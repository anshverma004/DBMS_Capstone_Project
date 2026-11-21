import express from 'express';
import { getShows, getShowById, resetShowDemo } from '../controllers/showController.js';

const router = express.Router();

router.get('/shows', getShows);
router.get('/shows/:showId', getShowById);
router.post('/shows/:showId/reset', resetShowDemo);

export default router;
