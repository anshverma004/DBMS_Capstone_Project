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

// Rich BookMyShow-style metadata mapped to each show_id (1, 2, 3...)
export const SHOW_ENRICHMENT = {
    1: {
        city: 'Gurugram (Delhi-NCR)',
        theaterName: "PVR Director's Cut: Ambience Mall, Gurugram",
        mallAddress: '3rd Floor, Ambience Mall, NH-8, Gurugram • 2.4 km away',
        format: 'IMAX 4K Laser 3D • Dolby 7.1',
        language: 'English, Hindi',
        certification: 'UA 16+',
        rating: '9.6/10',
        votes: '184.2K Votes',
        showTimeLabel: '07:00 PM (Flash Premiere Drop)',
        regularBasePrice: 180,
        flashBasePrice: 99,
        tagline: 'First-Day-First-Show IMAX Flash Sale — Flat 45% Off All Tiers!',
        gradient: 'from-rose-600 via-indigo-900 to-slate-950',
        badgeColor: 'bg-rose-500 text-white',
        amenities: ['M-Ticket', 'F&B Seat Service', '4K Laser Projection', 'Recliner Loungers']
    },
    2: {
        city: 'New Delhi (Delhi-NCR)',
        theaterName: 'INOX Laserplex: Select Citywalk, Saket',
        mallAddress: 'A-3, District Centre, Saket, New Delhi • 5.1 km away',
        format: '70mm IMAX Laser • English',
        language: 'English',
        certification: 'UA 13+',
        rating: '9.8/10',
        votes: '312.5K Votes',
        showTimeLabel: '10:30 PM (10th Anniversary Special)',
        regularBasePrice: 180,
        flashBasePrice: 180,
        tagline: 'Christopher Nolan’s Masterpiece in True IMAX Aspect Ratio',
        gradient: 'from-blue-600 via-slate-900 to-slate-950',
        badgeColor: 'bg-indigo-500 text-white',
        amenities: ['M-Ticket', 'IMAX 12-Channel Sound', 'Dolby Surround', 'Wheelchair Accessible']
    },
    3: {
        city: 'Mumbai',
        theaterName: 'Maison PVR: Jio World Drive, BKC Mumbai',
        mallAddress: 'Maker Maxity, Bandra Kurla Complex, Mumbai • 3.8 km away',
        format: 'Dolby Atmos 4K • IMAX 2D',
        language: 'English, Hindi',
        certification: 'UA 16+',
        rating: '9.4/10',
        votes: '128.9K Votes',
        showTimeLabel: '08:00 PM (Dolby Atmos Flash Drop)',
        regularBasePrice: 180,
        flashBasePrice: 99,
        tagline: 'Experience Arrakis in 64-Channel Overhead Dolby Atmos Sound',
        gradient: 'from-amber-600 via-stone-900 to-slate-950',
        badgeColor: 'bg-amber-500 text-slate-950',
        amenities: ['M-Ticket', 'Dolby Atmos', 'Gourmet Popcorn Bar', 'Valet Parking']
    }
};

export function enrichShow(show, index = 0) {
    if (!show) return null;
    const preset = SHOW_ENRICHMENT[show.show_id] || SHOW_ENRICHMENT[(index % 3) + 1];
    return {
        ...preset,
        ...show
    };
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
