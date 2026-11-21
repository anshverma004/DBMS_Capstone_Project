import express from 'express';
import {
    getShows,
    getShowById,
    createMovieAndShow,
    deleteCustomShow,
    runPresetAnalyticsQuery,
    resetShowDemo,
    forceExpireHolds,
    toggleFlashSale,
    simulateCrowdFill
} from '../controllers/showController.js';

const router = express.Router();

router.get('/shows', getShows);
router.post('/shows/create', createMovieAndShow);
router.get('/shows/:showId', getShowById);
router.delete('/shows/:showId', deleteCustomShow);
router.get('/analytics/query/:queryKey', runPresetAnalyticsQuery);
router.post('/shows/:showId/reset', resetShowDemo);
router.post('/shows/:showId/force-expire', forceExpireHolds);
router.post('/shows/:showId/toggle-flash-sale', toggleFlashSale);
router.post('/shows/:showId/crowd-fill', simulateCrowdFill);

export default router;
