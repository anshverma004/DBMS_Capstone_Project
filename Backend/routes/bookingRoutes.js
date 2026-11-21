import express from 'express';
import {
    holdSeats,
    confirmBooking,
    cancelBooking,
    simulateConcurrencyRace
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/shows/:showId/hold', holdSeats);
router.post('/bookings/:bookingId/confirm', confirmBooking);
router.post('/bookings/:bookingId/cancel', cancelBooking);
router.post('/shows/:showId/simulate-race', simulateConcurrencyRace);

export default router;
