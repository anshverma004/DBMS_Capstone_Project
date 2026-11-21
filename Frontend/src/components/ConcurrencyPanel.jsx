import React, { useEffect, useState } from 'react';
import SimulationResultsCard from './concurrency/SimulationResultsCard';
import TriggerAuditTable from './concurrency/TriggerAuditTable';

export default function ConcurrencyPanel({
    seats,
    auditLogs,
    onSimulateRace,
    onAutoCompareBothStrategies,
    simulationResult,
    sampleResults = []
}) {
    const availableSeats = seats.filter((s) => s.status === 'AVAILABLE');
    const [targetSeatId, setTargetSeatId] = useState('');
    const [concurrentCount, setConcurrentCount] = useState(50);
    const [testMode, setTestMode] = useState('SINGLE');
    const [benchmarkHistory, setBenchmarkHistory] = useState([]);
    const [comparingBoth, setComparingBoth] = useState(false);

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

    async function handleDualBenchmark() {
        if (!onAutoCompareBothStrategies || availableSeats.length < 2) return;
        setComparingBoth(true);
        try {
            await onAutoCompareBothStrategies(
                availableSeats[0].show_seat_id,
                availableSeats[1].show_seat_id,
                concurrentCount
            );
        } finally {
            setComparingBoth(false);
        }
    }

    return (
        <div className="space-y-6">
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

                    {onAutoCompareBothStrategies && availableSeats.length >= 2 && (
                        <button
                            type="button"
                            onClick={handleDualBenchmark}
                            disabled={comparingBoth}
                            className="w-full py-2 rounded-lg text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition cursor-pointer"
                        >
                            {comparingBoth
                                ? 'Running Dual Benchmark...'
                                : '⚖️ 1-Click Auto-Compare Pessimistic vs. Optimistic'}
                        </button>
                    )}
                </div>

                <SimulationResultsCard
                    simulationResult={simulationResult}
                    sampleResults={sampleResults}
                    benchmarkHistory={benchmarkHistory}
                    onClearBenchmarkHistory={() => setBenchmarkHistory([])}
                />
            </div>

            <TriggerAuditTable auditLogs={auditLogs} />
        </div>
    );
}
