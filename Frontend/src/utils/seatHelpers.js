export function formatMMSS(totalSeconds) {
    const sec = Math.max(0, Number(totalSeconds) || 0);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getSeatViewingProfile(seat) {
    if (!seat) return null;
    if (seat.tier === 'CLASSIC') {
        return {
            distance: '8.5m from IMAX Screen (Close-Up Front Angle)',
            acoustics: '91% Direct Front Array',
            perks: 'Ergonomic Push-Back Cushion Seat'
        };
    }
    if (seat.tier === 'PRIME') {
        return {
            distance: '14.5m from IMAX Screen (Eye-Level Center Sweet-Spot)',
            acoustics: '99% Optimal 360° Dolby Atmos Calibration',
            perks: 'Panoramic Wide-Angle View + Dual Cupholders'
        };
    }
    return {
        distance: '21.0m from IMAX Screen (Elevated Stadium Back View)',
        acoustics: '96% Rear & Overhead Surround Balance',
        perks: '180° Motorised Leather Recliner + In-Seat Butler Service'
    };
}

export function isBestViewSeat(seat) {
    return (
        ['C', 'D'].includes(seat.row_label) &&
        seat.seat_number >= 4 &&
        seat.seat_number <= 7
    );
}

export const SEAT_TIERS = [
    {
        key: 'CLASSIC',
        title: 'CLASSIC TIER (Front Rows A–B)',
        rows: ['A', 'B'],
        badgeClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30'
    },
    {
        key: 'PRIME',
        title: 'PRIME TIER (Center Sweet-Spot Rows C–D)',
        rows: ['C', 'D'],
        badgeClass: 'text-indigo-300 border-indigo-500/30 bg-indigo-950/30'
    },
    {
        key: 'RECLINER',
        title: 'VIP ROYAL RECLINER TIER (Luxury Back Rows E–F)',
        rows: ['E', 'F'],
        badgeClass: 'text-amber-300 border-amber-500/30 bg-amber-950/30'
    }
];
