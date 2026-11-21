import React from 'react';
import { SEAT_TIERS, formatMMSS, isBestViewSeat } from '../../utils/seatHelpers';

export default function AuditoriumGrid({
    seats,
    selectedSeatIds,
    watchedSeatIds,
    tickOffset,
    tierFilter,
    heatmapMode,
    currentShow,
    onToggleSeat,
    onToggleWatchHeldSeat
}) {
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
                seatStyle = 'bg-amber-500/35 border-amber-400 text-amber-200 cursor-pointer';
            } else {
                seatStyle = 'bg-slate-950/80 border-slate-800 text-slate-400 cursor-pointer';
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
                        onToggleWatchHeldSeat(seat.show_seat_id);
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

    return (
        <>
            
            <div className="mb-6 text-center">
                <div className="w-4/5 mx-auto h-2.5 rounded-t-full bg-gradient-to-r from-slate-800 via-cyan-400/90 to-slate-800 shadow-[0_8px_25px_rgba(34,211,238,0.3)]"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-2 inline-block">
                    All Eyes This Way • Cinema Screen
                </span>
            </div>

            
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

            
            <div className="space-y-5 mb-6">
                {SEAT_TIERS.map((tierGroup) => {
                    if (
                        tierFilter !== 'ALL' &&
                        tierFilter !== 'BEST_VIEW' &&
                        tierFilter !== tierGroup.key
                    ) {
                        return null;
                    }

                    const tierSeats = seats.filter((s) => tierGroup.rows.includes(s.row_label));
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
                                            {leftBlock.map((seat) => renderSeatButton(seat))}
                                        </div>

                                        <div className="w-4 sm:w-7 flex items-center justify-center">
                                            <span className="text-[8px] text-slate-600 uppercase rotate-90 tracking-widest select-none">
                                                AISLE
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-5 gap-1.5 flex-1">
                                            {rightBlock.map((seat) => renderSeatButton(seat))}
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
        </>
    );
}
