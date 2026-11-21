import pool from '../config/db.js';

// Background service: Release any expired 5-minute seat holds back to AVAILABLE
export async function releaseExpiredHolds() {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query(
            `UPDATE bookings 
             SET booking_status = 'EXPIRED' 
             WHERE booking_status = 'PENDING' AND expires_at < NOW()`
        );

        await conn.query(
            `UPDATE show_seats 
             SET status = 'AVAILABLE', held_by_user_id = NULL, held_until = NULL, version = version + 1
             WHERE status = 'HELD' AND held_until IS NOT NULL AND held_until < NOW()`
        );

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.error('Expiry cleanup error:', err.message);
    } finally {
        conn.release();
    }
}

// Core ACID Transaction Service: Hold Seats (Pessimistic or Optimistic)
export async function holdSeatsTransaction({ showId, userId, seatIds, lockMode = 'PESSIMISTIC' }) {
    // 1. Sort seat IDs in ascending order so concurrent multi-seat requests never deadlock
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
            // PESSIMISTIC LOCKING: Lock the requested seat rows in MySQL InnoDB
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
