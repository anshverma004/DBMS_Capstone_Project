import React from 'react';

export default function MyBookingsPage({
    loggedInUser,
    bookings,
    currentShow,
    onOpenPaymentModal,
    onCancelBooking,
    onBackToTheaters
}) {
    const myBookings = loggedInUser
        ? bookings.filter((b) => Number(b.user_id) === Number(loggedInUser.user_id))
        : bookings;

    return (
        <div className="space-y-6 py-2">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        BookMyShow E-Tickets &amp; Checkout History
                    </span>
                    <h1 className="text-2xl font-extrabold text-white mt-0.5">
                        🎟️ My Bookings &amp; M-Tickets
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Account:{' '}
                        <strong className="text-emerald-400">
                            {loggedInUser?.full_name || 'Guest'}
                        </strong>{' '}
                        ({loggedInUser?.email || 'Active Session'})
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition cursor-pointer"
                    >
                        🖨️ Print / Save Tickets PDF
                    </button>
                    <button
                        onClick={onBackToTheaters}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
                    >
                        ← Browse Theaters
                    </button>
                </div>
            </div>

            {/* Bookings List */}
            {myBookings.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                    <div className="text-4xl">🎬</div>
                    <h3 className="text-base font-bold text-white">
                        No Tickets or Active Seat Holds Yet
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Select a theater and hold or confirm your favorite seats to generate your
                        BookMyShow M-Ticket here.
                    </p>
                    <button
                        onClick={onBackToTheaters}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                        Search Theaters &amp; Book Seats →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {myBookings.map((b) => {
                        const isConfirmed = b.booking_status === 'CONFIRMED';
                        const isPending = b.booking_status === 'PENDING';

                        return (
                            <div
                                key={b.booking_id}
                                className={`rounded-2xl border p-6 shadow-xl flex flex-col justify-between gap-4 ${
                                    isConfirmed
                                        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/40'
                                        : isPending
                                        ? 'bg-gradient-to-br from-slate-900 to-amber-950/30 border-amber-500/40'
                                        : 'bg-slate-900/70 border-slate-800 opacity-75'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                                                    isConfirmed
                                                        ? 'bg-emerald-500 text-slate-950'
                                                        : isPending
                                                        ? 'bg-amber-400 text-slate-950'
                                                        : 'bg-slate-800 text-slate-400'
                                                }`}
                                            >
                                                {isConfirmed
                                                    ? '✅ CONFIRMED M-TICKET'
                                                    : isPending
                                                    ? `⏳ PENDING HOLD (${b.seconds_left}s)`
                                                    : b.booking_status}
                                            </span>
                                            <span className="text-xs font-mono text-slate-400">
                                                #BMS-{1000 + Number(b.booking_id)}
                                            </span>
                                            <span className="text-[10px] font-mono bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                                                {b.lock_mode}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-extrabold text-white">
                                            {currentShow?.movie_title || 'Cinema Premiere'}
                                        </h3>

                                        <p className="text-xs text-slate-300">
                                            📍 {currentShow?.theaterName} ({currentShow?.screen_name})
                                        </p>

                                        <div className="pt-1 flex flex-wrap items-center gap-4 text-xs">
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase">
                                                    Seats
                                                </span>
                                                <span className="font-extrabold text-rose-400 text-sm">
                                                    {b.seats_list}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase">
                                                    Total Paid
                                                </span>
                                                <span className="font-extrabold text-emerald-400 text-sm">
                                                    ₹{b.total_amount}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase">
                                                    Customer
                                                </span>
                                                <span className="font-semibold text-white">
                                                    {b.user_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {isConfirmed && (
                                        <div className="bg-white text-slate-950 p-3 rounded-xl text-center font-mono text-xs font-black leading-none select-none shadow-md">
                                            ▄▄▄▄▄▄▄
                                            <br />
                                            █ ▄▄▄ █
                                            <br />
                                            █ ███ █
                                            <br />
                                            ▀▀▀▀▀▀▀
                                            <div className="text-[8px] font-extrabold mt-1 tracking-wider">
                                                SCAN ENTRY
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isPending && (
                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                                        <button
                                            onClick={() => onOpenPaymentModal(b)}
                                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                                        >
                                            ✅ Complete Payment Now
                                        </button>
                                        <button
                                            onClick={() => onCancelBooking(b.booking_id)}
                                            className="px-3.5 py-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                                        >
                                            Release Hold
                                        </button>
                                    </div>
                                )}

                                {isConfirmed && (
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                                        <span className="text-[11px] text-emerald-400">
                                            ✓ 100% Refundable M-Ticket
                                        </span>
                                        <button
                                            onClick={() => onCancelBooking(b.booking_id)}
                                            className="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold rounded-xl transition cursor-pointer"
                                        >
                                            🔄 Cancel Ticket &amp; Claim Refund
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
