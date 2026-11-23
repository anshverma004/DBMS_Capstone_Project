import React from 'react';

export default function TheaterVenueCard({
    show,
    onSelectTheaterShow,
    onOpenSpecsModal
}) {
    return (
        <div className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 sm:p-6 shadow-xl transition">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                    <div
                        onClick={() =>
                            onSelectTheaterShow(show.show_id, show.showTimeLabel, show)
                        }
                        className="w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden border border-slate-700/80 shadow-lg shrink-0 cursor-pointer group bg-slate-950"
                    >
                        <img
                            src={show.posterUrl}
                            alt={show.movie_title}
                            onError={(e) => {
                                e.currentTarget.src = '/images/poster-cosmic-wars.jpg';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                    </div>

                    <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                📍 {show.city}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                {show.screen_name}
                            </span>
                            {show.is_flash_sale ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950">
                                    ⚡ FLASH SALE • STARTING ₹99
                                </span>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => onOpenSpecsModal(show)}
                                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                            >
                                ℹ️ Auditorium &amp; Tier Specs
                            </button>
                        </div>

                        <h3
                            onClick={() =>
                                onSelectTheaterShow(show.show_id, show.showTimeLabel, show)
                            }
                            className="text-lg font-extrabold text-white hover:text-rose-400 transition cursor-pointer"
                        >
                            {show.theaterName}
                        </h3>

                        <p className="text-xs text-slate-400">{show.mallAddress}</p>

                        <div className="text-xs text-indigo-300 font-semibold pt-0.5">
                            🎬 Now Playing:{' '}
                            <span className="text-white">{show.movie_title}</span> ({show.genre} •{' '}
                            {show.duration_mins}m • ⭐ {show.rating})
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            {show.amenities?.map((am) => (
                                <span
                                    key={am}
                                    className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg"
                                >
                                    ✓ {am}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden w-full lg:w-auto min-w-[330px]">
                    <div className="relative h-24 overflow-hidden">
                        <img
                            src={show.venuePhotoUrl || '/images/theater-imax-hall.jpg'}
                            alt={show.screen_name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                        <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-xs">
                            <span className="text-slate-100 font-bold uppercase text-[10px] tracking-wider drop-shadow">
                                Select Showtime
                            </span>
                            <span className="text-emerald-400 font-bold text-[11px] bg-slate-950/85 px-2 py-0.5 rounded-full">
                                🟢 {show.available_seats}/{show.total_capacity} Free
                            </span>
                        </div>
                    </div>

                    <div className="p-3.5 grid grid-cols-2 gap-2">
                        {(show.timeSlots || []).map((slot) => (
                            <button
                                key={slot.time}
                                type="button"
                                onClick={() =>
                                    onSelectTheaterShow(
                                        show.show_id,
                                        `${slot.time} (${slot.tag})`,
                                        show
                                    )
                                }
                                className={`px-3 py-2 rounded-xl border text-center transition cursor-pointer ${
                                    slot.isFlash
                                        ? 'bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 border-amber-500/50 text-amber-300'
                                        : 'bg-emerald-950/40 hover:bg-emerald-600 hover:text-white border-emerald-500/50 text-emerald-300'
                                }`}
                            >
                                <div className="text-xs font-extrabold">{slot.time}</div>
                                <div className="text-[9px] font-bold uppercase opacity-80">
                                    {slot.tag}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
