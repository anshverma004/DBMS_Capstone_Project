import React from 'react';

export default function Navbar({
    currentPage,
    setCurrentPage,
    loggedInUser,
    onLogout,
    lockMode,
    setLockMode,
    onResetShow,
    myBookingsCount = 0
}) {
    return (
        <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
                {/* Brand Logo */}
                <div
                    onClick={() => setCurrentPage('landing')}
                    className="cursor-pointer flex items-center gap-2.5"
                >
                    <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-rose-600/30">
                        B
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-white tracking-tight">
                            BookMy<span className="text-rose-500">Show</span>
                        </h2>
                        <p className="text-[11px] text-slate-400">
                            Flash-Sale &amp; Movie Seat Reservation System
                        </p>
                    </div>
                </div>

                {/* Navigation Links & Auth Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setCurrentPage('landing')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            currentPage === 'landing'
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Home
                    </button>

                    {loggedInUser && (
                        <>
                            <button
                                onClick={() => setCurrentPage('theaters')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    currentPage === 'theaters'
                                        ? 'bg-rose-600 text-white'
                                        : 'text-slate-300 hover:text-white bg-slate-800/70'
                                }`}
                            >
                                📍 Search Theaters
                            </button>

                            <button
                                onClick={() => setCurrentPage('mybookings')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                    currentPage === 'mybookings'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-indigo-300 hover:text-white bg-indigo-950/60 border border-indigo-500/30'
                                }`}
                            >
                                🎟️ My Bookings
                                {myBookingsCount > 0 && (
                                    <span className="bg-rose-500 text-white text-[10px] px-1.5 rounded-full">
                                        {myBookingsCount}
                                    </span>
                                )}
                            </button>
                        </>
                    )}

                    {/* Show Lock Mode & Reset ONLY on the Seat Booking page */}
                    {currentPage === 'booking' && loggedInUser && (
                        <>
                            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1">
                                <label className="text-[11px] text-slate-400">Lock:</label>
                                <select
                                    value={lockMode}
                                    onChange={(e) => setLockMode(e.target.value)}
                                    className="bg-slate-900 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded border border-slate-700 focus:outline-none cursor-pointer"
                                >
                                    <option value="PESSIMISTIC">PESSIMISTIC (FOR UPDATE)</option>
                                    <option value="OPTIMISTIC">OPTIMISTIC (Version)</option>
                                </select>
                            </div>

                            <button
                                onClick={onResetShow}
                                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg transition cursor-pointer"
                            >
                                Reset Show
                            </button>
                        </>
                    )}

                    {/* If NOT Logged In -> Show Log In and Sign Up buttons in Navbar */}
                    {!loggedInUser ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage('login')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    currentPage === 'login'
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                }`}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => setCurrentPage('signup')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    currentPage === 'signup'
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                            <span className="text-xs text-slate-300">
                                👤 <strong className="text-emerald-400">{loggedInUser.full_name}</strong>
                            </span>
                            <button
                                onClick={onLogout}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
