import React, { useState } from 'react';
import { enrichShow } from '../services/api';

const BMS_PROBLEMS_SOLVED = [
    {
        id: 1,
        problem: '1. Double Booking & Overselling During Flash-Sale Drops',
        bmsFailure:
            'When 10,000 fans click Seat E5 at 12:00:00 PM on BookMyShow, naive check-then-book reads allow multiple users to pay for the exact same seat.',
        ourSolution:
            'Solved via MySQL InnoDB Row-Level Pessimistic Locking (SELECT ... FOR UPDATE) & Optimistic Concurrency Control (version column). Exactly 1 transaction commits; the other 49 get an instant 409 Conflict.',
        badge: 'ACID Row Locking'
    },
    {
        id: 2,
        problem: '2. "Money Deducted / Seat Stuck Locked" (The 5-Min Payment Gap)',
        bmsFailure:
            'If a user reaches the UPI payment page and closes the app, seats on ticketing sites stay stuck as "Unavailable" for 20+ minutes while genuine buyers see Sold Out.',
        ourSolution:
            'Solved via a Two-Phase State Machine (AVAILABLE -> HELD with 5-Min TTL -> BOOKED) plus an automated 5-second Background Expiry Sweeper that self-heals abandoned seats back to AVAILABLE.',
        badge: 'Self-Healing 5-Min TTL'
    },
    {
        id: 3,
        problem: '3. Circular Deadlocks on Multi-Seat Group Bookings',
        bmsFailure:
            'If User A tries to lock (E5, E6) at the same millisecond User B tries to lock (E6, E5), two database transactions wait on each other forever.',
        ourSolution:
            'Solved via Deterministic Ascending Seat-ID Sorting (ORDER BY show_seat_id ASC) before acquiring row locks, plus All-or-Nothing ACID Rollback if any seat in a group is unavailable.',
        badge: 'Deadlock-Free Sorting'
    },
    {
        id: 4,
        problem: '4. The "Single-Seat Orphan Gap" Problem in Theaters',
        bmsFailure:
            'Users leave 1 isolated empty seat between booked groups (e.g., booking E4-E5 when E1-E2 are taken, stranding E3 alone so couples cannot sit together).',
        ourSolution:
            'Solved via our Smart Contiguous Best-Seat Auto-Finder (1-click picks center adjacent seats) + Anti-Single-Seat-Gap Protection that prevents stranding a single orphan seat.',
        badge: 'Smart Gap Prevention'
    },
    {
        id: 5,
        problem: '5. Stale Seat Map ("Green Seat Already Taken at Checkout")',
        bmsFailure:
            'On traditional sites, you spend 30 seconds picking green seats, click Proceed, and get an error because someone else took them 15 seconds ago.',
        ourSolution:
            'Solved via Zero-Latency WebSockets (Socket.io). The millisecond any user holds or books a seat, it turns Yellow (HELD) or Red (BOOKED) across all open tabs with a live countdown.',
        badge: 'Real-Time Socket.io'
    },
    {
        id: 6,
        problem: '6. Hidden Convenience Fees & Checkout Price Shock',
        bmsFailure:
            'A ₹149 flash-sale ticket jumps by +₹80 at the final payment screen due to hidden convenience fees and opaque tier pricing.',
        ourSolution:
            'Solved via 100% Transparent Tier Pricing (Classic, Prime, VIP Recliner) with ₹0 hidden convenience fees and live Flash-Sale savings calculated upfront.',
        badge: '₹0 Hidden Fees'
    },
    {
        id: 7,
        problem: '7. Zero Database Audit Visibility Under Race Contention',
        bmsFailure:
            'When a flash sale fails, users and admins have no verifiable record of who won the seat lock first or which version transition occurred.',
        ourSolution:
            'Solved via an automatic MySQL AFTER UPDATE Trigger (trg_after_show_seat_update) that logs every state & version change with TIMESTAMP(3) millisecond precision.',
        badge: 'MySQL Audit Trigger'
    }
];

