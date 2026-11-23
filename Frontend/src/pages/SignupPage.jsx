import React, { useState } from 'react';

const CITY_SUGGESTIONS = [
    'New Delhi',
    'Gurugram',
    'Noida',
    'Mumbai',
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Kolkata',
    'Jaipur',
    'Chandigarh',
    'Ahmedabad',
    'Kochi',
    'Lucknow',
    'Indore',
    'Surat',
    'Goa',
    'Patna'
];

export default function SignupPage({ onSignupSubmit, onGoToLogin }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSignupSubmit({ fullName, email, city });
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
                        src="/images/theater-imax-hall.jpg"
                        alt="CinePulse Multiplex"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-rose-950/60" />
                    <div className="absolute inset-x-6 bottom-4">
                        <h2 className="text-lg font-extrabold text-white">
                            Create Your Cine<span className="text-rose-400">Pulse</span> Account
                        </h2>
                        <p className="text-xs text-slate-200 mt-0.5">
                            Sign up to search theaters in any city and reserve movie seats
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs px-3.5 py-2.5 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                        </div>

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
                                Your City
                            </label>
                            <input
                                type="text"
                                required
                                list="cinepulse-city-list"
                                placeholder="Enter any city (e.g. Bengaluru, Jaipur, Delhi, Pune...)"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                            <datalist id="cinepulse-city-list">
                                {CITY_SUGGESTIONS.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Create a password"
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
                            {loading ? 'Creating Account...' : 'Sign Up & Proceed to Login →'}
                        </button>
                    </form>

                    <div className="border-t border-slate-800 pt-4 text-center">
                        <p className="text-xs text-slate-400">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onGoToLogin}
                                className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                            >
                                Log In Here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
