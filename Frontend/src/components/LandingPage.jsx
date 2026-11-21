import React from 'react';
import { enrichShow } from '../services/api';

export default function LandingPage({
    shows,
    loggedInUser,
    onGoToLogin,
    onGoToSignup,
    onGoToTheaters
}) {
    const enrichedShows = shows.map((sh, idx) => enrichShow(sh, idx));

    function handleCTA() {
        if (loggedInUser) {
            onGoToTheaters();
        } else {
            onGoToLogin();
        }
    }

    return (
        <div className="space-y-12 py-4">
            {/* 1. HERO BANNER */}
            <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 p-8 md:p-12 shadow-2xl">
                <div className="max-w-3xl space-y-5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
                        ⚡ Flash-Sale &amp; Movie Ticket Booking Platform
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Book Blockbuster Movie Tickets &amp; IMAX Premieres Instantly.
                    </h1>

                    <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
                        Search theaters across your city, explore live IMAX Laser &amp; Dolby Atmos
                        showtimes, pick your favorite seats in real time, and grab flash-sale
                        premiere tickets starting at just ₹99.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        {!loggedInUser ? (
                            <>
                                <button
                                    onClick={onGoToSignup}
                                    className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition cursor-pointer"
                                >
                                    Get Started — Sign Up Free
                                </button>
                                <button
                                    onClick={onGoToLogin}
                                    className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition cursor-pointer"
                                >
                                    Already a Member? Log In →
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onGoToTheaters}
                                className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition cursor-pointer"
                            >
                                📍 Search Theaters in Your City →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. HOW IT WORKS (3-STEP FLOW) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center font-extrabold text-sm">
                        01
                    </div>
                    <h3 className="text-base font-bold text-white">Create Account &amp; Sign In</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Sign up in seconds and log in to access live flash-sale movie drops and your
                        personal ticket bookings.
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-extrabold text-sm">
                        02
                    </div>
                    <h3 className="text-base font-bold text-white">
                        Search City &amp; Choose a Theater
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Filter theaters by city (Delhi-NCR, Gurugram, Mumbai), mall location, or
                        screen format (IMAX Laser &amp; Dolby Atmos).
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-sm">
                        03
                    </div>
                    <h3 className="text-base font-bold text-white">
                        Pick Your Seats &amp; Confirm Instant M-Ticket
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Select Classic, Prime, or VIP Recliner seats with a guaranteed 5-minute
                        checkout lock and zero hidden convenience fees.
                    </p>
                </div>
            </div>

            {/* 3. FEATURED MOVIES PREVIEW */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-extrabold text-white">
                            Trending Blockbusters &amp; Flash Premieres
                        </h2>
                        <p className="text-xs text-slate-400">
                            {loggedInUser
                                ? 'Click any movie below to search theaters and select seats'
                                : 'Log in or sign up to choose a theater and book seats'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {enrichedShows.map((sh) => (
                        <div
                            key={sh.show_id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                        >
                            <div className={`p-6 bg-gradient-to-br ${sh.gradient} border-b border-slate-800`}>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span
                                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                                            sh.is_flash_sale
                                                ? 'bg-amber-400 text-slate-950'
                                                : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                                        }`}
                                    >
                                        {sh.is_flash_sale ? '⚡ FLASH SALE' : '🎬 NOW SHOWING'}
                                    </span>
                                    <span className="text-xs font-bold bg-black/40 text-amber-300 px-2.5 py-1 rounded-full">
                                        ⭐ {sh.rating}
                                    </span>
                                </div>
                                <h3 className="text-lg font-extrabold text-white">
                                    {sh.movie_title}
                                </h3>
                                <p className="text-xs text-slate-200/80 mt-1">
                                    {sh.genre} • {sh.duration_mins} mins • {sh.certification}
                                </p>
                            </div>

                            <div className="p-5 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] text-slate-400 block">
                                        Tickets Starting At
                                    </span>
                                    <span className="text-lg font-extrabold text-white">
                                        ₹{sh.is_flash_sale ? '99' : '180'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCTA}
                                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                                >
                                    {loggedInUser ? 'Find Theaters →' : 'Log In to Book →'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
