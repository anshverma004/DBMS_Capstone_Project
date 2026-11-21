import React, { useState } from 'react';

const SQL_INSPECTOR_TABS = [
    {
        id: 'pessimistic',
        title: '🔒 Pessimistic Locking (FOR UPDATE)',
        badge: 'InnoDB X-Lock',
        description:
            'Acquires an exclusive row-level lock inside a MySQL transaction after sorting seat IDs in ascending order (preventing circular deadlocks).',
        sql: `START TRANSACTION;

-- 1. Sort seatIds in ascending order to prevent circular deadlocks
SELECT show_seat_id, seat_code, price, status, version
FROM show_seats
WHERE show_id = ? AND show_seat_id IN (?)
ORDER BY show_seat_id ASC
FOR UPDATE;

-- 2. Verify all seats are AVAILABLE; else ROLLBACK (All-or-Nothing Atomicity)
UPDATE show_seats
SET status = 'HELD',
    held_by_user_id = ?,
    held_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
    version = version + 1
WHERE show_seat_id IN (?);

COMMIT;`
    },
    {
        id: 'optimistic',
        title: '⚡ Optimistic Concurrency (Version Column)',
        badge: 'Lock-Free Read',
        description:
            'Reads the current version counter without holding row locks, then performs an atomic version-checked UPDATE. If affectedRows = 0, another user won the race.',
        sql: `START TRANSACTION;

-- 1. Read seat status and version without locking
SELECT show_seat_id, seat_code, price, status, version
FROM show_seats
WHERE show_id = ? AND show_seat_id IN (?)
ORDER BY show_seat_id ASC;

-- 2. Atomic conditional update matching exact version
UPDATE show_seats
SET status = 'HELD',
    held_by_user_id = ?,
    held_until = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
    version = version + 1
WHERE show_seat_id = ?
  AND status = 'AVAILABLE'
  AND version = ?;

-- If affectedRows !== 1 -> ROLLBACK & return 409 Conflict
COMMIT;`
    },
    {
        id: 'trigger',
        title: '⚙️ MySQL AFTER UPDATE Trigger',
        badge: 'trg_after_show_seat_update',
        description:
            'Automatically logs every state transition with TIMESTAMP(3) millisecond precision and keeps shows.available_seats synchronized.',
        sql: `CREATE TRIGGER trg_after_show_seat_update
AFTER UPDATE ON show_seats
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status OR OLD.version <> NEW.version THEN
        INSERT INTO seat_audit_logs (
            show_seat_id, show_id, seat_code,
            old_status, new_status, acted_by_user_id,
            old_version, new_version
        ) VALUES (
            NEW.show_seat_id, NEW.show_id, NEW.seat_code,
            OLD.status, NEW.status, NEW.held_by_user_id,
            OLD.version, NEW.version
        );
    END IF;

    IF OLD.status = 'AVAILABLE' AND NEW.status IN ('HELD', 'BOOKED') THEN
        UPDATE shows SET available_seats = available_seats - 1 WHERE show_id = NEW.show_id;
    ELSEIF OLD.status IN ('HELD', 'BOOKED') AND NEW.status = 'AVAILABLE' THEN
        UPDATE shows SET available_seats = available_seats + 1 WHERE show_id = NEW.show_id;
    END IF;
END;`
    },
    {
        id: 'ttl',
        title: '⏳ 5-Minute TTL Auto-Expiry Sweeper',
        badge: 'Self-Healing Inventory',
        description:
            'Runs every 5 seconds in the backend to automatically release expired 5-minute checkout holds back to AVAILABLE.',
        sql: `START TRANSACTION;

UPDATE bookings
SET booking_status = 'EXPIRED'
WHERE booking_status = 'PENDING' AND expires_at < NOW();

UPDATE show_seats
SET status = 'AVAILABLE',
    held_by_user_id = NULL,
    held_until = NULL,
    version = version + 1
WHERE status = 'HELD'
  AND held_until IS NOT NULL
  AND held_until < NOW();

COMMIT;`
    }
];

