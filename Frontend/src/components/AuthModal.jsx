import React, { useState } from 'react';

export default function AuthModal({
    isOpen,
    mode,
    onClose,
    users,
    currentUser,
    onSelectUser,
    onLoginSubmit,
    onSignupSubmit,
    bookings,
    currentShow,
    onConfirmBooking,
    onCancelBooking
}) {
    const [tab, setTab] = useState(mode === 'signup' ? 'signup' : 'login');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [preferredCity, setPreferredCity] = useState('Gurugram (Delhi-NCR)');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleFormSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'signup') {
                await onSignupSubmit({ fullName, email, preferredCity });
            } else {
                await onLoginSubmit({ email });
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // "My Tickets" Modal Mode
    if (mode === 'tickets') {
        const myBookings = bookings.filter(
            (b) => Number(b.user_id) === Number(currentUser?.user_id)
        );

        return (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                    <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                🎟️ My Tickets &amp; Seat Holds
                            </h3>
                            <p className="text-xs text-slate-400">
                                Signed in as{' '}
                                <span className="text-rose-400 font-semibold">
                                    {currentUser?.full_name} ({currentUser?.email})
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-4">
                        {myBookings.length === 0 ? (
                            <div className="text-center py-10 bg-slate-950/60 border border-slate-800 rounded-xl">
                                <div className="text-3xl mb-2">🎬</div>
                                <p className="text-sm font-semibold text-slate-300">
                                    No bookings or active holds for {currentUser?.full_name} in this show yet.
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Select green seats on the seat map to lock or book your tickets!
                                </p>
                            </div>
                        ) : (
                            myBookings.map((b) => (
                                <div
                                    key={b.booking_id}
                                    className={`rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4 ${
                                        b.booking_status === 'CONFIRMED'
                                            ? 'bg-emerald-950/25 border-emerald-500/40'
                                            : b.booking_status === 'PENDING'
                                            ? 'bg-amber-500/10 border-amber-500/40'
                                            : 'bg-slate-950/60 border-slate-800 opacity-70'
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                    b.booking_status === 'CONFIRMED'
                                                        ? 'bg-emerald-500 text-slate-950'
                                                        : b.booking_status === 'PENDING'
                                                        ? 'bg-amber-400 text-slate-950'
                                                        : 'bg-slate-700 text-slate-300'
                                                }`}
                                            >
                                                {b.booking_status === 'CONFIRMED'
                                                    ? '✅ M-TICKET CONFIRMED'
                                                    : b.booking_status === 'PENDING'
                                                    ? `⏳ HELD (${b.seconds_left}s LEFT)`
                                                    : b.booking_status}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">
                                                Order #BMS-{1000 + Number(b.booking_id)}
                                            </span>
                                            <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                                                {b.lock_mode}
                                            </span>
                                        </div>

                                        <div className="text-sm font-bold text-white">
                                            {currentShow?.movie_title || 'Cinema Show'} —{' '}
                                            <span className="text-rose-400">Seats: {b.seats_list}</span>
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            📍 {currentShow?.theaterName || currentShow?.screen_name} • Amount:{' '}
                                            <span className="text-emerald-400 font-bold">₹{b.total_amount}</span>
                                        </div>
                                    </div>

                                    {b.booking_status === 'PENDING' && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    onConfirmBooking(b.booking_id);
                                                    onClose();
                                                }}
                                                className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer"
                                            >
                                                Pay &amp; Confirm
                                            </button>
                                            <button
                                                onClick={() => onCancelBooking(b.booking_id)}
                                                className="px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                                            >
                                                Release
                                            </button>
                                        </div>
                                    )}

                                    {b.booking_status === 'CONFIRMED' && (
                                        <div className="bg-white text-slate-950 px-3 py-2 rounded-lg text-center font-mono text-[10px] font-bold leading-tight">
                                            ▄▄▄▄▄
                                            <br />
                                            █▀█▀█
                                            <br />
                                            ▀▀▀▀▀
                                            <div className="mt-0.5 text-[8px]">M-TICKET</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Login / Sign Up Modal Mode
    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-rose-600 to-indigo-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white">
                            {tab === 'login' ? 'Sign In to BookMyFlash' : 'Create Your BookMyFlash Account'}
                        </h3>
                        <p className="text-xs text-rose-100">
                            Synced directly with the MySQL users table
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white bg-black/20 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <button
                        onClick={() => {
                            setTab('login');
                            setError('');
                        }}
                        className={`py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                            tab === 'login'
                                ? 'text-rose-400 border-b-2 border-rose-500 bg-slate-900'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => {
                            setTab('signup');
                            setError('');
                        }}
                        className={`py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                            tab === 'signup'
                                ? 'text-rose-400 border-b-2 border-rose-500 bg-slate-900'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Sign Up (New User)
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs px-3.5 py-2.5 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-3.5">
                        {tab === 'signup' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ansh Verma"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="e.g. aarav.sharma@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        {tab === 'signup' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">
                                    Preferred Cinema City
                                </label>
                                <select
                                    value={preferredCity}
                                    onChange={(e) => setPreferredCity(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                                >
                                    <option value="Gurugram (Delhi-NCR)">Gurugram (Delhi-NCR)</option>
                                    <option value="New Delhi (Delhi-NCR)">New Delhi (Delhi-NCR)</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Bengaluru">Bengaluru</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-rose-600/30 transition cursor-pointer"
                        >
                            {loading
                                ? 'Processing...'
                                : tab === 'login'
                                ? 'Sign In to My Account'
                                : 'Create Account in MySQL'}
                        </button>
                    </form>

                    {/* 1-Click Quick Demo Switcher for Multi-Tab Viva Testing */}
                    <div className="border-t border-slate-800 pt-4">
                        <p className="text-[11px] font-semibold text-slate-400 mb-2">
                            ⚡ Quick 1-Click Switch Account (For Multi-Tab Concurrency Demo):
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                            {users.map((u) => (
                                <button
                                    key={u.user_id}
                                    type="button"
                                    onClick={() => {
                                        onSelectUser(u.user_id);
                                        onClose();
                                    }}
                                    className={`text-left px-2.5 py-1.5 rounded-lg border text-[11px] truncate transition cursor-pointer ${
                                        Number(u.user_id) === Number(currentUser?.user_id)
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                >
                                    #{u.user_id} {u.full_name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
