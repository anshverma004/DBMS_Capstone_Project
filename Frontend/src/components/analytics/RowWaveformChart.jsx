import React from 'react';

export default function RowWaveformChart({
    svgWavePoints,
    versionPolyline,
    versionAreaPath,
    activePolyline,
    activeAreaPath
}) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                        DIGITAL WAVEFORM TELEMETRY • ROWS A TO F
                    </span>
                    <h2 className="text-base font-bold text-white">
                        📈 Auditorium Row Version Activity &amp; Seat Lock Waveform
                    </h2>
                </div>

                <div className="flex items-center gap-5 text-xs font-mono">
                    <span className="flex items-center gap-2 text-cyan-300">
                        <span className="w-3 h-1 bg-cyan-400 inline-block rounded"></span>
                        Cumulative Row Version Curve
                    </span>
                    <span className="flex items-center gap-2 text-rose-300">
                        <span className="w-3 h-1 bg-rose-500 inline-block rounded"></span>
                        Locked &amp; Sold Seats Curve
                    </span>
                </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                <svg className="w-full h-48" viewBox="0 0 600 175">
                    <defs>
                        <linearGradient id="cyanWaveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="roseWaveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {[35, 70, 105, 145].map((yVal) => (
                        <line
                            key={yVal}
                            x1="30"
                            y1={yVal}
                            x2="570"
                            y2={yVal}
                            stroke="#1e293b"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                        />
                    ))}

                    <path d={versionAreaPath} fill="url(#cyanWaveGrad)" />
                    <path d={activeAreaPath} fill="url(#roseWaveGrad)" />

                    <polyline
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="3"
                        points={versionPolyline}
                    />
                    <polyline
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                        points={activePolyline}
                    />

                    {svgWavePoints.map((pt) => (
                        <g key={pt.rowLabel}>
                            <circle
                                cx={pt.x}
                                cy={pt.yVersion}
                                r="5"
                                fill="#0f172a"
                                stroke="#22d3ee"
                                strokeWidth="2.5"
                            />
                            <text
                                x={pt.x}
                                y={pt.yVersion - 10}
                                textAnchor="middle"
                                fill="#67e8f9"
                                fontSize="10"
                                fontFamily="monospace"
                            >
                                v{pt.versionSum}
                            </text>

                            <circle cx={pt.x} cy={pt.yActive} r="4" fill="#f43f5e" />

                            <text
                                x={pt.x}
                                y="168"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                                fontWeight="bold"
                                fontFamily="monospace"
                            >
                                ROW {pt.rowLabel}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
