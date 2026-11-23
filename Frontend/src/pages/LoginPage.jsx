import React, { useEffect, useState } from 'react';

export default function LoginPage({
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
            await onLoginSubmit({ email, password });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto py-10">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative h-28 overflow-hidden">
                    <img
                        src="/images/hero-cinema.jpg"
                        alt="CinePulse Cinema"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-indigo-950/60" />
                    <div className="absolute inset-x-6 bottom-4">
                        <h2 className="text-lg font-extrabold text-white">
                            Log In to Cine<span className="text-rose-400">Pulse</span>
                        </h2>
                        <p className="text-xs text-slate-200 mt-0.5">
                            Sign in with your registered email and password
                        </p>
                    </div>
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
                                placeholder="Enter your email address"
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

                    <div className="border-t border-slate-800 pt-4 text-center">
                        <p className="text-xs text-slate-400">
                            New to CinePulse?{' '}
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
