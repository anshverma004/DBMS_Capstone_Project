import React, { useEffect, useState } from 'react';

export default function LoginPage({
    users,
    prefilledEmail,
    onLoginSubmit,
    onGoToSignup
}) {
    const [email, setEmail] = useState(prefilledEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (prefilledEmail) {
            setEmail(prefilledEmail);
        }
    }, [prefilledEmail]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onLoginSubmit({ email });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto py-10">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-rose-600">
                    <h2 className="text-lg font-extrabold text-white">
                        Log In to BookMyShow
                    </h2>
                    <p className="text-xs text-rose-100 mt-0.5">
                        Sign in to search theaters in your city and book movie seats
                    </p>
                </div>

                <div className="p-6 space-y-5">
                    {prefilledEmail && (
                        <div className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs px-3.5 py-2.5 rounded-lg">
                            ✅ Account created! Enter your password below to log in.
                        </div>
                    )}

                    {error && (
                        <div className="bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs px-3.5 py-2.5 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer"
                        >
                            {loading ? 'Signing In...' : 'Log In & Search Theaters →'}
                        </button>
                    </form>

                    {/* Quick Demo Email Fill */}
                    {users.length > 0 && (
                        <div className="border-t border-slate-800 pt-4">
                            <p className="text-[11px] text-slate-400 mb-2">
                                Or click any existing account to auto-fill email:
                            </p>
                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                                {users.slice(0, 6).map((u) => (
                                    <button
                                        key={u.user_id}
                                        type="button"
                                        onClick={() => {
                                            setEmail(u.email);
                                            setPassword('123456');
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 cursor-pointer"
                                    >
                                        {u.full_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-slate-800 pt-4 text-center">
                        <p className="text-xs text-slate-400">
                            New to BookMyShow?{' '}
                            <button
                                type="button"
                                onClick={onGoToSignup}
                                className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                            >
                                Create an Account (Sign Up)
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
