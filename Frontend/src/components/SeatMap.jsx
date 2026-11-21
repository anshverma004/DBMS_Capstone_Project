import React, { useEffect, useState } from 'react';
import SeatKpiHeader from './seatmap/SeatKpiHeader';
import AuditoriumGrid from './seatmap/AuditoriumGrid';
import SeatSelectionBar from './seatmap/SeatSelectionBar';
import ActiveHoldsList from './seatmap/ActiveHoldsList';

export default function SeatMap({
    seats,
    selectedSeatIds,
    onToggleSeat,
    onSetSelectedSeats,
    onHoldSeats,
    bookings,
    onConfirmBooking,
    onCancelBooking,
    onForceExpireHolds,
    currentShow
}) {
    const [tickOffset, setTickOffset] = useState(0);
    const [tierFilter, setTierFilter] = useState('ALL');
    const [heatmapMode, setHeatmapMode] = useState(false);
    const [watchedSeatIds, setWatchedSeatIds] = useState([]);
    const [watchAlert, setWatchAlert] = useState('');

    useEffect(() => {
        setTickOffset(0);
    }, [seats, bookings]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTickOffset((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (watchedSeatIds.length === 0 || !onSetSelectedSeats) return;
        const newlyFreed = seats.filter(
            (s) => watchedSeatIds.includes(s.show_seat_id) && s.status === 'AVAILABLE'
        );
        if (newlyFreed.length > 0) {
            const freedIds = newlyFreed.map((s) => s.show_seat_id);
            const freedCodes = newlyFreed.map((s) => s.seat_code).join(', ');
            onSetSelectedSeats((prev) => [...new Set([...prev, ...freedIds])]);
            setWatchedSeatIds((prev) => prev.filter((id) => !freedIds.includes(id)));
            setWatchAlert(
                `🔔 Watched Seat (${freedCodes}) just expired and was automatically selected for you!`
            );
        }
    }, [seats, watchedSeatIds, onSetSelectedSeats]);

    const pendingBookings = bookings.filter((b) => b.booking_status === 'PENDING');
    const confirmedBookings = bookings.filter((b) => b.booking_status === 'CONFIRMED');

    const availableCount = seats.filter((s) => s.status === 'AVAILABLE').length;
    const heldCount = seats.filter((s) => s.status === 'HELD').length;
    const bookedCount = seats.filter((s) => s.status === 'BOOKED').length;
    const totalRevenue = seats
        .filter((s) => s.status === 'BOOKED')
        .reduce((sum, s) => sum + Number(s.price), 0);

    const selectedSeatObjects = seats.filter((s) =>
        selectedSeatIds.includes(s.show_seat_id)
    );
    const selectedSubtotal = selectedSeatObjects.reduce(
        (sum, s) => sum + Number(s.price),
        0
    );

    function toggleWatchHeldSeat(seatId) {
        setWatchedSeatIds((prev) =>
            prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
        );
    }

    function handleSmartPreset(count, targetRows = ['C', 'D', 'E', 'F', 'B', 'A']) {
        if (!onSetSelectedSeats) return;

        const rowsMap = {};
        for (const s of seats) {
            if (!rowsMap[s.row_label]) rowsMap[s.row_label] = [];
            rowsMap[s.row_label].push(s);
        }

        for (const rLabel of targetRows) {
            const rowSeats = (rowsMap[rLabel] || []).sort(
                (a, b) => a.seat_number - b.seat_number
            );
            if (rowSeats.length === 0) continue;

            const blocks = [
                rowSeats.filter((s) => s.seat_number <= 5),
                rowSeats.filter((s) => s.seat_number > 5)
            ];

            for (const block of blocks) {
                for (let i = 0; i <= block.length - count; i++) {
                    const slice = block.slice(i, i + count);
                    if (slice.every((s) => s.status === 'AVAILABLE')) {
                        onSetSelectedSeats(slice.map((s) => s.show_seat_id));
                        return;
                    }
                }
            }
        }
    }

    return (
        <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <SeatKpiHeader
                    availableCount={availableCount}
                    heldCount={heldCount}
                    bookedCount={bookedCount}
                    totalRevenue={totalRevenue}
                    currentShow={currentShow}
                    selectedSeatIds={selectedSeatIds}
                    onSetSelectedSeats={onSetSelectedSeats}
                    onSmartPreset={handleSmartPreset}
                    tierFilter={tierFilter}
                    setTierFilter={setTierFilter}
                    heatmapMode={heatmapMode}
                    setHeatmapMode={setHeatmapMode}
                    watchAlert={watchAlert}
                    setWatchAlert={setWatchAlert}
                />

                <AuditoriumGrid
                    seats={seats}
                    selectedSeatIds={selectedSeatIds}
                    watchedSeatIds={watchedSeatIds}
                    tickOffset={tickOffset}
                    tierFilter={tierFilter}
                    heatmapMode={heatmapMode}
                    currentShow={currentShow}
                    onToggleSeat={onToggleSeat}
                    onToggleWatchHeldSeat={toggleWatchHeldSeat}
                />

                <SeatSelectionBar
                    selectedSeatObjects={selectedSeatObjects}
                    selectedSubtotal={selectedSubtotal}
                    selectedSeatIds={selectedSeatIds}
                    onHoldSeats={onHoldSeats}
                />

                <ActiveHoldsList
                    pendingBookings={pendingBookings}
                    confirmedBookings={confirmedBookings}
                    heldCount={heldCount}
                    tickOffset={tickOffset}
                    onForceExpireHolds={onForceExpireHolds}
                    onConfirmBooking={onConfirmBooking}
                    onCancelBooking={onCancelBooking}
                />
            </div>
        </div>
    );
}
