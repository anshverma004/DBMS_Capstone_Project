import React, { useEffect, useState } from 'react';

function formatMMSS(totalSeconds) {
    const sec = Math.max(0, Number(totalSeconds) || 0);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
    currentShow
}) {
    const [tickOffset, setTickOffset] = useState(0);
    const [tierFilter, setTierFilter] = useState('ALL'); // 'ALL' | 'CLASSIC' | 'PRIME' | 'RECLINER' | 'BEST_VIEW'

    useEffect(() => {
        setTickOffset(0);
    }, [seats, bookings]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTickOffset((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

    // Check if a seat is in the IMAX Acoustic & Visual Sweet Spot (Rows C-D, Seats 4-7)
    function isBestViewSeat(seat) {
        return (
            ['C', 'D'].includes(seat.row_label) &&
            seat.seat_number >= 4 &&
            seat.seat_number <= 7
        );
    }

    function handleAutoPickBestSeats(count) {
        if (!onSetSelectedSeats) return;

        const preferredRows = ['C', 'D', 'E', 'F', 'B', 'A'];
        const rowsMap = {};
        for (const s of seats) {
            if (!rowsMap[s.row_label]) rowsMap[s.row_label] = [];
            rowsMap[s.row_label].push(s);
        }

        for (const rLabel of preferredRows) {
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

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                            ✨ Auto-Pick Best Seats:
                        </span>
                        {[2, 3, 4].map((cnt) => (
                            <button
                                key={cnt}
                                type="button"
                                onClick={() => handleAutoPickBestSeats(cnt)}
                                className="px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 rounded-lg transition cursor-pointer"
                            >
                                {cnt} Seats
                            </button>
                        ))}
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

                {/* Tier & Sweet-Spot View Filter Pills */}
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
                    <span className="text-[11px] text-amber-300">
                        ⭐ = Acoustic &amp; Visual Center Sweet-Spot
                    </span>
                </div>

                {/* Curved Cinema Screen Banner */}
                <div className="mb-6 text-center">
                    <div className="w-4/5 mx-auto h-2.5 rounded-t-full bg-gradient-to-r from-slate-800 via-cyan-400/90 to-slate-800 shadow-[0_8px_25px_rgba(34,211,238,0.3)]"></div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-2 inline-block">
                        All Eyes This Way • Cinema Screen
                    </span>
                </div>

                {/* Color Legend */}
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
                        Held (5-Min Lock)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded bg-rose-950 border border-rose-700 inline-block"></span>
                        Booked (Sold)
                    </span>
                </div>

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
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                        <span>⏳ Active Pending Holds (5-Minute TTL Checkout)</span>
                        <span className="text-[11px] font-normal text-slate-400">
                            Auto-releases back to AVAILABLE if unpaid when timer hits 00:00
                        </span>
                    </h3>
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
        const liveSeatSec = Math.max(0, Number(seat.seconds_left || 0) - tickOffset);
        const bestView = isBestViewSeat(seat);
        const dimmedByBestViewFilter = tierFilter === 'BEST_VIEW' && !bestView;

        let seatStyle =
            'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/70 cursor-pointer';
        if (isSelected) {
            seatStyle =
                'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-400/40 cursor-pointer';
        } else if (seat.status === 'HELD') {
            seatStyle =
                'bg-amber-500/20 border-amber-500/70 text-amber-300 cursor-not-allowed';
        } else if (seat.status === 'BOOKED') {
            seatStyle =
                'bg-rose-950/50 border-rose-800/60 text-rose-400/60 cursor-not-allowed opacity-70';
        }

        const tooltipText =
            seat.status === 'HELD'
                ? `Seat ${seat.seat_code} HELD by ${seat.held_by_name || 'User'} (${formatMMSS(
                      liveSeatSec
                  )} left) • Version v${seat.version}`
                : `Seat ${seat.seat_code} (${seat.tier}) • ₹${seat.price} • ${seat.status} • Version v${seat.version}`;

        return (
            <button
                key={seat.show_seat_id}
                onClick={() => onToggleSeat(seat.show_seat_id)}
                disabled={seat.status !== 'AVAILABLE'}
                title={tooltipText}
                className={`p-1.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${seatStyle} ${
                    dimmedByBestViewFilter ? 'opacity-25' : ''
                }`}
            >
                <div className="flex items-center gap-0.5">
                    {bestView && <span className="text-[8px]">⭐</span>}
                    <span className="text-xs font-bold">{seat.seat_code}</span>
                    <span className="text-[8px] font-mono opacity-70">v{seat.version}</span>
                </div>
                <span className="text-[10px] opacity-80">₹{seat.price}</span>
                <span className="text-[8px] font-semibold uppercase mt-0.5 truncate max-w-full">
                    {isSelected
                        ? 'SELECTED'
                        : seat.status === 'HELD'
                        ? `⏳ ${formatMMSS(liveSeatSec)}`
                        : seat.status}
                </span>
            </button>
        );
    }
}
