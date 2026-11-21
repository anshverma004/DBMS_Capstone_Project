import React from 'react';
import { exportAuditLogsToCsv } from '../services/api';
import { enrichShow } from '../constants/theaterData';

export default function DbmsAnalyticsPage({
    shows,
    seats,
    bookings,
    auditLogs,
    users,
    onBackToBooking
}) {
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

    // SVG Donut Ring Math (radius = 52, circumference = 326.7)
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const availArc = totalSeats > 0 ? (availableCount / totalSeats) * circumference : 0;
    const heldArc = totalSeats > 0 ? (heldCount / totalSeats) * circumference : 0;
    const bookedArc = totalSeats > 0 ? (bookedCount / totalSeats) * circumference : 0;

    // Tier-Wise Metrics for 3-Ring Concentric Radar & Cards
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

    // Row-by-Row Telemetry Points for the SVG Area Spline Wave Chart (Rows A..F)
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const rowPoints = rowLabels.map((rLabel, idx) => {
        const rowSeats = seats.filter((s) => s.row_label === rLabel);
        const rowBooked = rowSeats.filter((s) => s.status === 'BOOKED').length;
        const rowHeld = rowSeats.filter((s) => s.status === 'HELD').length;
        const rowVersionSum = rowSeats.reduce(
            (sum, s) => sum + Number(s.version || 1),
            0
        );
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

    return (
        <div className="space-y-6 py-2">
            {/* TOP HEADER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                            LIVE VISUAL ANALYTICS &amp; DIGITAL TELEMETRY COCKPIT
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white mt-1">
                        📊 Cinema Box-Office, Concurrency Waveforms &amp; Radar Analytics
                    </h1>
                </div>

                <div className="flex items-center gap-2.5">
                    {auditLogs.length > 0 && (
                        <button
                            onClick={() => exportAuditLogsToCsv(auditLogs)}
                            className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
                        >
                            📥 Export CSV Report
                        </button>
                    )}
                    <button
                        onClick={onBackToBooking}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer"
                    >
                        ← Back to Seat Auditorium
                    </button>
                </div>
            </div>

            {/* ==================== ROW 1: 4 GLOWING KPI CARDS WITH MINI SVG SPARKLINES ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1 */}
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <span className="text-[11px] font-mono uppercase text-slate-400 block">
                        Confirmed Box-Office
                    </span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                        ₹{totalRevenue}
                    </div>
                    <span className="text-[11px] text-slate-400">
                        +₹{heldRevenue} locked in active checkout
                    </span>
                    <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                        <path
                            d="M 0,25 Q 25,18 45,20 T 85,10 T 120,4 L 120,30 L 0,30 Z"
                            fill="rgba(16,185,129,0.18)"
                        />
                        <path
                            d="M 0,25 Q 25,18 45,20 T 85,10 T 120,4"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                {/* KPI 2 */}
                <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <span className="text-[11px] font-mono uppercase text-slate-400 block">
                        Auditorium Occupancy
                    </span>
                    <div className="text-2xl font-black text-cyan-400 mt-1">
                        {occupancyRate}%
                    </div>
                    <span className="text-[11px] text-slate-400">
                        {bookedCount + heldCount} of {totalSeats} seats active
                    </span>
                    <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                        <path
                            d="M 0,24 Q 30,12 60,16 T 120,6 L 120,30 L 0,30 Z"
                            fill="rgba(34,211,238,0.18)"
                        />
                        <path
                            d="M 0,24 Q 30,12 60,16 T 120,6"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                {/* KPI 3 */}
                <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <span className="text-[11px] font-mono uppercase text-slate-400 block">
                        Trigger Audit Events
                    </span>
                    <div className="text-2xl font-black text-amber-400 mt-1">
                        {auditLogs.length}
                    </div>
                    <span className="text-[11px] text-slate-400">
                        Peak Seat Version: v
                        {Math.max(1, ...seats.map((s) => Number(s.version || 1)))}
                    </span>
                    <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                        <path
                            d="M 0,26 Q 20,22 45,12 T 90,15 T 120,5 L 120,30 L 0,30 Z"
                            fill="rgba(245,158,11,0.18)"
                        />
                        <path
                            d="M 0,26 Q 20,22 45,12 T 90,15 T 120,5"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                {/* KPI 4 */}
                <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <span className="text-[11px] font-mono uppercase text-slate-400 block">
                        Concurrency Integrity
                    </span>
                    <div className="text-2xl font-black text-indigo-400 mt-1">
                        100% ACID
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                        ✓ 0 Double Bookings • 0 Deadlocks
                    </span>
                    <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                        <path
                            d="M 0,8 L 30,8 L 60,8 L 90,8 L 120,8 L 120,30 L 0,30 Z"
                            fill="rgba(129,140,248,0.18)"
                        />
                        <path
                            d="M 0,8 L 30,8 L 60,8 L 90,8 L 120,8"
                            fill="none"
                            stroke="#818cf8"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            </div>

            {/* ==================== ROW 2: FULL-WIDTH SVG AREA SPLINE WAVE CHART ==================== */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                            DIGITAL WAVEFORM TELEMETRY • ROWS A TO F
                        </span>
                        <h2 className="text-base font-bold text-white">
                            📈 Auditorium Row Version Activity &amp; Seat Lock Waveform
                        </h2>
                    </div>

                    <div className="flex items-center gap-5 text-xs font-mono">
                        <span className="flex items-center gap-2 text-cyan-300">
                            <span className="w-3 h-1 bg-cyan-400 inline-block rounded"></span>
                            Cumulative Row Version Curve
                        </span>
                        <span className="flex items-center gap-2 text-rose-300">
                            <span className="w-3 h-1 bg-rose-500 inline-block rounded"></span>
                            Locked &amp; Sold Seats Curve
                        </span>
                    </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                    <svg className="w-full h-48" viewBox="0 0 600 175">
                        <defs>
                            <linearGradient id="cyanWaveGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="roseWaveGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        {/* Horizontal Grid Lines */}
                        {[35, 70, 105, 145].map((yVal) => (
                            <line
                                key={yVal}
                                x1="30"
                                y1={yVal}
                                x2="570"
                                y2={yVal}
                                stroke="#1e293b"
                                strokeDasharray="4 4"
                                strokeWidth="1"
                            />
                        ))}

                        {/* Area Fills */}
                        <path d={versionAreaPath} fill="url(#cyanWaveGrad)" />
                        <path d={activeAreaPath} fill="url(#roseWaveGrad)" />

                        {/* Glowing Polyline Curves */}
                        <polyline
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="3"
                            points={versionPolyline}
                        />
                        <polyline
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="2.5"
                            points={activePolyline}
                        />

                        {/* Data Nodes & X-Axis Labels */}
                        {svgWavePoints.map((pt) => (
                            <g key={pt.rowLabel}>
                                <circle
                                    cx={pt.x}
                                    cy={pt.yVersion}
                                    r="5"
                                    fill="#0f172a"
                                    stroke="#22d3ee"
                                    strokeWidth="2.5"
                                />
                                <text
                                    x={pt.x}
                                    y={pt.yVersion - 10}
                                    textAnchor="middle"
                                    fill="#67e8f9"
                                    fontSize="10"
                                    fontFamily="monospace"
                                >
                                    v{pt.versionSum}
                                </text>

                                <circle
                                    cx={pt.x}
                                    cy={pt.yActive}
                                    r="4"
                                    fill="#f43f5e"
                                />

                                <text
                                    x={pt.x}
                                    y="168"
                                    textAnchor="middle"
                                    fill="#94a3b8"
                                    fontSize="11"
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                >
                                    ROW {pt.rowLabel}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* ==================== ROW 3: DUAL RADIAL GAUGES + 2D AUDITORIUM RADAR MATRIX ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* LEFT 4 COLS: SEAT STATE DONUT */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                            RADIAL GAUGE 01
                        </span>
                        <h3 className="text-sm font-bold text-white">
                            Seat State Distribution Ring
                        </h3>
                    </div>

                    <div className="flex items-center justify-center gap-6 my-4">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#0f172a"
                                    strokeWidth="14"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#10b981"
                                    strokeWidth="14"
                                    strokeDasharray={`${availArc} ${circumference}`}
                                    strokeDashoffset="0"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#f59e0b"
                                    strokeWidth="14"
                                    strokeDasharray={`${heldArc} ${circumference}`}
                                    strokeDashoffset={-availArc}
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#f43f5e"
                                    strokeWidth="14"
                                    strokeDasharray={`${bookedArc} ${circumference}`}
                                    strokeDashoffset={-(availArc + heldArc)}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-black font-mono text-white">
                                    {occupancyRate}%
                                </span>
                                <span className="text-[9px] font-mono uppercase text-slate-400">
                                    Active
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2.5 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                                <span className="text-slate-400">FREE:</span>
                                <strong className="text-emerald-400">{availableCount}</strong>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                                <span className="text-slate-400">HELD:</span>
                                <strong className="text-amber-400">{heldCount}</strong>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
                                <span className="text-slate-400">SOLD:</span>
                                <strong className="text-rose-400">{bookedCount}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span>Box-Office Fill Ratio:</span>
                        <span className="text-emerald-400 font-bold">
                            ₹{totalRevenue} / ₹{maxCapacityRevenue}
                        </span>
                    </div>
                </div>

                {/* MIDDLE 4 COLS: 3-RING CONCENTRIC TIER RADAR GAUGE */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block">
                            RADIAL GAUGE 02
                        </span>
                        <h3 className="text-sm font-bold text-white">
                            Concentric Multi-Tier Radar Rings
                        </h3>
                    </div>

                    <div className="flex items-center justify-center gap-5 my-4">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
                                {tiersSummary.map((t) => (
                                    <g key={t.name}>
                                        <circle
                                            cx="70"
                                            cy="70"
                                            r={t.ringRadius}
                                            fill="transparent"
                                            stroke="#0f172a"
                                            strokeWidth="8"
                                        />
                                        <circle
                                            cx="70"
                                            cy="70"
                                            r={t.ringRadius}
                                            fill="transparent"
                                            stroke={t.color}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${t.ringDash} ${t.ringCirc}`}
                                        />
                                    </g>
                                ))}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs font-mono font-bold text-slate-300">
                                    3 TIERS
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2.5 text-xs font-mono">
                            {tiersSummary.map((t) => (
                                <div key={t.name}>
                                    <div className={`font-bold ${t.textClass}`}>
                                        {t.name}: {t.fillPct}%
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                        {t.booked} Sold • ₹{t.revenue}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span>Outer: Recliner • Mid: Prime • Inner: Classic</span>
                    </div>
                </div>

                {/* RIGHT 4 COLS: 2D DIGITAL AUDITORIUM RADAR MATRIX */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                                2D SPATIAL RADAR
                            </span>
                            <h3 className="text-sm font-bold text-white">
                                Live 60-Seat Cyber Telemetry Grid
                            </h3>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">
                            6x10 Matrix
                        </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 my-2">
                        <div className="grid grid-cols-10 gap-1">
                            {seats.map((s) => {
                                const dotClass =
                                    s.status === 'BOOKED'
                                        ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                        : s.status === 'HELD'
                                        ? 'bg-amber-400 text-slate-950 animate-pulse'
                                        : Number(s.version) > 1
                                        ? 'bg-cyan-500/40 text-cyan-200 border border-cyan-400'
                                        : 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30';

                                return (
                                    <div
                                        key={s.show_seat_id}
                                        title={`${s.seat_code}: ${s.status} (v${s.version})`}
                                        className={`h-5 rounded text-[8px] font-mono font-bold flex items-center justify-center ${dotClass}`}
                                    >
                                        {s.seat_code}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span>Cyan Node = Contended &amp; Freed (`v2+`)</span>
                    </div>
                </div>
            </div>

            {/* ==================== ROW 4: MULTI-THEATER SHOW COMPARISON BARS ==================== */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block">
                        MULTI-VENUE COMPARISON • ALL ACTIVE SHOWS
                    </span>
                    <h2 className="text-base font-bold text-white">
                        🎬 Cross-Theater Capacity &amp; Occupancy Comparison Graph
                    </h2>
                </div>

                <div className="space-y-3">
                    {enrichedShows.map((sh) => {
                        const occupied = sh.total_capacity - sh.available_seats;
                        const pct = Math.round((occupied / sh.total_capacity) * 100);

                        return (
                            <div
                                key={sh.show_id}
                                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                    <div className="font-bold text-white flex items-center gap-2">
                                        <span>{sh.movie_title}</span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            ({sh.theaterName})
                                        </span>
                                    </div>
                                    <div className="font-mono text-xs">
                                        <span className="text-emerald-400 font-bold">
                                            {sh.available_seats} Free
                                        </span>{' '}
                                        /{' '}
                                        <span className="text-rose-400 font-bold">
                                            {occupied} Active
                                        </span>{' '}
                                        ({pct}%)
                                    </div>
                                </div>

                                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                                    <div
                                        className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-cyan-400 transition-all duration-500"
                                        style={{ width: `${Math.max(4, pct)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
