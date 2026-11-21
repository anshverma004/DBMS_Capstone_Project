import pool from '../config/db.js';

// 1. GET /api/analytics/query/:queryKey
export async function runPresetAnalyticsQuery(req, res) {
    const { queryKey } = req.params;
    const startTime = Date.now();
    try {
        let sql = '';
        const allowedTables = {
            table_users: 'SELECT user_id, full_name, email, created_at FROM users ORDER BY user_id DESC LIMIT 15',
            table_movies: 'SELECT * FROM movies ORDER BY movie_id ASC LIMIT 15',
            table_screens: 'SELECT * FROM screens ORDER BY screen_id ASC LIMIT 15',
            table_shows: 'SELECT show_id, movie_id, screen_id, is_flash_sale, available_seats, status FROM shows ORDER BY show_id ASC LIMIT 15',
            table_show_seats: 'SELECT show_seat_id, show_id, seat_code, tier, price, status, held_by_user_id, version FROM show_seats ORDER BY version DESC, show_seat_id ASC LIMIT 15',
            table_bookings: 'SELECT booking_id, user_id, show_id, total_amount, booking_status, lock_mode, created_at FROM bookings ORDER BY booking_id DESC LIMIT 15',
            table_booking_seats: 'SELECT * FROM booking_seats ORDER BY booking_seat_id DESC LIMIT 15',
            table_seat_audit_logs: 'SELECT log_id, show_id, seat_code, old_status, new_status, old_version, new_version, changed_at FROM seat_audit_logs ORDER BY log_id DESC LIMIT 15'
        };

        if (allowedTables[queryKey]) {
            sql = allowedTables[queryKey];
        } else if (queryKey === 'tier_aggregation') {
            sql = `SELECT tier, status, COUNT(*) AS seat_count, SUM(price) AS total_value
                   FROM show_seats
                   GROUP BY tier, status
                   ORDER BY tier, status`;
        } else if (queryKey === 'top_contended_seats') {
            sql = `SELECT show_id, seat_code, tier, status, version, price
                   FROM show_seats
                   ORDER BY version DESC, show_seat_id ASC
                   LIMIT 10`;
        } else if (queryKey === 'joined_bookings') {
            sql = `SELECT b.booking_id, u.full_name, u.email, m.title AS movie,
                          b.total_amount, b.booking_status, b.lock_mode
                   FROM bookings b
                   INNER JOIN users u ON b.user_id = u.user_id
                   INNER JOIN shows sh ON b.show_id = sh.show_id
                   INNER JOIN movies m ON sh.movie_id = m.movie_id
                   ORDER BY b.booking_id DESC
                   LIMIT 10`;
        } else if (queryKey === 'explain_index') {
            sql = `EXPLAIN SELECT show_seat_id, seat_code, status
                   FROM show_seats
                   WHERE show_id = 1 AND status = 'AVAILABLE'`;
        } else if (queryKey === 'engine_telemetry') {
            sql = `SELECT VERSION() AS mysql_version,
                          @@transaction_isolation AS isolation_level,
                          @@innodb_lock_wait_timeout AS lock_timeout_sec,
                          @@autocommit AS autocommit_mode`;
        } else {
            return res.status(400).json({ error: 'Unknown preset query key.' });
        }

        const [rows] = await pool.query(sql);
        const durationMs = Date.now() - startTime;
        res.json({ queryKey, sql, rows, durationMs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 2. POST /api/analytics/sql
export async function runCustomReadOnlySql(req, res) {
    const rawSql = String(req.body?.sql || '').trim();
    if (!rawSql) {
        return res.status(400).json({ error: 'Please enter a SQL query.' });
    }

    const cleanSql = rawSql.replace(/;+\s*$/, '');
    if (cleanSql.includes(';')) {
        return res.status(400).json({
            error: 'Only single read-only SQL statements are allowed in the live console.'
        });
    }

    const firstWord = cleanSql.split(/\s+/)[0]?.toUpperCase();
    const allowedCommands = ['SELECT', 'EXPLAIN', 'SHOW', 'DESCRIBE', 'DESC'];
    const forbiddenKeywords = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|REPLACE|GRANT|REVOKE|CALL|SET)\b/i;

    if (!allowedCommands.includes(firstWord) || forbiddenKeywords.test(cleanSql)) {
        return res.status(403).json({
            error: 'Read-Only Console: Only SELECT, EXPLAIN, SHOW, and DESCRIBE queries are permitted.'
        });
    }

    const startTime = Date.now();
    try {
        const [rows] = await pool.query(cleanSql);
        const durationMs = Date.now() - startTime;
        res.json({
            sql: cleanSql,
            rows: Array.isArray(rows) ? rows.slice(0, 50) : [rows],
            durationMs
        });
    } catch (err) {
        res.status(400).json({ error: `MySQL Error: ${err.message}` });
    }
}
