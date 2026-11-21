import { request } from './httpClient';

export const holdSeatsApi = (showId, payload) =>
    request(`/shows/${showId}/hold`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const confirmBookingApi = (bookingId) =>
    request(`/bookings/${bookingId}/confirm`, { method: 'POST' });

export const cancelBookingApi = (bookingId) =>
    request(`/bookings/${bookingId}/cancel`, { method: 'POST' });

export const simulateRaceApi = (showId, payload) =>
    request(`/shows/${showId}/simulate-race`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
