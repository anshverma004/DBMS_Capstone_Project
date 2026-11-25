import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const envPath = fileURLToPath(new URL('../.env', import.meta.url));
dotenv.config({ path: envPath });

const resolvedHost =
    !process.env.DB_HOST || process.env.DB_HOST === 'localhost'
        ? '127.0.0.1'
        : process.env.DB_HOST;

const pool = mysql.createPool({
    host: resolvedHost,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flash_movie_booking',
    ssl:
        process.env.DB_HOST &&
        process.env.DB_HOST !== 'localhost' &&
        process.env.DB_HOST !== '127.0.0.1'
            ? { rejectUnauthorized: false }
            : undefined,
    waitForConnections: true,
    connectionLimit: 30,
    queueLimit: 0
});

async function testConnection() {
    try {
        const conn = await pool.getConnection();
        console.log('✅ Connected to MySQL Database:', process.env.DB_NAME);
        conn.release();
    } catch (err) {
        const reason =
            err?.message ||
            err?.code ||
            err?.errors?.[0]?.message ||
            err?.errors?.[0]?.code ||
            'Check MySQL service status';
        console.error('❌ MySQL Connection Error:', reason);
    }
}

testConnection();

export default pool;
