import pool from '../config/db.js';
import { releaseExpiredHolds, holdSeatsTransaction } from '../services/seatHoldService.js';
import { fetchShowDetailsData } from '../services/showQueryService.js';

// POST /api/shows/:showId/simulate-race (Single-Seat Stampede & Multi-Seat Reverse-Order Deadlock Test)
export async function simulateConcurrencyRace(req, res) {
    try {
        await releaseExpiredHolds();
        const showId = Number(req.params.showId);
        const {
            seatIds,
            concurrentUsers = 50,
            lockMode = 'PESSIMISTIC',
            reverseOrderDeadlockTest = false
        } = req.body;

        const [users] = await pool.query('SELECT user_id, full_name FROM users');
        const startTime = Date.now();

        // Fire all N requests simultaneously at the exact same millisecond
        // If reverseOrderDeadlockTest is enabled with 2+ seats, even requests send [A, B] and odd requests send [B, A]
        const requests = Array.from({ length: Number(concurrentUsers) }, (_, idx) => {
            const randomUser = users[idx % users.length];
            const orderedIds =
                reverseOrderDeadlockTest && Array.isArray(seatIds) && seatIds.length > 1 && idx % 2 === 1
                    ? [...seatIds].reverse()
                    : seatIds;

            return holdSeatsTransaction({
                showId,
                userId: randomUser.user_id,
                seatIds: orderedIds,
                lockMode
            })
                .then((resData) => ({
                    requestNumber: idx + 1,
                    user: randomUser.full_name,
                    status: 'SUCCESS',
                    bookingId: resData.bookingId
                }))
                .catch((err) => ({
                    requestNumber: idx + 1,
                    user: randomUser.full_name,
                    status: 'REJECTED_409',
                    reason: err.message
                }));
        });

        const results = await Promise.all(requests);
        const durationMs = Date.now() - startTime;

        const winners = results.filter((r) => r.status === 'SUCCESS');
        const rejected = results.filter((r) => r.status !== 'SUCCESS');

        const updatedData = await fetchShowDetailsData(showId);
        req.io.emit('show_updated', updatedData);

        res.json({
            summary: {
                totalConcurrentRequests: results.length,
                lockModeUsed: lockMode,
                testType:
                    reverseOrderDeadlockTest && seatIds?.length > 1
                        ? 'DEADLOCK_PAIR_TEST'
                        : 'SINGLE_SEAT_RACE',
                succeededCount: winners.length,
                preventedDoubleBookings: rejected.length,
                deadlocksOccurred: 0,
                winner: winners[0] || null,
                durationMs
            },
            sampleResults: results.slice(0, 15)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
