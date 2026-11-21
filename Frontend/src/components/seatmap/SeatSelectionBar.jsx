import React from 'react';
import { getSeatViewingProfile, isBestViewSeat } from '../../utils/seatHelpers';

export default function SeatSelectionBar({
    selectedSeatObjects,
    selectedSubtotal,
    selectedSeatIds,
    onHoldSeats
}) {
    const lastSelectedSeat =
        selectedSeatObjects[selectedSeatObjects.length - 1] || null;
    const viewProfile = getSeatViewingProfile(lastSelectedSeat);

    return (
        <>
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
        </>
    );
}
