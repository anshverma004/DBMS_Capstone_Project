import React from 'react';

export default function AuditoriumSpecsModal({
    specsModalShow,
    onClose,
    onSelectTheaterShow
}) {
    if (!specsModalShow) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-gradient-to-r from-rose-600 to-indigo-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-white">
                            {specsModalShow.theaterName}
                        </h3>
                        <p className="text-xs text-rose-100">
                            {specsModalShow.screen_name} • {specsModalShow.format}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white bg-black/20 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
                        <div className="text-sm font-extrabold text-white">
                            🎬 {specsModalShow.movie_title}
                        </div>
                        <div className="text-slate-400">{specsModalShow.tagline}</div>
                        <div className="text-indigo-300 pt-1">
                            📍 {specsModalShow.mallAddress}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">
                            Auditorium Seat Tier Matrix ({specsModalShow.total_capacity} Total Seats)
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                <span className="text-cyan-400 font-bold block">CLASSIC</span>
                                <span className="text-[11px] text-slate-400 block">Rows A–B</span>
                                <span className="text-sm font-extrabold text-white mt-1 block">
                                    ₹{specsModalShow.is_flash_sale ? '99' : '180'}
                                </span>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                <span className="text-indigo-300 font-bold block">PRIME</span>
                                <span className="text-[11px] text-slate-400 block">Rows C–D</span>
                                <span className="text-sm font-extrabold text-white mt-1 block">
                                    ₹{specsModalShow.is_flash_sale ? '149' : '280'}
                                </span>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                <span className="text-amber-300 font-bold block">RECLINER</span>
                                <span className="text-[11px] text-slate-400 block">Rows E–F</span>
                                <span className="text-sm font-extrabold text-white mt-1 block">
                                    ₹{specsModalShow.is_flash_sale ? '249' : '450'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const id = specsModalShow.show_id;
                            const label = specsModalShow.showTimeLabel;
                            onClose();
                            onSelectTheaterShow(id, label);
                        }}
                        className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer"
                    >
                        🎟️ Enter Auditorium &amp; Select Seats →
                    </button>
                </div>
            </div>
        </div>
    );
}
