import express from 'express';
import authRoutes from './authRoutes.js';
import showRoutes from './showRoutes.js';
import adminRoutes from './adminRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', showRoutes);
router.use('/', adminRoutes);
router.use('/', analyticsRoutes);
router.use('/', bookingRoutes);

export default router;
