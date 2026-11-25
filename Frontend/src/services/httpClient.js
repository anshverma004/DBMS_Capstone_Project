const CLOUD_BACKEND_URL =
    'https://high-concurrency-movie-flash-sale-and.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:5000';
const LOCAL_USERS_KEY = 'cinepulse_registered_users';

function isLocalBrowserHost() {
    if (typeof window === 'undefined') return false;
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1';
}

const initialBaseUrl =
    import.meta.env.VITE_BACKEND_URL ||
    (isLocalBrowserHost() ? LOCAL_BACKEND_URL : CLOUD_BACKEND_URL);

let activeBaseUrl = initialBaseUrl;

export const SOCKET_URL = initialBaseUrl;
export const API_BASE = `${initialBaseUrl}/api`;

export function getActiveSocketUrl() {
    return activeBaseUrl;
}

export function getLocalRegisteredUsers() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    } catch {
        return [];
    }
}

export function saveLocalRegisteredUser(user) {
    try {
        const list = getLocalRegisteredUsers().filter(
            (u) => u.email?.toLowerCase() !== user.email?.toLowerCase()
        );
        list.push(user);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list));
    } catch {

    }
}

async function parseJsonSafely(res) {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return null;
    }
    try {
        return await res.json();
    } catch {
        return null;
    }
}

async function executeFetch(baseUrl, endpoint, options = {}) {
    const res = await fetch(`${baseUrl}/api${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const data = await parseJsonSafely(res);

    if (!res.ok) {
        if (res.status === 429) {
            throw new Error(
                'Cloud server rate-limited (HTTP 429). Wait a minute or run Backend locally on port 5000.'
            );
        }
        if (res.status >= 502 && res.status <= 504) {
            const err = new Error(`Backend server temporarily unavailable (HTTP ${res.status}).`);
            err.retryable = true;
            throw err;
        }
        throw new Error(data?.error || `Request failed (HTTP ${res.status})`);
    }

    if (data === null) {
        throw new Error('Unexpected non-JSON response from server.');
    }

    return data;
}

export async function request(endpoint, options = {}) {
    const canFallbackToCloud =
        !import.meta.env.VITE_BACKEND_URL &&
        isLocalBrowserHost() &&
        activeBaseUrl === LOCAL_BACKEND_URL;

    try {
        return await executeFetch(activeBaseUrl, endpoint, options);
    } catch (err) {
        const isNetworkError =
            err instanceof TypeError || /failed to fetch|networkerror/i.test(err.message);

        if (canFallbackToCloud && isNetworkError) {
            try {
                const cloudData = await executeFetch(CLOUD_BACKEND_URL, endpoint, options);
                activeBaseUrl = CLOUD_BACKEND_URL;
                return cloudData;
            } catch (cloudErr) {
                throw new Error(
                    'Cannot reach local Backend (localhost:5000) or Render Cloud API. Start Backend (npm run dev in Backend/) or check your connection.'
                );
            }
        }

        if (err.retryable) {
            await new Promise((r) => setTimeout(r, 1200));
            return executeFetch(activeBaseUrl, endpoint, options);
        }

        if (isNetworkError) {
            throw new Error(
                'Backend server is waking up or unreachable right now. Please try again in a few seconds.'
            );
        }

        throw err;
    }
}
