export function buildGateQrPayload(booking, currentShow) {
    if (!booking) return '';
    const ticketNo = `CP-${1000 + Number(booking.booking_id)}`;
    return JSON.stringify({
        issuer: 'CINEPULSE_CINEMA',
        ticket: ticketNo,
        bookingId: Number(booking.booking_id),
        showId: Number(booking.show_id),
        movie: currentShow?.movie_title || 'Cinema Premiere',
        theater: currentShow?.theaterName || 'CinePulse Multiplex',
        screen: currentShow?.screen_name || 'Screen 1',
        seats: booking.seats_list,
        amountINR: Number(booking.total_amount),
        lockMode: booking.lock_mode || 'PESSIMISTIC',
        holder: booking.user_name || 'Guest',
        status: booking.booking_status || 'CONFIRMED'
    });
}

export function buildUpiQrPayload({ upiId, amount, bookingId }) {
    const pa = encodeURIComponent(String(upiId || 'cinepulse@icici').trim());
    const pn = encodeURIComponent('CinePulse Cinemas');
    const am = Math.max(1, Number(amount) || 0).toFixed(2);
    const tn = encodeURIComponent(`Ticket CP-${1000 + Number(bookingId || 0)}`);
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}
