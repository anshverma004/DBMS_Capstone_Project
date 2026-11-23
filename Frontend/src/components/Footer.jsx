import React from 'react';

export default function Footer({ loggedInUser, isAdmin, setCurrentPage }) {
    return (
        <footer className="bg-slate-900/90 border-t border-slate-800 mt-12 py-6 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-white">
                        Cine<span className="text-rose-500">Pulse</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                        Socket.io Real-Time Sync Active
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">
                        High-Concurrency Cinema Seat Reservation Platform
                    </span>
                </div>

                {loggedInUser && (
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setCurrentPage('theaters')}
                            className="hover:text-white cursor-pointer"
                        >
                            Theaters
                        </button>
                        <span>•</span>
                        <button
                            onClick={() => setCurrentPage('mybookings')}
                            className="hover:text-white cursor-pointer"
                        >
                            My M-Tickets
                        </button>
                        {isAdmin && (
                            <>
                                <span>•</span>
                                <button
                                    onClick={() => setCurrentPage('analytics')}
                                    className="hover:text-white cursor-pointer"
                                >
                                    DBMS Analytics
                                </button>
                                <span>•</span>
                                <button
                                    onClick={() => setCurrentPage('admin')}
                                    className="hover:text-white cursor-pointer"
                                >
                                    Admin Control
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </footer>
    );
}
