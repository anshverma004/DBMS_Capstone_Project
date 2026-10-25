import React from 'react';

export default function ShowSelector({ shows, selectedShowId, onSelectShow }) {
    return (
        <section className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Select Movie Showtime
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {shows.map((sh) => {
                    const isSelected = sh.show_id === selectedShowId;
                    return (
                        <button
                            key={sh.show_id}
                            onClick={() => onSelectShow(sh.show_id)}
                            disabled={isSelected}
                            className={`text-left p-4 rounded-xl border transition ${
                                isSelected
                                    ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/30 text-white shadow-md'
                                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/70 cursor-pointer'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                        sh.is_flash_sale
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                                    }`}
                                >
                                    {sh.is_flash_sale ? '[FLASH SALE]' : '[REGULAR]'}
                                </span>
                                <span className="text-xs font-semibold text-emerald-400">
                                    Available: {sh.available_seats}/{sh.total_capacity}
                                </span>
                            </div>
                            <div className="font-bold text-sm text-white truncate">
                                {sh.movie_title}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                                {sh.screen_name}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
