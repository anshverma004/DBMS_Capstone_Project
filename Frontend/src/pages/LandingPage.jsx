import React from 'react';

export default function LandingPage({
    loggedInUser,
    onGoToLogin,
    onGoToSignup,
    onGoToTheaters
}) {
    return (
        <div className="space-y-12 py-8">
            
            <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 p-8 md:p-14 shadow-2xl text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
                        ⚡ High-Concurrency Flash-Sale &amp; Movie Seat Reservation Platform
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Welcome to BookMy<span className="text-rose-500">Show</span>
                    </h1>

                    <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        Your one-stop destination for flash-sale movie drops and real-time cinema
                        seat reservations. Sign up or log in to search theaters in your city and
                        book your seats.
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
                                    className="px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition cursor-pointer"
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
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2.5 text-center">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center font-extrabold text-sm">
                        01
                    </div>
                    <h3 className="text-base font-bold text-white">1. Sign Up &amp; Log In</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Create your account and sign in to unlock theater search and live movie
                        showtimes across cities.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2.5 text-center">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-extrabold text-sm">
                        02
                    </div>
                    <h3 className="text-base font-bold text-white">
                        2. Search Theaters in Your City
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        After logging in, browse theaters by city and mall location to find your
                        preferred cinema hall.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2.5 text-center">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-sm">
                        03
                    </div>
                    <h3 className="text-base font-bold text-white">
                        3. Select Seats &amp; Confirm Booking
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Click on a theater to view its live seat layout, hold seats for 5 minutes,
                        and confirm your ticket.
                    </p>
                </div>
            </div>
        </div>
    );
}
