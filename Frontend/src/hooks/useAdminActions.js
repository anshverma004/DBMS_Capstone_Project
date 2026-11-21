import {
    fetchShows,
    createMovieShowApi,
    deleteCustomShowApi,
    resetShowApi,
    forceExpireHoldsApi,
    toggleFlashSaleApi,
    simulateCrowdFillApi,
    simulateRaceApi
} from '../services/api';

export function useAdminActions({
    selectedShowId,
    setSelectedShowId,
    setShows,
    setSelectedSeatIds,
    setSimulationResult,
    setSampleResults,
    setMessage,
    lockMode,
    loadShowData
}) {
    async function handleCreateMovieShow(payload) {
        try {
            const res = await createMovieShowApi(payload);
            setMessage(res.message);
            const showsData = await fetchShows();
            setShows(showsData);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleDeleteCustomShow(targetShowId) {
        try {
            const res = await deleteCustomShowApi(targetShowId);
            setMessage(res.message);
            const showsData = await fetchShows();
            setShows(showsData);
            if (Number(selectedShowId) === Number(targetShowId) && showsData.length > 0) {
                setSelectedShowId(showsData[0].show_id);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleForceExpireHolds(targetShowId = selectedShowId) {
        try {
            const res = await forceExpireHoldsApi(targetShowId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleToggleFlashSale(targetShowId) {
        try {
            const res = await toggleFlashSaleApi(targetShowId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleCrowdFill(targetShowId, count = 12) {
        try {
            const res = await simulateCrowdFillApi(targetShowId, count);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleSimulateRace(targetSeatIds, concurrentUsers, reverseOrderDeadlockTest = false) {
        try {
            const seatIdsArray = Array.isArray(targetSeatIds) ? targetSeatIds : [targetSeatIds];
            const res = await simulateRaceApi(selectedShowId, {
                seatIds: seatIdsArray,
                concurrentUsers,
                lockMode,
                reverseOrderDeadlockTest
            });
            setSimulationResult(res.summary);
            setSampleResults(res.sampleResults || []);
            setMessage(
                reverseOrderDeadlockTest
                    ? `Deadlock Attack Completed: 0 Deadlocks, ${res.summary.succeededCount} Group Winner, ${res.summary.preventedDoubleBookings} Rolled Back!`
                    : `Simulated ${res.summary.totalConcurrentRequests} requests: 1 Winner, ${res.summary.preventedDoubleBookings} Rejected!`
            );
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleAutoCompareBothStrategies(seatId1, seatId2, concurrentUsers = 50) {
        try {
            const res1 = await simulateRaceApi(selectedShowId, {
                seatIds: [Number(seatId1)],
                concurrentUsers,
                lockMode: 'PESSIMISTIC',
                reverseOrderDeadlockTest: false
            });
            setSimulationResult(res1.summary);

            const res2 = await simulateRaceApi(selectedShowId, {
                seatIds: [Number(seatId2)],
                concurrentUsers,
                lockMode: 'OPTIMISTIC',
                reverseOrderDeadlockTest: false
            });
            setSimulationResult(res2.summary);
            setSampleResults(res2.sampleResults || []);

            setMessage(
                `⚖️ Dual Benchmark Complete! PESSIMISTIC: ${res1.summary.durationMs}ms (1 Won, ${res1.summary.preventedDoubleBookings} Blocked) vs. OPTIMISTIC: ${res2.summary.durationMs}ms (1 Won, ${res2.summary.preventedDoubleBookings} Blocked)!`
            );
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleResetShow(targetShowId = selectedShowId) {
        try {
            const idToReset = typeof targetShowId === 'number' ? targetShowId : selectedShowId;
            const res = await resetShowApi(idToReset);
            setMessage(res.message);
            setSelectedSeatIds([]);
            setSimulationResult(null);
            setSampleResults([]);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    return {
        handleCreateMovieShow,
        handleDeleteCustomShow,
        handleForceExpireHolds,
        handleToggleFlashSale,
        handleCrowdFill,
        handleSimulateRace,
        handleAutoCompareBothStrategies,
        handleResetShow
    };
}
