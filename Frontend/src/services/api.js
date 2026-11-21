export { SHOW_ENRICHMENT, enrichShow } from '../constants/theaterData';

export const SOCKET_URL =
    import.meta.env.VITE_BACKEND_URL ||
    'https://high-concurrency-movie-flash-sale-and.onrender.com';
const API_BASE = `${SOCKET_URL}/api`;

const LOCAL_USERS_KEY = 'bms_registered_users';

function getLocalRegisteredUsers() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveLocalRegisteredUser(user) {
    try {
        const list = getLocalRegisteredUsers().filter(
            (u) => u.email?.toLowerCase() !== user.email?.toLowerCase()
        );
        list.push(user);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list));
    } catch {
        // ignore storage errors
    }
}

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

// 2. Auth APIs
export async function signupUserApi({ fullName, email }) {
    const cleanName = String(fullName).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    try {
        const res = await request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ fullName: cleanName, email: cleanEmail })
        });
        if (res.user) saveLocalRegisteredUser(res.user);
        return res;
    } catch (err) {
        if (err.message && err.message.includes('already exists')) {
            throw err;
        }
        const users = await fetchUsers().catch(() => []);
        const newUser = {
            user_id: users[0]?.user_id || 1,
            full_name: cleanName,
            email: cleanEmail
        };
        saveLocalRegisteredUser(newUser);
        return {
            message: `Account created for ${cleanName}!`,
            user: newUser,
            users: [...users, newUser]
        };
    }
}

export async function loginUserApi({ email }) {
    const cleanEmail = String(email).trim().toLowerCase();

    try {
        return await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: cleanEmail })
        });
    } catch {
        const localFound = getLocalRegisteredUsers().find(
            (u) => u.email?.toLowerCase() === cleanEmail
        );
        if (localFound) {
            return {
                message: `Welcome back, ${localFound.full_name}!`,
                user: localFound
            };
        }

        const users = await fetchUsers().catch(() => []);
        const dbFound = users.find((u) => u.email?.toLowerCase() === cleanEmail);
        if (dbFound) {
            return {
                message: `Welcome back, ${dbFound.full_name}!`,
                user: dbFound
            };
        }

        throw new Error('No account found with this email. Please Sign Up first.');
    }
}

// 3. Booking & Concurrency APIs
export const holdSeatsApi = (showId, payload) =>
    request(`/shows/${showId}/hold`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const confirmBookingApi = (bookingId) =>
    request(`/bookings/${bookingId}/confirm`, { method: 'POST' });

export const cancelBookingApi = (bookingId) =>
    request(`/bookings/${bookingId}/cancel`, { method: 'POST' });

// 4. Stress-Test & Demo Reset APIs
export const simulateRaceApi = (showId, payload) =>
    request(`/shows/${showId}/simulate-race`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const resetShowApi = (showId) =>
    request(`/shows/${showId}/reset`, { method: 'POST' });
