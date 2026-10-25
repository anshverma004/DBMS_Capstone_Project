import React, { useState } from 'react';

export default function ConcurrencyPanel({
    seats,
    auditLogs,
    onSimulateRace,
    simulationResult
}) {
    const availableSeats = seats.filter((s) => s.status === 'AVAILABLE');
    const [targetSeatId, setTargetSeatId] = useState('');
    const [concurrentCount, setConcurrentCount] = useState(50);

    const selectedId = targetSeatId || availableSeats[0]?.show_seat_id || '';

    return (
        <div className="space-y-6">
            {/* 1. Concurrency Stress-Test Simulator Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-base font-bold text-white mb-1">
                    Concurrency Stress-Test Simulator
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                    Fire simultaneous requests at the same seat to test MySQL race-condition prevention.
                </p>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            Target Available Seat:
                        </label>
                        <select
                            value={selectedId}
                            onChange={(e) => setTargetSeatId(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                        >
                            {availableSeats.map((s) => (
                                <option key={s.show_seat_id} value={s.show_seat_id}>
                                    {s.seat_code} ({s.tier} - ID: {s.show_seat_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            Concurrent Users:
                        </label>
                        <input
                            type="number"
                            value={concurrentCount}
                            onChange={(e) => setConcurrentCount(Number(e.target.value))}
                            min="2"
                            max="200"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <button
                        onClick={() => onSimulateRace(Number(selectedId), concurrentCount)}
                        disabled={!selectedId}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition ${
                            !selectedId
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                        }`}
                    >
                        ⚡ Fire Simultaneous Requests
                    </button>
                </div>

                {/* 2. Simulation Scoreboard */}
                {simulationResult && (
                    <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                            Simulation Result ({simulationResult.lockModeUsed})
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                                <span className="text-slate-400 block text-[11px]">Total Requests</span>
                                <span className="text-base font-bold text-white">
                                    {simulationResult.totalConcurrentRequests}
                                </span>
                            </div>
                            <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
                                <span className="text-emerald-300 block text-[11px]">Succeeded (Winner)</span>
                                <span className="text-base font-bold text-emerald-400">
                                    {simulationResult.succeededCount}
                                </span>
                            </div>
                            <div className="bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
                                <span className="text-rose-300 block text-[11px]">Prevented (409)</span>
                                <span className="text-base font-bold text-rose-400">
                                    {simulationResult.preventedDoubleBookings}
                                </span>
                            </div>
                            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                                <span className="text-slate-400 block text-[11px]">Execution Time</span>
                                <span className="text-base font-bold text-indigo-400">
                                    {simulationResult.durationMs} ms
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. MySQL Trigger Audit Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-3">
                    MySQL Trigger Audit Logs (seat_audit_logs)
                </h3>
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
                            {auditLogs.map((log) => (
                                <tr key={log.log_id} className="hover:bg-slate-800/50">
                                    <td className="px-3 py-2 font-mono text-slate-500">#{log.log_id}</td>
                                    <td className="px-3 py-2 font-bold text-white">{log.seat_code}</td>
                                    <td className="px-3 py-2">
                                        <span className="text-slate-400">{log.old_status}</span>
                                        <span className="mx-1 text-slate-500">-&gt;</span>
                                        <span className="font-semibold text-emerald-400">{log.new_status}</span>
                                    </td>
                                    <td className="px-3 py-2 font-mono text-indigo-300">
                                        v{log.old_version} -&gt; v{log.new_version}
                                    </td>
                                    <td className="px-3 py-2 text-slate-300">{log.user_name || '-'}</td>
                                    <td className="px-3 py-2 font-mono text-[11px] text-slate-400">
                                        {new Date(log.changed_at).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
