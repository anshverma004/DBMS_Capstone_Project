import React, { useEffect, useState } from 'react';
import { DATE_TABS, enrichShow } from '../constants/theaterData';
import { searchTheatersApi } from '../services/api';
import NowShowingStrip from '../components/theater/NowShowingStrip';
import TheaterVenueCard from '../components/theater/TheaterVenueCard';
import AuditoriumSpecsModal from '../components/theater/AuditoriumSpecsModal';

const POPULAR_CITIES = [
    { id: 'ALL', label: 'All Cities' },
    { id: 'New Delhi', label: 'New Delhi' },
    { id: 'Gurugram', label: 'Gurugram' },
    { id: 'Noida', label: 'Noida' },
    { id: 'Mumbai', label: 'Mumbai' },
    { id: 'Bengaluru', label: 'Bengaluru' },
    { id: 'Hyderabad', label: 'Hyderabad' },
    { id: 'Pune', label: 'Pune' },
    { id: 'Chennai', label: 'Chennai' },
    { id: 'Kolkata', label: 'Kolkata' },
    { id: 'Jaipur', label: 'Jaipur' },
    { id: 'Chandigarh', label: 'Chandigarh' },
    { id: 'Ahmedabad', label: 'Ahmedabad' },
    { id: 'Kochi', label: 'Kochi' },
    { id: 'Lucknow', label: 'Lucknow' }
];

export default function TheaterSearchPage({
    shows,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    onSelectTheaterShow
}) {
    const [selectedDateTab, setSelectedDateTab] = useState('today');
    const [cityInput, setCityInput] = useState(
        selectedCity && selectedCity !== 'ALL' ? selectedCity : ''
    );
    const [apiTheaters, setApiTheaters] = useState([]);
    const [searching, setSearching] = useState(false);
    const [specsModalShow, setSpecsModalShow] = useState(null);

    const enrichedBaseShows = shows.map((sh, idx) => enrichShow(sh, idx));

    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await searchTheatersApi({
                    city: selectedCity,
                    q: searchQuery
                });
                if (!cancelled && Array.isArray(res?.theaters)) {
                    setApiTheaters(res.theaters.map((sh, idx) => enrichShow(sh, idx)));
                }
            } catch {
                if (!cancelled) {
                    const cNorm = String(selectedCity || '').toLowerCase();
                    const qNorm = String(searchQuery || '').toLowerCase();
                    const fallback = enrichedBaseShows.filter((sh) => {
                        const matchCity =
                            !cNorm ||
                            cNorm === 'all' ||
                            sh.city?.toLowerCase().includes(cNorm);
                        const matchQ =
                            !qNorm ||
                            sh.theaterName?.toLowerCase().includes(qNorm) ||
                            sh.movie_title?.toLowerCase().includes(qNorm) ||
                            sh.city?.toLowerCase().includes(qNorm);
                        return matchCity && matchQ;
                    });
                    setApiTheaters(fallback);
                }
            } finally {
                if (!cancelled) setSearching(false);
            }
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [selectedCity, searchQuery, shows.length]);

    function handleCitySubmit(e) {
        e.preventDefault();
        const trimmed = cityInput.trim();
        setSelectedCity(trimmed || 'ALL');
    }

    function handleCityChipClick(cityId) {
        setCityInput(cityId === 'ALL' ? '' : cityId);
        setSelectedCity(cityId);
    }

    return (
        <div className="space-y-6 py-2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                            Step 1 of 2 • Pan-India City &amp; Cinema Discovery API
                        </span>
                        <h1 className="text-2xl font-extrabold text-white mt-0.5">
                            Search Theaters in Any City
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Enter any city name (Delhi, Mumbai, Bengaluru, Jaipur, Kochi, Indore,
                            Surat, or your hometown) to fetch live multiplexes &amp; seat availability.
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

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-800/80">
                    <form onSubmit={handleCitySubmit} className="md:col-span-6 flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={cityInput}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCityInput(val);
                                    setSelectedCity(val.trim() || 'ALL');
                                }}
                                placeholder="📍 Enter any city (e.g. Bengaluru, Jaipur, Pune, Surat, Goa)..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            />
                            {cityInput && (
                                <button
                                    type="button"
                                    onClick={() => handleCityChipClick('ALL')}
                                    className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white cursor-pointer"
                                >
                                    Clear ✕
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md shadow-rose-600/25 transition cursor-pointer shrink-0"
                        >
                            Find City
                        </button>
                    </form>

                    <div className="md:col-span-6 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🎬 Filter by theater, mall, screen, or movie (e.g. PVR, INOX, Interstellar)..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white cursor-pointer"
                            >
                                Clear ✕
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">
                        Quick Cities:
                    </span>
                    {POPULAR_CITIES.map((c) => {
                        const active =
                            selectedCity.toLowerCase() === c.id.toLowerCase();
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => handleCityChipClick(c.id)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                                    active
                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                {c.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <NowShowingStrip
                shows={enrichedBaseShows}
                onSelectShow={onSelectTheaterShow}
            />

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-base font-bold text-white">
                            Available Theaters ({apiTheaters.length})
                        </h2>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {searching
                                ? 'Searching API...'
                                : selectedCity === 'ALL'
                                ? 'Live API • All Cities'
                                : `Live API • City: ${selectedCity}`}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400">
                        Click any green showtime pill or theater below to open the seat layout
                    </span>
                </div>

                {apiTheaters.length === 0 && !searching ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                        <p className="text-sm font-semibold text-slate-300">
                            No theaters matched filter &ldquo;{searchQuery}&rdquo; in{' '}
                            {selectedCity === 'ALL' ? 'all cities' : selectedCity}.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                handleCityChipClick('ALL');
                            }}
                            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                            Reset Search Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {apiTheaters.map((sh) => (
                            <TheaterVenueCard
                                key={sh.listingId || sh.show_id}
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
                onSelectTheaterShow={(id, label) =>
                    onSelectTheaterShow(id, label, specsModalShow)
                }
            />
        </div>
    );
}
