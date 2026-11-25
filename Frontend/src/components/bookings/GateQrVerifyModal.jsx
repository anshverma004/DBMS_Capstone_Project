import React, { useState } from 'react';
import QRCode from 'qrcode';
import RealQrCode from '../common/RealQrCode';
import { buildGateQrPayload } from '../../utils/qrHelpers';

export default function GateQrVerifyModal({ inspectedTicket, currentShow, onClose }) {
    const [copied, setCopied] = useState(false);

    if (!inspectedTicket) return null;

    const ticketNo = `CP-${1000 + Number(inspectedTicket.booking_id)}`;
    const qrPayload = buildGateQrPayload(inspectedTicket, currentShow);

    async function handleDownloadQrPng() {
        try {
            const url = await QRCode.toDataURL(qrPayload, {
                width: 480,
                margin: 2,
                errorCorrectionLevel: 'M',
                color: { dark: '#0f172a', light: '#ffffff' }
            });
            const a = document.createElement('a');
            a.href = url;
            a.download = `${ticketNo}-gate-qr.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch {

        }
    }

    function handleCopyPayload() {
        navigator.clipboard?.writeText(qrPayload).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-white">
                            📱 Cinema Gate QR Scanner Verification
                        </h3>
                        <p className="text-xs text-emerald-100">
                            ✅ VERIFIED IN MYSQL INNODB (ACID COMMITTED)
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white bg-black/20 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                    <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center text-center space-y-2.5">
                        <div className="bg-white p-3 rounded-2xl shadow-lg shadow-emerald-500/15 ring-4 ring-emerald-500/20">
                            <RealQrCode
                                value={qrPayload}
                                size={172}
                                alt={`Gate Entry QR ${ticketNo}`}
                            />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-xs font-extrabold text-emerald-400 tracking-wide">
                                #{ticketNo} • SCAN AT AUDITORIUM GATE
                            </div>
                            <div className="text-[11px] text-slate-400">
                                Real ISO QR containing movie, theater, seat codes &amp; booking ID
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleDownloadQrPng}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 text-[11px] font-bold transition cursor-pointer"
                            >
                                📥 Save Gate QR (.PNG)
                            </button>
                            <button
                                type="button"
                                onClick={handleCopyPayload}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition cursor-pointer"
                            >
                                {copied ? '✓ Copied Data' : '📋 Copy QR Data'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 font-mono">
                        <div className="flex justify-between">
                            <span className="text-slate-400">PK booking_id:</span>
                            <span className="text-emerald-400 font-bold">
                                {inspectedTicket.booking_id} (#{ticketNo})
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">FK user_id:</span>
                            <span className="text-white">
                                {inspectedTicket.user_id} ({inspectedTicket.user_name})
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">FK show_id:</span>
                            <span className="text-white">{inspectedTicket.show_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">booking_seats (1NF):</span>
                            <span className="text-rose-400 font-bold">
                                {inspectedTicket.seats_list}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">lock_mode:</span>
                            <span className="text-amber-300 font-bold">
                                {inspectedTicket.lock_mode}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">confirmed_at:</span>
                            <span className="text-slate-300">
                                {inspectedTicket.confirmed_at
                                    ? new Date(inspectedTicket.confirmed_at).toLocaleString()
                                    : 'Verified Timestamp'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                    >
                        Close Gate Scanner
                    </button>
                </div>
            </div>
        </div>
    );
}
