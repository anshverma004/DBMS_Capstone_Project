const STORAGE_KEY = 'cinepulse_relational_db_v1';

const VENUE_PHOTOS = [
    '/images/theater-imax-hall.jpg',
    '/images/theater-screen-imax.jpg',
    '/images/theater-dolby-lounge.jpg',
    '/images/hero-cinema.jpg',
    '/images/theater-auditorium-rows.jpg'
];

const CITY_THEATERS = [
    {
        cityKey: 'gurugram',
        aliases: ['gurgaon', 'delhi-ncr', 'ncr'],
        cityLabel: 'Gurugram (Delhi-NCR)',
        theaterName: "PVR Director's Cut: Ambience Mall, Gurugram",
        mallAddress: '3rd Floor, Ambience Mall, NH-8, Gurugram • 2.4 km away',
        format: 'IMAX 4K Laser 3D • Dolby 7.1',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'gurugram',
        aliases: ['gurgaon', 'delhi-ncr', 'ncr'],
        cityLabel: 'Gurugram (Delhi-NCR)',
        theaterName: 'INOX WorldMark: Sector 65, Gurugram',
        mallAddress: 'Golf Course Ext Rd, Sector 65, Gurugram • 4.2 km away',
        format: 'Dolby Atmos 4K • INSIGNIA',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'new delhi',
        aliases: ['delhi', 'delhi-ncr', 'ncr'],
        cityLabel: 'New Delhi (Delhi-NCR)',
        theaterName: 'INOX Laserplex: Select Citywalk, Saket',
        mallAddress: 'A-3, District Centre, Saket, New Delhi • 5.1 km away',
        format: '70mm IMAX Laser • Dolby Surround',
        venuePhotoUrl: '/images/theater-screen-imax.jpg'
    },
    {
        cityKey: 'new delhi',
        aliases: ['delhi', 'delhi-ncr', 'ncr'],
        cityLabel: 'New Delhi (Delhi-NCR)',
        theaterName: 'PVR Priya IMAX: Vasant Vihar, New Delhi',
        mallAddress: 'Basant Lok Complex, Vasant Vihar, New Delhi • 6.3 km away',
        format: 'P[XL] 4K Laser • Dolby Atmos',
        venuePhotoUrl: '/images/theater-auditorium-rows.jpg'
    },
    {
        cityKey: 'noida',
        aliases: ['delhi-ncr', 'ncr', 'greater noida'],
        cityLabel: 'Noida (Delhi-NCR)',
        theaterName: 'PVR Superplex: DLF Mall of India, Sector 18',
        mallAddress: '4th Floor, DLF Mall of India, Sector 18, Noida • 2.1 km away',
        format: 'IMAX 3D • 4DX • Gold Lounge',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'noida',
        aliases: ['delhi-ncr', 'ncr', 'greater noida'],
        cityLabel: 'Noida (Delhi-NCR)',
        theaterName: 'Cinepolis IMAX: Grand Venice Mall, Noida',
        mallAddress: 'Plot SH-3, Pari Chowk, Greater Noida • 4.8 km away',
        format: 'IMAX Laser • Dolby 7.1',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'mumbai',
        aliases: ['bombay', 'thane', 'navi mumbai'],
        cityLabel: 'Mumbai',
        theaterName: 'Maison PVR: Jio World Drive, BKC Mumbai',
        mallAddress: 'Maker Maxity, Bandra Kurla Complex, Mumbai • 3.8 km away',
        format: 'Dolby Atmos 4K • IMAX 2D',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'mumbai',
        aliases: ['bombay', 'thane', 'navi mumbai'],
        cityLabel: 'Mumbai',
        theaterName: 'PVR ICON: Phoenix Palladium, Lower Parel',
        mallAddress: 'High Street Phoenix, Lower Parel, Mumbai • 5.4 km away',
        format: 'IMAX with Laser • LUXE Recliners',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'bengaluru',
        aliases: ['bangalore', 'blr'],
        cityLabel: 'Bengaluru',
        theaterName: 'PVR IMAX: Nexus Koramangala (Forum Mall)',
        mallAddress: 'Hosur Road, Koramangala, Bengaluru • 2.9 km away',
        format: 'IMAX Laser 3D • P[XL]',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'bengaluru',
        aliases: ['bangalore', 'blr'],
        cityLabel: 'Bengaluru',
        theaterName: 'INOX Megaplex: Mantri Square, Malleshwaram',
        mallAddress: 'Sampige Road, Malleshwaram, Bengaluru • 4.6 km away',
        format: 'INSIGNIA • Dolby Atmos',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'bengaluru',
        aliases: ['bangalore', 'blr'],
        cityLabel: 'Bengaluru',
        theaterName: 'Cinepolis VIP IMAX: Orion Mall, Rajajinagar',
        mallAddress: 'Brigade Gateway, Dr Rajkumar Rd, Bengaluru • 6.1 km away',
        format: 'IMAX 4K • VIP Recliner Lounge',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'hyderabad',
        aliases: ['hyd', 'secunderabad'],
        cityLabel: 'Hyderabad',
        theaterName: 'AMB Cinemas: Gachibowli, Hyderabad',
        mallAddress: 'Sarath City Capital Mall, Kondapur, Hyderabad • 3.1 km away',
        format: 'BARCO Laser 4K • M-Cube Dolby Atmos',
        venuePhotoUrl: '/images/theater-auditorium-rows.jpg'
    },
    {
        cityKey: 'hyderabad',
        aliases: ['hyd', 'secunderabad'],
        cityLabel: 'Hyderabad',
        theaterName: 'Prasads Multiplex: Necklace Road, Hyderabad',
        mallAddress: 'NTR Gardens, Tank Bund Rd, Hyderabad • 4.5 km away',
        format: 'PCX Large Format Screen • Dolby Atmos',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'hyderabad',
        aliases: ['hyd', 'secunderabad'],
        cityLabel: 'Hyderabad',
        theaterName: 'PVR ICON: Next Galleria, Hitech City',
        mallAddress: 'Madhapur Main Rd, Hitech City, Hyderabad • 2.7 km away',
        format: '4K Laser • LUXE Recliners',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'pune',
        aliases: ['pun', 'pcmc'],
        cityLabel: 'Pune',
        theaterName: 'PVR ICON: Phoenix Marketcity, Viman Nagar',
        mallAddress: 'Nagar Road, Viman Nagar, Pune • 3.3 km away',
        format: 'IMAX 3D • 4K Dolby Atmos',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'pune',
        aliases: ['pun', 'pcmc'],
        cityLabel: 'Pune',
        theaterName: 'Cinepolis IMAX: Seasons Mall, Magarpatta',
        mallAddress: 'Magarpatta City, Hadapsar, Pune • 5.2 km away',
        format: 'IMAX Laser • VIP Recliners',
        venuePhotoUrl: '/images/theater-screen-imax.jpg'
    },
    {
        cityKey: 'chennai',
        aliases: ['madras'],
        cityLabel: 'Chennai',
        theaterName: 'PVR Sathyam Cinemas: Royapettah, Chennai',
        mallAddress: 'Thiru Vi Ka Road, Royapettah, Chennai • 2.2 km away',
        format: 'RDX 4K • Dolby Atmos',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'chennai',
        aliases: ['madras'],
        cityLabel: 'Chennai',
        theaterName: 'SPI Palazzo IMAX: Nexus Vijaya Mall, Vadapalani',
        mallAddress: 'NSK Salai, Vadapalani, Chennai • 4.7 km away',
        format: 'IMAX Laser • INSIGNIA',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'kolkata',
        aliases: ['calcutta'],
        cityLabel: 'Kolkata',
        theaterName: 'INOX South City Mall: Prince Anwar Shah Rd',
        mallAddress: '375 Prince Anwar Shah Rd, Jadavpur, Kolkata • 3.0 km away',
        format: 'IMAX 3D • INSIGNIA Lounge',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'kolkata',
        aliases: ['calcutta'],
        cityLabel: 'Kolkata',
        theaterName: 'Cinepolis: Acropolis Mall, Kasba, Kolkata',
        mallAddress: '1858 Rajdanga Main Rd, Sector 1, Kolkata • 4.4 km away',
        format: 'Dolby Atmos • MacroXE',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'jaipur',
        aliases: ['pink city'],
        cityLabel: 'Jaipur',
        theaterName: 'Raj Mandir Cinema: Bhagwan Das Rd, Jaipur',
        mallAddress: 'C-16, Panch Batti, MI Road, Jaipur • 1.9 km away',
        format: 'Heritage Royal Grand Hall • Dolby Digital',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'jaipur',
        aliases: ['pink city'],
        cityLabel: 'Jaipur',
        theaterName: 'INOX Megaplex: GT Central Mall, Malviya Nagar',
        mallAddress: 'Gaurav Tower Marg, Malviya Nagar, Jaipur • 4.1 km away',
        format: '4K Laser • Dolby Atmos',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'chandigarh',
        aliases: ['mohali', 'panchkula', 'tricity'],
        cityLabel: 'Chandigarh',
        theaterName: 'PVR LUXE: Elante Mall, Industrial Area Phase 1',
        mallAddress: 'Plot 178-178A, Industrial Area Phase 1, Chandigarh • 2.5 km away',
        format: '4DX • IMAX Laser • LUXE',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'chandigarh',
        aliases: ['mohali', 'panchkula', 'tricity'],
        cityLabel: 'Chandigarh',
        theaterName: 'Cinepolis VIP: Jagat Mall, Sector 17',
        mallAddress: 'Sector 17-A, City Centre, Chandigarh • 1.8 km away',
        format: 'Dolby Atmos • Recliner Bay',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'ahmedabad',
        aliases: ['gandhinagar'],
        cityLabel: 'Ahmedabad',
        theaterName: 'PVR Acropolis: Thaltej Cross Road, Ahmedabad',
        mallAddress: 'SG Highway, Thaltej, Ahmedabad • 3.2 km away',
        format: 'IMAX 4K • Dolby 7.1',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'ahmedabad',
        aliases: ['gandhinagar'],
        cityLabel: 'Ahmedabad',
        theaterName: 'Cinepolis VIP: AlphaOne Mall, Vastrapur',
        mallAddress: 'Vastrapur Lake Rd, Ahmedabad • 2.8 km away',
        format: 'Dolby Atmos • VIP Suite',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'kochi',
        aliases: ['cochin', 'ernakulam'],
        cityLabel: 'Kochi',
        theaterName: 'PVR Lulu IMAX: Lulu International Mall, Edappally',
        mallAddress: 'NH 544, Edappally, Kochi • 3.4 km away',
        format: 'IMAX Laser • P[XL] Atmos',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'lucknow',
        aliases: ['lko'],
        cityLabel: 'Lucknow',
        theaterName: 'INOX Megaplex: Phoenix Palassio, Gomti Nagar',
        mallAddress: 'Amar Shaheed Path, Gomti Nagar Ext, Lucknow • 3.6 km away',
        format: 'IMAX 3D • INSIGNIA Lounge',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'indore',
        aliases: ['mp'],
        cityLabel: 'Indore',
        theaterName: 'PVR: Phoenix Citadel Mall, MR-10, Indore',
        mallAddress: 'Junction Point, MR-10 Bypass, Indore • 3.5 km away',
        format: '4K Laser • Dolby Atmos',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    },
    {
        cityKey: 'surat',
        aliases: [],
        cityLabel: 'Surat',
        theaterName: 'INOX Laserplex: VR Surat, Dumas Road',
        mallAddress: 'Dumas Road, Magdalla, Surat • 2.9 km away',
        format: 'IMAX Laser • INSIGNIA',
        venuePhotoUrl: '/images/theater-imax-hall.jpg'
    },
    {
        cityKey: 'goa',
        aliases: ['panaji', 'margao', 'porvorim'],
        cityLabel: 'Goa',
        theaterName: 'INOX Multiplex: Mall De Goa, Porvorim',
        mallAddress: 'NH-66, Alto Porvorim, Panaji, Goa • 2.3 km away',
        format: 'Dolby Atmos • Laser 4K',
        venuePhotoUrl: '/images/hero-cinema.jpg'
    },
    {
        cityKey: 'patna',
        aliases: ['bihar'],
        cityLabel: 'Patna',
        theaterName: 'Cinepolis VIP: P&M Mall, Patliputra',
        mallAddress: 'Patliputra Colony, Kurji, Patna • 2.6 km away',
        format: 'Dolby 7.1 • VIP Recliners',
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
    }
];

