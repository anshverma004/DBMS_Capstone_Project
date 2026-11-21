import pool from '../config/db.js';
import { releaseExpiredHolds } from '../services/seatHoldService.js';
import { fetchShowDetailsData } from '../services/showQueryService.js';

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

export async function getShowById(req, res) {
    try {
        await releaseExpiredHolds();
        const data = await fetchShowDetailsData(Number(req.params.showId));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
