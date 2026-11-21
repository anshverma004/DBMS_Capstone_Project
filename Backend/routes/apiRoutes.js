import express from 'express';
import authRoutes from './authRoutes.js';
import showRoutes from './showRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', showRoutes);
router.use('/', bookingRoutes);

export default router;
