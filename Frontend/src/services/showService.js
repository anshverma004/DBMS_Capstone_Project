import { request } from './httpClient';

export const fetchShows = () => request('/shows');
export const fetchShowDetails = (showId) => request(`/shows/${showId}`);

export const searchTheatersApi = ({ city = '', q = '' } = {}) => {
    const params = new URLSearchParams();
    if (city && city !== 'ALL') params.set('city', city);
    if (q) params.set('q', q);
    const qs = params.toString();
    return request(`/theaters/search${qs ? `?${qs}` : ''}`);
};

export const createMovieShowApi = (payload) =>
    request('/shows/create', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

export const deleteCustomShowApi = (showId) =>
    request(`/shows/${showId}`, { method: 'DELETE' });

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
