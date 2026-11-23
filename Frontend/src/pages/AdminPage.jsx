import React from 'react';
import { enrichShow } from '../constants/theaterData';
import AddMovieShowForm from '../components/admin/AddMovieShowForm';

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
    const enrichedShows = shows.map((sh, idx) => enrichShow(sh, idx));

    return (
        <div className="space-y-6 py-2">
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

            <AddMovieShowForm onCreateMovieShow={onCreateMovieShow} />

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
                                <div className="flex items-start gap-4">
                                    <img
                                        src={sh.posterUrl}
                                        alt={sh.movie_title}
                                        onError={(e) => {
                                            e.currentTarget.src = '/images/poster-cosmic-wars.jpg';
                                        }}
                                        className="w-16 h-24 rounded-xl object-cover border border-slate-700 shadow-lg shrink-0"
                                    />
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
                                            <strong className="text-indigo-300">
                                                {sh.screen_name}
                                            </strong>
                                        </p>
                                    </div>
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
