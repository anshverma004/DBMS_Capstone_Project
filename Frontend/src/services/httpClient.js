import { executeLocalDbRequest } from './localDbFallback';

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
let embeddedEngineUntil = 0;

export const SOCKET_URL = initialBaseUrl;
export const API_BASE = `${initialBaseUrl}/api`;

export function getActiveSocketUrl() {
    if (Date.now() < embeddedEngineUntil) {
        return null;
    }
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

function isInfrastructureOrDbFailure(err) {
    if (!err) return true;
    const status = Number(err.status || 0);
    if (status === 429 || status >= 500) {
        return true;
    }
    if (err.name === 'AbortError' || err instanceof TypeError) {
        return true;
    }
    const msg = String(err.message || '');
    return /failed to fetch|networkerror|load failed|abort|timeout|enotfound|econnrefused|etimedout|econnreset|protocol_connection_lost|aivencloud|waking up|unreachable|temporarily unavailable|rate-limited|non-json|http 5\d\d|http 429/i.test(
        msg
    );
}

async function executeFetch(baseUrl, endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    try {
        const res = await fetch(`${baseUrl}/api${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            ...options
        });
        const data = await parseJsonSafely(res);

        if (!res.ok) {
            const err = new Error(data?.error || `Request failed (HTTP ${res.status})`);
            err.status = res.status;
            throw err;
        }

        if (data === null) {
            const err = new Error('Unexpected non-JSON response from server.');
            err.status = 502;
            throw err;
        }

        return data;
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function request(endpoint, options = {}) {
    if (Date.now() < embeddedEngineUntil) {
        return executeLocalDbRequest(endpoint, options);
    }

    try {
        return await executeFetch(activeBaseUrl, endpoint, options);
    } catch (err) {
        if (isInfrastructureOrDbFailure(err)) {
            embeddedEngineUntil = Date.now() + 45000;
            return executeLocalDbRequest(endpoint, options);
        }
        throw err;
    }
}
