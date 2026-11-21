import pool from '../config/db.js';

// 1. GET /api/users
export async function getUsers(req, res) {
    try {
        const [users] = await pool.query('SELECT * FROM users ORDER BY user_id ASC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 2. POST /api/auth/signup (Creates a user in MySQL users table)
export async function signupUser(req, res) {
    try {
        const { fullName, email } = req.body;
        if (!fullName || !email) {
            return res.status(400).json({ error: 'Full name and email are required.' });
        }

        const cleanName = String(fullName).trim();
        const cleanEmail = String(email).trim().toLowerCase();

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
            message: `Account created for ${cleanName}!`,
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
