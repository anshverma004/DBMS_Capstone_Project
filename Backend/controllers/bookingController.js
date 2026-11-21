import pool from '../config/db.js';
import { releaseExpiredHolds, holdSeatsTransaction } from '../services/seatHoldService.js';
import { fetchShowDetailsData } from '../services/showQueryService.js';

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

export async function cancelBooking(req, res) {
    const bookingId = Number(req.params.bookingId);
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [bookings] = await conn.query(
            `SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE`,
            [bookingId]
        );

        if (
            bookings.length === 0 ||
            !['PENDING', 'CONFIRMED'].includes(bookings[0].booking_status)
        ) {
            await conn.rollback();
            return res.status(400).json({ error: 'Booking cannot be cancelled.' });
        }

        const booking = bookings[0];
        const wasConfirmed = booking.booking_status === 'CONFIRMED';

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

        res.json({
            message: wasConfirmed
                ? 'Confirmed M-Ticket cancelled & refunded! Seats returned to AVAILABLE.'
                : 'Hold cancelled and seats released.'
        });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
}
