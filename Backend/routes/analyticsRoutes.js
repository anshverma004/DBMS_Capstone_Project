import express from 'express';
import {
    runPresetAnalyticsQuery,
    runCustomReadOnlySql
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/analytics/query/:queryKey', runPresetAnalyticsQuery);
router.post('/analytics/sql', runCustomReadOnlySql);

export default router;
