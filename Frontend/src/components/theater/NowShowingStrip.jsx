import React from 'react';

export default function NowShowingStrip({ shows = [], onSelectShow }) {
    if (shows.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    🎬 Now Showing Premieres
                </h2>
                <span className="text-xs text-slate-400">
                    Select any poster to jump straight to seats
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {shows.map((sh) => (
                    <button
                        key={sh.show_id}
                        type="button"
                        onClick={() => onSelectShow(sh.show_id, sh.showTimeLabel)}
                        className="group text-left bg-slate-900 border border-slate-800 hover:border-rose-500/60 rounded-2xl overflow-hidden shadow-lg transition flex flex-col cursor-pointer"
                    >
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                            <img
                                src={sh.posterUrl}
                                alt={sh.movie_title}
                                onError={(e) => {
                                    e.currentTarget.src = '/images/poster-cosmic-wars.jpg';
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/25" />

                            {sh.is_flash_sale ? (
                                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow">
                                    ⚡ FLASH ₹99
                                </span>
                            ) : (
                                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-slate-200 border border-slate-700">
                                    IMAX
                                </span>
                            )}

                            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/75 text-amber-300 border border-amber-500/30">
                                ⭐ {sh.rating}
                            </span>
                        </div>

                        <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-extrabold text-white line-clamp-1 group-hover:text-rose-400 transition">
                                    {sh.movie_title}
                                </h3>
                                <p className="text-[10px] text-slate-400 line-clamp-1">
                                    {sh.genre} • {sh.duration_mins}m
                                </p>
                            </div>
                            <div className="text-[10px] font-semibold text-emerald-400 pt-1">
                                🟢 {sh.available_seats} Seats Free
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
