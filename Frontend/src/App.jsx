import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
    SOCKET_URL,
    fetchUsers,
    fetchShows,
    fetchShowDetails,
    signupUserApi,
    loginUserApi,
    holdSeatsApi,
    confirmBookingApi,
    cancelBookingApi,
    simulateRaceApi,
    createMovieShowApi,
    resetShowApi,
    forceExpireHoldsApi,
    toggleFlashSaleApi,
    simulateCrowdFillApi
} from './services/api';
import { enrichShow } from './constants/theaterData';

import Navbar from './components/Navbar';
import PaymentModal from './components/PaymentModal';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import TheaterSearchPage from './pages/TheaterSearchPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import DbmsAnalyticsPage from './pages/DbmsAnalyticsPage';
import AdminPage from './pages/AdminPage';

const SESSION_USER_KEY = 'bms_active_user';
const SESSION_PAGE_KEY = 'bms_active_page';

export default function App() {
    const [loggedInUser, setLoggedInUser] = useState(() => {
        try {
            const saved = localStorage.getItem(SESSION_USER_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [currentPage, setCurrentPage] = useState(() => {
        try {
            const savedUser = localStorage.getItem(SESSION_USER_KEY);
            const savedPage = localStorage.getItem(SESSION_PAGE_KEY);
            return savedUser && savedPage ? savedPage : 'landing';
        } catch {
            return 'landing';
        }
    });

    const [prefilledEmail, setPrefilledEmail] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    // Theater search state
    const [selectedCity, setSelectedCity] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Database & booking state
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(SESSION_USER_KEY) || 'null');
            return saved?.user_id ? Number(saved.user_id) : 1;
        } catch {
            return 1;
        }
    });
    const [lockMode, setLockMode] = useState('PESSIMISTIC');

    const [shows, setShows] = useState([]);
    const [selectedShowId, setSelectedShowId] = useState(1);

    const [seats, setSeats] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);

    const [simulationResult, setSimulationResult] = useState(null);
    const [sampleResults, setSampleResults] = useState([]);
    const [message, setMessage] = useState('');
    const [paymentModalBooking, setPaymentModalBooking] = useState(null);

    // Sync session to localStorage so page refresh keeps user logged in
    useEffect(() => {
        try {
            if (loggedInUser) {
                localStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedInUser));
            } else {
                localStorage.removeItem(SESSION_USER_KEY);
            }
            localStorage.setItem(SESSION_PAGE_KEY, currentPage);
        } catch {
            // ignore storage errors
        }
    }, [loggedInUser, currentPage]);

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
        setSampleResults([]);
        loadShowData(selectedShowId);
    }, [selectedShowId]);

    // Real-time Socket.io updates across browser tabs
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
        socket.on('users_updated', (updatedUsers) => {
            if (Array.isArray(updatedUsers)) {
                setUsers(updatedUsers);
            }
        });
        return () => socket.disconnect();
    }, [selectedShowId]);

    // Step 1: Sign Up -> Redirects to Login Page
    async function handleSignupSubmit({ fullName, email }) {
        const res = await signupUserApi({ fullName, email });
        if (res.users) {
            setUsers(res.users);
        } else {
            const freshUsers = await fetchUsers();
            setUsers(freshUsers);
        }
        setPrefilledEmail(email);
        setMessage('Account created successfully! Please log in below.');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step 2: Log In -> Redirects to Search Theaters in Cities Page
    async function handleLoginSubmit({ email }) {
        const res = await loginUserApi({ email });
        if (res.user) {
            setLoggedInUser(res.user);
            setSelectedUserId(Number(res.user.user_id));
        }
        setMessage(`Welcome, ${res.user?.full_name || email}! Select a theater below to view seats.`);
        setCurrentPage('theaters');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Log Out -> Returns to Landing Page
    function handleLogout() {
        setLoggedInUser(null);
        setPrefilledEmail('');
        setSelectedSeatIds([]);
        setMessage('You have logged out.');
        setCurrentPage('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step 3: Click on a Theater / Showtime -> Opens the Seat Selection & Booking Page
    function handleSelectTheaterShow(showId, timeSlotLabel = '') {
        setSelectedShowId(Number(showId));
        setSelectedTimeSlot(timeSlotLabel);
        setCurrentPage('booking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Toggle seat selection
    function handleToggleSeat(seatId) {
        setSelectedSeatIds((prev) =>
            prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
        );
    }

    // Hold selected seats
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

    // Open Payment Gateway Modal when clicking "Confirm Payment" on a pending hold
    function handleRequestConfirmPayment(bookingId) {
        const found = bookings.find((b) => Number(b.booking_id) === Number(bookingId));
        if (found) {
            setPaymentModalBooking(found);
        } else {
            handleExecuteConfirmBooking(bookingId);
        }
    }

    // Execute MySQL Payment Confirmation
    async function handleExecuteConfirmBooking(bookingId) {
        try {
            const res = await confirmBookingApi(bookingId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    // Cancel active hold or refund confirmed ticket
    async function handleCancelBooking(bookingId) {
        try {
            const res = await cancelBookingApi(bookingId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    // Create New Movie & Showtime (Calls Stored Procedure sp_generate_show_seats)
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

    // Fast-forward 5-minute TTL timer for instant viva demo
    async function handleForceExpireHolds(targetShowId = selectedShowId) {
        try {
            const res = await forceExpireHoldsApi(targetShowId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    // Toggle Flash-Sale Mode in MySQL
    async function handleToggleFlashSale(targetShowId) {
        try {
            const res = await toggleFlashSaleApi(targetShowId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    // Simulate Theater Crowd Fill in MySQL
    async function handleCrowdFill(targetShowId, count = 12) {
        try {
            const res = await simulateCrowdFillApi(targetShowId, count);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    // Simulate 50 concurrent users (Single-Seat Stampede or Reverse-Order Deadlock Pair Test)
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

    // Reset show demo (Calls MySQL Stored Procedure)
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

    const isError = message.startsWith('Error:');
    const currentShowObj = enrichShow(
        shows.find((s) => Number(s.show_id) === Number(selectedShowId)),
        0
    );
    const myBookingsCount = bookings.filter(
        (b) =>
            Number(b.user_id) === Number(selectedUserId) &&
            (b.booking_status === 'PENDING' || b.booking_status === 'CONFIRMED')
    ).length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                loggedInUser={loggedInUser}
                onLogout={handleLogout}
                lockMode={lockMode}
                setLockMode={setLockMode}
                onResetShow={() => handleResetShow(selectedShowId)}
                myBookingsCount={myBookingsCount}
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
                            <strong className="uppercase tracking-wider mr-1.5">Status:</strong>{' '}
                            {message}
                        </span>
                        <button
                            onClick={() => setMessage('')}
                            className="text-slate-400 hover:text-white ml-4 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* PAGE 1: PUBLIC LANDING PAGE */}
                {currentPage === 'landing' && (
                    <LandingPage
                        loggedInUser={loggedInUser}
                        onGoToLogin={() => {
                            setMessage('');
                            setCurrentPage('login');
                        }}
                        onGoToSignup={() => {
                            setMessage('');
                            setCurrentPage('signup');
                        }}
                        onGoToTheaters={() => {
                            setMessage('');
                            setCurrentPage('theaters');
                        }}
                    />
                )}

                {/* PAGE 2: SEPARATE SIGN UP PAGE */}
                {currentPage === 'signup' && (
                    <SignupPage
                        onSignupSubmit={handleSignupSubmit}
                        onGoToLogin={() => {
                            setMessage('');
                            setCurrentPage('login');
                        }}
                    />
                )}

                {/* PAGE 3: SEPARATE LOG IN PAGE */}
                {currentPage === 'login' && (
                    <LoginPage
                        prefilledEmail={prefilledEmail}
                        onLoginSubmit={handleLoginSubmit}
                        onGoToSignup={() => {
                            setMessage('');
                            setCurrentPage('signup');
                        }}
                    />
                )}

                {/* PAGE 4: SEPARATE SEARCH THEATERS IN CITIES & LIST OF THEATERS PAGE */}
                {currentPage === 'theaters' && (
                    <TheaterSearchPage
                        shows={shows}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSelectTheaterShow={handleSelectTheaterShow}
                    />
                )}

                {/* PAGE 5: SEPARATE SEAT SELECTION & BOOKING PAGE */}
                {currentPage === 'booking' && (
                    <BookingPage
                        currentShow={currentShowObj}
                        selectedTimeSlot={selectedTimeSlot}
                        seats={seats}
                        selectedSeatIds={selectedSeatIds}
                        onToggleSeat={handleToggleSeat}
                        onSetSelectedSeats={setSelectedSeatIds}
                        onHoldSeats={handleHoldSeats}
                        bookings={bookings}
                        onConfirmBooking={handleRequestConfirmPayment}
                        onCancelBooking={handleCancelBooking}
                        onForceExpireHolds={() => handleForceExpireHolds(selectedShowId)}
                        auditLogs={auditLogs}
                        onSimulateRace={handleSimulateRace}
                        simulationResult={simulationResult}
                        sampleResults={sampleResults}
                        onBackToTheaters={() => setCurrentPage('theaters')}
                        onGoToMyBookings={() => setCurrentPage('mybookings')}
                    />
                )}

                {/* PAGE 6: DEDICATED MY BOOKINGS & PRINTABLE M-TICKETS PAGE */}
                {currentPage === 'mybookings' && (
                    <MyBookingsPage
                        loggedInUser={loggedInUser}
                        bookings={bookings}
                        currentShow={currentShowObj}
                        onOpenPaymentModal={(b) => setPaymentModalBooking(b)}
                        onCancelBooking={handleCancelBooking}
                        onBackToTheaters={() => setCurrentPage('theaters')}
                    />
                )}

                {/* PAGE 7: DEDICATED DBMS LIVE ANALYTICS & SQL INSPECTOR PAGE */}
                {currentPage === 'analytics' && (
                    <DbmsAnalyticsPage
                        shows={shows}
                        seats={seats}
                        bookings={bookings}
                        auditLogs={auditLogs}
                        users={users}
                        onBackToBooking={() => setCurrentPage('booking')}
                    />
                )}

                {/* PAGE 8: DEDICATED CINEMA ADMIN & FLASH-SALE CONTROL CENTER */}
                {currentPage === 'admin' && (
                    <AdminPage
                        shows={shows}
                        onCreateMovieShow={handleCreateMovieShow}
                        onToggleFlashSale={handleToggleFlashSale}
                        onCrowdFill={handleCrowdFill}
                        onForceExpire={handleForceExpireHolds}
                        onResetShowById={handleResetShow}
                        onOpenShowInHall={(id) => handleSelectTheaterShow(id)}
                    />
                )}
            </main>

            {/* UPI / Card / Instant Payment Checkout Modal */}
            <PaymentModal
                booking={paymentModalBooking}
                currentShow={currentShowObj}
                onClose={() => setPaymentModalBooking(null)}
                onConfirmPayment={handleExecuteConfirmBooking}
            />
        </div>
    );
}
