import React from 'react';
import { useCinemaApp } from './hooks/useCinemaApp';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import TheaterSearchPage from './pages/TheaterSearchPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import DbmsAnalyticsPage from './pages/DbmsAnalyticsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
    const {
        loggedInUser,
        isAdmin,
        currentPage,
        setCurrentPage,
        prefilledEmail,
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
        handleSignupSubmit,
        handleLoginSubmit,
        handleLogout,
        handleSelectTheaterShow,
        handleToggleSeat,
        handleHoldSeats,
        handleRequestConfirmPayment,
        handleExecuteConfirmBooking,
        handleCancelBooking,
        handleCreateMovieShow,
        handleDeleteCustomShow,
        handleForceExpireHolds,
        handleToggleFlashSale,
        handleCrowdFill,
        handleSimulateRace,
        handleAutoCompareBothStrategies,
        handleResetShow
    } = useCinemaApp();

    const isError = message.startsWith('Error:');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
            <div>
                <Navbar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    loggedInUser={loggedInUser}
                    isAdmin={isAdmin}
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
                                <strong className="uppercase tracking-wider mr-1.5">
                                    Status:
                                </strong>{' '}
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

                    {currentPage === 'signup' && (
                        <SignupPage
                            onSignupSubmit={handleSignupSubmit}
                            onGoToLogin={() => {
                                setMessage('');
                                setCurrentPage('login');
                            }}
                        />
                    )}

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
                            onForceExpireHolds={
                                isAdmin ? () => handleForceExpireHolds(selectedShowId) : null
                            }
                            auditLogs={auditLogs}
                            onSimulateRace={handleSimulateRace}
                            onAutoCompareBothStrategies={handleAutoCompareBothStrategies}
                            simulationResult={simulationResult}
                            sampleResults={sampleResults}
                            onBackToTheaters={() => setCurrentPage('theaters')}
                            onGoToMyBookings={() => setCurrentPage('mybookings')}
                        />
                    )}

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

                    {currentPage === 'analytics' && isAdmin && (
                        <DbmsAnalyticsPage
                            shows={shows}
                            seats={seats}
                            bookings={bookings}
                            auditLogs={auditLogs}
                            users={users}
                            onBackToBooking={() => setCurrentPage('booking')}
                        />
                    )}

                    {currentPage === 'admin' && isAdmin && (
                        <AdminPage
                            shows={shows}
                            onCreateMovieShow={handleCreateMovieShow}
                            onDeleteCustomShow={handleDeleteCustomShow}
                            onToggleFlashSale={handleToggleFlashSale}
                            onCrowdFill={handleCrowdFill}
                            onForceExpire={handleForceExpireHolds}
                            onResetShowById={handleResetShow}
                            onOpenShowInHall={(id) => handleSelectTheaterShow(id)}
                        />
                    )}
                </main>
            </div>

            <Footer
                loggedInUser={loggedInUser}
                isAdmin={isAdmin}
                setCurrentPage={setCurrentPage}
            />

            <PaymentModal
                booking={paymentModalBooking}
                currentShow={currentShowObj}
                onClose={() => setPaymentModalBooking(null)}
                onConfirmPayment={handleExecuteConfirmBooking}
            />
        </div>
    );
}
