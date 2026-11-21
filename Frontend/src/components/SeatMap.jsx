import React, { useEffect, useState } from 'react';

function formatMMSS(totalSeconds) {
    const sec = Math.max(0, Number(totalSeconds) || 0);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getSeatViewingProfile(seat) {
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

export default function SeatMap({
    seats,
    selectedSeatIds,
    onToggleSeat,
    onSetSelectedSeats,
    onHoldSeats,
    bookings,
    onConfirmBooking,
    onCancelBooking,
    onForceExpireHolds,
    currentShow
}) {
    const [tickOffset, setTickOffset] = useState(0);
    const [tierFilter, setTierFilter] = useState('ALL');
    const [heatmapMode, setHeatmapMode] = useState(false);
    const [watchedSeatIds, setWatchedSeatIds] = useState([]);
    const [watchAlert, setWatchAlert] = useState('');

    useEffect(() => {
        setTickOffset(0);
    }, [seats, bookings]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTickOffset((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-Select any Watched HELD seat the instant it expires back to AVAILABLE!
    useEffect(() => {
        if (watchedSeatIds.length === 0 || !onSetSelectedSeats) return;
        const newlyFreed = seats.filter(
            (s) => watchedSeatIds.includes(s.show_seat_id) && s.status === 'AVAILABLE'
        );
        if (newlyFreed.length > 0) {
            const freedIds = newlyFreed.map((s) => s.show_seat_id);
            const freedCodes = newlyFreed.map((s) => s.seat_code).join(', ');
            onSetSelectedSeats((prev) => [...new Set([...prev, ...freedIds])]);
            setWatchedSeatIds((prev) => prev.filter((id) => !freedIds.includes(id)));
            setWatchAlert(
                `🔔 Watched Seat (${freedCodes}) just expired and was automatically selected for you!`
            );
        }
    }, [seats, watchedSeatIds, onSetSelectedSeats]);

    const pendingBookings = bookings.filter((b) => b.booking_status === 'PENDING');
    const confirmedBookings = bookings.filter((b) => b.booking_status === 'CONFIRMED');

    const availableCount = seats.filter((s) => s.status === 'AVAILABLE').length;
    const heldCount = seats.filter((s) => s.status === 'HELD').length;
    const bookedCount = seats.filter((s) => s.status === 'BOOKED').length;
    const totalRevenue = seats
        .filter((s) => s.status === 'BOOKED')
        .reduce((sum, s) => sum + Number(s.price), 0);

    const selectedSeatObjects = seats.filter((s) =>
        selectedSeatIds.includes(s.show_seat_id)
    );
    const selectedSubtotal = selectedSeatObjects.reduce(
        (sum, s) => sum + Number(s.price),
        0
    );

    const lastSelectedSeat =
        selectedSeatObjects[selectedSeatObjects.length - 1] || null;
    const viewProfile = getSeatViewingProfile(lastSelectedSeat);

    function isBestViewSeat(seat) {
        return (
            ['C', 'D'].includes(seat.row_label) &&
            seat.seat_number >= 4 &&
            seat.seat_number <= 7
        );
    }

    function toggleWatchHeldSeat(seatId) {
        setWatchedSeatIds((prev) =>
            prev.includes(seatId)
                ? prev.filter((id) => id !== seatId)
                : [...prev, seatId]
        );
    }

    // Smart Group Presets (Couple Recliner, Family 4-Pack, Budget Front Pair)
    function handleSmartPreset(count, targetRows = ['C', 'D', 'E', 'F', 'B', 'A']) {
        if (!onSetSelectedSeats) return;

        const rowsMap = {};
        for (const s of seats) {
            if (!rowsMap[s.row_label]) rowsMap[s.row_label] = [];
            rowsMap[s.row_label].push(s);
        }

        for (const rLabel of targetRows) {
            const rowSeats = (rowsMap[rLabel] || []).sort(
                (a, b) => a.seat_number - b.seat_number
            );
            if (rowSeats.length === 0) continue;

            const blocks = [
                rowSeats.filter((s) => s.seat_number <= 5),
                rowSeats.filter((s) => s.seat_number > 5)
            ];

            for (const block of blocks) {
                for (let i = 0; i <= block.length - count; i++) {
                    const slice = block.slice(i, i + count);
                    if (slice.every((s) => s.status === 'AVAILABLE')) {
                        onSetSelectedSeats(slice.map((s) => s.show_seat_id));
                        return;
                    }
                }
            }
        }
    }

    const tiers = [
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

    return (
        <div className="space-y-5">
            {/* 1. LIVE SHOW KPI ANALYTICS BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">🟢 Available Seats</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                        {availableCount}
                    </span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">🟡 Locked (5-Min TTL)</span>
                    <span className="text-xl font-extrabold text-amber-400">{heldCount}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">🔴 Sold (Confirmed)</span>
                    <span className="text-xl font-extrabold text-rose-400">{bookedCount}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">💰 Box-Office Revenue</span>
                    <span className="text-xl font-extrabold text-white">₹{totalRevenue}</span>
                </div>
            </div>

            {/* 2. MAIN THEATER AUDITORIUM CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            🎬 {currentShow?.movie_title || 'Theater Auditorium'}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            📍 {currentShow?.theaterName || currentShow?.screen_name} •{' '}
                            <span className="text-indigo-400 font-semibold">
                                {currentShow?.screen_name}
                            </span>
                        </p>
                    </div>

                    {/* Smart Group Combos & Auto-Picker */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => handleSmartPreset(2, ['E', 'F', 'D', 'C'])}
                            className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 rounded-lg transition cursor-pointer"
                        >
                            💑 Couple Recliner (2)
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSmartPreset(4, ['C', 'D', 'E', 'B'])}
                            className="px-2.5 py-1 text-[11px] font-bold bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg transition cursor-pointer"
                        >
                            👨‍👩‍👧‍👦 Family Pack (4)
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSmartPreset(2, ['A', 'B', 'C'])}
                            className="px-2.5 py-1 text-[11px] font-bold bg-cyan-500/15 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-lg transition cursor-pointer"
                        >
                            💸 Budget Pair (2)
                        </button>
                        {selectedSeatIds.length > 0 && onSetSelectedSeats && (
                            <button
                                type="button"
                                onClick={() => onSetSelectedSeats([])}
                                className="px-2.5 py-1 text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Watch Alert Banner */}
                {watchAlert && (
                    <div className="mb-4 px-4 py-2.5 rounded-xl bg-indigo-950/70 border border-indigo-500/50 text-indigo-200 text-xs flex items-center justify-between">
                        <span>{watchAlert}</span>
                        <button
                            onClick={() => setWatchAlert('')}
                            className="text-slate-400 hover:text-white ml-3 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Tier & Sweet-Spot View Filter Pills + Version Contention Heatmap Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {[
                            { id: 'ALL', label: 'All Tiers' },
                            { id: 'CLASSIC', label: 'Classic' },
                            { id: 'PRIME', label: 'Prime' },
                            { id: 'RECLINER', label: 'VIP Recliner' },
                            { id: 'BEST_VIEW', label: '⭐ Best IMAX Center View' }
                        ].map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setTierFilter(f.id)}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                    tierFilter === f.id
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => setHeatmapMode((h) => !h)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                            heatmapMode
                                ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/30'
                                : 'bg-slate-950 text-orange-300 border-orange-500/40 hover:bg-orange-500/15'
                        }`}
                    >
                        🔥 {heatmapMode ? 'Exit Contention Heatmap' : 'Version Contention Heatmap'}
                    </button>
                </div>

                {/* Curved Cinema Screen Banner */}
                <div className="mb-6 text-center">
                    <div className="w-4/5 mx-auto h-2.5 rounded-t-full bg-gradient-to-r from-slate-800 via-cyan-400/90 to-slate-800 shadow-[0_8px_25px_rgba(34,211,238,0.3)]"></div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-2 inline-block">
                        All Eyes This Way • Cinema Screen
                    </span>
                </div>

                {/* Color Legend (Standard vs Heatmap Mode) */}
                {!heatmapMode ? (
                    <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400 mb-6">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500 inline-block"></span>
                            Available
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-400 inline-block"></span>
                            Selected by You
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-amber-500/25 border border-amber-400 inline-block"></span>
                            Held (Click to 🔔 Watch)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-rose-950 border border-rose-700 inline-block"></span>
                            Booked (Sold)
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-300 mb-6 bg-orange-950/30 border border-orange-500/30 rounded-xl py-2 px-4">
                        <span className="font-bold text-orange-300">
                            🔥 MySQL Version Contention Heatmap:
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-700 inline-block"></span>
                            v1 (Untouched)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-amber-500/30 border border-amber-400 inline-block"></span>
                            v2 (Moderate Lock History)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-rose-600 border border-rose-300 inline-block"></span>
                            v3+ (Hot Contention Target!)
                        </span>
                    </div>
                )}

                {/* TIERED AUDITORIUM ROWS WITH CENTER AISLE WALKWAY */}
                <div className="space-y-5 mb-6">
                    {tiers.map((tierGroup) => {
                        if (
                            tierFilter !== 'ALL' &&
                            tierFilter !== 'BEST_VIEW' &&
                            tierFilter !== tierGroup.key
                        ) {
                            return null;
                        }

                        const tierSeats = seats.filter((s) =>
                            tierGroup.rows.includes(s.row_label)
                        );
                        if (tierSeats.length === 0) return null;
                        const samplePrice = tierSeats[0]?.price;

                        return (
                            <div key={tierGroup.key} className="space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                                    <span
                                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tierGroup.badgeClass}`}
                                    >
                                        {tierGroup.title}
                                    </span>
                                    <span className="text-xs font-bold text-slate-300">
                                        ₹{samplePrice}{' '}
                                        {currentShow?.is_flash_sale ? (
                                            <span className="text-[10px] text-amber-400">
                                                (Flash Drop)
                                            </span>
                                        ) : null}
                                    </span>
                                </div>

                                {tierGroup.rows.map((rowLabel) => {
                                    const rowSeats = tierSeats
                                        .filter((s) => s.row_label === rowLabel)
                                        .sort((a, b) => a.seat_number - b.seat_number);
                                    if (rowSeats.length === 0) return null;

                                    const leftBlock = rowSeats.filter((s) => s.seat_number <= 5);
                                    const rightBlock = rowSeats.filter((s) => s.seat_number > 5);

                                    return (
                                        <div
                                            key={rowLabel}
                                            className="flex items-center justify-between gap-2"
                                        >
                                            <span className="w-5 text-xs font-bold text-slate-500 text-center">
                                                {rowLabel}
                                            </span>

                                            <div className="grid grid-cols-5 gap-1.5 flex-1">
                                                {leftBlock.map((seat) =>
                                                    renderSeatButton(seat)
                                                )}
                                            </div>

                                            <div className="w-4 sm:w-7 flex items-center justify-center">
                                                <span className="text-[8px] text-slate-600 uppercase rotate-90 tracking-widest select-none">
                                                    AISLE
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-5 gap-1.5 flex-1">
                                                {rightBlock.map((seat) =>
                                                    renderSeatButton(seat)
                                                )}
                                            </div>

                                            <span className="w-5 text-xs font-bold text-slate-500 text-center">
                                                {rowLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* "👁️ VIEW FROM SELECTED SEAT" DISTANCE & ACOUSTIC PREVIEW BAR */}
                {lastSelectedSeat && viewProfile && (
                    <div className="mb-4 bg-indigo-950/35 border border-indigo-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                            <div className="font-bold text-indigo-300 flex items-center gap-2">
                                <span>
                                    👁️ View From Seat {lastSelectedSeat.seat_code} (
                                    {lastSelectedSeat.tier} Tier)
                                </span>
                                {isBestViewSeat(lastSelectedSeat) && (
                                    <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.2 rounded-full">
                                        ⭐ SWEET-SPOT
                                    </span>
                                )}
                            </div>
                            <div className="text-slate-300">
                                📐 {viewProfile.distance} • 🔊 {viewProfile.acoustics}
                            </div>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-300 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
                            ✨ {viewProfile.perks}
                        </div>
                    </div>
                )}

                {/* TRANSPARENT CHECKOUT BAR FOR SELECTED SEATS */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="text-xs text-slate-400">
                            Selected Seats ({selectedSeatObjects.length}):{' '}
                            <span className="font-bold text-white">
                                {selectedSeatObjects.map((s) => s.seat_code).join(', ') ||
                                    'Click any green seat above'}
                            </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                            Ticket Total:{' '}
                            <span className="text-emerald-400 font-extrabold text-sm">
                                ₹{selectedSubtotal}
                            </span>{' '}
                            <span className="text-[11px] text-slate-500">
                                (+ ₹0 Convenience Fee)
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onHoldSeats}
                        disabled={selectedSeatIds.length === 0}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                            selectedSeatIds.length === 0
                                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 cursor-pointer'
                        }`}
                    >
                        🔒 Hold Selected Seats (5-Min Lock)
                    </button>
                </div>

                {/* 3. ACTIVE PENDING HOLDS (LIVE 1-SECOND COUNTDOWN CHECKOUT) */}
                <div className="border-t border-slate-800 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h3 className="text-sm font-bold text-white">
                            ⏳ Active Pending Holds (5-Minute TTL Checkout)
                        </h3>

                        {(pendingBookings.length > 0 || heldCount > 0) && onForceExpireHolds && (
                            <button
                                onClick={onForceExpireHolds}
                                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-[11px] font-bold transition cursor-pointer"
                            >
                                ⏩ Simulate 5-Min Timeout Now
                            </button>
                        )}
                    </div>

                    {pendingBookings.length === 0 ? (
                        <p className="text-xs text-slate-500 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                            No active holds right now. Select available seats above to lock them for 5 minutes.
                        </p>
                    ) : (
                        <div className="space-y-2.5">
                            {pendingBookings.map((b) => {
                                const liveSecLeft = Math.max(
                                    0,
                                    Number(b.seconds_left || 300) - tickOffset
                                );
                                const progressPct = Math.min(
                                    100,
                                    Math.round((liveSecLeft / 300) * 100)
                                );

                                return (
                                    <div
                                        key={b.booking_id}
                                        className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2.5"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="text-xs text-slate-200 space-y-0.5">
                                                <div className="font-bold text-amber-300 flex items-center gap-2">
                                                    <span>
                                                        Booking #{b.booking_id} • {b.user_name}
                                                    </span>
                                                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
                                                        {b.lock_mode}
                                                    </span>
                                                </div>
                                                <div className="text-slate-300">
                                                    Seats:{' '}
                                                    <span className="font-semibold text-white">
                                                        {b.seats_list}
                                                    </span>{' '}
                                                    | Total:{' '}
                                                    <span className="font-semibold text-emerald-400">
                                                        ₹{b.total_amount}
                                                    </span>{' '}
                                                    | TTL Countdown:{' '}
                                                    <span className="font-mono font-extrabold text-amber-300 text-sm">
                                                        {formatMMSS(liveSecLeft)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onConfirmBooking(b.booking_id)}
                                                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                                                >
                                                    ✅ Confirm Payment
                                                </button>
                                                <button
                                                    onClick={() => onCancelBooking(b.booking_id)}
                                                    className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 rounded-lg transition cursor-pointer"
                                                >
                                                    ✕ Cancel Hold
                                                </button>
                                            </div>
                                        </div>

                                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 transition-all duration-1000"
                                                style={{ width: `${progressPct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 4. CONFIRMED M-TICKETS & RECENT ORDERS */}
                {confirmedBookings.length > 0 && (
                    <div className="border-t border-slate-800 pt-5 mt-5">
                        <h3 className="text-sm font-bold text-white mb-3">
                            🎟️ Confirmed M-Tickets ({confirmedBookings.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {confirmedBookings.slice(0, 6).map((b) => (
                                <div
                                    key={b.booking_id}
                                    className="bg-emerald-950/25 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-2 text-xs"
                                >
                                    <div>
                                        <div className="font-bold text-emerald-300">
                                            ✅ Ticket #BMS-{1000 + Number(b.booking_id)} • {b.user_name}
                                        </div>
                                        <div className="text-slate-300 mt-0.5">
                                            Seats: <strong className="text-white">{b.seats_list}</strong> •
                                            Paid: <strong className="text-emerald-400">₹{b.total_amount}</strong>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onCancelBooking(b.booking_id)}
                                        className="text-[10px] font-bold bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                    >
                                        Refund
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    function renderSeatButton(seat) {
        const isSelected = selectedSeatIds.includes(seat.show_seat_id);
        const isWatched = watchedSeatIds.includes(seat.show_seat_id);
        const liveSeatSec = Math.max(0, Number(seat.seconds_left || 0) - tickOffset);
        const bestView = isBestViewSeat(seat);
        const dimmedByBestViewFilter = tierFilter === 'BEST_VIEW' && !bestView;

        let seatStyle =
            'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/70 cursor-pointer';

        if (heatmapMode) {
            if (Number(seat.version) >= 3) {
                seatStyle =
                    'bg-rose-600 border-rose-300 text-white shadow-md shadow-rose-500/40 cursor-pointer';
            } else if (Number(seat.version) === 2) {
                seatStyle =
                    'bg-amber-500/35 border-amber-400 text-amber-200 cursor-pointer';
            } else {
                seatStyle =
                    'bg-slate-950/80 border-slate-800 text-slate-400 cursor-pointer';
            }
        } else if (isSelected) {
            seatStyle =
                'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-400/40 cursor-pointer';
        } else if (seat.status === 'HELD') {
            seatStyle = isWatched
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/40 cursor-pointer'
                : 'bg-amber-500/20 border-amber-500/70 text-amber-300 hover:border-cyan-400 cursor-pointer';
        } else if (seat.status === 'BOOKED') {
            seatStyle =
                'bg-rose-950/50 border-rose-800/60 text-rose-400/60 cursor-not-allowed opacity-70';
        }

        const tooltipText =
            seat.status === 'HELD'
                ? `Seat ${seat.seat_code} HELD by ${seat.held_by_name || 'User'} (${formatMMSS(
                      liveSeatSec
                  )} left) • Click to 🔔 Watch & Auto-Select on Expiry`
                : `Seat ${seat.seat_code} (${seat.tier}) • ₹${seat.price} • ${seat.status} • Version v${seat.version}`;

        return (
            <button
                key={seat.show_seat_id}
                onClick={() => {
                    if (seat.status === 'AVAILABLE') {
                        onToggleSeat(seat.show_seat_id);
                    } else if (seat.status === 'HELD') {
                        toggleWatchHeldSeat(seat.show_seat_id);
                    }
                }}
                disabled={seat.status === 'BOOKED'}
                title={tooltipText}
                className={`p-1.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${seatStyle} ${
                    dimmedByBestViewFilter ? 'opacity-25' : ''
                }`}
            >
                <div className="flex items-center gap-0.5">
                    {bestView && <span className="text-[8px]">⭐</span>}
                    <span className="text-xs font-bold">{seat.seat_code}</span>
                    <span className="text-[8px] font-mono opacity-80">v{seat.version}</span>
                </div>
                <span className="text-[10px] opacity-80">₹{seat.price}</span>
                <span className="text-[8px] font-semibold uppercase mt-0.5 truncate max-w-full">
                    {heatmapMode
                        ? `${seat.version - 1} Txns`
                        : isSelected
                        ? 'SELECTED'
                        : seat.status === 'HELD'
                        ? isWatched
                            ? '🔔 WATCHING'
                            : `⏳ ${formatMMSS(liveSeatSec)}`
                        : seat.status}
                </span>
            </button>
        );
    }
}
