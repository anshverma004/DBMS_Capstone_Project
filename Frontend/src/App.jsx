import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  SOCKET_URL,
  fetchUsers,
  fetchShows,
  fetchShowDetails,
  holdSeatsApi,
  confirmBookingApi,
  cancelBookingApi,
  simulateRaceApi,
  resetShowApi
} from './services/api';

import Navbar from './components/Navbar';
import ShowSelector from './components/ShowSelector';
import SeatMap from './components/SeatMap';
import ConcurrencyPanel from './components/ConcurrencyPanel';

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [lockMode, setLockMode] = useState('PESSIMISTIC');

  const [shows, setShows] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState(1);

  const [seats, setSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  const [simulationResult, setSimulationResult] = useState(null);
  const [message, setMessage] = useState('');

  // Load users and shows on startup
  async function loadInitialData() {
    try {
      const [usersData, showsData] = await Promise.all([fetchUsers(), fetchShows()]);
      setUsers(usersData);
      setShows(showsData);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  // Load seat map & details for selected show
  async function loadShowData(showId) {
    try {
      const data = await fetchShowDetails(showId);
      setSeats(data.seats || []);
      setBookings(data.bookings || []);
      setAuditLogs(data.auditLogs || []);
      const showsData = await fetchShows();
      setShows(showsData);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    setSelectedSeatIds([]);
    setSimulationResult(null);
    loadShowData(selectedShowId);
  }, [selectedShowId]);

  // Listen for real-time Socket.io updates across browser tabs
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('show_updated', (data) => {
      if (data.show && data.show.show_id === selectedShowId) {
        setSeats(data.seats || []);
        setBookings(data.bookings || []);
        setAuditLogs(data.auditLogs || []);
      }
      fetchShows().then(setShows).catch(() => {});
    });
    return () => socket.disconnect();
  }, [selectedShowId]);

  // Toggle seat selection
  function handleToggleSeat(seatId) {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  }

  // 1. Hold selected seats
  async function handleHoldSeats() {
    try {
      const res = await holdSeatsApi(selectedShowId, {
        userId: selectedUserId,
        seatIds: selectedSeatIds,
        lockMode
      });
      setMessage(res.message);
      setSelectedSeatIds([]);
      await loadShowData(selectedShowId);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  // 2. Confirm booking payment
  async function handleConfirmBooking(bookingId) {
    try {
      const res = await confirmBookingApi(bookingId);
      setMessage(res.message);
      await loadShowData(selectedShowId);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  // 3. Cancel active hold
  async function handleCancelBooking(bookingId) {
    try {
      const res = await cancelBookingApi(bookingId);
      setMessage(res.message);
      await loadShowData(selectedShowId);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  // 4. Simulate 50 concurrent users attacking the same seat
  async function handleSimulateRace(targetSeatId, concurrentUsers) {
    try {
      const res = await simulateRaceApi(selectedShowId, {
        seatIds: [targetSeatId],
        concurrentUsers,
        lockMode
      });
      setSimulationResult(res.summary);
      setMessage(
        `Simulated ${res.summary.totalConcurrentRequests} requests: 1 Winner, ${res.summary.preventedDoubleBookings} Rejected!`
      );
      await loadShowData(selectedShowId);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  // 5. Reset show demo (Calls MySQL Stored Procedure)
  async function handleResetShow() {
    try {
      const res = await resetShowApi(selectedShowId);
      setMessage(res.message);
      setSelectedSeatIds([]);
      setSimulationResult(null);
      await loadShowData(selectedShowId);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  const isError = message.startsWith('Error:');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        users={users}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        lockMode={lockMode}
        setLockMode={setLockMode}
        onResetShow={handleResetShow}
      />

      <main className="max-w-7xl mx-auto px-6 py-6">
        {message && (
          <div
            className={`mb-5 px-4 py-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
              isError
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <span>
              <strong className="uppercase tracking-wider mr-1.5">Status:</strong> {message}
            </span>
            <button
              onClick={() => setMessage('')}
              className="text-slate-400 hover:text-white ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <ShowSelector
          shows={shows}
          selectedShowId={selectedShowId}
          onSelectShow={setSelectedShowId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <SeatMap
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={handleToggleSeat}
              onHoldSeats={handleHoldSeats}
              bookings={bookings}
              onConfirmBooking={handleConfirmBooking}
              onCancelBooking={handleCancelBooking}
            />
          </div>

          <div className="lg:col-span-5">
            <ConcurrencyPanel
              seats={seats}
              auditLogs={auditLogs}
              onSimulateRace={handleSimulateRace}
              simulationResult={simulationResult}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
