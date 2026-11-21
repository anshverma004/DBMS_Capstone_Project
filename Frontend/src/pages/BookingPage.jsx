import React from 'react';
import SeatMap from '../components/SeatMap';
import ConcurrencyPanel from '../components/ConcurrencyPanel';

export default function BookingPage({
    currentShow,
    selectedTimeSlot,
    seats,
    selectedSeatIds,
    onToggleSeat,
    onSetSelectedSeats,
    onHoldSeats,
    bookings,
    onConfirmBooking,
    onCancelBooking,
    onForceExpireHolds,
    auditLogs,
    onSimulateRace,
    simulationResult,
    onBackToTheaters,
    onGoToMyBookings
}) {
    return (
        <div className="space-y-6">
            {/* Top Breadcrumb Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                        Step 2 of 2 • Auditorium Seat Selection &amp; Reservation
                    </span>
                    <h2 className="text-base font-extrabold text-white">
                        📍 {currentShow?.theaterName} —{' '}
                        <span className="text-indigo-300">{currentShow?.movie_title}</span>
                        {selectedTimeSlot && (
                            <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                                🕒 {selectedTimeSlot}
                            </span>
                        )}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onGoToMyBookings}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-xs font-bold text-indigo-300 hover:text-white border border-indigo-500/30 transition cursor-pointer"
                    >
                        🎟️ View My M-Tickets
                    </button>
                    <button
                        onClick={onBackToTheaters}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
                    >
                        ← Back to Theaters List
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                    <SeatMap
                        seats={seats}
                        selectedSeatIds={selectedSeatIds}
                        onToggleSeat={onToggleSeat}
                        onSetSelectedSeats={onSetSelectedSeats}
                        onHoldSeats={onHoldSeats}
                        bookings={bookings}
                        onConfirmBooking={onConfirmBooking}
                        onCancelBooking={onCancelBooking}
                        onForceExpireHolds={onForceExpireHolds}
                        currentShow={currentShow}
                    />
                </div>

                <div className="lg:col-span-5">
                    <ConcurrencyPanel
                        seats={seats}
                        auditLogs={auditLogs}
                        onSimulateRace={onSimulateRace}
                        simulationResult={simulationResult}
                    />
                </div>
            </div>
        </div>
    );
}
