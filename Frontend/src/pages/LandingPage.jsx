import React from 'react';

export default function LandingPage({
    loggedInUser,
    onGoToLogin,
    onGoToSignup,
    onGoToTheaters
}) {
    return (
        <div className="space-y-12 py-8">
            <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 shadow-2xl">
                <img
                    src="/images/hero-cinema.jpg"
                    alt="CinePulse Luxury IMAX Auditorium"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-slate-950/80 to-rose-950/75" />

                <div className="relative z-10 max-w-3xl mx-auto p-8 md:p-16 space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        ⚡ High-Concurrency Flash-Sale &amp; Movie Seat Reservation Platform
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                        Welcome to Cine<span className="text-rose-500">Pulse</span>
                    </h1>

                    <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
                        Your premier destination for flash-sale movie drops and real-time luxury
                        cinema seat reservations. Sign up or log in to search theaters in your city
                        and reserve your seats.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                        {!loggedInUser ? (
                            <>
                                <button
                                    onClick={onGoToSignup}
                                    className="px-7 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition cursor-pointer"
                                >
                                    Get Started — Sign Up Free
                                </button>
                                <button
                                    onClick={onGoToLogin}
                                    className="px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition cursor-pointer backdrop-blur-sm"
                                >
                                    Already Have an Account? Log In →
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onGoToTheaters}
                                className="px-7 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition cursor-pointer"
                            >
                                📍 Go to City &amp; Theater Search →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl group">
                    <div className="relative h-36 overflow-hidden">
                        <img
                            src="/images/theater-imax-hall.jpg"
                            alt="Luxury Cinema Lobby"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                        <div className="absolute bottom-3 left-4 w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-extrabold text-xs shadow-lg">
                            01
                        </div>
                    </div>
                    <div className="p-6 pt-3 space-y-2">
                        <h3 className="text-base font-bold text-white">1. Sign Up &amp; Log In</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Create your CinePulse account and sign in to unlock theater search and
                            live premiere showtimes across cities.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl group">
                    <div className="relative h-36 overflow-hidden">
                        <img
                            src="/images/theater-dolby-lounge.jpg"
                            alt="Dolby Atmos Theater Lounge"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                        <div className="absolute bottom-3 left-4 w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-lg">
                            02
                        </div>
                    </div>
                    <div className="p-6 pt-3 space-y-2">
                        <h3 className="text-base font-bold text-white">
                            2. Search Theaters in Your City
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            After logging in, browse multiplexes by city and mall location to find
                            your preferred cinema hall.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl group">
                    <div className="relative h-36 overflow-hidden">
                        <img
                            src="/images/theater-auditorium-rows.jpg"
                            alt="IMAX Auditorium Seating"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                        <div className="absolute bottom-3 left-4 w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-lg">
                            03
                        </div>
                    </div>
                    <div className="p-6 pt-3 space-y-2">
                        <h3 className="text-base font-bold text-white">
                            3. Select Seats &amp; Confirm Booking
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Click on a theater to view its live seat layout, hold seats for 5
                            minutes, and download your QR E-Ticket PDF.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
