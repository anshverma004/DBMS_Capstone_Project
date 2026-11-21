import React from 'react';
import { exportAuditLogsToCsv } from '../services/api';
import { computeAnalyticsTelemetry } from '../utils/analyticsMath';
import TelemetryKpiCards from '../components/analytics/TelemetryKpiCards';
import RowWaveformChart from '../components/analytics/RowWaveformChart';
import RadialRadarGauges from '../components/analytics/RadialRadarGauges';
import VenueComparisonBars from '../components/analytics/VenueComparisonBars';

export default function DbmsAnalyticsPage({
    shows,
    seats,
    auditLogs,
    onBackToBooking
}) {
    const telemetry = computeAnalyticsTelemetry(seats, shows);
    const peakSeatVersion = Math.max(1, ...seats.map((s) => Number(s.version || 1)));

    return (
        <div className="space-y-6 py-2">
            {/* TOP HEADER */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                            LIVE VISUAL ANALYTICS &amp; DIGITAL TELEMETRY COCKPIT
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white mt-1">
                        📊 Cinema Box-Office, Concurrency Waveforms &amp; Radar Analytics
                    </h1>
                </div>

                <div className="flex items-center gap-2.5">
                    {auditLogs.length > 0 && (
                        <button
                            onClick={() => exportAuditLogsToCsv(auditLogs)}
                            className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-bold transition cursor-pointer"
                        >
                            📥 Export CSV Report
                        </button>
                    )}
                    <button
                        onClick={onBackToBooking}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer"
                    >
                        ← Back to Seat Auditorium
                    </button>
                </div>
            </div>

            <TelemetryKpiCards
                totalRevenue={telemetry.totalRevenue}
                heldRevenue={telemetry.heldRevenue}
                occupancyRate={telemetry.occupancyRate}
                bookedCount={telemetry.bookedCount}
                heldCount={telemetry.heldCount}
                totalSeats={telemetry.totalSeats}
                auditLogsCount={auditLogs.length}
                peakSeatVersion={peakSeatVersion}
            />

            <RowWaveformChart
                svgWavePoints={telemetry.svgWavePoints}
                versionPolyline={telemetry.versionPolyline}
                versionAreaPath={telemetry.versionAreaPath}
                activePolyline={telemetry.activePolyline}
                activeAreaPath={telemetry.activeAreaPath}
            />

            <RadialRadarGauges
                seats={seats}
                radius={telemetry.radius}
                circumference={telemetry.circumference}
                availArc={telemetry.availArc}
                heldArc={telemetry.heldArc}
                bookedArc={telemetry.bookedArc}
                occupancyRate={telemetry.occupancyRate}
                availableCount={telemetry.availableCount}
                heldCount={telemetry.heldCount}
                bookedCount={telemetry.bookedCount}
                totalRevenue={telemetry.totalRevenue}
                maxCapacityRevenue={telemetry.maxCapacityRevenue}
                tiersSummary={telemetry.tiersSummary}
            />

            <VenueComparisonBars enrichedShows={telemetry.enrichedShows} />
        </div>
    );
}