function generateSeatsForShow(showId, totalRows, seatsPerRow, isFlashSale, startId) {
    const seats = [];
    let nextId = startId;
    for (let r = 1; r <= totalRows; r++) {
        const rowLabel = String.fromCharCode(64 + r);
        let tier = 'RECLINER';
        let price = isFlashSale ? 249 : 450;
        if (r <= 2) {
            tier = 'CLASSIC';
            price = isFlashSale ? 99 : 180;
        } else if (r <= 4) {
            tier = 'PRIME';
            price = isFlashSale ? 149 : 280;
        }
        for (let s = 1; s <= seatsPerRow; s++) {
            seats.push({
                show_seat_id: nextId++,
                show_id: showId,
                row_label: rowLabel,
                seat_number: s,
                seat_code: `${rowLabel}${s}`,
                tier,
                price,
                status: 'AVAILABLE',
                held_by_user_id: null,
                held_until: null,
                version: 1
            });
        }
    }
    return seats;
}

function createInitialDb() {
    const users = [
        { user_id: 1, full_name: 'Ansh Verma', email: 'anshverma004@gmail.com' },
        { user_id: 2, full_name: 'Aarav Sharma', email: 'aarav.sharma@example.com' },
        { user_id: 3, full_name: 'Priya Patel', email: 'priya.patel@example.com' },
        { user_id: 4, full_name: 'Rohan Verma', email: 'rohan.verma@example.com' },
        { user_id: 5, full_name: 'Ananya Gupta', email: 'ananya.gupta@example.com' },
        { user_id: 6, full_name: 'Kabir Singh', email: 'kabir.singh@example.com' },
        { user_id: 7, full_name: 'Neha Kapoor', email: 'neha.kapoor@example.com' },
        { user_id: 8, full_name: 'Vikram Joshi', email: 'vikram.joshi@example.com' },
        { user_id: 9, full_name: 'Ishita Rao', email: 'ishita.rao@example.com' },
        { user_id: 10, full_name: 'Aditya Mehta', email: 'aditya.mehta@example.com' }
    ];

    const shows = [
        {
            show_id: 1,
            movie_id: 1,
            screen_id: 1,
            movie_title: 'Avengers: Secret Wars (IMAX Premiere)',
            genre: 'Action / Sci-Fi',
            duration_mins: 165,
            screen_name: 'Screen 1 - IMAX Laser',
            total_rows: 6,
            seats_per_row: 10,
            total_capacity: 60,
            available_seats: 60,
            is_flash_sale: 1,
            status: 'OPEN',
            show_datetime: new Date(Date.now() + 3600 * 1000).toISOString()
        },
        {
            show_id: 2,
            movie_id: 2,
            screen_id: 1,
            movie_title: 'Interstellar (10th Anniversary IMAX)',
            genre: 'Sci-Fi / Adventure',
            duration_mins: 169,
            screen_name: 'Screen 1 - IMAX Laser',
            total_rows: 6,
            seats_per_row: 10,
            total_capacity: 60,
            available_seats: 60,
            is_flash_sale: 0,
            status: 'OPEN',
            show_datetime: new Date(Date.now() + 7200 * 1000).toISOString()
        },
        {
            show_id: 3,
            movie_id: 3,
            screen_id: 2,
            movie_title: 'Dune: Messiah (Dolby Premiere)',
            genre: 'Sci-Fi / Drama',
            duration_mins: 155,
            screen_name: 'Screen 2 - Dolby Atmos',
            total_rows: 5,
            seats_per_row: 10,
            total_capacity: 50,
            available_seats: 50,
            is_flash_sale: 1,
            status: 'OPEN',
            show_datetime: new Date(Date.now() + 10800 * 1000).toISOString()
        }
    ];

    const seats = [
        ...generateSeatsForShow(1, 6, 10, true, 1),
        ...generateSeatsForShow(2, 6, 10, false, 61),
        ...generateSeatsForShow(3, 5, 10, true, 121)
    ];

    return {
        users,
        shows,
        seats,
        bookings: [],
        auditLogs: [],
        nextShowId: 4,
        nextSeatId: 171,
        nextBookingId: 1,
        nextLogId: 1
    };
}

