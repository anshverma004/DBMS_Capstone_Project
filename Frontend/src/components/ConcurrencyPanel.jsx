import React, { useEffect, useState } from 'react';
import { exportAuditLogsToCsv } from '../services/api';

export default function ConcurrencyPanel({
    seats,
    auditLogs,
    onSimulateRace,
    simulationResult
}) {
    const availableSeats = seats.filter((s) => s.status === 'AVAILABLE');
    const [targetSeatId, setTargetSeatId] = useState('');
    const [concurrentCount, setConcurrentCount] = useState(50);
    const [testMode, setTestMode] = useState('SINGLE'); // 'SINGLE' | 'DEADLOCK_PAIR'
    const [benchmarkHistory, setBenchmarkHistory] = useState([]);

    const selectedId = Number(targetSeatId) || availableSeats[0]?.show_seat_id || '';
    const secondSeat =
        availableSeats.find((s) => s.show_seat_id !== Number(selectedId)) || null;

    useEffect(() => {
        if (simulationResult) {
            setBenchmarkHistory((prev) => [
                {
                    runId: prev.length + 1,
                    ...simulationResult,
                    timestamp: new Date().toLocaleTimeString()
                },
                ...prev
            ]);
        }
    }, [simulationResult]);

    function handleFireTest() {
        if (!selectedId) return;
        if (testMode === 'DEADLOCK_PAIR' && secondSeat) {
            onSimulateRace(
                [Number(selectedId), Number(secondSeat.show_seat_id)],
                concurrentCount,
                true
            );
        } else {
            onSimulateRace([Number(selectedId)], concurrentCount, false);
        }
    }

    return (
        <div className="space-y-6">
            {/* 1. Concurrency & Deadlock Stress-Test Simulator Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-base font-bold text-white mb-1">
                    Concurrency &amp; Deadlock Stress-Tester
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                    Test single-seat flash-sale stampedes or reverse-order multi-seat deadlock prevention.
                </p>

                <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
                    <button
                        type="button"
                        onClick={() => setTestMode('SINGLE')}
                        className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            testMode === 'SINGLE'
                                ? 'bg-amber-500 text-slate-950'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        🎯 Single-Seat Race
                    </button>
                    <button
                        type="button"
                        onClick={() => setTestMode('DEADLOCK_PAIR')}
                        className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            testMode === 'DEADLOCK_PAIR'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        🔀 Deadlock Pair Test (A,B vs B,A)
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            {testMode === 'DEADLOCK_PAIR'
                                ? 'Primary Target Seat (Auto-paired with next free seat):'
                                : 'Target Available Seat:'}
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
                        {testMode === 'DEADLOCK_PAIR' && secondSeat && (
                            <p className="text-[11px] text-indigo-300 mt-1">
                                🔀 25 requests lock{' '}
                                <strong>
                                    ({availableSeats.find((s) => s.show_seat_id === Number(selectedId))?.seat_code},{' '}
                                    {secondSeat.seat_code})
                                </strong>{' '}
                                &amp; 25 lock{' '}
                                <strong>
                                    ({secondSeat.seat_code},{' '}
                                    {availableSeats.find((s) => s.show_seat_id === Number(selectedId))?.seat_code})
                                </strong>{' '}
                                simultaneously!
                            </p>
                        )}
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
                        onClick={handleFireTest}
                        disabled={!selectedId}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition ${
                            !selectedId
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : testMode === 'DEADLOCK_PAIR'
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 cursor-pointer'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                        }`}
                    >
                        {testMode === 'DEADLOCK_PAIR'
                            ? '🔀 Fire Reverse-Order Deadlock Attack'
                            : '⚡ Fire Simultaneous Requests'}
                    </button>
                </div>

                {/* 2. Latest Simulation Scoreboard */}
                {simulationResult && (
                    <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                Latest Result ({simulationResult.lockModeUsed})
                            </h4>
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                🛡️ 0 Deadlocks
                            </span>
                        </div>
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

                {/* 3. Pessimistic vs. Optimistic Benchmark Comparison Table */}
                {benchmarkHistory.length > 0 && (
                    <div className="mt-4 border-t border-slate-800 pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white">
                                📊 Locking Strategy Benchmark Comparison
                            </span>
                            <button
                                onClick={() => setBenchmarkHistory([])}
                                className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-slate-800">
                            <table className="w-full text-left text-[11px] text-slate-300">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-[9px]">
                                    <tr>
                                        <th className="px-2 py-1.5">Run</th>
                                        <th className="px-2 py-1.5">Strategy</th>
                                        <th className="px-2 py-1.5">Users</th>
                                        <th className="px-2 py-1.5">Won</th>
                                        <th className="px-2 py-1.5">409 Blocked</th>
                                        <th className="px-2 py-1.5">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/80">
                                    {benchmarkHistory.map((item) => (
                                        <tr key={item.runId} className="bg-slate-950/40">
                                            <td className="px-2 py-1.5 font-mono text-slate-500">
                                                #{item.runId}
                                            </td>
                                            <td className="px-2 py-1.5 font-bold text-amber-300">
                                                {item.lockModeUsed}
                                            </td>
                                            <td className="px-2 py-1.5">
                                                {item.totalConcurrentRequests}
                                            </td>
                                            <td className="px-2 py-1.5 font-bold text-emerald-400">
                                                {item.succeededCount}
                                            </td>
                                            <td className="px-2 py-1.5 font-bold text-rose-400">
                                                {item.preventedDoubleBookings}
                                            </td>
                                            <td className="px-2 py-1.5 font-mono text-indigo-300">
                                                {item.durationMs}ms
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. MySQL Trigger Audit Logs + CSV Export */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-3">
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
