import React from 'react';

export default function Navbar({
    users,
    selectedUserId,
    setSelectedUserId,
    lockMode,
    setLockMode,
    onResetShow
}) {
    return (
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Flash-Sale &amp; Seat Reservation System
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        High-Concurrency MySQL InnoDB Locking &amp; Real-Time Seat Management
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* 1. User Switcher */}
                    <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5">
                        <label className="text-xs font-medium text-slate-400">Acting User:</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(Number(e.target.value))}
                            className="bg-slate-900 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                            {users.map((u) => (
                                <option key={u.user_id} value={u.user_id} className="bg-slate-900 text-white">
                                    #{u.user_id} - {u.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Lock Mode Selector */}
                    <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5">
                        <label className="text-xs font-medium text-slate-400">Lock Mode:</label>
                        <select
                            value={lockMode}
                            onChange={(e) => setLockMode(e.target.value)}
                            className="bg-slate-900 text-amber-400 text-xs font-semibold px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                            <option value="PESSIMISTIC" className="bg-slate-900 text-white">
                                PESSIMISTIC (SELECT FOR UPDATE)
                            </option>
                            <option value="OPTIMISTIC" className="bg-slate-900 text-white">
                                OPTIMISTIC (Version Check)
                            </option>
                        </select>
                    </div>

                    {/* 3. Reset Show Button */}
                    <button
                        onClick={onResetShow}
                        className="px-3.5 py-2 text-xs font-semibold bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-lg transition cursor-pointer"
                    >
                        Reset Show Demo
                    </button>
                </div>
            </div>
        </header>
    );
}