export default function DbmsAnalyticsPage({
    shows,
    seats,
    bookings,
    auditLogs,
    users,
    currentShow,
    onBackToBooking
}) {
    const [activeSqlTab, setActiveSqlTab] = useState('pessimistic');

    const tiersSummary = ['CLASSIC', 'PRIME', 'RECLINER'].map((tierName) => {
        const tierSeats = seats.filter((s) => s.tier === tierName);
        const total = tierSeats.length;
        const available = tierSeats.filter((s) => s.status === 'AVAILABLE').length;
        const held = tierSeats.filter((s) => s.status === 'HELD').length;
        const booked = tierSeats.filter((s) => s.status === 'BOOKED').length;
        const revenue = tierSeats
            .filter((s) => s.status === 'BOOKED')
            .reduce((sum, s) => sum + Number(s.price), 0);

        return { tierName, total, available, held, booked, revenue };
    });

    const selectedSql =
        SQL_INSPECTOR_TABS.find((t) => t.id === activeSqlTab) || SQL_INSPECTOR_TABS[0];

    return (
        <div className="space-y-6 py-2">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        DBMS Capstone Evaluation &amp; Viva Inspector
                    </span>
                    <h1 className="text-2xl font-extrabold text-white mt-0.5">
                        📊 Live DBMS Analytics, 3NF Schema &amp; SQL Inspector
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Inspect live tier occupancy, 3NF normalized table statistics, and the exact
                        MySQL InnoDB concurrency queries powering this system.
                    </p>
                </div>

                <button
                    onClick={onBackToBooking}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer"
                >
                    ← Back to Seat Auditorium
                </button>
            </div>

            {/* 1. TIER-WISE OCCUPANCY & REVENUE BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiersSummary.map((t) => {
                    const soldPct = t.total > 0 ? Math.round((t.booked / t.total) * 100) : 0;
                    const heldPct = t.total > 0 ? Math.round((t.held / t.total) * 100) : 0;

                    return (
                        <div
                            key={t.tierName}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                                    {t.tierName} TIER
                                </span>
                                <span className="text-sm font-extrabold text-emerald-400">
                                    ₹{t.revenue} Revenue
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                                    <span className="text-slate-400 block text-[10px]">Free</span>
                                    <span className="font-bold text-emerald-400">{t.available}</span>
                                </div>
                                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                                    <span className="text-slate-400 block text-[10px]">Held</span>
                                    <span className="font-bold text-amber-400">{t.held}</span>
                                </div>
                                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                                    <span className="text-slate-400 block text-[10px]">Sold</span>
                                    <span className="font-bold text-rose-400">{t.booked}</span>
                                </div>
                            </div>

                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                                <div
                                    className="bg-rose-500 h-full"
                                    style={{ width: `${soldPct}%` }}
                                ></div>
                                <div
                                    className="bg-amber-400 h-full"
                                    style={{ width: `${heldPct}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. INTERACTIVE SQL TRANSACTION & TRIGGER INSPECTOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                    <h2 className="text-base font-bold text-white">
                        🔍 Interactive MySQL Transaction, Trigger &amp; TTL Inspector
                    </h2>
                    <p className="text-xs text-slate-400">
                        Click any tab below to view the exact SQL executed by the backend engine
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {SQL_INSPECTOR_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSqlTab(tab.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                activeSqlTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                            }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">{selectedSql.title}</span>
                        <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                            {selectedSql.badge}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400">{selectedSql.description}</p>
                    <pre className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                        {selectedSql.sql}
                    </pre>
                </div>
            </div>

            {/* 3. 3NF NORMALIZED TABLES LIVE SUMMARY */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-white mb-3">
                    🗄️ 8 Normalized (3NF) MySQL InnoDB Tables — Live Status
                </h2>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                            <tr>
                                <th className="px-4 py-2.5">Table Name</th>
                                <th className="px-4 py-2.5">Normal Form</th>
                                <th className="px-4 py-2.5">Primary Key</th>
                                <th className="px-4 py-2.5">Key Constraints / Indexes</th>
                                <th className="px-4 py-2.5">Live Active Rows</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-white">users</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF</td>
                                <td className="px-4 py-2.5 font-mono">user_id</td>
                                <td className="px-4 py-2.5">UNIQUE (email)</td>
                                <td className="px-4 py-2.5 font-bold">{users.length} users</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-white">movies</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF</td>
                                <td className="px-4 py-2.5 font-mono">movie_id</td>
                                <td className="px-4 py-2.5">CHECK (duration_mins &gt; 0)</td>
                                <td className="px-4 py-2.5 font-bold">3 movies</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-white">screens</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF</td>
                                <td className="px-4 py-2.5 font-mono">screen_id</td>
                                <td className="px-4 py-2.5">UNIQUE (screen_name), CHECK (capacity)</td>
                                <td className="px-4 py-2.5 font-bold">2 screens</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-white">shows</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF</td>
                                <td className="px-4 py-2.5 font-mono">show_id</td>
                                <td className="px-4 py-2.5">FK (movie_id, screen_id), UNIQUE (screen, time)</td>
                                <td className="px-4 py-2.5 font-bold">{shows.length} shows</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-amber-300">show_seats</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF</td>
                                <td className="px-4 py-2.5 font-mono">show_seat_id</td>
                                <td className="px-4 py-2.5">INDEX (show_id, status, held_until), version</td>
                                <td className="px-4 py-2.5 font-bold">{seats.length} seats (this show)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-white">bookings</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF</td>
                                <td className="px-4 py-2.5 font-mono">booking_id</td>
                                <td className="px-4 py-2.5">FK (user_id, show_id), lock_mode, expires_at</td>
                                <td className="px-4 py-2.5 font-bold">{bookings.length} recent orders</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-white">booking_seats</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF (1NF M:N)</td>
                                <td className="px-4 py-2.5 font-mono">booking_seat_id</td>
                                <td className="px-4 py-2.5">UNIQUE (booking_id, show_seat_id)</td>
                                <td className="px-4 py-2.5 font-bold">Junction mapped</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-mono font-bold text-indigo-300">seat_audit_logs</td>
                                <td className="px-4 py-2.5 text-emerald-400 font-bold">3NF</td>
                                <td className="px-4 py-2.5 font-mono">log_id</td>
                                <td className="px-4 py-2.5">Populated via Trigger • TIMESTAMP(3)</td>
                                <td className="px-4 py-2.5 font-bold">{auditLogs.length} audit logs</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
