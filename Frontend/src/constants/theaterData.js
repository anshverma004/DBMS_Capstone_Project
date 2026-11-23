const CUSTOM_POSTERS_KEY = 'cinepulse_custom_posters';

export const DATE_TABS = [
    { id: 'today', day: 'TODAY', date: '21 NOV', label: 'Flash Drop Live' },
    { id: 'tomorrow', day: 'TOMORROW', date: '22 NOV', label: 'Premiere Day' },
    { id: 'weekend', day: 'SUNDAY', date: '23 NOV', label: 'Weekend Special' }
];

export const POSTER_PRESETS = [
    {
        id: 'cosmic',
        label: 'Cosmic Multiverse Action',
        url: '/images/poster-cosmic-wars.jpg'
    },
    {
        id: 'space',
        label: 'Deep-Space IMAX Odyssey',
        url: '/images/poster-deep-space.jpg'
    },
    {
        id: 'desert',
        label: 'Desert Empire Saga',
        url: '/images/poster-desert-empire.jpg'
    },
    {
        id: 'neon',
        label: 'Cyber Noir Thriller',
        url: '/images/poster-neon-action.jpg'
    },
    {
        id: 'royal',
        label: 'Royal Fortress Epic',
        url: '/images/poster-royal-action.jpg'
    }
];

export const VENUE_PHOTOS = [
    '/images/theater-imax-hall.jpg',
    '/images/hero-cinema.jpg',
    '/images/theater-dolby-lounge.jpg'
];

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
        posterUrl: '/images/poster-cosmic-wars.jpg',
        venuePhotoUrl: '/images/theater-imax-hall.jpg',
        timeSlots: [
            { time: '11:15 AM', tag: 'IMAX 3D', isFlash: false },
            { time: '03:30 PM', tag: 'LASER', isFlash: false },
            { time: '07:00 PM', tag: '⚡ FLASH ₹99', isFlash: true },
            { time: '10:45 PM', tag: 'VIP RECLINER', isFlash: true }
        ],
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
        posterUrl: '/images/poster-deep-space.jpg',
        venuePhotoUrl: '/images/hero-cinema.jpg',
        timeSlots: [
            { time: '12:00 PM', tag: '70MM IMAX', isFlash: false },
            { time: '04:15 PM', tag: 'IMAX LASER', isFlash: false },
            { time: '07:45 PM', tag: 'DOLBY 7.1', isFlash: false },
            { time: '10:30 PM', tag: 'PRIME IMAX', isFlash: false }
        ],
        regularBasePrice: 180,
        flashBasePrice: 180,
        tagline: 'Deep-Space IMAX Masterpiece in Full Expanded Aspect Ratio',
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
        posterUrl: '/images/poster-desert-empire.jpg',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg',
        timeSlots: [
            { time: '10:45 AM', tag: 'DOLBY ATMOS', isFlash: false },
            { time: '02:30 PM', tag: '4K LASER', isFlash: false },
            { time: '08:00 PM', tag: '⚡ FLASH ₹99', isFlash: true },
            { time: '11:15 PM', tag: 'LATE SHOW', isFlash: true }
        ],
        regularBasePrice: 180,
        flashBasePrice: 99,
        tagline: 'Experience the Desert Saga in 64-Channel Overhead Dolby Atmos Sound',
        gradient: 'from-amber-600 via-stone-900 to-slate-950',
        badgeColor: 'bg-amber-500 text-slate-950',
        amenities: ['M-Ticket', 'Dolby Atmos', 'Gourmet Popcorn Bar', 'Valet Parking']
    }
};

function getCustomPosterMap() {
    try {
        return JSON.parse(localStorage.getItem(CUSTOM_POSTERS_KEY) || '{}');
    } catch {
        return {};
    }
}

export function saveCustomShowPoster(showId, movieTitle, posterUrl) {
    if (!posterUrl) return;
    try {
        const current = getCustomPosterMap();
        if (showId) current[`id:${showId}`] = posterUrl;
        if (movieTitle) current[`title:${String(movieTitle).trim().toLowerCase()}`] = posterUrl;
        localStorage.setItem(CUSTOM_POSTERS_KEY, JSON.stringify(current));
    } catch {

    }
}

export function resolveMoviePoster(show, index = 0) {
    if (!show) return POSTER_PRESETS[0].url;
    const customMap = getCustomPosterMap();
    const byId = customMap[`id:${show.show_id}`];
    if (byId) return byId;

    const cleanTitle = String(show.movie_title || '').trim().toLowerCase();
    const byTitle = customMap[`title:${cleanTitle}`];
    if (byTitle) return byTitle;

    if (cleanTitle.includes('interstellar') || cleanTitle.includes('space')) {
        return '/images/poster-deep-space.jpg';
    }
    if (cleanTitle.includes('dune') || cleanTitle.includes('desert')) {
        return '/images/poster-desert-empire.jpg';
    }
    if (cleanTitle.includes('avenger') || cleanTitle.includes('secret')) {
        return '/images/poster-cosmic-wars.jpg';
    }
    if (
        cleanTitle.includes('pushpa') ||
        cleanTitle.includes('kalki') ||
        cleanTitle.includes('king') ||
        cleanTitle.includes('kantara')
    ) {
        return '/images/poster-royal-action.jpg';
    }
    if (
        cleanTitle.includes('batman') ||
        cleanTitle.includes('john') ||
        cleanTitle.includes('matrix') ||
        cleanTitle.includes('cyber')
    ) {
        return '/images/poster-neon-action.jpg';
    }

    const fallbackIndex = (Number(show.show_id || index + 1) - 1) % POSTER_PRESETS.length;
    return POSTER_PRESETS[Math.max(0, fallbackIndex)].url;
}

export function enrichShow(show, index = 0) {
    if (!show) return null;
    const slotKey = ((Number(show.show_id || index + 1) - 1) % 3) + 1;
    const preset = SHOW_ENRICHMENT[show.show_id] || SHOW_ENRICHMENT[slotKey];
    return {
        ...preset,
        ...show,
        posterUrl: resolveMoviePoster(show, index),
        venuePhotoUrl: preset.venuePhotoUrl || VENUE_PHOTOS[index % VENUE_PHOTOS.length]
    };
}
