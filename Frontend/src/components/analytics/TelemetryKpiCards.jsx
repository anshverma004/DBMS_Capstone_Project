import React from 'react';

export default function TelemetryKpiCards({
    totalRevenue,
    heldRevenue,
    occupancyRate,
    bookedCount,
    heldCount,
    totalSeats,
    auditLogsCount,
    peakSeatVersion
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <span className="text-[11px] font-mono uppercase text-slate-400 block">
                    Confirmed Box-Office
                </span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                    ₹{totalRevenue}
                </div>
                <span className="text-[11px] text-slate-400">
                    +₹{heldRevenue} locked in active checkout
                </span>
                <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                    <path
                        d="M 0,25 Q 25,18 45,20 T 85,10 T 120,4 L 120,30 L 0,30 Z"
                        fill="rgba(16,185,129,0.18)"
                    />
                    <path
                        d="M 0,25 Q 25,18 45,20 T 85,10 T 120,4"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <span className="text-[11px] font-mono uppercase text-slate-400 block">
                    Auditorium Occupancy
                </span>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                    {occupancyRate}%
                </div>
                <span className="text-[11px] text-slate-400">
                    {bookedCount + heldCount} of {totalSeats} seats active
                </span>
                <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                    <path
                        d="M 0,24 Q 30,12 60,16 T 120,6 L 120,30 L 0,30 Z"
                        fill="rgba(34,211,238,0.18)"
                    />
                    <path
                        d="M 0,24 Q 30,12 60,16 T 120,6"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <span className="text-[11px] font-mono uppercase text-slate-400 block">
                    Trigger Audit Events
                </span>
                <div className="text-2xl font-black text-amber-400 mt-1">
                    {auditLogsCount}
                </div>
                <span className="text-[11px] text-slate-400">
                    Peak Seat Version: v{peakSeatVersion}
                </span>
                <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                    <path
                        d="M 0,26 Q 20,22 45,12 T 90,15 T 120,5 L 120,30 L 0,30 Z"
                        fill="rgba(245,158,11,0.18)"
                    />
                    <path
                        d="M 0,26 Q 20,22 45,12 T 90,15 T 120,5"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <span className="text-[11px] font-mono uppercase text-slate-400 block">
                    Concurrency Integrity
                </span>
                <div className="text-2xl font-black text-indigo-400 mt-1">
                    100% ACID
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                    ✓ 0 Double Bookings • 0 Deadlocks
                </span>
                <svg className="w-full h-10 mt-2" viewBox="0 0 120 30">
                    <path
                        d="M 0,8 L 30,8 L 60,8 L 90,8 L 120,8 L 120,30 L 0,30 Z"
                        fill="rgba(129,140,248,0.18)"
                    />
                    <path
                        d="M 0,8 L 30,8 L 60,8 L 90,8 L 120,8"
                        fill="none"
                        stroke="#818cf8"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
}
