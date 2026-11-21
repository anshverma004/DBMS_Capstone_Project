import pool from '../config/db.js';

// Helper: Release any expired 5-minute seat holds back to AVAILABLE
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

// Helper: Fetch complete data for one show (Show + Seats + Bookings + Audit Logs)
export async function fetchShowDetailsData(showId) {
    const [shows] = await pool.query(
        `SELECT sh.*, m.title AS movie_title, m.genre, m.duration_mins,
            sc.screen_name, sc.total_rows, sc.seats_per_row, sc.total_capacity
     FROM shows sh
     JOIN movies m ON sh.movie_id = m.movie_id
     JOIN screens sc ON sh.screen_id = sc.screen_id
     WHERE sh.show_id = ?`,
        [showId]
    );

    const [seats] = await pool.query(
        `SELECT ss.*, u.full_name AS held_by_name,
            GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), ss.held_until)) AS seconds_left
     FROM show_seats ss
     LEFT JOIN users u ON ss.held_by_user_id = u.user_id
     WHERE ss.show_id = ?
     ORDER BY ss.row_label ASC, ss.seat_number ASC`,
        [showId]
    );

    const [bookings] = await pool.query(
        `SELECT b.*, u.full_name AS user_name,
            GROUP_CONCAT(ss.seat_code ORDER BY ss.row_label, ss.seat_number SEPARATOR ', ') AS seats_list,
            GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), b.expires_at)) AS seconds_left
     FROM bookings b
     JOIN users u ON b.user_id = u.user_id
     JOIN booking_seats bs ON b.booking_id = bs.booking_id
     JOIN show_seats ss ON bs.show_seat_id = ss.show_seat_id
     WHERE b.show_id = ?
     GROUP BY b.booking_id
     ORDER BY b.created_at DESC
     LIMIT 20`,
        [showId]
    );

    const [auditLogs] = await pool.query(
        `SELECT sal.*, u.full_name AS user_name
     FROM seat_audit_logs sal
     LEFT JOIN users u ON sal.acted_by_user_id = u.user_id
     WHERE sal.show_id = ?
     ORDER BY sal.log_id DESC
     LIMIT 30`,
        [showId]
    );

    return { show: shows[0] || null, seats, bookings, auditLogs };
}

