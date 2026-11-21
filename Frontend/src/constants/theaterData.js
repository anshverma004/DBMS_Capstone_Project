export const DATE_TABS = [
    { id: 'today', day: 'TODAY', date: '21 NOV', label: 'Flash Drop Live' },
    { id: 'tomorrow', day: 'TOMORROW', date: '22 NOV', label: 'Premiere Day' },
    { id: 'weekend', day: 'SUNDAY', date: '23 NOV', label: 'Weekend Special' }
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
        timeSlots: [
            { time: '12:00 PM', tag: '70MM IMAX', isFlash: false },
            { time: '04:15 PM', tag: 'IMAX LASER', isFlash: false },
            { time: '07:45 PM', tag: 'DOLBY 7.1', isFlash: false },
            { time: '10:30 PM', tag: 'PRIME IMAX', isFlash: false }
        ],
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
        timeSlots: [
            { time: '10:45 AM', tag: 'DOLBY ATMOS', isFlash: false },
            { time: '02:30 PM', tag: '4K LASER', isFlash: false },
            { time: '08:00 PM', tag: '⚡ FLASH ₹99', isFlash: true },
            { time: '11:15 PM', tag: 'LATE SHOW', isFlash: true }
        ],
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
