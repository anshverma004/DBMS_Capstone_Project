import React from 'react';
import { formatMMSS } from '../../utils/seatHelpers';

export default function ActiveHoldsList({
    pendingBookings,
    confirmedBookings,
    heldCount,
    tickOffset,
    onForceExpireHolds,
    onConfirmBooking,
    onCancelBooking
}) {
    return (
        <>
            
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
                                        Paid:{' '}
                                        <strong className="text-emerald-400">₹{b.total_amount}</strong>
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
        </>
    );
}