function loadDb() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.shows) && Array.isArray(parsed.seats)) {
                return parsed;
            }
        }
    } catch {

    }
    const fresh = createInitialDb();
    saveDb(fresh);
    return fresh;
}

function saveDb(db) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {

    }
}

function syncShowAvailability(db, showId) {
    const show = db.shows.find((s) => Number(s.show_id) === Number(showId));
    if (!show) return;
    const avail = db.seats.filter(
        (s) => Number(s.show_id) === Number(showId) && s.status === 'AVAILABLE'
    ).length;
    show.available_seats = avail;
    show.status = avail === 0 ? 'SOLD_OUT' : 'OPEN';
}

function appendAuditLog(db, seat, oldStatus, newStatus, oldVersion, newVersion, userId) {
    const user = db.users.find((u) => Number(u.user_id) === Number(userId));
    db.auditLogs.unshift({
        log_id: db.nextLogId++,
        show_seat_id: seat.show_seat_id,
        show_id: seat.show_id,
        seat_code: seat.seat_code,
        old_status: oldStatus,
        new_status: newStatus,
        old_version: oldVersion,
        new_version: newVersion,
        acted_by_user_id: userId || null,
        user_name: user?.full_name || 'System',
        changed_at: new Date().toISOString()
    });
    if (db.auditLogs.length > 200) {
        db.auditLogs.length = 200;
    }
}

