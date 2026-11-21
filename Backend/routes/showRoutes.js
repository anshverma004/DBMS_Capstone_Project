import express from 'express';
import { getShows, getShowById } from '../controllers/showController.js';

const router = express.Router();

router.get('/shows', getShows);
router.get('/shows/:showId', getShowById);

export default router;
