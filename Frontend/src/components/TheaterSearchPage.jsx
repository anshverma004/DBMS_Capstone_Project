import React from 'react';
import { enrichShow } from '../services/api';

export default function TheaterSearchPage({
    shows,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    onSelectTheaterShow
}) {
    const enrichedShows = shows.map((sh, idx) => enrichShow(sh, idx));

    const filteredTheaters = enrichedShows.filter((sh) => {
        const matchesCity =
            selectedCity === 'ALL' ||
            sh.city.toLowerCase().includes(selectedCity.toLowerCase());

        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
            !q ||
            sh.theaterName?.toLowerCase().includes(q) ||
            sh.mallAddress?.toLowerCase().includes(q) ||
            sh.city?.toLowerCase().includes(q) ||
            sh.movie_title?.toLowerCase().includes(q) ||
            sh.screen_name?.toLowerCase().includes(q);

        return matchesCity && matchesSearch;
    });

    return (
        <div className="space-y-6 py-2">
            {/* 1. PAGE HEADER & CITY / THEATER SEARCH BAR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        Step 1 of 2 • Choose Your Cinema Venue
                    </span>
                    <h1 className="text-2xl font-extrabold text-white mt-0.5">
                        Search Theaters in Your City
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Select your city or search by theater/mall name, then click on a theater to
                        open the seat layout and book tickets.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 Search theater name, mall location, city, or movie (e.g. PVR Ambience Mall, INOX Saket, Mumbai)..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white cursor-pointer"
                            >
                                Clear ✕
                            </button>
                        )}
                    </div>

                    {/* City Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">📍 City:</span>
                        {['ALL', 'Gurugram', 'New Delhi', 'Mumbai'].map((city) => (
                            <button
                                key={city}
                                onClick={() => setSelectedCity(city)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                    selectedCity === city
                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                {city === 'ALL' ? 'All Cities' : city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. LIST OF THEATERS */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">
                        Available Theaters ({filteredTheaters.length})
                    </h2>
                    <span className="text-xs text-slate-400">
                        Click on any theater or showtime below to view seats
                    </span>
                </div>

                {filteredTheaters.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                        <p className="text-sm font-semibold text-slate-300">
                            No theaters found matching &ldquo;{searchQuery}&rdquo; in {selectedCity}.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCity('ALL');
                            }}
                            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Show All Theaters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTheaters.map((sh) => (
                            <div
                                key={sh.show_id}
                                onClick={() => onSelectTheaterShow(sh.show_id)}
                                className="bg-slate-900 border border-slate-800 hover:border-rose-500/60 rounded-2xl p-6 shadow-xl transition cursor-pointer group"
                            >
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                    {/* Left: Theater Info & Location */}
                                    <div className="space-y-2.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                📍 {sh.city}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                                {sh.screen_name}
                                            </span>
                                            {sh.is_flash_sale ? (
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950">
                                                    ⚡ FLASH SALE • STARTING ₹99
                                                </span>
                                            ) : null}
                                        </div>

                                        <h3 className="text-lg font-extrabold text-white group-hover:text-rose-400 transition">
                                            {sh.theaterName}
                                        </h3>

                                        <p className="text-xs text-slate-400">{sh.mallAddress}</p>

                                        {/* Amenities */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                            {sh.amenities?.map((am) => (
                                                <span
                                                    key={am}
                                                    className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg"
                                                >
                                                    ✓ {am}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Movie Playing & Showtime Button to Open Seat Map */}
                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 w-full lg:w-auto min-w-[300px] flex flex-col justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                                                Now Screening
                                            </span>
                                            <div className="text-sm font-extrabold text-white mt-0.5">
                                                🎬 {sh.movie_title}
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                {sh.genre} • {sh.duration_mins} mins • ⭐ {sh.rating}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                                            <div>
                                                <span className="text-xs font-bold text-emerald-400 block">
                                                    🟢 {sh.available_seats} / {sh.total_capacity} Seats Available
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {sh.showTimeLabel}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectTheaterShow(sh.show_id);
                                                }}
                                                className="px-4 py-2.5 bg-rose-600 group-hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition cursor-pointer"
                                            >
                                                View Seats &amp; Book →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
