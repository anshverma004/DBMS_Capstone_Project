import React, { useState } from 'react';

export default function AddMovieShowForm({ onCreateMovieShow }) {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Action / Sci-Fi');
    const [durationMins, setDurationMins] = useState(165);
    const [screenId, setScreenId] = useState(1);
    const [creating, setCreating] = useState(false);

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
                isFlashSale: true
            });
            setTitle('');
        } finally {
            setCreating(false);
        }
    }

    return (
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
    );
}
