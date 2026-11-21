import { enrichShow } from '../constants/theaterData';

export function computeAnalyticsTelemetry(seats = [], shows = []) {
    const totalSeats = seats.length || 60;
    const availableCount = seats.filter((s) => s.status === 'AVAILABLE').length;
    const heldCount = seats.filter((s) => s.status === 'HELD').length;
    const bookedCount = seats.filter((s) => s.status === 'BOOKED').length;
    const occupancyRate =
        totalSeats > 0 ? Math.round(((bookedCount + heldCount) / totalSeats) * 100) : 0;

    const totalRevenue = seats
        .filter((s) => s.status === 'BOOKED')
        .reduce((sum, s) => sum + Number(s.price), 0);
    const heldRevenue = seats
        .filter((s) => s.status === 'HELD')
        .reduce((sum, s) => sum + Number(s.price), 0);
    const maxCapacityRevenue = seats.reduce((sum, s) => sum + Number(s.price), 0) || 10000;

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const availArc = totalSeats > 0 ? (availableCount / totalSeats) * circumference : 0;
    const heldArc = totalSeats > 0 ? (heldCount / totalSeats) * circumference : 0;
    const bookedArc = totalSeats > 0 ? (bookedCount / totalSeats) * circumference : 0;

    const tiersConfig = [
        {
            name: 'CLASSIC',
            color: '#22d3ee',
            textClass: 'text-cyan-400',
            bgClass: 'bg-cyan-400',
            ringRadius: 34
        },
        {
            name: 'PRIME',
            color: '#818cf8',
            textClass: 'text-indigo-400',
            bgClass: 'bg-indigo-400',
            ringRadius: 46
        },
        {
            name: 'RECLINER',
            color: '#fbbf24',
            textClass: 'text-amber-400',
            bgClass: 'bg-amber-400',
            ringRadius: 58
        }
    ];

    const tiersSummary = tiersConfig.map((cfg) => {
        const tierSeats = seats.filter((s) => s.tier === cfg.name);
        const total = tierSeats.length || 20;
        const available = tierSeats.filter((s) => s.status === 'AVAILABLE').length;
        const held = tierSeats.filter((s) => s.status === 'HELD').length;
        const booked = tierSeats.filter((s) => s.status === 'BOOKED').length;
        const revenue = tierSeats
            .filter((s) => s.status === 'BOOKED')
            .reduce((sum, s) => sum + Number(s.price), 0);
        const fillPct = total > 0 ? Math.round(((booked + held) / total) * 100) : 0;
        const ringCirc = 2 * Math.PI * cfg.ringRadius;
        const ringDash = (Math.max(8, fillPct) / 100) * ringCirc;

        return {
            ...cfg,
            total,
            available,
            held,
            booked,
            revenue,
            fillPct,
            ringCirc,
            ringDash
        };
    });

    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const rowPoints = rowLabels.map((rLabel, idx) => {
        const rowSeats = seats.filter((s) => s.row_label === rLabel);
        const rowBooked = rowSeats.filter((s) => s.status === 'BOOKED').length;
        const rowHeld = rowSeats.filter((s) => s.status === 'HELD').length;
        const rowVersionSum = rowSeats.reduce((sum, s) => sum + Number(s.version || 1), 0);
        const rowRev = rowSeats
            .filter((s) => s.status !== 'AVAILABLE')
            .reduce((sum, s) => sum + Number(s.price), 0);

        return {
            rowLabel: rLabel,
            x: 50 + idx * 100,
            booked: rowBooked,
            held: rowHeld,
            versionSum: rowVersionSum,
            revenue: rowRev
        };
    });

    const maxVersionVal = Math.max(15, ...rowPoints.map((p) => p.versionSum));
    const svgWavePoints = rowPoints.map((p) => ({
        ...p,
        yVersion: 145 - Math.round((p.versionSum / maxVersionVal) * 110),
        yActive: 145 - Math.round(((p.booked + p.held) / 10) * 110)
    }));

    const versionPolyline = svgWavePoints.map((p) => `${p.x},${p.yVersion}`).join(' ');
    const versionAreaPath = `M ${svgWavePoints[0].x},150 L ${svgWavePoints
        .map((p) => `${p.x},${p.yVersion}`)
        .join(' L ')} L ${svgWavePoints[svgWavePoints.length - 1].x},150 Z`;

    const activePolyline = svgWavePoints.map((p) => `${p.x},${p.yActive}`).join(' ');
    const activeAreaPath = `M ${svgWavePoints[0].x},150 L ${svgWavePoints
        .map((p) => `${p.x},${p.yActive}`)
        .join(' L ')} L ${svgWavePoints[svgWavePoints.length - 1].x},150 Z`;

    const enrichedShows = shows.map((sh, idx) => enrichShow(sh, idx));

    return {
        totalSeats,
        availableCount,
        heldCount,
        bookedCount,
        occupancyRate,
        totalRevenue,
        heldRevenue,
        maxCapacityRevenue,
        radius,
        circumference,
        availArc,
        heldArc,
        bookedArc,
        tiersSummary,
        svgWavePoints,
        versionPolyline,
        versionAreaPath,
        activePolyline,
        activeAreaPath,
        enrichedShows
    };
}