export default function LandingPage({
    shows,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    onBookShow
}) {
    const [formatFilter, setFormatFilter] = useState('ALL');

    const enrichedShows = shows.map((sh, idx) => enrichShow(sh, idx));

    // Filter shows by city, search query (movie, theater, mall, genre, screen), and format filter
    const filteredShows = enrichedShows.filter((sh) => {
        const matchesCity =
            selectedCity === 'ALL' ||
            sh.city.toLowerCase().includes(selectedCity.toLowerCase());

        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
            !q ||
            sh.movie_title?.toLowerCase().includes(q) ||
            sh.genre?.toLowerCase().includes(q) ||
            sh.screen_name?.toLowerCase().includes(q) ||
            sh.theaterName?.toLowerCase().includes(q) ||
            sh.mallAddress?.toLowerCase().includes(q) ||
            sh.city?.toLowerCase().includes(q);

        const matchesFormat =
            formatFilter === 'ALL' ||
            (formatFilter === 'FLASH' && sh.is_flash_sale) ||
            (formatFilter === 'IMAX' && sh.screen_name?.toLowerCase().includes('imax')) ||
            (formatFilter === 'DOLBY' && sh.screen_name?.toLowerCase().includes('dolby'));

        return matchesCity && matchesSearch && matchesFormat;
    });

    const spotlightShow = enrichedShows[0] || null;

    return (
        <div className="space-y-8">
            {/* 1. HERO PREMIERE FLASH-SALE BANNER (BookMyShow Spotlight) */}
            {spotlightShow && (
                <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/90 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-lg shadow-rose-600/40">
                                    ⚡ LIVE IMAX FLASH-SALE DROP
                                </span>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    ⭐ {spotlightShow.rating} ({spotlightShow.votes})
                                </span>
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-slate-300 border border-slate-700">
                                    {spotlightShow.certification} • {spotlightShow.duration_mins} mins
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                                {spotlightShow.movie_title}
                            </h1>

                            <p className="text-sm text-slate-300">
                                {spotlightShow.tagline} — Hosted at{' '}
                                <span className="text-white font-semibold">
                                    {spotlightShow.theaterName}
                                </span>
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                                <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                                    📍 {spotlightShow.mallAddress}
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                                    🎬 {spotlightShow.screen_name} ({spotlightShow.format})
                                </span>
                            </div>
                        </div>

                        {/* Right CTA Box */}
                        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 min-w-[260px] w-full lg:w-auto text-center space-y-3">
                            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                                Flash Premiere Pricing
                            </div>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-3xl font-extrabold text-white">₹99</span>
                                <span className="text-sm text-slate-500 line-through">₹180</span>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                                    45% OFF
                                </span>
                            </div>
                            <div className="text-xs text-slate-400">
                                Live Seats Left:{' '}
                                <span className="text-emerald-400 font-bold">
                                    {spotlightShow.available_seats} / {spotlightShow.total_capacity}
                                </span>
                            </div>
                            <button
                                onClick={() => onBookShow(spotlightShow.show_id)}
                                className="w-full py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition cursor-pointer"
                            >
                                🎟️ Book Tickets Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. THEATER LOCATION, CITY & MOVIE SEARCH BAR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 Search movies, theaters, malls (e.g. Ambience Mall, Saket, Jio World, IMAX, Avengers)..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                            >
                                Clear ✕
                            </button>
                        )}
                    </div>

                    {/* City Location Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-slate-400 mr-1">📍 City:</span>
                        {['ALL', 'Gurugram', 'New Delhi', 'Mumbai'].map((city) => (
                            <button
                                key={city}
                                onClick={() => setSelectedCity(city)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    selectedCity === city
                                        ? 'bg-rose-600 text-white shadow'
                                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                                }`}
                            >
                                {city === 'ALL' ? 'All Cities' : city}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Format & Flash-Sale Quick Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'ALL', label: '🎬 All Shows' },
                            { id: 'FLASH', label: '⚡ Flash-Sale Drops Only' },
                            { id: 'IMAX', label: '📽️ IMAX Laser' },
                            { id: 'DOLBY', label: '🔊 Dolby Atmos' }
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFormatFilter(f.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    formatFilter === f.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <span className="text-xs text-slate-400">
                        Showing <strong className="text-white">{filteredShows.length}</strong> live
                        theater showtimes
                    </span>
                </div>
            </div>

            {/* 3. BOOKMYSHOW MOVIE & THEATER LISTING CARDS */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            Now Showing in Theaters &amp; Flash-Sale Premieres
                        </h2>
                        <p className="text-xs text-slate-400">
                            Select any showtime or theater below to enter the real-time InnoDB Seat Reservation Hall
                        </p>
                    </div>
                </div>

                {filteredShows.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                        <p className="text-sm font-semibold text-slate-300">
                            No movies or theaters matched &ldquo;{searchQuery}&rdquo; in {selectedCity}.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCity('ALL');
                                setFormatFilter('ALL');
                            }}
                            className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredShows.map((sh) => {
                            const occupancyPct = Math.round(
                                ((sh.total_capacity - sh.available_seats) / sh.total_capacity) * 100
                            );
                            const isFastFilling =
                                sh.available_seats > 0 && sh.available_seats <= sh.total_capacity * 0.4;

                            return (
                                <div
                                    key={sh.show_id}
                                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition group"
                                >
                                    <div>
                                        {/* Top Poster Banner */}
                                        <div
                                            className={`p-5 bg-gradient-to-br ${sh.gradient} relative border-b border-slate-800`}
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <span
                                                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                                        sh.is_flash_sale
                                                            ? 'bg-amber-400 text-slate-950'
                                                            : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                                                    }`}
                                                >
                                                    {sh.is_flash_sale
                                                        ? '⚡ FLASH SALE • 45% OFF'
                                                        : '🎬 REGULAR SHOW'}
                                                </span>
                                                <span className="text-xs font-bold bg-black/50 text-amber-300 px-2.5 py-1 rounded-full">
                                                    ⭐ {sh.rating}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-extrabold text-white leading-snug">
                                                {sh.movie_title}
                                            </h3>
                                            <p className="text-xs text-slate-200/80 mt-1">
                                                {sh.genre} • {sh.duration_mins} mins • {sh.certification}
                                            </p>
                                            <p className="text-[11px] text-indigo-200 mt-1 font-medium">
                                                {sh.format}
                                            </p>
                                        </div>

                                        {/* Theater Location & Showtime Details */}
                                        <div className="p-5 space-y-4">
                                            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 space-y-1">
                                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    📍 {sh.theaterName}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    {sh.mallAddress}
                                                </div>
                                                <div className="text-[11px] text-indigo-400 font-semibold pt-0.5">
                                                    Auditorium: {sh.screen_name}
                                                </div>
                                            </div>

                                            {/* Amenities Chips */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {sh.amenities?.map((am) => (
                                                    <span
                                                        key={am}
                                                        className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md"
                                                    >
                                                        {am}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Live Seat Occupancy Progress Bar */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span
                                                        className={`font-bold ${
                                                            sh.available_seats === 0
                                                                ? 'text-rose-400'
                                                                : isFastFilling
                                                                ? 'text-amber-400'
                                                                : 'text-emerald-400'
                                                        }`}
                                                    >
                                                        {sh.available_seats === 0
                                                            ? '🔴 SOLD OUT'
                                                            : isFastFilling
                                                            ? '🟡 FAST FILLING'
                                                            : '🟢 AVAILABLE'}
                                                    </span>
                                                    <span className="text-slate-300 font-semibold">
                                                        {sh.available_seats} / {sh.total_capacity} Seats Free
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                                    <div
                                                        className={`h-full transition-all ${
                                                            isFastFilling
                                                                ? 'bg-amber-400'
                                                                : 'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${Math.max(6, 100 - occupancyPct)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Showtime & Book Button */}
                                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] text-slate-400 block uppercase">
                                                Starts From
                                            </span>
                                            <span className="text-base font-extrabold text-white">
                                                ₹{sh.is_flash_sale ? '99' : '180'}
                                            </span>
                                            <span className="text-[11px] text-emerald-400 ml-1.5">
                                                ₹0 Fee
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => onBookShow(sh.show_id)}
                                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition cursor-pointer"
                                        >
                                            🎟️ Select Seats →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 4. HOW WE SOLVED EVERY BOOKMYSHOW PROBLEM (Engineering Showcase) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                            DBMS Capstone Engineering Solutions
                        </span>
                        <h2 className="text-xl font-extrabold text-white mt-0.5">
                            7 Real-World BookMyShow Problems Solved in This System
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Every bottleneck that causes ticket crashes, ghost locks, or double bookings on commercial platforms is solved below:
                        </p>
                    </div>
                    <button
                        onClick={() => onBookShow(spotlightShow?.show_id || 1)}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                        ⚡ Test Live in Seat Hall →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {BMS_PROBLEMS_SOLVED.map((item) => (
                        <div
                            key={item.id}
                            className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                        {item.badge}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-white">{item.problem}</h3>
                                <p className="text-xs text-rose-300/90 bg-rose-950/30 border border-rose-900/40 rounded-lg p-2.5">
                                    <strong>❌ BookMyShow Issue:</strong> {item.bmsFailure}
                                </p>
                                <p className="text-xs text-emerald-300/90 bg-emerald-950/30 border border-emerald-900/40 rounded-lg p-2.5">
                                    <strong>✅ Our DBMS Solution:</strong> {item.ourSolution}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
