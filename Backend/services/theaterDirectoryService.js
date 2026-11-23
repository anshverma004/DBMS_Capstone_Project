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
        venuePhotoUrl: '/images/theater-dolby-lounge.jpg'
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

export function searchTheatersDirectory(shows = [], cityInput = '', queryInput = '') {
    if (!Array.isArray(shows) || shows.length === 0) return [];

    const rawCity = String(cityInput || '').trim();
    const cityNorm = rawCity.toLowerCase();
    const qNorm = String(queryInput || '').trim().toLowerCase();
    const hasSpecificCity = cityNorm && cityNorm !== 'all';

    let matchedVenues = [];

    if (!hasSpecificCity) {
        matchedVenues = shows.map((sh, idx) => {
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
            const pairedShow = shows[idx % shows.length];
            matchedVenues.push({
                venue: v,
                show: pairedShow,
                idx: shows.length + idx
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
            show: shows[idx % shows.length],
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
