import React from 'react';

export default function Navbar({
    users,
    selectedUserId,
    setSelectedUserId,
    lockMode,
    setLockMode,
    onResetShow,
    activeView,
    setActiveView,
    selectedCity,
    setSelectedCity,
    onOpenAuthModal,
    myBookingsCount = 0
}) {
    const currentUser = users.find((u) => Number(u.user_id) === Number(selectedUserId));

    return (
        <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
                {/* Left: BookMyShow Brand & Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-5">
                    <div
                        onClick={() => setActiveView('landing')}
                        className="cursor-pointer flex items-center gap-2.5"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-rose-600/30">
                            B
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                                BookMy<span className="text-rose-500">Flash</span>
                                <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                    InnoDB Engine
                                </span>
                            </h2>
                            <p className="text-[11px] text-slate-400">
                                High-Concurrency Flash-Sale &amp; Theater Reservation
                            </p>
                        </div>
                    </div>

                    {/* View Switcher Pills */}
                    <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setActiveView('landing')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeView === 'landing'
                                    ? 'bg-rose-600 text-white shadow'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            🏠 Explore Movies &amp; Theaters
                        </button>
                        <button
                            onClick={() => setActiveView('booking')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeView === 'booking'
                                    ? 'bg-rose-600 text-white shadow'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            🎟️ Live Seat Hall &amp; Concurrency Lab
                        </button>
                    </nav>
                </div>

                {/* Right: City Picker, Lock Mode, User Switcher, My Tickets, Auth & Reset */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* City Selector */}
                    {setSelectedCity && (
                        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5">
                            <span className="text-xs">📍</span>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
                            >
                                <option value="ALL" className="bg-slate-900">All Cities</option>
                                <option value="Gurugram" className="bg-slate-900">Gurugram (NCR)</option>
                                <option value="New Delhi" className="bg-slate-900">New Delhi</option>
                                <option value="Mumbai" className="bg-slate-900">Mumbai</option>
                            </select>
                        </div>
                    )}

                    {/* Lock Mode Selector */}
                    <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5">
                        <label className="text-[11px] font-medium text-slate-400">Lock:</label>
                        <select
                            value={lockMode}
                            onChange={(e) => setLockMode(e.target.value)}
                            className="bg-slate-900 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded border border-slate-700 focus:outline-none cursor-pointer"
                        >
                            <option value="PESSIMISTIC" className="bg-slate-900 text-white">
                                🔒 PESSIMISTIC (FOR UPDATE)
                            </option>
                            <option value="OPTIMISTIC" className="bg-slate-900 text-white">
                                ⚡ OPTIMISTIC (Version)
                            </option>
                        </select>
                    </div>

                    {/* Acting User Switcher */}
                    <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5">
                        <label className="text-[11px] font-medium text-slate-400">User:</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(Number(e.target.value))}
                            className="bg-slate-900 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded border border-slate-700 focus:outline-none cursor-pointer max-w-[145px]"
                        >
                            {users.map((u) => (
                                <option key={u.user_id} value={u.user_id} className="bg-slate-900 text-white">
                                    #{u.user_id} - {u.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* My Tickets Button */}
                    {onOpenAuthModal && (
                        <button
                            onClick={() => onOpenAuthModal('tickets')}
                            className="px-3 py-1.5 text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                        >
                            🎟️ My Tickets
                            {myBookingsCount > 0 && (
                                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                                    {myBookingsCount}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Login / Sign Up Button */}
                    {onOpenAuthModal && (
                        <button
                            onClick={() => onOpenAuthModal('login')}
                            className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow shadow-rose-600/30 transition cursor-pointer"
                        >
                            👤 {currentUser ? currentUser.full_name.split(' ')[0] : 'Sign In'} / Sign Up
                        </button>
                    )}

                    {/* Reset Show Button */}
                    <button
                        onClick={onResetShow}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg transition cursor-pointer"
                        title="Reset all seats in this show via MySQL Stored Procedure"
                    >
                        🔄 Reset Show
                    </button>
                </div>
            </div>
        </header>
    );
}
