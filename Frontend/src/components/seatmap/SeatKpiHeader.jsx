import React from 'react';

export default function SeatKpiHeader({
    availableCount,
    heldCount,
    bookedCount,
    totalRevenue,
    currentShow,
    selectedSeatIds,
    onSetSelectedSeats,
    onSmartPreset,
    tierFilter,
    setTierFilter,
    heatmapMode,
    setHeatmapMode,
    watchAlert,
    setWatchAlert
}) {
    return (
        <>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">🟢 Available Seats</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                        {availableCount}
                    </span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">🟡 Locked (5-Min TTL)</span>
                    <span className="text-xl font-extrabold text-amber-400">{heldCount}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">🔴 Sold (Confirmed)</span>
                    <span className="text-xl font-extrabold text-rose-400">{bookedCount}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-400 block">💰 Box-Office Revenue</span>
                    <span className="text-xl font-extrabold text-white">₹{totalRevenue}</span>
                </div>
            </div>

            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
                <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        🎬 {currentShow?.movie_title || 'Theater Auditorium'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        📍 {currentShow?.theaterName || currentShow?.screen_name} •{' '}
                        <span className="text-indigo-400 font-semibold">
                            {currentShow?.screen_name}
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onSmartPreset(2, ['E', 'F', 'D', 'C'])}
                        className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 rounded-lg transition cursor-pointer"
                    >
                        💑 Couple Recliner (2)
                    </button>
                    <button
                        type="button"
                        onClick={() => onSmartPreset(4, ['C', 'D', 'E', 'B'])}
                        className="px-2.5 py-1 text-[11px] font-bold bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg transition cursor-pointer"
                    >
                        👨‍👩‍👧‍👦 Family Pack (4)
                    </button>
                    <button
                        type="button"
                        onClick={() => onSmartPreset(2, ['A', 'B', 'C'])}
                        className="px-2.5 py-1 text-[11px] font-bold bg-cyan-500/15 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-lg transition cursor-pointer"
                    >
                        💸 Budget Pair (2)
                    </button>
                    {selectedSeatIds.length > 0 && onSetSelectedSeats && (
                        <button
                            type="button"
                            onClick={() => onSetSelectedSeats([])}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {watchAlert && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-indigo-950/70 border border-indigo-500/50 text-indigo-200 text-xs flex items-center justify-between">
                    <span>{watchAlert}</span>
                    <button
                        onClick={() => setWatchAlert('')}
                        className="text-slate-400 hover:text-white ml-3 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <div className="flex flex-wrap items-center gap-1.5">
                    {[
                        { id: 'ALL', label: 'All Tiers' },
                        { id: 'CLASSIC', label: 'Classic' },
                        { id: 'PRIME', label: 'Prime' },
                        { id: 'RECLINER', label: 'VIP Recliner' },
                        { id: 'BEST_VIEW', label: '⭐ Best IMAX Center View' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setTierFilter(f.id)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                tierFilter === f.id
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setHeatmapMode((h) => !h)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        heatmapMode
                            ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/30'
                            : 'bg-slate-950 text-orange-300 border-orange-500/40 hover:bg-orange-500/15'
                    }`}
                >
                    🔥 {heatmapMode ? 'Exit Contention Heatmap' : 'Version Contention Heatmap'}
                </button>
            </div>
        </>
    );
}