// 1. GET /api/shows
export async function getShows(req, res) {
    try {
        await releaseExpiredHolds();
        const [shows] = await pool.query(
            `SELECT sh.*, m.title AS movie_title, m.genre, m.duration_mins,
              sc.screen_name, sc.total_capacity
       FROM shows sh
       JOIN movies m ON sh.movie_id = m.movie_id
       JOIN screens sc ON sh.screen_id = sc.screen_id
       ORDER BY sh.show_id ASC`
        );
        res.json(shows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 2. GET /api/shows/:showId
export async function getShowById(req, res) {
    try {
        await releaseExpiredHolds();
        const data = await fetchShowDetailsData(Number(req.params.showId));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 3. POST /api/shows/create (Inserts Movie + Show and calls Stored Procedure sp_generate_show_seats)
export async function createMovieAndShow(req, res) {
    const {
        title,
        genre = 'Action / Sci-Fi',
        durationMins = 160,
        screenId = 1,
        isFlashSale = true
    } = req.body;

    if (!title || !String(title).trim()) {
        return res.status(400).json({ error: 'Movie title is required.' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Insert new movie into movies table
        const [movieRes] = await conn.query(
            `INSERT INTO movies (title, genre, duration_mins) VALUES (?, ?, ?)`,
            [String(title).trim(), String(genre).trim(), Math.max(30, Number(durationMins) || 150)]
        );
        const newMovieId = movieRes.insertId;

        // 2. Get auditorium capacity from screens table
        const [screens] = await conn.query(
            `SELECT total_capacity FROM screens WHERE screen_id = ?`,
            [Number(screenId) || 1]
        );
        const totalCapacity = screens[0]?.total_capacity || 60;

        // 3. Insert new showtime into shows table (unique timestamp per show)
        const [showRes] = await conn.query(
            `INSERT INTO shows (
                movie_id, screen_id, show_datetime, is_flash_sale, sale_start_time, available_seats, status
             ) VALUES (
                ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), ?, NOW(), ?, 'OPEN'
             )`,
            [
                newMovieId,
                Number(screenId) || 1,
                60 + Math.floor(Math.random() * 5000),
                Boolean(isFlashSale),
                totalCapacity
            ]
        );
        const newShowId = showRes.insertId;

        await conn.commit();

        // 4. Call Stored Procedure sp_generate_show_seats to populate all auditorium seats
        await pool.query('CALL sp_generate_show_seats(?)', [newShowId]);

        const updatedData = await fetchShowDetailsData(newShowId);
        req.io?.emit('show_updated', updatedData);

        res.status(201).json({
            message: `🎬 Created "${String(title).trim()}" & generated ${totalCapacity} seats via sp_generate_show_seats(${newShowId})!`,
            showId: newShowId
        });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
}

// 4. POST /api/shows/:showId/reset (Calls Stored Procedure sp_reset_show_demo)
export async function resetShowDemo(req, res) {
    try {
        const showId = Number(req.params.showId);
        await pool.query('CALL sp_reset_show_demo(?)', [showId]);

        const updatedData = await fetchShowDetailsData(showId);
        req.io.emit('show_updated', updatedData);

        res.json({ message: 'Show reset to 100% AVAILABLE seats!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 5. POST /api/shows/:showId/force-expire (Fast-forwards 5-min TTL timer for instant viva demo)
export async function forceExpireHolds(req, res) {
    try {
        const showId = Number(req.params.showId);

        await pool.query(
            `UPDATE bookings
             SET expires_at = DATE_SUB(NOW(), INTERVAL 5 SECOND)
             WHERE show_id = ? AND booking_status = 'PENDING'`,
            [showId]
        );

        await pool.query(
            `UPDATE show_seats
             SET held_until = DATE_SUB(NOW(), INTERVAL 5 SECOND)
             WHERE show_id = ? AND status = 'HELD'`,
            [showId]
        );

        await releaseExpiredHolds();

        const updatedData = await fetchShowDetailsData(showId);
        req.io.emit('show_updated', updatedData);

        res.json({
            message:
                '⏩ 5-Minute TTL Timer Fast-Forwarded! All unpaid HELD seats automatically expired back to AVAILABLE.'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 6. POST /api/shows/:showId/toggle-flash-sale (Toggles Flash-Sale pricing in MySQL)
export async function toggleFlashSale(req, res) {
    try {
        const showId = Number(req.params.showId);
        const [rows] = await pool.query(
            'SELECT is_flash_sale FROM shows WHERE show_id = ?',
            [showId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Show not found.' });
        }

        const newFlashState = !rows[0].is_flash_sale;

        await pool.query(
            'UPDATE shows SET is_flash_sale = ? WHERE show_id = ?',
            [newFlashState, showId]
        );

        await pool.query(
            `UPDATE show_seats
             SET price = CASE
                 WHEN tier = 'CLASSIC' THEN IF(?, 99.00, 180.00)
                 WHEN tier = 'PRIME' THEN IF(?, 149.00, 280.00)
                 ELSE IF(?, 249.00, 450.00)
             END
             WHERE show_id = ?`,
            [newFlashState, newFlashState, newFlashState, showId]
        );

        const updatedData = await fetchShowDetailsData(showId);
        req.io.emit('show_updated', updatedData);

        res.json({
            message: newFlashState
                ? '⚡ Flash-Sale Mode ENABLED! Seat prices slashed to ₹99 / ₹149 / ₹249 in MySQL.'
                : '🎬 Switched to Regular Show Pricing (₹180 / ₹280 / ₹450) in MySQL.'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 7. POST /api/shows/:showId/crowd-fill (Simulates realistic theater occupancy by booking random available seats)
export async function simulateCrowdFill(req, res) {
    const showId = Number(req.params.showId);
    const count = Math.min(25, Math.max(1, Number(req.body?.count) || 12));
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [availableSeats] = await conn.query(
            `SELECT show_seat_id, seat_code, price
             FROM show_seats
             WHERE show_id = ? AND status = 'AVAILABLE'
             ORDER BY RAND()
             LIMIT ?
             FOR UPDATE`,
            [showId, count]
        );

        if (availableSeats.length === 0) {
            await conn.rollback();
            return res.status(409).json({ error: 'No available seats left to fill.' });
        }

        const [users] = await conn.query('SELECT user_id FROM users LIMIT 10');
        const actorUserId = users[0]?.user_id || 1;
        const seatIds = availableSeats.map((s) => s.show_seat_id);
        const totalAmount = availableSeats.reduce((sum, s) => sum + Number(s.price), 0);

        await conn.query(
            `UPDATE show_seats
             SET status = 'BOOKED',
                 held_by_user_id = ?,
                 held_until = NULL,
                 version = version + 1
             WHERE show_seat_id IN (?)`,
            [actorUserId, seatIds]
        );

        const [bookingRes] = await conn.query(
            `INSERT INTO bookings (user_id, show_id, total_amount, booking_status, lock_mode, expires_at, confirmed_at)
             VALUES (?, ?, ?, 'CONFIRMED', 'PESSIMISTIC', DATE_ADD(NOW(), INTERVAL 5 MINUTE), NOW())`,
            [actorUserId, showId, totalAmount]
        );

        for (const seat of availableSeats) {
            await conn.query(
                `INSERT INTO booking_seats (booking_id, show_seat_id, price_at_booking)
                 VALUES (?, ?, ?)`,
                [bookingRes.insertId, seat.show_seat_id, seat.price]
            );
        }

        await conn.commit();

        const updatedData = await fetchShowDetailsData(showId);
        req.io.emit('show_updated', updatedData);

        res.json({
            message: `🍿 Simulated Theater Crowd Fill! Booked ${availableSeats.length} seats (${availableSeats
                .map((s) => s.seat_code)
                .join(', ')}).`
        });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
}
