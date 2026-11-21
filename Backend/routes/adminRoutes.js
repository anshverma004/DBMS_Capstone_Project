import express from 'express';
import {
    createMovieAndShow,
    deleteCustomShow,
    resetShowDemo,
    forceExpireHolds,
    toggleFlashSale,
    simulateCrowdFill
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/shows/create', createMovieAndShow);
router.delete('/shows/:showId', deleteCustomShow);
router.post('/shows/:showId/reset', resetShowDemo);
router.post('/shows/:showId/force-expire', forceExpireHolds);
router.post('/shows/:showId/toggle-flash-sale', toggleFlashSale);
router.post('/shows/:showId/crowd-fill', simulateCrowdFill);

export default router;
