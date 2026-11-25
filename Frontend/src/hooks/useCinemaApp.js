import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
    getActiveSocketUrl,
    fetchUsers,
    fetchShows,
    fetchShowDetails,
    holdSeatsApi,
    confirmBookingApi,
    cancelBookingApi
} from '../services/api';
import { enrichShow } from '../constants/theaterData';
import { useAuthSession } from './useAuthSession';
import { useAdminActions } from './useAdminActions';

export function useCinemaApp() {
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedCity, setSelectedCity] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTheaterVenue, setSelectedTheaterVenue] = useState(null);

    const [users, setUsers] = useState([]);
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
    const [backendReady, setBackendReady] = useState(false);

    const selectedShowIdRef = useRef(selectedShowId);
    selectedShowIdRef.current = selectedShowId;

    const auth = useAuthSession({
        setUsers,
        setSelectedSeatIds,
        setMessage
    });

    async function loadInitialData() {
        try {
            const [showsData, usersData] = await Promise.all([
                fetchShows(),
                fetchUsers().catch(() => [])
            ]);
            setShows(showsData);
            if (Array.isArray(usersData) && usersData.length > 0) {
                setUsers(usersData);
            }
            setBackendReady(true);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function loadShowData(showId) {
        try {
            const data = await fetchShowDetails(showId);
            setSeats(data.seats || []);
            setBookings(data.bookings || []);
            setAuditLogs(data.auditLogs || []);
            if (data.show) {
                setShows((prev) =>
                    prev.map((s) =>
                        Number(s.show_id) === Number(data.show.show_id) ? data.show : s
                    )
                );
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    const adminActions = useAdminActions({
        selectedShowId,
        setSelectedShowId,
        setShows,
        setSelectedSeatIds,
        setSimulationResult,
        setSampleResults,
        setMessage,
        lockMode,
        loadShowData
    });

    useEffect(() => {
        if (!auth.loggedInUser) {
            setBackendReady(false);
            return;
        }
        loadInitialData();
    }, [auth.loggedInUser]);

    useEffect(() => {
        if (!auth.loggedInUser) return;
        setSelectedSeatIds([]);
        setSimulationResult(null);
        setSampleResults([]);
        loadShowData(selectedShowId);
    }, [auth.loggedInUser, selectedShowId]);

    useEffect(() => {
        if (!auth.loggedInUser || !backendReady) return;
        const socketUrl = getActiveSocketUrl();
        if (!socketUrl) return;
        const socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 2,
            reconnectionDelay: 5000,
            timeout: 10000
        });
        socket.on('show_updated', (data) => {
            if (data.show && data.show.show_id === selectedShowIdRef.current) {
                setSeats(data.seats || []);
                setBookings(data.bookings || []);
                setAuditLogs(data.auditLogs || []);
            }
        });
        socket.on('users_updated', (updatedUsers) => {
            if (Array.isArray(updatedUsers)) {
                setUsers(updatedUsers);
            }
        });
        return () => socket.disconnect();
    }, [auth.loggedInUser, backendReady]);

    function handleSelectTheaterShow(showId, timeSlotLabel = '', venueObj = null) {
        setSelectedShowId(Number(showId));
        setSelectedTimeSlot(timeSlotLabel);
        setSelectedTheaterVenue(venueObj);
        auth.setCurrentPage('booking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleToggleSeat(seatId) {
        setSelectedSeatIds((prev) =>
            prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
        );
    }

    async function handleHoldSeats() {
        try {
            const res = await holdSeatsApi(selectedShowId, {
                userId: auth.selectedUserId,
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

    function handleRequestConfirmPayment(bookingId) {
        const found = bookings.find((b) => Number(b.booking_id) === Number(bookingId));
        if (found) {
            setPaymentModalBooking(found);
        } else {
            handleExecuteConfirmBooking(bookingId);
        }
    }

    async function handleExecuteConfirmBooking(bookingId) {
        try {
            const res = await confirmBookingApi(bookingId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function handleCancelBooking(bookingId) {
        try {
            const res = await cancelBookingApi(bookingId);
            setMessage(res.message);
            await loadShowData(selectedShowId);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    const baseShow = enrichShow(
        shows.find((s) => Number(s.show_id) === Number(selectedShowId)),
        0
    );
    const currentShowObj =
        baseShow &&
        selectedTheaterVenue &&
        Number(selectedTheaterVenue.show_id) === Number(baseShow.show_id)
            ? {
                  ...baseShow,
                  city: selectedTheaterVenue.city || baseShow.city,
                  theaterName: selectedTheaterVenue.theaterName || baseShow.theaterName,
                  mallAddress: selectedTheaterVenue.mallAddress || baseShow.mallAddress,
                  format: selectedTheaterVenue.format || baseShow.format,
                  venuePhotoUrl: selectedTheaterVenue.venuePhotoUrl || baseShow.venuePhotoUrl
              }
            : baseShow;

    const myBookingsCount = bookings.filter(
        (b) =>
            Number(b.user_id) === Number(auth.selectedUserId) &&
            (b.booking_status === 'PENDING' || b.booking_status === 'CONFIRMED')
    ).length;

    return {
        ...auth,
        ...adminActions,
        selectedTimeSlot,
        selectedCity,
        setSelectedCity,
        searchQuery,
        setSearchQuery,
        users,
        lockMode,
        setLockMode,
        shows,
        selectedShowId,
        seats,
        bookings,
        auditLogs,
        selectedSeatIds,
        setSelectedSeatIds,
        simulationResult,
        sampleResults,
        message,
        setMessage,
        paymentModalBooking,
        setPaymentModalBooking,
        currentShowObj,
        myBookingsCount,
        handleSelectTheaterShow,
        handleToggleSeat,
        handleHoldSeats,
        handleRequestConfirmPayment,
        handleExecuteConfirmBooking,
        handleCancelBooking
    };
}
