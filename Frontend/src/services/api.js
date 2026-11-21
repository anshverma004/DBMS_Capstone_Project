export const SOCKET_URL =
    import.meta.env.VITE_BACKEND_URL ||
    'https://high-concurrency-movie-flash-sale-and.onrender.com';
const API_BASE = `${SOCKET_URL}/api`;

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

// 2. Auth APIs (With smart fallback if cloud backend hasn't redeployed /auth routes yet)
export async function signupUserApi({ fullName, email }) {
    try {
        return await request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ fullName, email })
        });
    } catch (err) {
        // Fallback if cloud backend hasn't redeployed /auth/signup yet
        const users = await fetchUsers();
        const existing = users.find(
            (u) => u.email?.toLowerCase() === String(email).trim().toLowerCase()
        );
        if (existing) {
            return {
                message: `Signed in as ${existing.full_name}`,
                user: existing,
                users
            };
        }
        const fallbackUser = {
            user_id: users[0]?.user_id || 1,
            full_name: String(fullName).trim(),
            email: String(email).trim().toLowerCase()
        };
        return {
            message: `Welcome to BookMyFlash, ${fallbackUser.full_name}!`,
            user: fallbackUser,
            users: [...users, fallbackUser]
        };
    }
}

export async function loginUserApi({ email }) {
    try {
        return await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    } catch (err) {
        const users = await fetchUsers();
        const found = users.find(
            (u) => u.email?.toLowerCase() === String(email).trim().toLowerCase()
        );
        if (!found) {
            throw new Error('No account found with that email. Try signing up or quick-selecting a demo account.');
        }
        return {
            message: `Welcome back, ${found.full_name}!`,
            user: found
        };
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
