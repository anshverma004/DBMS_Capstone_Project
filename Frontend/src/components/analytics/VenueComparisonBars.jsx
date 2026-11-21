import React from 'react';

export default function VenueComparisonBars({ enrichedShows }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block">
                    MULTI-VENUE COMPARISON • ALL ACTIVE SHOWS
                </span>
                <h2 className="text-base font-bold text-white">
                    🎬 Cross-Theater Capacity &amp; Occupancy Comparison Graph
                </h2>
            </div>

            <div className="space-y-3">
                {enrichedShows.map((sh) => {
                    const occupied = sh.total_capacity - sh.available_seats;
                    const pct = Math.round((occupied / sh.total_capacity) * 100);

                    return (
                        <div
                            key={sh.show_id}
                            className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="font-bold text-white flex items-center gap-2">
                                    <span>{sh.movie_title}</span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                        ({sh.theaterName})
                                    </span>
                                </div>
                                <div className="font-mono text-xs">
                                    <span className="text-emerald-400 font-bold">
                                        {sh.available_seats} Free
                                    </span>{' '}
                                    /{' '}
                                    <span className="text-rose-400 font-bold">
                                        {occupied} Active
                                    </span>{' '}
                                    ({pct}%)
                                </div>
                            </div>

                            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                                <div
                                    className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-cyan-400 transition-all duration-500"
                                    style={{ width: `${Math.max(4, pct)}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
