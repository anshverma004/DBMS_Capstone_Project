import pool from '../config/db.js';
import { releaseExpiredHolds, fetchShowDetailsData } from './showController.js';

// Core ACID Transaction: Hold Seats (Pessimistic or Optimistic)
async function holdSeatsTransaction({ showId, userId, seatIds, lockMode = 'PESSIMISTIC' }) {
    // 1. Sort seat IDs in ascending order so two users never deadlock
    const sortedSeatIds = [...new Set(seatIds.map(Number))].sort((a, b) => a - b);
    if (sortedSeatIds.length === 0) {
        const err = new Error('Please select at least one seat.');
        err.status = 400;
        throw err;
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        let seats;
        if (lockMode === 'PESSIMISTIC') {
            // PESSIMISTIC LOCKING: Lock the requested seat rows in MySQL
            const [rows] = await conn.query(
                `SELECT show_seat_id, seat_code, price, status, version
         FROM show_seats
         WHERE show_id = ? AND show_seat_id IN (?)
         ORDER BY show_seat_id ASC
         FOR UPDATE`,
                [showId, sortedSeatIds]
            );
            seats = rows;

            for (const seat of seats) {
                if (seat.status !== 'AVAILABLE') {
                    const err = new Error(`Seat ${seat.seat_code} is already ${seat.status}.`);
                    err.status = 409;
                    throw err;
                }
            }

            await conn.query(
                `UPDATE show_seats
         SET status = 'HELD',
             held_by_user_id = ?,
             held_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
             version = version + 1
         WHERE show_seat_id IN (?)`,
                [userId, sortedSeatIds]
            );
        } else {
            // OPTIMISTIC LOCKING: Check version numbers without holding row locks
            const [rows] = await conn.query(
                `SELECT show_seat_id, seat_code, price, status, version
         FROM show_seats
         WHERE show_id = ? AND show_seat_id IN (?)
         ORDER BY show_seat_id ASC`,
                [showId, sortedSeatIds]
            );
            seats = rows;

            for (const seat of seats) {
                if (seat.status !== 'AVAILABLE') {
                    const err = new Error(`Seat ${seat.seat_code} is already ${seat.status}.`);
                    err.status = 409;
                    throw err;
                }

                const [updateResult] = await conn.query(
                    `UPDATE show_seats
           SET status = 'HELD',
               held_by_user_id = ?,
               held_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
               version = version + 1
           WHERE show_seat_id = ? AND status = 'AVAILABLE' AND version = ?`,
                    [userId, seat.show_seat_id, seat.version]
                );

                if (updateResult.affectedRows !== 1) {
                    const err = new Error(`Optimistic version conflict on Seat ${seat.seat_code}.`);
                    err.status = 409;
                    throw err;
                }
            }
        }

        // Create PENDING booking and map seats in booking_seats
        const totalAmount = seats.reduce((sum, s) => sum + Number(s.price), 0);

        const [bookingResult] = await conn.query(
            `INSERT INTO bookings (user_id, show_id, total_amount, booking_status, lock_mode, expires_at)
       VALUES (?, ?, ?, 'PENDING', ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
            [userId, showId, totalAmount, lockMode]
        );

        const bookingId = bookingResult.insertId;

        for (const seat of seats) {
            await conn.query(
                `INSERT INTO booking_seats (booking_id, show_seat_id, price_at_booking)
         VALUES (?, ?, ?)`,
                [bookingId, seat.show_seat_id, seat.price]
            );
        }

        await conn.commit();

        return {
            bookingId,
            userId,
            showId,
            seatCodes: seats.map((s) => s.seat_code),
            totalAmount,
            lockMode
        };
    } catch (err) {
        await conn.rollback();
        if (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_LOCK_WAIT_TIMEOUT') {
            err.status = 409;
            err.message = 'Concurrent transaction conflict prevented double-booking.';
        }
        throw err;
    } finally {
        conn.release();
    }
}

// 1. POST /api/shows/:showId/hold
export async function holdSeats(req, res) {
    try {
        await releaseExpiredHolds();
        const showId = Number(req.params.showId);
        const { userId, seatIds, lockMode = 'PESSIMISTIC' } = req.body;

        const result = await holdSeatsTransaction({ showId, userId, seatIds, lockMode });

        const updatedData = await fetchShowDetailsData(showId);
        req.io.emit('show_updated', updatedData);

        res.status(201).json({
            message: `Seats (${result.seatCodes.join(', ')}) held for 5 minutes!`,
            booking: result
        });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

// 2. POST /api/bookings/:bookingId/confirm
export async function confirmBooking(req, res) {
    const bookingId = Number(req.params.bookingId);
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [bookings] = await conn.query(
            `SELECT *, (expires_at > NOW()) AS is_valid FROM bookings WHERE booking_id = ? FOR UPDATE`,
            [bookingId]
        );

        if (bookings.length === 0 || bookings[0].booking_status !== 'PENDING') {
            await conn.rollback();
            return res.status(409).json({ error: 'Booking is no longer pending.' });
        }

        const booking = bookings[0];

        if (!booking.is_valid) {
            await conn.rollback();
            await releaseExpiredHolds();
            return res.status(410).json({ error: '5-minute hold timer expired!' });
        }

        await conn.query(
            `UPDATE show_seats ss
       JOIN booking_seats bs ON ss.show_seat_id = bs.show_seat_id
       SET ss.status = 'BOOKED', ss.held_until = NULL, ss.version = ss.version + 1
       WHERE bs.booking_id = ?`,
            [bookingId]
        );

        await conn.query(
            `UPDATE bookings SET booking_status = 'CONFIRMED', confirmed_at = NOW() WHERE booking_id = ?`,
            [bookingId]
        );

        await conn.commit();

        const updatedData = await fetchShowDetailsData(booking.show_id);
        req.io.emit('show_updated', updatedData);

        res.json({ message: 'Payment confirmed! Seats are permanently BOOKED.' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
}

// 3. POST /api/bookings/:bookingId/cancel
export async function cancelBooking(req, res) {
    const bookingId = Number(req.params.bookingId);
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [bookings] = await conn.query(
            `SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE`,
            [bookingId]
        );

        if (bookings.length === 0 || bookings[0].booking_status !== 'PENDING') {
            await conn.rollback();
            return res.status(400).json({ error: 'No active pending hold found.' });
        }

        const booking = bookings[0];

        await conn.query(
            `UPDATE show_seats ss
       JOIN booking_seats bs ON ss.show_seat_id = bs.show_seat_id
       SET ss.status = 'AVAILABLE', ss.held_by_user_id = NULL, ss.held_until = NULL, ss.version = ss.version + 1
       WHERE bs.booking_id = ?`,
            [bookingId]
        );

        await conn.query(
            `UPDATE bookings SET booking_status = 'CANCELLED' WHERE booking_id = ?`,
            [bookingId]
        );

        await conn.commit();

        const updatedData = await fetchShowDetailsData(booking.show_id);
        req.io.emit('show_updated', updatedData);

        res.json({ message: 'Hold cancelled and seats released.' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
}

// 4. POST /api/shows/:showId/simulate-race (Concurrency Stress-Tester)
export async function simulateConcurrencyRace(req, res) {
    try {
        await releaseExpiredHolds();
        const showId = Number(req.params.showId);
        const { seatIds, concurrentUsers = 50, lockMode = 'PESSIMISTIC' } = req.body;

        const [users] = await pool.query('SELECT user_id, full_name FROM users');
        const startTime = Date.now();

        // Fire all N requests simultaneously at the exact same millisecond
        const requests = Array.from({ length: Number(concurrentUsers) }, (_, idx) => {
            const randomUser = users[idx % users.length];
            return holdSeatsTransaction({
                showId,
                userId: randomUser.user_id,
                seatIds,
                lockMode
            })
                .then((resData) => ({
                    requestNumber: idx + 1,
                    user: randomUser.full_name,
                    status: 'SUCCESS',
                    bookingId: resData.bookingId
                }))
                .catch((err) => ({
                    requestNumber: idx + 1,
                    user: randomUser.full_name,
                    status: 'REJECTED_409',
                    reason: err.message
                }));
        });

        const results = await Promise.all(requests);
        const durationMs = Date.now() - startTime;

        const winners = results.filter((r) => r.status === 'SUCCESS');
        const rejected = results.filter((r) => r.status !== 'SUCCESS');

        const updatedData = await fetchShowDetailsData(showId);
        req.io.emit('show_updated', updatedData);

        res.json({
            summary: {
                totalConcurrentRequests: results.length,
                lockModeUsed: lockMode,
                succeededCount: winners.length,
                preventedDoubleBookings: rejected.length,
                winner: winners[0] || null,
                durationMs
            },
            sampleResults: results.slice(0, 15)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}