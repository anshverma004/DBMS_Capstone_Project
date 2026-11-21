import React, { useState } from 'react';
import { enrichShow } from '../constants/theaterData';

export default function AdminPage({
    shows,
    onCreateMovieShow,
    onDeleteCustomShow,
    onToggleFlashSale,
    onCrowdFill,
    onForceExpire,
    onResetShowById,
    onOpenShowInHall
}) {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Action / Sci-Fi');
    const [durationMins, setDurationMins] = useState(165);
    const [screenId, setScreenId] = useState(1);
    const [isFlashSale, setIsFlashSale] = useState(true);
    const [creating, setCreating] = useState(false);

    const enrichedShows = shows.map((sh, idx) => enrichShow(sh, idx));

    async function handleCreateSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !onCreateMovieShow) return;
        setCreating(true);
        try {
            await onCreateMovieShow({
                title: title.trim(),
                genre,
                durationMins: Number(durationMins),
                screenId: Number(screenId),
                isFlashSale
            });
            setTitle('');
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="space-y-6 py-2">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Owner-Only Cinema Control Center
                    </span>
                    <h1 className="text-2xl font-extrabold text-white mt-0.5">
                        🛠️ Cinema Admin &amp; Show Management
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Add new movies &amp; shows, remove shows, toggle Flash-Sale pricing,
                        simulate crowd fills, or reset seat inventories.
                    </p>
                </div>
            </div>

            {/* 1. CREATE NEW MOVIE & SCHEDULE SHOWTIME FORM */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                    <h2 className="text-base font-bold text-white">
                        ➕ Add New Movie &amp; Schedule Auditorium Show
                    </h2>
                    <p className="text-xs text-slate-400">
                        Creates the movie &amp; showtime in MySQL and automatically generates all
                        50–60 theater seats.
                    </p>
                </div>

                <form
                    onSubmit={handleCreateSubmit}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                >
                    <div className="md:col-span-4">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Movie Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Pushpa 2: The Rule (IMAX Premiere)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Genre
                        </label>
                        <input
                            type="text"
                            required
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Mins
                        </label>
                        <input
                            type="number"
                            min="45"
                            max="300"
                            value={durationMins}
                            onChange={(e) => setDurationMins(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Auditorium Screen
                        </label>
                        <select
                            value={screenId}
                            onChange={(e) => setScreenId(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        >
                            <option value={1}>Screen 1 - IMAX Laser (60 Seats)</option>
                            <option value={2}>Screen 2 - Dolby Atmos (50 Seats)</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                        >
                            {creating ? 'Adding...' : '➕ Add Show'}
                        </button>
                    </div>
                </form>
            </div>

            {/* 2. EXISTING SHOW MANAGEMENT CARDS WITH REMOVE BUTTON */}
            <div className="grid grid-cols-1 gap-5">
                {enrichedShows.map((sh) => {
                    const soldSeats = sh.total_capacity - sh.available_seats;
                    const occupancyPct = Math.round((soldSeats / sh.total_capacity) * 100);

                    return (
                        <div
                            key={sh.show_id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="text-xs font-mono bg-slate-950 text-slate-400 px-2.5 py-0.5 rounded border border-slate-800">
                                            Show #{sh.show_id}
                                        </span>
                                        <span
                                            className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                                sh.is_flash_sale
                                                    ? 'bg-amber-400 text-slate-950'
                                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                            }`}
                                        >
                                            {sh.is_flash_sale
                                                ? '⚡ FLASH SALE LIVE (₹99 / ₹149 / ₹249)'
                                                : '🎬 REGULAR PRICING (₹180 / ₹280 / ₹450)'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-white">
                                        {sh.movie_title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        📍 {sh.theaterName} •{' '}
                                        <strong className="text-indigo-300">{sh.screen_name}</strong>
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-xs text-slate-400 block">
                                            Live Seat Availability
                                        </span>
                                        <span className="text-lg font-extrabold text-emerald-400">
                                            {sh.available_seats} / {sh.total_capacity} Free
                                        </span>
                                        <span className="text-[11px] text-slate-500 block">
                                            ({occupancyPct}% Occupied)
                                        </span>
                                    </div>

                                    {/* Remove Show Button */}
                                    {onDeleteCustomShow && (
                                        <button
                                            onClick={() => onDeleteCustomShow(sh.show_id)}
                                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/25 transition cursor-pointer"
                                        >
                                            🗑️ Remove Show
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
                                <button
                                    onClick={() => onToggleFlashSale(sh.show_id)}
                                    className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold transition cursor-pointer"
                                >
                                    {sh.is_flash_sale
                                        ? '🎬 Switch to Regular Prices'
                                        : '⚡ Enable Flash-Sale Drop'}
                                </button>

                                <button
                                    onClick={() => onCrowdFill(sh.show_id, 12)}
                                    className="px-3.5 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition cursor-pointer"
                                >
                                    🍿 Auto-Fill 12 Random Seats
                                </button>

                                <button
                                    onClick={() => onForceExpire(sh.show_id)}
                                    className="px-3.5 py-2.5 rounded-xl bg-cyan-600/15 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
                                >
                                    ⏩ Force-Expire 5-Min Holds
                                </button>

                                <button
                                    onClick={() => onResetShowById(sh.show_id)}
                                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
                                >
                                    🔄 Reset All Seats
                                </button>

                                <button
                                    onClick={() => onOpenShowInHall(sh.show_id)}
                                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                                >
                                    🎟️ Open Seat Auditorium →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
