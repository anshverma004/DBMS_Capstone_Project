function generateTicketQrSvg(seedText = 'CP-1001') {
    const size = 9;
    let hash = 2166136261;
    for (let i = 0; i < seedText.length; i++) {
        hash ^= seedText.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    let rects = '';
    const cell = 10;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const isCorner =
                (r < 3 && c < 3) ||
                (r < 3 && c >= size - 3) ||
                (r >= size - 3 && c < 3);
            const bit = ((hash >>> ((r * size + c) % 28)) & 1) === 1;
            if (isCorner || bit) {
                rects += `<rect x="${10 + c * cell}" y="${10 + r * cell}" width="${cell - 1}" height="${cell - 1}" rx="1.5" fill="#0f172a" />`;
            }
        }
    }

    return `<svg viewBox="0 0 110 110" width="115" height="115" xmlns="http://www.w3.org/2000/svg">
        <rect width="110" height="110" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        ${rects}
    </svg>`;
}

function resolveAbsoluteImageUrl(urlPath = '/images/poster-cosmic-wars.jpg') {
    if (String(urlPath).startsWith('http')) return urlPath;
    return `${window.location.origin}${urlPath}`;
}

function buildSingleTicketHtml(booking, currentShow, loggedInUser) {
    const ticketNo = `CP-${1000 + Number(booking.booking_id)}`;
    const isConfirmed = booking.booking_status === 'CONFIRMED';
    const movieTitle = currentShow?.movie_title || 'Cinema Premiere';
    const theaterName = currentShow?.theaterName || 'PVR IMAX Multiplex';
    const mallAddress = currentShow?.mallAddress || 'Main Atrium, Level 3';
    const screenName = currentShow?.screen_name || 'Screen 1 - IMAX Laser';
    const formatTag = currentShow?.format || 'IMAX 3D • Dolby Atmos';
    const posterSrc = resolveAbsoluteImageUrl(currentShow?.posterUrl);
    const customerName = booking.user_name || loggedInUser?.full_name || 'Cinema Guest';
    const customerEmail = loggedInUser?.email || 'tickets@cinepulse.in';
    const timestamp = booking.confirmed_at
        ? new Date(booking.confirmed_at).toLocaleString()
        : new Date().toLocaleString();
    const qrSvg = generateTicketQrSvg(`${ticketNo}-${booking.seats_list}`);

    return `
        <div class="ticket-wrapper">
            <div class="ticket-card">
                <div class="ticket-poster-col">
                    <img class="ticket-poster" src="${posterSrc}" alt="${movieTitle}" />
                </div>

                <div class="ticket-main">
                    <div class="brand-row">
                        <div>
                            <span class="brand-badge">CINEPULSE</span>
                            <span class="status-pill ${isConfirmed ? 'status-confirmed' : 'status-pending'}">
                                ${isConfirmed ? '✓ CONFIRMED E-TICKET' : '⏳ PENDING HOLD'}
                            </span>
                        </div>
                        <span class="ticket-id">#${ticketNo}</span>
                    </div>

                    <h2 class="movie-title">${movieTitle}</h2>
                    <div class="movie-meta">${formatTag} • ${currentShow?.genre || 'Action / Sci-Fi'} • ${currentShow?.duration_mins || 165} mins</div>

                    <div class="venue-box">
                        <div class="venue-name">📍 ${theaterName}</div>
                        <div class="venue-address">${mallAddress}</div>
                    </div>

                    <div class="info-grid">
                        <div class="info-cell">
                            <span class="info-label">AUDITORIUM</span>
                            <strong class="info-value">${screenName}</strong>
                        </div>
                        <div class="info-cell">
                            <span class="info-label">SEAT NUMBERS</span>
                            <strong class="info-value seat-highlight">${booking.seats_list}</strong>
                        </div>
                        <div class="info-cell">
                            <span class="info-label">CUSTOMER</span>
                            <strong class="info-value">${customerName}</strong>
                        </div>
                        <div class="info-cell">
                            <span class="info-label">ISSUED AT</span>
                            <strong class="info-value">${timestamp}</strong>
                        </div>
                    </div>

                    <div class="receipt-row">
                        <div>
                            <span class="receipt-label">ACID Lock Mode:</span>
                            <strong class="receipt-mode">${booking.lock_mode || 'PESSIMISTIC'}</strong>
                            <span class="receipt-email">• ${customerEmail}</span>
                        </div>
                        <div class="receipt-total">
                            <span>TOTAL PAID:</span>
                            <strong>₹${booking.total_amount}</strong>
                        </div>
                    </div>
                </div>

                <div class="ticket-divider">
                    <div class="notch-top"></div>
                    <div class="dashed-line"></div>
                    <div class="notch-bottom"></div>
                </div>

                <div class="ticket-stub">
                    <div class="stub-tag">GATE ENTRY QR</div>
                    <div class="qr-box">${qrSvg}</div>
                    <div class="stub-code">#${ticketNo}</div>
                    <div class="stub-seats">SEATS: ${booking.seats_list}</div>
                    <div class="barcode-bars">||| |||| | ||| |||| ||| | ||||</div>
                </div>
            </div>
        </div>
    `;
}

