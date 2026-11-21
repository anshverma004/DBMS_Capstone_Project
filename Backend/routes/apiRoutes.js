import express from 'express';
import {
    getUsers,
    signupUser,
    loginUser,
    getShows,
    getShowById,
    resetShowDemo
} from '../controllers/showController.js';
import {
    holdSeats,
    confirmBooking,
    cancelBooking,
    simulateConcurrencyRace
} from '../controllers/bookingController.js';

const router = express.Router();

// Auth & User Routes
router.get('/users', getUsers);
router.post('/auth/signup', signupUser);
router.post('/auth/login', loginUser);

// Show Routes
router.get('/shows', getShows);
router.get('/shows/:showId', getShowById);

// Concurrency & Booking Routes
router.post('/shows/:showId/hold', holdSeats);
router.post('/bookings/:bookingId/confirm', confirmBooking);
router.post('/bookings/:bookingId/cancel', cancelBooking);

// Stress-Test & Demo Reset Routes
router.post('/shows/:showId/simulate-race', simulateConcurrencyRace);
router.post('/shows/:showId/reset', resetShowDemo);

export default router;
