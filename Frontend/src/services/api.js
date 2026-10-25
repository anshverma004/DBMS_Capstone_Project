export const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'https://high-concurrency-movie-flash-sale-and.onrender.com';
const API_BASE = `${SOCKET_URL}/api`;

// Helper for JSON requests
async function request(endpoint, options = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Request failed');
    }
    return data;
}

// 1. Read APIs
export const fetchUsers = () => request('/users');
export const fetchShows = () => request('/shows');
export const fetchShowDetails = (showId) => request(`/shows/${showId}`);

// 2. Booking & Concurrency APIs
export const holdSeatsApi = (showId, payload) =>
    request(`/shows/${showId}/hold`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const confirmBookingApi = (bookingId) =>
    request(`/bookings/${bookingId}/confirm`, { method: 'POST' });

export const cancelBookingApi = (bookingId) =>
    request(`/bookings/${bookingId}/cancel`, { method: 'POST' });

// 3. Stress-Test & Demo Reset APIs
export const simulateRaceApi = (showId, payload) =>
    request(`/shows/${showId}/simulate-race`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const resetShowApi = (showId) =>
    request(`/shows/${showId}/reset`, { method: 'POST' });