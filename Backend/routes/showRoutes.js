import express from 'express';
import {
    getShows,
    searchTheatersByCity,
    getShowById
} from '../controllers/showController.js';

const router = express.Router();

router.get('/shows', getShows);
router.get('/theaters/search', searchTheatersByCity);
router.get('/shows/:showId', getShowById);

export default router;
