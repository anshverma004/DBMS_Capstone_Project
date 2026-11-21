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

// 1. GET /api/users
export async function getUsers(req, res) {
    try {
        const [users] = await pool.query('SELECT * FROM users ORDER BY user_id ASC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 2. POST /api/auth/signup (Creates a real user in MySQL users table)
export async function signupUser(req, res) {
    try {
        const { fullName, email } = req.body;
        if (!fullName || !email) {
            return res.status(400).json({ error: 'Full name and email are required.' });
        }

        const cleanName = String(fullName).trim();
        const cleanEmail = String(email).trim().toLowerCase();

        // Check if email already exists
        const [existing] = await pool.query(
            'SELECT * FROM users WHERE LOWER(email) = ?',
            [cleanEmail]
        );
        if (existing.length > 0) {
            return res.status(409).json({
                error: 'An account with this email already exists. Please log in instead.'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO users (full_name, email) VALUES (?, ?)',
            [cleanName, cleanEmail]
        );

        const [newUserRows] = await pool.query(
            'SELECT * FROM users WHERE user_id = ?',
            [result.insertId]
        );

        const [allUsers] = await pool.query('SELECT * FROM users ORDER BY user_id ASC');
        req.io?.emit('users_updated', allUsers);

        res.status(201).json({
            message: `Welcome to BookMyFlash, ${cleanName}!`,
            user: newUserRows[0],
            users: allUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 3. POST /api/auth/login (Authenticates an existing user from MySQL users table)
export async function loginUser(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Please enter your email address.' });
        }

        const cleanEmail = String(email).trim().toLowerCase();
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE LOWER(email) = ?',
            [cleanEmail]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'No account found with this email. Please sign up first.'
            });
        }

        res.json({
            message: `Welcome back, ${rows[0].full_name}!`,
            user: rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 4. GET /api/shows
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

// 5. GET /api/shows/:showId
export async function getShowById(req, res) {
    try {
        await releaseExpiredHolds();
        const data = await fetchShowDetailsData(Number(req.params.showId));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 6. POST /api/shows/:showId/reset (Calls Stored Procedure sp_reset_show_demo)
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
