import React from 'react';
import { exportAuditLogsToCsv } from '../services/api';

export default function DbmsAnalyticsPage({
    shows,
    seats,
    bookings,
    auditLogs,
    users,
    onBackToBooking
}) {
    // Compute live telemetry metrics for digital SVG graphs
    const totalSeats = seats.length || 60;
    const availableCount = seats.filter((s) => s.status === 'AVAILABLE').length;
    const heldCount = seats.filter((s) => s.status === 'HELD').length;
    const bookedCount = seats.filter((s) => s.status === 'BOOKED').length;
    const occupancyRate =
        totalSeats > 0 ? Math.round(((bookedCount + heldCount) / totalSeats) * 100) : 0;

    // SVG Donut Ring Math (radius = 52, circumference = 326.7)
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const availArc = totalSeats > 0 ? (availableCount / totalSeats) * circumference : 0;
    const heldArc = totalSeats > 0 ? (heldCount / totalSeats) * circumference : 0;
    const bookedArc = totalSeats > 0 ? (bookedCount / totalSeats) * circumference : 0;

    // Tier-Wise Digital Graph Metrics
    const tiersSummary = ['CLASSIC', 'PRIME', 'RECLINER'].map((tierName) => {
        const tierSeats = seats.filter((s) => s.tier === tierName);
        const total = tierSeats.length || 20;
        const available = tierSeats.filter((s) => s.status === 'AVAILABLE').length;
        const held = tierSeats.filter((s) => s.status === 'HELD').length;
        const booked = tierSeats.filter((s) => s.status === 'BOOKED').length;
        const revenue = tierSeats
            .filter((s) => s.status === 'BOOKED')
            .reduce((sum, s) => sum + Number(s.price), 0);
        const potentialRevenue = tierSeats.reduce(
            (sum, s) => sum + Number(s.price),
            0
        );

        return {
            tierName,
            total,
            available,
            held,
            booked,
            revenue,
            potentialRevenue
        };
    });

    // Row-by-Row Version Contention Digital Histogram (Rows A - F)
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const rowContentionData = rowLabels.map((rLabel) => {
        const rowSeats = seats.filter((s) => s.row_label === rLabel);
        const totalTxns = rowSeats.reduce(
            (sum, s) => sum + Math.max(0, Number(s.version || 1) - 1),
            0
        );
        const maxVersion = rowSeats.reduce(
            (max, s) => Math.max(max, Number(s.version || 1)),
            1
        );
        return { rowLabel: rLabel, totalTxns, maxVersion };
    });
    const maxRowTxns = Math.max(1, ...rowContentionData.map((r) => r.totalTxns));

    // Audit Log Transition Breakdown & Lock Mode Distribution
    const holdTransitions = auditLogs.filter((l) => l.new_status === 'HELD').length;
    const bookTransitions = auditLogs.filter((l) => l.new_status === 'BOOKED').length;
    const releaseTransitions = auditLogs.filter(
        (l) => l.new_status === 'AVAILABLE'
    ).length;

    const pessimisticOrders = bookings.filter(
        (b) => b.lock_mode === 'PESSIMISTIC'
    ).length;
    const optimisticOrders = bookings.filter(
        (b) => b.lock_mode === 'OPTIMISTIC'
    ).length;
    const totalStrategyOrders = Math.max(1, pessimisticOrders + optimisticOrders);

    return (
        <div className="space-y-6 py-2">
            {/* TOP CYBER-TELEMETRY HEADER */}
            <div className="relative overflow-hidden bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_35px_rgba(6,182,212,0.12)]">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                            REAL-TIME TELEMETRY &amp; DIGITAL GRAPH COCKPIT
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white mt-1">
                        📊 Live Cinema &amp; Concurrency Telemetry Graphs
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Live vector graphs of seat lock states, row contention histograms, trigger
                        velocity meters, and tier revenue analytics.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {auditLogs.length > 0 && (
                        <button
                            onClick={() => exportAuditLogsToCsv(auditLogs)}
                            className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
                        >
                            📥 Export Telemetry CSV
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

            {/* ==================== ROW 1: 3 DIGITAL VECTOR GRAPHS ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* GRAPH 1: SVG RADIAL DONUT GAUGE (SEAT STATE DISTRIBUTION) */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                                GRAPH 01 • STATE MACHINE TELEMETRY
                            </span>
                            <h3 className="text-sm font-bold text-white">
                                Live Auditorium Seat State Donut
                            </h3>
                        </div>
                        <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-emerald-400">
                            {totalSeats} Seats
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-6 my-3">
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
                                {/* Available Arc (Emerald) */}
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
                                {/* Held Arc (Amber) */}
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
                                {/* Booked Arc (Rose) */}
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
                                    Locked/Sold
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2.5 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                                <span className="text-slate-400">AVAILABLE:</span>
                                <strong className="text-emerald-400">{availableCount}</strong>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                                <span className="text-slate-400">HELD (TTL):</span>
                                <strong className="text-amber-400">{heldCount}</strong>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
                                <span className="text-slate-400">BOOKED:</span>
                                <strong className="text-rose-400">{bookedCount}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span>Active Shows / Users:</span>
                        <span className="text-cyan-300">
                            {shows.length} Shows • {users.length} Users
                        </span>
                    </div>
                </div>

                {/* GRAPH 2: ROW-BY-ROW VERSION CONTENTION DIGITAL HISTOGRAM */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                                GRAPH 02 • VERSION CONTENTION TELEMETRY
                            </span>
                            <h3 className="text-sm font-bold text-white">
                                Row Contention &amp; Version Histogram
                            </h3>
                        </div>
                        <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-amber-300">
                            OCC v1..vN
                        </span>
                    </div>

                    {/* Vertical Digital Bar Chart */}
                    <div className="h-36 flex items-end justify-between gap-3 pt-6 pb-2 px-3 bg-slate-950/70 border border-slate-800/80 rounded-xl my-2">
                        {rowContentionData.map((r) => {
                            const heightPct = Math.max(
                                12,
                                Math.round((r.totalTxns / maxRowTxns) * 100)
                            );
                            return (
                                <div
                                    key={r.rowLabel}
                                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                                >
                                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                                        {r.totalTxns}
                                    </span>
                                    <div className="w-full bg-slate-900 rounded-t-md h-20 flex items-end overflow-hidden border border-slate-800">
                                        <div
                                            className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-cyan-300 rounded-t transition-all duration-500"
                                            style={{ height: `${heightPct}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-slate-300">
                                        Row {r.rowLabel}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span>Peak Seat Version:</span>
                        <span className="text-amber-300 font-bold">
                            v{Math.max(1, ...seats.map((s) => Number(s.version || 1)))}
                        </span>
                    </div>
                </div>

                {/* GRAPH 3: TRIGGER VELOCITY & LOCKING STRATEGY SPLIT */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block">
                                GRAPH 03 • TRIGGER &amp; LOCK TELEMETRY
                            </span>
                            <h3 className="text-sm font-bold text-white">
                                State Transitions &amp; Lock Split
                            </h3>
                        </div>
                        <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-indigo-300">
                            {auditLogs.length} Events
                        </span>
                    </div>

                    <div className="space-y-3 my-2">
                        {/* Transition Horizontal Digital Meters */}
                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2.5 text-xs font-mono">
                            <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-amber-300">
                                        AVAILABLE -&gt; HELD (Locks)
                                    </span>
                                    <span className="font-bold text-white">
                                        {holdTransitions}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(8, holdTransitions * 8)
                                            )}%`
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-emerald-400">
                                        HELD -&gt; BOOKED (Commits)
                                    </span>
                                    <span className="font-bold text-white">
                                        {bookTransitions}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(8, bookTransitions * 12)
                                            )}%`
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-cyan-400">
                                        HELD/BOOKED -&gt; AVAILABLE (Healed)
                                    </span>
                                    <span className="font-bold text-white">
                                        {releaseTransitions}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-cyan-400"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(8, releaseTransitions * 12)
                                            )}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Comparison Bar */}
                        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-[11px] font-mono">
                            <div className="flex justify-between mb-1">
                                <span className="text-indigo-300">
                                    🔒 Pessimistic: {pessimisticOrders}
                                </span>
                                <span className="text-amber-300">
                                    ⚡ Optimistic: {optimisticOrders}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                                <div
                                    className="bg-indigo-500 h-full"
                                    style={{
                                        width: `${Math.round(
                                            (pessimisticOrders / totalStrategyOrders) * 100
                                        )}%`
                                    }}
                                ></div>
                                <div
                                    className="bg-amber-400 h-full"
                                    style={{
                                        width: `${Math.round(
                                            (optimisticOrders / totalStrategyOrders) * 100
                                        )}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== ROW 2: TIER REVENUE DIGITAL BAR CHART ==================== */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                            GRAPH 04 • FINANCIAL &amp; TIER CAPACITY TELEMETRY
                        </span>
                        <h2 className="text-base font-bold text-white">
                            Tier-Wise Occupancy &amp; Box-Office Revenue Digital Bars
                        </h2>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                        Total Realized Revenue: ₹
                        {tiersSummary.reduce((s, t) => s + t.revenue, 0)} / ₹
                        {tiersSummary.reduce((s, t) => s + t.potentialRevenue, 0)} Capacity
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tiersSummary.map((t) => {
                        const soldPct = t.total > 0 ? Math.round((t.booked / t.total) * 100) : 0;
                        const heldPct = t.total > 0 ? Math.round((t.held / t.total) * 100) : 0;
                        const revPct =
                            t.potentialRevenue > 0
                                ? Math.round((t.revenue / t.potentialRevenue) * 100)
                                : 0;

                        return (
                            <div
                                key={t.tierName}
                                className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3 font-mono"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-cyan-300">
                                        {t.tierName} TIER
                                    </span>
                                    <span className="text-xs font-bold text-emerald-400">
                                        ₹{t.revenue} ({revPct}%)
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                        <span className="text-slate-500 block text-[9px]">
                                            FREE
                                        </span>
                                        <span className="font-bold text-emerald-400">
                                            {t.available}
                                        </span>
                                    </div>
                                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                        <span className="text-slate-500 block text-[9px]">
                                            HELD
                                        </span>
                                        <span className="font-bold text-amber-400">
                                            {t.held}
                                        </span>
                                    </div>
                                    <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                        <span className="text-slate-500 block text-[9px]">
                                            SOLD
                                        </span>
                                        <span className="font-bold text-rose-400">
                                            {t.booked}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                                    <div
                                        className="bg-rose-500 h-full transition-all"
                                        style={{ width: `${soldPct}%` }}
                                    ></div>
                                    <div
                                        className="bg-amber-400 h-full transition-all"
                                        style={{ width: `${heldPct}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ==================== ROW 3: SEAT-BY-SEAT DIGITAL MATRIX WAVEFORM ==================== */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                            GRAPH 05 • LIVE 60-NODE SEAT CONTENTION MATRIX
                        </span>
                        <h2 className="text-base font-bold text-white">
                            Per-Seat Transaction &amp; Version Pulse Map
                        </h2>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                        Height = Version Counter (`v1` to `vN`) • Color = Live Status
                    </span>
                </div>

                <div className="h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-end gap-1 overflow-x-auto">
                    {seats.map((s) => {
                        const v = Number(s.version || 1);
                        const barHeight = Math.min(100, Math.max(18, v * 22));
                        const barColor =
                            s.status === 'BOOKED'
                                ? 'bg-rose-500'
                                : s.status === 'HELD'
                                ? 'bg-amber-400'
                                : v > 1
                                ? 'bg-cyan-400'
                                : 'bg-emerald-500/60';

                        return (
                            <div
                                key={s.show_seat_id}
                                title={`${s.seat_code}: ${s.status} (v${v})`}
                                className="flex-1 min-w-[10px] h-full flex flex-col items-center justify-end gap-1"
                            >
                                <div
                                    className={`w-full rounded-t transition-all duration-300 ${barColor}`}
                                    style={{ height: `${barHeight}%` }}
                                ></div>
                                <span className="text-[8px] font-mono text-slate-500">
                                    {s.seat_code}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