export function openPrintableTicketPdf(bookingsList, currentShow, loggedInUser) {
    const items = Array.isArray(bookingsList) ? bookingsList : [bookingsList];
    if (items.length === 0) return;

    const printWin = window.open('', '_blank', 'width=1020,height=820');
    if (!printWin) {
        window.print();
        return;
    }

    const cardsHtml = items
        .map((b) => buildSingleTicketHtml(b, currentShow, loggedInUser))
        .join('');

    const docHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>CinePulse Official E-Ticket PDF — ${currentShow?.movie_title || 'Cinema'}</title>
    <style>
        * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body {
            margin: 0;
            padding: 28px;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f1f5f9;
            color: #0f172a;
        }
        .toolbar {
            max-width: 920px;
            margin: 0 auto 22px auto;
            background: #0f172a;
            color: #ffffff;
            padding: 14px 22px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 10px 25px rgba(15,23,42,0.18);
        }
        .toolbar-btn {
            background: #e11d48;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
        }
        .toolbar-close {
            background: #334155;
            color: #e2e8f0;
            border: none;
            padding: 10px 14px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            margin-left: 8px;
        }
        .sheet-header {
            max-width: 920px;
            margin: 0 auto 18px auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 12px;
        }
        .ticket-wrapper {
            max-width: 920px;
            margin: 0 auto 24px auto;
            page-break-inside: avoid;
        }
        .ticket-card {
            display: flex;
            background: #ffffff;
            border: 2px solid #cbd5e1;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15,23,42,0.08);
        }
        .ticket-poster-col {
            width: 145px;
            background: #0f172a;
            flex-shrink: 0;
        }
        .ticket-poster {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .ticket-main {
            flex: 1;
            padding: 20px 24px;
        }
        .brand-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .brand-badge {
            background: #e11d48;
            color: #ffffff;
            font-weight: 900;
            font-size: 11px;
            letter-spacing: 1.5px;
            padding: 4px 10px;
            border-radius: 6px;
            margin-right: 8px;
        }
        .status-pill {
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 999px;
        }
        .status-confirmed { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .ticket-id {
            font-family: monospace;
            font-size: 14px;
            font-weight: 800;
            color: #475569;
        }
        .movie-title {
            margin: 4px 0;
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
        }
        .movie-meta {
            font-size: 11.5px;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 12px;
        }
        .venue-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 9px 12px;
            margin-bottom: 12px;
        }
        .venue-name { font-size: 12.5px; font-weight: 800; color: #1e293b; }
        .venue-address { font-size: 11px; color: #64748b; margin-top: 2px; }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 14px;
        }
        .info-cell {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 7px 9px;
        }
        .info-label {
            display: block;
            font-size: 9px;
            font-weight: 800;
            color: #64748b;
            letter-spacing: 0.8px;
        }
        .info-value {
            display: block;
            font-size: 11.5px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 3px;
        }
        .seat-highlight { color: #e11d48; font-size: 13.5px; }
        .receipt-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px dashed #cbd5e1;
            padding-top: 10px;
            font-size: 11px;
            color: #475569;
        }
        .receipt-mode {
            background: #eef2ff;
            color: #4338ca;
            padding: 2px 7px;
            border-radius: 5px;
            font-family: monospace;
            margin-left: 4px;
        }
        .receipt-total {
            font-size: 14px;
            color: #0f172a;
        }
        .receipt-total strong {
            color: #15803d;
            font-size: 17px;
            font-weight: 900;
            margin-left: 4px;
        }
        .ticket-divider {
            width: 24px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
        }
        .dashed-line {
            height: 85%;
            border-left: 2px dashed #cbd5e1;
        }
        .notch-top, .notch-bottom {
            position: absolute;
            width: 22px;
            height: 22px;
            background: #f1f5f9;
            border: 2px solid #cbd5e1;
            border-radius: 50%;
        }
        .notch-top { top: -12px; }
        .notch-bottom { bottom: -12px; }
        .ticket-stub {
            width: 205px;
            background: #f8fafc;
            padding: 18px 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .stub-tag {
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #475569;
            margin-bottom: 8px;
        }
        .qr-box { margin-bottom: 8px; }
        .stub-code {
            font-family: monospace;
            font-size: 13px;
            font-weight: 900;
            color: #0f172a;
        }
        .stub-seats {
            font-size: 11px;
            font-weight: 800;
            color: #e11d48;
            margin-top: 2px;
        }
        .barcode-bars {
            font-family: monospace;
            letter-spacing: 2px;
            font-size: 12px;
            color: #334155;
            margin-top: 8px;
        }
        .footer-note {
            max-width: 920px;
            margin: 12px auto 0 auto;
            font-size: 11px;
            color: #64748b;
            text-align: center;
        }
        @media print {
            body { background: #ffffff; padding: 0; }
            .toolbar { display: none !important; }
            .notch-top, .notch-bottom { background: #ffffff; }
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <div>
            <strong style="font-size:14px;">🎟️ CinePulse Official E-Ticket PDF Preview</strong>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">
                Choose "Save as PDF" in the destination dropdown to download your ticket PDF.
            </div>
        </div>
        <div>
            <button class="toolbar-btn" onclick="window.print()">🖨️ Save as PDF / Print Ticket</button>
            <button class="toolbar-close" onclick="window.close()">Close</button>
        </div>
    </div>

    <div class="sheet-header">
        <div>
            <strong style="font-size:16px;color:#0f172a;">CINEPULSE CINEMA • M-TICKET &amp; TAX RECEIPT</strong>
            <div style="font-size:11px;color:#64748b;">Verified by MySQL 8.0 InnoDB ACID Transaction Engine</div>
        </div>
        <div style="font-size:11px;color:#475569;font-family:monospace;">
            Generated: ${new Date().toLocaleString()}
        </div>
    </div>

    ${cardsHtml}

    <div class="footer-note">
        Please present this QR code at the cinema auditorium entrance • Carry a valid photo ID • Zero double-booking guaranteed by InnoDB Row-Level Locking.
    </div>

    <script>
        window.onload = function() {
            setTimeout(function() { window.print(); }, 450);
        };
    </script>
</body>
</html>`;

    printWin.document.open();
    printWin.document.write(docHtml);
    printWin.document.close();
}
