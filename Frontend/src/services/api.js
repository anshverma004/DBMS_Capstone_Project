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

// 4. Stress-Test, Admin & Demo Reset APIs
export const simulateRaceApi = (showId, payload) =>
    request(`/shows/${showId}/simulate-race`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const createMovieShowApi = (payload) =>
    request('/shows/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const deleteCustomShowApi = (showId) =>
    request(`/shows/${showId}`, { method: 'DELETE' });

export const runPresetQueryApi = (queryKey) =>
    request(`/analytics/query/${queryKey}`);

export const resetShowApi = (showId) =>
    request(`/shows/${showId}/reset`, { method: 'POST' });

export const forceExpireHoldsApi = (showId) =>
    request(`/shows/${showId}/force-expire`, { method: 'POST' });

export const toggleFlashSaleApi = (showId) =>
    request(`/shows/${showId}/toggle-flash-sale`, { method: 'POST' });

export const simulateCrowdFillApi = (showId, count = 12) =>
    request(`/shows/${showId}/crowd-fill`, {
        method: 'POST',
        body: JSON.stringify({ count })
    });

// 5. Export MySQL Trigger Audit Logs to CSV
export function exportAuditLogsToCsv(auditLogs = []) {
    if (!auditLogs.length) return;
    const headers = [
        'Log_ID',
        'Show_ID',
        'Seat_Code',
        'Old_Status',
        'New_Status',
        'Old_Version',
        'New_Version',
        'Acted_By_User',
        'Changed_At_Timestamp'
    ];
    const rows = auditLogs.map((l) => [
        l.log_id,
        l.show_id,
        l.seat_code,
        l.old_status,
        l.new_status,
        `v${l.old_version}`,
        `v${l.new_version}`,
        `"${(l.user_name || '-').replace(/"/g, '""')}"`,
        `"${new Date(l.changed_at).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mysql_seat_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
