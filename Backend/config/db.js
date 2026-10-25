import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Properly decode Windows folder spaces in the path to backend/.env
const envPath = fileURLToPath(new URL('../.env', import.meta.url));
dotenv.config({ path: envPath });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'flash_movie_booking',
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
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
        console.error('❌ MySQL Connection Error:', err.message);
    }
}

testConnection();

export default pool;