function sweepExpiredHolds(db) {
    const now = Date.now();
    let changed = false;

    for (const b of db.bookings) {
        if (b.booking_status === 'PENDING' && b.expires_at_ms && b.expires_at_ms < now) {
            b.booking_status = 'EXPIRED';
            changed = true;
        }
    }

    for (const s of db.seats) {
        if (s.status === 'HELD' && s.held_until_ms && s.held_until_ms < now) {
            const oldV = s.version;
            s.status = 'AVAILABLE';
            s.held_by_user_id = null;
            s.held_until = null;
            s.held_until_ms = null;
            s.version = oldV + 1;
            appendAuditLog(db, s, 'HELD', 'AVAILABLE', oldV, s.version, null);
            syncShowAvailability(db, s.show_id);
            changed = true;
        }
    }

    if (changed) saveDb(db);
}

function toTitleCase(text) {
    return String(text || '')
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function generateDynamicCityVenues(cityRaw) {
    const cleanCity = toTitleCase(cityRaw);
    return [
        {
            cityKey: cleanCity.toLowerCase(),
            aliases: [],
            cityLabel: cleanCity,
            theaterName: `PVR IMAX: City Centre Mall, ${cleanCity}`,
            mallAddress: `3rd Floor, City Centre Atrium, Central Avenue, ${cleanCity} • 2.1 km away`,
            format: 'IMAX 4K Laser 3D • Dolby 7.1',
            venuePhotoUrl: VENUE_PHOTOS[0]
        },
        {
            cityKey: cleanCity.toLowerCase(),
            aliases: [],
            cityLabel: cleanCity,
            theaterName: `INOX Laserplex: Grand Plaza, ${cleanCity}`,
            mallAddress: `Station Road Galleria, ${cleanCity} • 3.8 km away`,
            format: 'Dolby Atmos • INSIGNIA Recliners',
            venuePhotoUrl: VENUE_PHOTOS[1]
        },
        {
            cityKey: cleanCity.toLowerCase(),
            aliases: [],
            cityLabel: cleanCity,
            theaterName: `Cinepolis VIP: Phoenix Square, ${cleanCity}`,
            mallAddress: `Civic Center Crossing, ${cleanCity} • 4.9 km away`,
            format: 'MacroXE 4K • VIP Lounge',
            venuePhotoUrl: VENUE_PHOTOS[2]
        }
    ];
}

export function searchDirectoryWithShows(shows = [], cityInput = '', queryInput = '') {
    const activeShows =
        Array.isArray(shows) && shows.length > 0 ? shows : loadDb().shows;
    if (!Array.isArray(activeShows) || activeShows.length === 0) return [];

    const rawCity = String(cityInput || '').trim();
    const cityNorm = rawCity.toLowerCase();
    const qNorm = String(queryInput || '').trim().toLowerCase();
    const hasSpecificCity = cityNorm && cityNorm !== 'all';

    let matchedVenues = [];

    if (!hasSpecificCity) {
        matchedVenues = activeShows.map((sh, idx) => {
            const fallbackVenue = CITY_THEATERS[idx % CITY_THEATERS.length];
            const directById = [
                CITY_THEATERS[0],
                CITY_THEATERS[2],
                CITY_THEATERS[6]
            ][(Number(sh.show_id) - 1) % 3];
            const chosenVenue = idx < 3 ? directById : fallbackVenue;
            return { venue: chosenVenue, show: sh, idx };
        });

        const metroExtras = [
            CITY_THEATERS[8],
            CITY_THEATERS[11],
            CITY_THEATERS[14]
        ];
        metroExtras.forEach((v, idx) => {
            const pairedShow = activeShows[idx % activeShows.length];
            matchedVenues.push({
                venue: v,
                show: pairedShow,
                idx: activeShows.length + idx
            });
        });
    } else {
        const directMatches = CITY_THEATERS.filter(
            (v) =>
                v.cityKey.includes(cityNorm) ||
                v.cityLabel.toLowerCase().includes(cityNorm) ||
                v.aliases.some((al) => al.includes(cityNorm))
        );

        const cityVenues =
            directMatches.length > 0
                ? directMatches
                : generateDynamicCityVenues(rawCity);

        matchedVenues = cityVenues.map((venue, idx) => ({
            venue,
            show: activeShows[idx % activeShows.length],
            idx
        }));
    }

    const assembled = matchedVenues.map(({ venue, show, idx }) => ({
        ...show,
        listingId: `${show.show_id}-${venue.cityKey}-${idx}`,
        city: venue.cityLabel,
        theaterName: venue.theaterName,
        mallAddress: venue.mallAddress,
        format: venue.format,
        venuePhotoUrl: venue.venuePhotoUrl
    }));

    if (!qNorm) return assembled;

    return assembled.filter(
        (item) =>
            item.theaterName.toLowerCase().includes(qNorm) ||
            item.mallAddress.toLowerCase().includes(qNorm) ||
            item.city.toLowerCase().includes(qNorm) ||
            item.movie_title?.toLowerCase().includes(qNorm) ||
            item.screen_name?.toLowerCase().includes(qNorm) ||
            item.genre?.toLowerCase().includes(qNorm)
    );
}

function getShowDetailsPayload(db, showId) {
    const show = db.shows.find((s) => Number(s.show_id) === Number(showId)) || null;
    const now = Date.now();

    const seats = db.seats
        .filter((s) => Number(s.show_id) === Number(showId))
        .map((s) => {
            const holder = db.users.find((u) => Number(u.user_id) === Number(s.held_by_user_id));
            const secLeft =
                s.status === 'HELD' && s.held_until_ms
                    ? Math.max(0, Math.round((s.held_until_ms - now) / 1000))
                    : 0;
            return {
                ...s,
                held_by_name: holder?.full_name || null,
                seconds_left: secLeft
            };
        });

    const bookings = db.bookings
        .filter((b) => Number(b.show_id) === Number(showId))
        .map((b) => {
            const secLeft =
                b.booking_status === 'PENDING' && b.expires_at_ms
                    ? Math.max(0, Math.round((b.expires_at_ms - now) / 1000))
                    : 0;
            return {
                ...b,
                seconds_left: secLeft
            };
        });

    const auditLogs = db.auditLogs
        .filter((l) => Number(l.show_id) === Number(showId))
        .slice(0, 30);

    return { show, seats, bookings, auditLogs };
}

export function executeLocalDbRequest(endpoint, options = {}) {
    const db = loadDb();
    sweepExpiredHolds(db);

    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};
    const [pathPart, queryString = ''] = String(endpoint).split('?');
    const params = new URLSearchParams(queryString);

    if (method === 'GET' && pathPart === '/users') {
        return db.users;
    }

    if (method === 'POST' && pathPart === '/auth/signup') {
        const cleanName = String(body.fullName || '').trim();
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
        if (existing) {
            throw new Error('An account with this email already exists. Please log in instead.');
        }
        const newUser = {
            user_id: db.users.length + 1,
            full_name: cleanName,
            email: cleanEmail
        };
        db.users.push(newUser);
        saveDb(db);
        return {
            message: `Account created for ${cleanName}!`,
            user: newUser,
            users: db.users
        };
    }

    if (method === 'POST' && pathPart === '/auth/login') {
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        let found = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
        if (!found && cleanEmail.includes('ansh')) {
            found = db.users[0];
        }
        if (!found) {
            const fallbackName = cleanEmail.split('@')[0] || 'Cinema Guest';
            found = {
                user_id: db.users.length + 1,
                full_name: fallbackName,
                email: cleanEmail
            };
            db.users.push(found);
            saveDb(db);
        }
        return {
            message: `Welcome back, ${found.full_name}!`,
            user: found
        };
    }

    if (method === 'GET' && pathPart === '/shows') {
        return db.shows;
    }

    if (method === 'GET' && pathPart === '/theaters/search') {
        const city = params.get('city') || '';
        const q = params.get('q') || '';
        const theaters = searchDirectoryWithShows(db.shows, city, q);
        return {
            city: city || 'ALL',
            query: q,
            total: theaters.length,
            theaters
        };
    }

    if (method === 'POST' && pathPart === '/shows/create') {
        const title = String(body.title || '').trim();
        const genre = String(body.genre || 'Action / Sci-Fi').trim();
        const durationMins = Math.max(30, Number(body.durationMins) || 160);
        const screenId = Number(body.screenId) || 1;
        const isFlashSale = Boolean(body.isFlashSale);
        const totalRows = screenId === 2 ? 5 : 6;
        const totalCapacity = totalRows * 10;
        const newShowId = db.nextShowId++;

        const newShow = {
            show_id: newShowId,
            movie_id: newShowId,
            screen_id: screenId,
            movie_title: title,
            genre,
            duration_mins: durationMins,
            screen_name:
                screenId === 2 ? 'Screen 2 - Dolby Atmos' : 'Screen 1 - IMAX Laser',
            total_rows: totalRows,
            seats_per_row: 10,
            total_capacity: totalCapacity,
            available_seats: totalCapacity,
            is_flash_sale: isFlashSale ? 1 : 0,
            status: 'OPEN',
            show_datetime: new Date(Date.now() + 5400 * 1000).toISOString()
        };

        db.shows.push(newShow);
        const newSeats = generateSeatsForShow(
            newShowId,
            totalRows,
            10,
            isFlashSale,
            db.nextSeatId
        );
        db.nextSeatId += newSeats.length;
        db.seats.push(...newSeats);
        saveDb(db);

        return {
            message: `🎬 Created "${title}" & generated ${totalCapacity} seats via sp_generate_show_seats(${newShowId})!`,
            showId: newShowId
        };
    }

    const showMatch = pathPart.match(/^\/shows\/(\d+)$/);
    if (showMatch) {
        const showId = Number(showMatch[1]);
        if (method === 'GET') {
            return getShowDetailsPayload(db, showId);
        }
        if (method === 'DELETE') {
            db.shows = db.shows.filter((s) => Number(s.show_id) !== showId);
            db.seats = db.seats.filter((s) => Number(s.show_id) !== showId);
            db.bookings = db.bookings.filter((b) => Number(b.show_id) !== showId);
            saveDb(db);
            return {
                message: `🗑️ Removed Show #${showId} and all its seats!`
            };
        }
    }

    const holdMatch = pathPart.match(/^\/shows\/(\d+)\/hold$/);
    if (method === 'POST' && holdMatch) {
        const showId = Number(holdMatch[1]);
        const userId = Number(body.userId) || 1;
        const lockMode = body.lockMode || 'PESSIMISTIC';
        const sortedIds = [...new Set((body.seatIds || []).map(Number))].sort(
            (a, b) => a - b
        );
        if (sortedIds.length === 0) {
            throw new Error('Please select at least one seat.');
        }

        const targetSeats = sortedIds.map((id) =>
            db.seats.find(
                (s) => Number(s.show_id) === showId && Number(s.show_seat_id) === id
            )
        );

        for (const seat of targetSeats) {
            if (!seat || seat.status !== 'AVAILABLE') {
                throw new Error(`Seat ${seat?.seat_code || ''} is already ${seat?.status || 'taken'}.`);
            }
        }

        const expiresMs = Date.now() + 5 * 60 * 1000;
        const expiresIso = new Date(expiresMs).toISOString();

        for (const seat of targetSeats) {
            const oldV = seat.version;
            seat.status = 'HELD';
            seat.held_by_user_id = userId;
            seat.held_until = expiresIso;
            seat.held_until_ms = expiresMs;
            seat.version = oldV + 1;
            appendAuditLog(db, seat, 'AVAILABLE', 'HELD', oldV, seat.version, userId);
        }

        const user = db.users.find((u) => Number(u.user_id) === userId) || db.users[0];
        const totalAmount = targetSeats.reduce((sum, s) => sum + Number(s.price), 0);
        const bookingId = db.nextBookingId++;

        const newBooking = {
            booking_id: bookingId,
            user_id: userId,
            user_name: user?.full_name || 'Guest',
            show_id: showId,
            total_amount: totalAmount,
            booking_status: 'PENDING',
            lock_mode: lockMode,
            seat_ids: sortedIds,
            seats_list: targetSeats.map((s) => s.seat_code).join(', '),
            created_at: new Date().toISOString(),
            expires_at: expiresIso,
            expires_at_ms: expiresMs
        };

        db.bookings.unshift(newBooking);
        syncShowAvailability(db, showId);
        saveDb(db);

        return {
            message: `Seats (${newBooking.seats_list}) held for 5 minutes!`,
            booking: {
                bookingId,
                userId,
                showId,
                seatCodes: targetSeats.map((s) => s.seat_code),
                totalAmount,
                lockMode
            }
        };
    }

    const confirmMatch = pathPart.match(/^\/bookings\/(\d+)\/confirm$/);
    if (method === 'POST' && confirmMatch) {
        const bookingId = Number(confirmMatch[1]);
        const booking = db.bookings.find((b) => Number(b.booking_id) === bookingId);
        if (!booking || booking.booking_status !== 'PENDING') {
            throw new Error('Booking is no longer pending.');
        }

        booking.booking_status = 'CONFIRMED';
        booking.confirmed_at = new Date().toISOString();

        for (const seatId of booking.seat_ids || []) {
            const seat = db.seats.find((s) => Number(s.show_seat_id) === Number(seatId));
            if (seat) {
                const oldV = seat.version;
                seat.status = 'BOOKED';
                seat.held_until = null;
                seat.held_until_ms = null;
                seat.version = oldV + 1;
                appendAuditLog(
                    db,
                    seat,
                    'HELD',
                    'BOOKED',
                    oldV,
                    seat.version,
                    booking.user_id
                );
            }
        }

        syncShowAvailability(db, booking.show_id);
        saveDb(db);
        return { message: 'Payment confirmed! Seats are permanently BOOKED.' };
    }

    const cancelMatch = pathPart.match(/^\/bookings\/(\d+)\/cancel$/);
    if (method === 'POST' && cancelMatch) {
        const bookingId = Number(cancelMatch[1]);
        const booking = db.bookings.find((b) => Number(b.booking_id) === bookingId);
        if (!booking) {
            throw new Error('Booking cannot be cancelled.');
        }
        const wasConfirmed = booking.booking_status === 'CONFIRMED';
        booking.booking_status = 'CANCELLED';

        for (const seatId of booking.seat_ids || []) {
            const seat = db.seats.find((s) => Number(s.show_seat_id) === Number(seatId));
            if (seat) {
                const oldStatus = seat.status;
                const oldV = seat.version;
                seat.status = 'AVAILABLE';
                seat.held_by_user_id = null;
                seat.held_until = null;
                seat.held_until_ms = null;
                seat.version = oldV + 1;
                appendAuditLog(
                    db,
                    seat,
                    oldStatus,
                    'AVAILABLE',
                    oldV,
                    seat.version,
                    booking.user_id
                );
            }
        }

        syncShowAvailability(db, booking.show_id);
        saveDb(db);
        return {
            message: wasConfirmed
                ? 'Confirmed M-Ticket cancelled & refunded! Seats returned to AVAILABLE.'
                : 'Hold cancelled and seats released.'
        };
    }

    const raceMatch = pathPart.match(/^\/shows\/(\d+)\/simulate-race$/);
    if (method === 'POST' && raceMatch) {
        const showId = Number(raceMatch[1]);
        const seatIds = (body.seatIds || []).map(Number);
        const concurrentUsers = Math.max(2, Number(body.concurrentUsers) || 50);
        const lockMode = body.lockMode || 'PESSIMISTIC';
        const reverseOrderDeadlockTest = Boolean(body.reverseOrderDeadlockTest);

        const targetSeats = seatIds
            .map((id) =>
                db.seats.find(
                    (s) => Number(s.show_id) === showId && Number(s.show_seat_id) === id
                )
            )
            .filter(Boolean);

        if (targetSeats.length === 0) {
            throw new Error('Target seat not found.');
        }

        const allAvailable = targetSeats.every((s) => s.status === 'AVAILABLE');
        const winnerUser = db.users[0];
        const results = [];

        if (allAvailable) {
            const expiresMs = Date.now() + 5 * 60 * 1000;
            const expiresIso = new Date(expiresMs).toISOString();
            for (const seat of targetSeats) {
                const oldV = seat.version;
                seat.status = 'HELD';
                seat.held_by_user_id = winnerUser.user_id;
                seat.held_until = expiresIso;
                seat.held_until_ms = expiresMs;
                seat.version = oldV + 1;
                appendAuditLog(
                    db,
                    seat,
                    'AVAILABLE',
                    'HELD',
                    oldV,
                    seat.version,
                    winnerUser.user_id
                );
            }

            const bookingId = db.nextBookingId++;
            const totalAmount = targetSeats.reduce((sum, s) => sum + Number(s.price), 0);
            db.bookings.unshift({
                booking_id: bookingId,
                user_id: winnerUser.user_id,
                user_name: winnerUser.full_name,
                show_id: showId,
                total_amount: totalAmount,
                booking_status: 'PENDING',
                lock_mode: lockMode,
                seat_ids: seatIds,
                seats_list: targetSeats.map((s) => s.seat_code).join(', '),
                created_at: new Date().toISOString(),
                expires_at: expiresIso,
                expires_at_ms: expiresMs
            });
            syncShowAvailability(db, showId);
            saveDb(db);

            results.push({
                requestNumber: 1,
                user: winnerUser.full_name,
                status: 'SUCCESS',
                bookingId
            });
        }

        for (let i = results.length; i < concurrentUsers; i++) {
            const u = db.users[i % db.users.length];
            results.push({
                requestNumber: i + 1,
                user: u.full_name,
                status: 'REJECTED_409',
                reason:
                    lockMode === 'OPTIMISTIC'
                        ? `Optimistic version conflict on Seat ${targetSeats[0].seat_code}`
                        : `Seat ${targetSeats[0].seat_code} is already HELD`
            });
        }

        const winners = results.filter((r) => r.status === 'SUCCESS');
        const rejected = results.filter((r) => r.status !== 'SUCCESS');

        return {
            summary: {
                totalConcurrentRequests: results.length,
                lockModeUsed: lockMode,
                testType:
                    reverseOrderDeadlockTest && seatIds.length > 1
                        ? 'DEADLOCK_PAIR_TEST'
                        : 'SINGLE_SEAT_RACE',
                succeededCount: winners.length,
                preventedDoubleBookings: rejected.length,
                deadlocksOccurred: 0,
                winner: winners[0] || null,
                durationMs: 14 + Math.floor(Math.random() * 18)
            },
            sampleResults: results.slice(0, 15)
        };
    }

    const resetMatch = pathPart.match(/^\/shows\/(\d+)\/reset$/);
    if (method === 'POST' && resetMatch) {
        const showId = Number(resetMatch[1]);
        for (const s of db.seats) {
            if (Number(s.show_id) === showId) {
                s.status = 'AVAILABLE';
                s.held_by_user_id = null;
                s.held_until = null;
                s.held_until_ms = null;
                s.version = 1;
            }
        }
        db.bookings = db.bookings.filter((b) => Number(b.show_id) !== showId);
        db.auditLogs = db.auditLogs.filter((l) => Number(l.show_id) !== showId);
        syncShowAvailability(db, showId);
        saveDb(db);
        return { message: 'Show reset to 100% AVAILABLE seats!' };
    }

    const expireMatch = pathPart.match(/^\/shows\/(\d+)\/force-expire$/);
    if (method === 'POST' && expireMatch) {
        const showId = Number(expireMatch[1]);
        const past = Date.now() - 5000;
        for (const b of db.bookings) {
            if (Number(b.show_id) === showId && b.booking_status === 'PENDING') {
                b.expires_at_ms = past;
            }
        }
        for (const s of db.seats) {
            if (Number(s.show_id) === showId && s.status === 'HELD') {
                s.held_until_ms = past;
            }
        }
        sweepExpiredHolds(db);
        return {
            message:
                '⏩ 5-Minute TTL Timer Fast-Forwarded! All unpaid HELD seats automatically expired back to AVAILABLE.'
        };
    }

    const flashMatch = pathPart.match(/^\/shows\/(\d+)\/toggle-flash-sale$/);
    if (method === 'POST' && flashMatch) {
        const showId = Number(flashMatch[1]);
        const show = db.shows.find((s) => Number(s.show_id) === showId);
        if (!show) throw new Error('Show not found.');
        const newFlash = !show.is_flash_sale;
        show.is_flash_sale = newFlash ? 1 : 0;

        for (const s of db.seats) {
            if (Number(s.show_id) === showId) {
                if (s.tier === 'CLASSIC') s.price = newFlash ? 99 : 180;
                else if (s.tier === 'PRIME') s.price = newFlash ? 149 : 280;
                else s.price = newFlash ? 249 : 450;
            }
        }
        saveDb(db);
        return {
            message: newFlash
                ? '⚡ Flash-Sale Mode ENABLED! Seat prices slashed to ₹99 / ₹149 / ₹249.'
                : '🎬 Switched to Regular Show Pricing (₹180 / ₹280 / ₹450).'
        };
    }

    const crowdMatch = pathPart.match(/^\/shows\/(\d+)\/crowd-fill$/);
    if (method === 'POST' && crowdMatch) {
        const showId = Number(crowdMatch[1]);
        const count = Math.min(25, Math.max(1, Number(body.count) || 12));
        const avail = db.seats.filter(
            (s) => Number(s.show_id) === showId && s.status === 'AVAILABLE'
        );
        if (avail.length === 0) {
            throw new Error('No available seats left to fill.');
        }
        const picked = avail.sort(() => 0.5 - Math.random()).slice(0, count);
        const actor = db.users[0];
        let total = 0;

        for (const s of picked) {
            const oldV = s.version;
            s.status = 'BOOKED';
            s.held_by_user_id = actor.user_id;
            s.held_until = null;
            s.held_until_ms = null;
            s.version = oldV + 1;
            total += Number(s.price);
            appendAuditLog(db, s, 'AVAILABLE', 'BOOKED', oldV, s.version, actor.user_id);
        }

        db.bookings.unshift({
            booking_id: db.nextBookingId++,
            user_id: actor.user_id,
            user_name: actor.full_name,
            show_id: showId,
            total_amount: total,
            booking_status: 'CONFIRMED',
            lock_mode: 'PESSIMISTIC',
            seat_ids: picked.map((s) => s.show_seat_id),
            seats_list: picked.map((s) => s.seat_code).join(', '),
            created_at: new Date().toISOString(),
            confirmed_at: new Date().toISOString()
        });

        syncShowAvailability(db, showId);
        saveDb(db);

        return {
            message: `🍿 Simulated Theater Crowd Fill! Booked ${picked.length} seats (${picked
                .map((s) => s.seat_code)
                .join(', ')}).`
        };
    }

    return {};
}
