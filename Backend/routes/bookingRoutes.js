import express from 'express';
import {
    holdSeats,
    confirmBooking,
    cancelBooking
} from '../controllers/bookingController.js';
import { simulateConcurrencyRace } from '../controllers/simulationController.js';

const router = express.Router();

router.post('/shows/:showId/hold', holdSeats);
router.post('/bookings/:bookingId/confirm', confirmBooking);
router.post('/bookings/:bookingId/cancel', cancelBooking);
router.post('/shows/:showId/simulate-race', simulateConcurrencyRace);

export default router;
