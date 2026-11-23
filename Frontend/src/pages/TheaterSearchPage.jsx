import React, { useState } from 'react';
import { DATE_TABS, enrichShow } from '../constants/theaterData';
import NowShowingStrip from '../components/theater/NowShowingStrip';
import TheaterVenueCard from '../components/theater/TheaterVenueCard';
import AuditoriumSpecsModal from '../components/theater/AuditoriumSpecsModal';

export default function TheaterSearchPage({
    shows,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    onSelectTheaterShow
}) {
    const [selectedDateTab, setSelectedDateTab] = useState('today');
    const [specsModalShow, setSpecsModalShow] = useState(null);
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                            Step 1 of 2 • Choose Your Cinema Venue &amp; Showtime
                        </span>
                        <h1 className="text-2xl font-extrabold text-white mt-0.5">
                            Search Theaters in Your City
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Pick a movie premiere below or filter by city and mall name to view the
                            live auditorium seat map.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                        {DATE_TABS.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setSelectedDateTab(d.id)}
                                className={`px-3.5 py-2 rounded-lg text-center transition cursor-pointer ${
                                    selectedDateTab === d.id
                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <div className="text-[10px] font-bold uppercase">{d.day}</div>
                                <div className="text-xs font-extrabold">{d.date}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
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

            <NowShowingStrip
                shows={enrichedShows}
                onSelectShow={onSelectTheaterShow}
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">
                        Available Theaters ({filteredTheaters.length})
                    </h2>
                    <span className="text-xs text-slate-400">
                        Click any green showtime pill or theater below to open the seat layout
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
                            <TheaterVenueCard
                                key={sh.show_id}
                                show={sh}
                                onSelectTheaterShow={onSelectTheaterShow}
                                onOpenSpecsModal={setSpecsModalShow}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AuditoriumSpecsModal
                specsModalShow={specsModalShow}
                onClose={() => setSpecsModalShow(null)}
                onSelectTheaterShow={onSelectTheaterShow}
            />
        </div>
    );
}
