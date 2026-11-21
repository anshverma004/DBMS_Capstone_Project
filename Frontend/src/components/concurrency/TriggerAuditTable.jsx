import React, { useState } from 'react';
import { exportAuditLogsToCsv } from '../../services/api';

export default function TriggerAuditTable({ auditLogs = [] }) {
    const [seatFilter, setSeatFilter] = useState('');

    const filteredAuditLogs = auditLogs.filter((log) => {
        if (!seatFilter.trim()) return true;
        return log.seat_code?.toLowerCase().includes(seatFilter.trim().toLowerCase());
    });

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">
                    MySQL Trigger Audit Logs (seat_audit_logs)
                </h3>
                {auditLogs.length > 0 && (
                    <button
                        onClick={() => exportAuditLogsToCsv(auditLogs)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-bold transition cursor-pointer"
                    >
                        📥 Export CSV
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={seatFilter}
                    onChange={(e) => setSeatFilter(e.target.value)}
                    placeholder="🔍 Filter logs by Seat Code (e.g. A1, C5, E8)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {seatFilter && (
                    <button
                        onClick={() => setSeatFilter('')}
                        className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                        <tr>
                            <th className="px-3 py-2">Log ID</th>
                            <th className="px-3 py-2">Seat</th>
                            <th className="px-3 py-2">Transition</th>
                            <th className="px-3 py-2">Version</th>
                            <th className="px-3 py-2">User</th>
                            <th className="px-3 py-2">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                        {filteredAuditLogs.map((log) => (
                            <tr key={log.log_id} className="hover:bg-slate-800/50">
                                <td className="px-3 py-2 font-mono text-slate-500">
                                    #{log.log_id}
                                </td>
                                <td className="px-3 py-2 font-bold text-white">
                                    {log.seat_code}
                                </td>
                                <td className="px-3 py-2">
                                    <span className="text-slate-400">{log.old_status}</span>
                                    <span className="mx-1 text-slate-500">-&gt;</span>
                                    <span className="font-semibold text-emerald-400">
                                        {log.new_status}
                                    </span>
                                </td>
                                <td className="px-3 py-2 font-mono text-indigo-300">
                                    v{log.old_version} -&gt; v{log.new_version}
                                </td>
                                <td className="px-3 py-2 text-slate-300">
                                    {log.user_name || '-'}
                                </td>
                                <td className="px-3 py-2 font-mono text-[11px] text-slate-400">
                                    {new Date(log.changed_at).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
