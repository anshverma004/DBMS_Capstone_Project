import React from 'react';

export default function SeatMap({
    seats,
    selectedSeatIds,
    onToggleSeat,
    onHoldSeats,
    bookings,
    onConfirmBooking,
    onCancelBooking
}) {
    const pendingBookings = bookings.filter((b) => b.booking_status === 'PENDING');

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                    <h3 className="text-base font-bold text-white">Theater Seats</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Selected Seat IDs:{' '}
                        <span className="font-semibold text-indigo-400">
                            {selectedSeatIds.join(', ') || 'None'}
                        </span>
                    </p>
                </div>

                {/* 1. Hold Selected Seats Button */}
                <button
                    onClick={onHoldSeats}
                    disabled={selectedSeatIds.length === 0}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                        selectedSeatIds.length === 0
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer'
                    }`}
                >
                    Hold Selected Seats (5 Min Lock)
                </button>
            </div>

            {/* Curved Cinema Screen Banner */}
            <div className="mb-6 text-center">
                <div className="w-3/4 mx-auto h-2 rounded-t-full bg-gradient-to-r from-slate-800 via-cyan-400/80 to-slate-800 shadow-[0_6px_20px_rgba(34,211,238,0.25)]"></div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mt-1.5 inline-block">
                    Cinema Screen This Way
                </span>
            </div>

            {/* Color Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mb-5">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500 inline-block"></span>
                    Available
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-indigo-600 border border-indigo-400 inline-block"></span>
                    Selected
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500/25 border border-amber-400 inline-block"></span>
                    Held (5-Min Lock)
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-rose-950 border border-rose-700 inline-block"></span>
                    Booked
                </span>
            </div>

            {/* 2. Seat Buttons Grid (10 Seats per Row) */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
                {seats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.show_seat_id);

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

                    return (
                        <button
                            key={seat.show_seat_id}
                            onClick={() => onToggleSeat(seat.show_seat_id)}
                            disabled={seat.status !== 'AVAILABLE'}
                            className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center ${seatStyle}`}
                        >
                            <span className="text-xs font-bold">{seat.seat_code}</span>
                            <span className="text-[10px] opacity-80">₹{seat.price}</span>
                            <span className="text-[9px] font-semibold uppercase mt-0.5 opacity-90">
                                {isSelected ? 'SELECTED' : seat.status}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 3. Active Pending Holds (Confirm or Cancel) */}
            <div className="border-t border-slate-800 pt-5">
                <h3 className="text-sm font-bold text-white mb-3">
                    Active Pending Holds (Checkout)
                </h3>
                {pendingBookings.length === 0 ? (
                    <p className="text-xs text-slate-500 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                        No active holds right now. Select available seats above to lock them for 5 minutes.
                    </p>
                ) : (
                    <div className="space-y-2.5">
                        {pendingBookings.map((b) => (
                            <div
                                key={b.booking_id}
                                className="flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3"
                            >
                                <div className="text-xs text-slate-200 space-y-0.5">
                                    <div className="font-bold text-amber-300">
                                        Booking #{b.booking_id} • {b.user_name} ({b.lock_mode})
                                    </div>
                                    <div className="text-slate-300">
                                        Seats: <span className="font-semibold text-white">{b.seats_list}</span> | Total:{' '}
                                        <span className="font-semibold text-emerald-400">₹{b.total_amount}</span> | Time Left:{' '}
                                        <span className="font-mono font-bold text-amber-300">{b.seconds_left}s</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onConfirmBooking(b.booking_id)}
                                        className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                                    >
                                        Confirm Payment
                                    </button>
                                    <button
                                        onClick={() => onCancelBooking(b.booking_id)}
                                        className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 rounded-lg transition cursor-pointer"
                                    >
                                        Cancel Hold
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
