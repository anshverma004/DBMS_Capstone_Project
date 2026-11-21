import React from 'react';

export default function RadialRadarGauges({
    seats,
    radius,
    circumference,
    availArc,
    heldArc,
    bookedArc,
    occupancyRate,
    availableCount,
    heldCount,
    bookedCount,
    totalRevenue,
    maxCapacityRevenue,
    tiersSummary
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                        RADIAL GAUGE 01
                    </span>
                    <h3 className="text-sm font-bold text-white">
                        Seat State Distribution Ring
                    </h3>
                </div>

                <div className="flex items-center justify-center gap-6 my-4">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="transparent"
                                stroke="#0f172a"
                                strokeWidth="14"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="transparent"
                                stroke="#10b981"
                                strokeWidth="14"
                                strokeDasharray={`${availArc} ${circumference}`}
                                strokeDashoffset="0"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="transparent"
                                stroke="#f59e0b"
                                strokeWidth="14"
                                strokeDasharray={`${heldArc} ${circumference}`}
                                strokeDashoffset={-availArc}
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="transparent"
                                stroke="#f43f5e"
                                strokeWidth="14"
                                strokeDasharray={`${bookedArc} ${circumference}`}
                                strokeDashoffset={-(availArc + heldArc)}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-black font-mono text-white">
                                {occupancyRate}%
                            </span>
                            <span className="text-[9px] font-mono uppercase text-slate-400">
                                Active
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                            <span className="text-slate-400">FREE:</span>
                            <strong className="text-emerald-400">{availableCount}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                            <span className="text-slate-400">HELD:</span>
                            <strong className="text-amber-400">{heldCount}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
                            <span className="text-slate-400">SOLD:</span>
                            <strong className="text-rose-400">{bookedCount}</strong>
                        </div>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span>Box-Office Fill Ratio:</span>
                    <span className="text-emerald-400 font-bold">
                        ₹{totalRevenue} / ₹{maxCapacityRevenue}
                    </span>
                </div>
            </div>

            
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block">
                        RADIAL GAUGE 02
                    </span>
                    <h3 className="text-sm font-bold text-white">
                        Concentric Multi-Tier Radar Rings
                    </h3>
                </div>

                <div className="flex items-center justify-center gap-5 my-4">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
                            {tiersSummary.map((t) => (
                                <g key={t.name}>
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={t.ringRadius}
                                        fill="transparent"
                                        stroke="#0f172a"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={t.ringRadius}
                                        fill="transparent"
                                        stroke={t.color}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${t.ringDash} ${t.ringCirc}`}
                                    />
                                </g>
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs font-mono font-bold text-slate-300">
                                3 TIERS
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-mono">
                        {tiersSummary.map((t) => (
                            <div key={t.name}>
                                <div className={`font-bold ${t.textClass}`}>
                                    {t.name}: {t.fillPct}%
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    {t.booked} Sold • ₹{t.revenue}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span>Outer: Recliner • Mid: Prime • Inner: Classic</span>
                </div>
            </div>

            
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                            2D SPATIAL RADAR
                        </span>
                        <h3 className="text-sm font-bold text-white">
                            Live 60-Seat Cyber Telemetry Grid
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">6x10 Matrix</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 my-2">
                    <div className="grid grid-cols-10 gap-1">
                        {seats.map((s) => {
                            const dotClass =
                                s.status === 'BOOKED'
                                    ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                    : s.status === 'HELD'
                                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                                    : Number(s.version) > 1
                                    ? 'bg-cyan-500/40 text-cyan-200 border border-cyan-400'
                                    : 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30';

                            return (
                                <div
                                    key={s.show_seat_id}
                                    title={`${s.seat_code}: ${s.status} (v${s.version})`}
                                    className={`h-5 rounded text-[8px] font-mono font-bold flex items-center justify-center ${dotClass}`}
                                >
                                    {s.seat_code}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span>Cyan Node = Contended &amp; Freed (`v2+`)</span>
                </div>
            </div>
        </div>
    );
}
