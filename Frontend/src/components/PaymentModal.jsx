import React, { useState } from 'react';

export default function PaymentModal({
    booking,
    currentShow,
    onClose,
    onConfirmPayment
}) {
    const [method, setMethod] = useState('INSTANT'); // 'INSTANT' | 'UPI' | 'CARD'
    const [upiId, setUpiId] = useState('user@okicici');
    const [cardNum, setCardNum] = useState('4532 •••• •••• 8891');
    const [processing, setProcessing] = useState(false);

    if (!booking) return null;

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

                <form onSubmit={handlePay} className="p-6 space-y-5">
                    {/* Ticket Summary Box */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Movie:</span>
                            <span className="font-bold text-white">
                                {currentShow?.movie_title}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Theater:</span>
                            <span className="font-semibold text-slate-200 truncate max-w-[230px]">
                                {currentShow?.theaterName}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Locked Seats:</span>
                            <span className="font-extrabold text-rose-400">
                                {booking.seats_list}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Convenience Fee:</span>
                            <span className="font-bold text-emerald-400">₹0 (FREE)</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
                            <span className="font-bold text-white">Total Payable:</span>
                            <span className="font-extrabold text-emerald-400 text-base">
                                ₹{booking.total_amount}
                            </span>
                        </div>
                    </div>

                    {/* Payment Method Tabs */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Select Payment Method
                        </label>
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
                            <div>
                                <label className="block text-[11px] text-slate-400 mb-1">
                                    Enter UPI ID (GPay / PhonePe / Paytm)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        )}

                        {method === 'CARD' && (
                            <div>
                                <label className="block text-[11px] text-slate-400 mb-1">
                                    Debit / Credit Card Number
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={cardNum}
                                    onChange={(e) => setCardNum(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                    >
                        {processing
                            ? 'Committing MySQL Transaction...'
                            : `✅ Pay ₹${booking.total_amount} & Confirm M-Ticket`}
                    </button>
                </form>
            </div>
        </div>
    );
}
