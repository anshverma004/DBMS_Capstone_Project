import React, { useState } from 'react';

const SNACK_COMBOS = [
    { id: 'popcorn', name: '🍿 Caramel Popcorn + 2 Cokes', price: 140 },
    { id: 'nachos', name: '🧀 Loaded Nachos & Pepsi', price: 110 }
];

export default function PaymentModal({
    booking,
    currentShow,
    onClose,
    onConfirmPayment
}) {
    const [method, setMethod] = useState('INSTANT'); // 'INSTANT' | 'UPI' | 'CARD'
    const [upiId, setUpiId] = useState('user@okicici');
    const [cardNum, setCardNum] = useState('4532 •••• •••• 8891');
    const [selectedSnacks, setSelectedSnacks] = useState([]);
    const [promoApplied, setPromoApplied] = useState(false);
    const [processing, setProcessing] = useState(false);

    if (!booking) return null;

    function toggleSnack(snackId) {
        setSelectedSnacks((prev) =>
            prev.includes(snackId)
                ? prev.filter((id) => id !== snackId)
                : [...prev, snackId]
        );
    }

    const ticketBase = Number(booking.total_amount) || 0;
    const snacksTotal = SNACK_COMBOS.filter((s) =>
        selectedSnacks.includes(s.id)
    ).reduce((sum, s) => sum + s.price, 0);
    const discount = promoApplied ? Math.min(50, ticketBase) : 0;
    const finalPayable = Math.max(0, ticketBase + snacksTotal - discount);

    async function handlePay(e) {
        e.preventDefault();
        setProcessing(true);
        try {
            await onConfirmPayment(booking.booking_id);
            onClose();
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                {/* Top Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-white">
                            Complete Your Ticket Payment
                        </h3>
                        <p className="text-xs text-emerald-100">
                            Order #BMS-{1000 + Number(booking.booking_id)} • Locked via{' '}
                            {booking.lock_mode}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white bg-black/20 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handlePay} className="p-6 space-y-4">
                    {/* Optional Cinema F&B Combos */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            🍿 Add Cinema Snacks (Optional)
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {SNACK_COMBOS.map((snack) => {
                                const active = selectedSnacks.includes(snack.id);
                                return (
                                    <button
                                        key={snack.id}
                                        type="button"
                                        onClick={() => toggleSnack(snack.id)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition cursor-pointer ${
                                            active
                                                ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                        }`}
                                    >
                                        <span>{snack.name}</span>
                                        <span>+₹{snack.price}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Promo Coupon Button */}
                    <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs">
                        <div>
                            <span className="font-bold text-rose-400">🏷️ FLASH50</span>
                            <span className="text-slate-400 ml-1.5">
                                Instant ₹50 Flash-Sale Coupon
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPromoApplied((p) => !p)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                                promoApplied
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-rose-600 text-white'
                            }`}
                        >
                            {promoApplied ? '✓ Applied (-₹50)' : 'Apply'}
                        </button>
                    </div>

                    {/* Ticket Summary Box */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Movie &amp; Seats:</span>
                            <span className="font-bold text-white">
                                {currentShow?.movie_title} ({booking.seats_list})
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Tickets Subtotal:</span>
                            <span className="font-semibold text-slate-200">₹{ticketBase}</span>
                        </div>
                        {snacksTotal > 0 && (
                            <div className="flex items-center justify-between text-amber-300">
                                <span>F&amp;B Snacks Combo:</span>
                                <span>+₹{snacksTotal}</span>
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="flex items-center justify-between text-emerald-400">
                                <span>Coupon (FLASH50):</span>
                                <span>-₹{discount}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Convenience Fee:</span>
                            <span className="font-bold text-emerald-400">₹0 (FREE)</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
                            <span className="font-bold text-white">Total Payable:</span>
                            <span className="font-extrabold text-emerald-400 text-base">
                                ₹{finalPayable}
                            </span>
                        </div>
                    </div>

                    {/* Payment Method Tabs */}
                    <div className="space-y-2.5">
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'INSTANT', label: '⚡ 1-Click Pay' },
                                { id: 'UPI', label: '📱 UPI App' },
                                { id: 'CARD', label: '💳 Card' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setMethod(m.id)}
                                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                        method === m.id
                                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {method === 'UPI' && (
                            <input
                                type="text"
                                required
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="Enter UPI ID"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                        )}

                        {method === 'CARD' && (
                            <input
                                type="text"
                                required
                                value={cardNum}
                                onChange={(e) => setCardNum(e.target.value)}
                                placeholder="Card Number"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                    >
                        {processing
                            ? 'Committing MySQL Transaction...'
                            : `✅ Pay ₹${finalPayable} & Confirm M-Ticket`}
                    </button>
                </form>
            </div>
        </div>
    );
}
