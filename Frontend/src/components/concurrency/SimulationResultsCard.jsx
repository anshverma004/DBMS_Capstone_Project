import React from 'react';

export default function SimulationResultsCard({
    simulationResult,
    sampleResults = [],
    benchmarkHistory = [],
    onClearBenchmarkHistory
}) {
    if (!simulationResult && benchmarkHistory.length === 0) return null;

    return (
        <>
            {simulationResult && (
                <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
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
                            <span className="text-emerald-300 block text-[11px]">
                                Succeeded (Winner)
                            </span>
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

                    {sampleResults.length > 0 && (
                        <div className="pt-2 border-t border-slate-800">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                🧵 Per-Thread Race Execution Feed (Sample 15 Threads)
                            </span>
                            <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px] font-mono">
                                {sampleResults.map((r) => (
                                    <div
                                        key={r.requestNumber}
                                        className={`px-2.5 py-1 rounded flex items-center justify-between gap-2 ${
                                            r.status === 'SUCCESS'
                                                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold'
                                                : 'bg-slate-900/90 text-slate-400'
                                        }`}
                                    >
                                        <span>
                                            Req #{r.requestNumber} ({r.user})
                                        </span>
                                        <span>
                                            {r.status === 'SUCCESS'
                                                ? `✅ WON (Booking #${r.bookingId})`
                                                : `❌ 409 (${r.reason || 'Locked'})`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {benchmarkHistory.length > 0 && (
                <div className="mt-4 border-t border-slate-800 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">
                            📊 Locking Strategy Benchmark Comparison
                        </span>
                        <button
                            onClick={onClearBenchmarkHistory}
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
        </>
    );
}
