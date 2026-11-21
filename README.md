# 🎬 High-Concurrency Movie Flash-Sale & Seat Reservation System

[![Live Frontend](https://img.shields.io/badge/Live_App-Vercel-000000?style=for-the-badge&logo=vercel)](https://dbms-capstone-project-ebon.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://high-concurrency-movie-flash-sale-and.onrender.com/api/shows)
[![Database](https://img.shields.io/badge/MySQL_8.0-InnoDB_ACID-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://aiven.io)

> **B.Tech CSE (AI & ML) — 3rd Semester DBMS Capstone Project**  
> **K.R. Mangalam University** • **Author:** Ansh Verma

A full-stack **Movie Flash-Sale & Seat Reservation System** (inspired by **BookMyShow**) built with **MySQL 8.0 (`InnoDB`)**, **Node.js + Express (MVC)**, **Socket.io**, and **React + Tailwind CSS** to prevent double-bookings, deadlocks, and abandoned-cart seat lockups during high-traffic ticket sales.

---

## 🌐 Live Links

* **Frontend (Vercel):** [https://dbms-capstone-project-ebon.vercel.app](https://dbms-capstone-project-ebon.vercel.app)
* **Backend API (Render):** [https://high-concurrency-movie-flash-sale-and.onrender.com/api/shows](https://high-concurrency-movie-flash-sale-and.onrender.com/api/shows)
* **Cloud Database:** Aiven Cloud MySQL 8.0 (`InnoDB` with SSL & Connection Pool)

---

## ✨ Key Highlights

### 1. Core DBMS & Concurrency Engine
* **Zero Double-Booking:** Supports both **Pessimistic Locking (`SELECT ... FOR UPDATE`)** and **Optimistic Concurrency Control (`version` column)** inside ACID transactions.
* **Deadlock Prevention:** Multi-seat requests sort seat IDs in ascending order (`ORDER BY show_seat_id ASC`) before locking, preventing circular wait deadlocks (`0 Deadlocks`).
* **Two-Phase Seat Lock (5-Min TTL):** Seats transition `AVAILABLE` $\rightarrow$ `HELD (5-Min TTL)` $\rightarrow$ `BOOKED`. A background sweeper releases expired holds every **5 seconds**.
* **Automated Trigger & Stored Procedures:**
  * `trg_after_show_seat_update`: Logs every seat status/version change in `seat_audit_logs` (`TIMESTAMP(3)`) and updates `shows.available_seats`.
  * `sp_generate_show_seats` & `sp_reset_show_demo`: Generates 3-tier auditorium seats (`CLASSIC`, `PRIME`, `RECLINER`) and resets demo inventory.

### 2. Customer Ticketing Experience
* **City & Theater Search:** Filter multiplexes by City (*Gurugram*, *New Delhi*, *Mumbai*), Mall/Movie search, Date tabs, and Showtime slots.
* **Interactive 3-Tier Auditorium:** Smart group presets (*Couple Recliner*, *Family 4-Pack*, *Budget Pair*), *View-From-Seat* acoustic preview, *Watch Held Seat* auto-picker, and *Version Contention Heatmap*.
* **Perforated Boarding-Pass E-Ticket PDF:** Print or save official BookMyShow-style PDF tickets with custom SVG QR code, barcode stub,Gate QR DB Verifier, and 1-click ticket refund.

### 3. Owner-Only Admin & Telemetry (`Ansh` Only)
* **Role-Based Access Control:** Admin & Analytics options are strictly hidden from regular customers and accessible only to the Owner (`Ansh`).
* **Admin Control Center:** Add new movies & shows, **Remove any show (`🗑️ Remove Show`)**, toggle Flash-Sale pricing (`₹99/₹149/₹249`), auto-fill seats, force-expire holds, or reset shows.
* **Digital Telemetry & Stress-Tester:** Live SVG waveform charts, 3-ring concentric tier radar, 2D 60-seat matrix, and a **50-to-200 User Concurrency & Deadlock Simulator**.

---

## 🗄️ 3NF Database Schema (8 Tables)

| Table | Primary Key | Purpose & Key Constraints |
| :--- | :--- | :--- |
| **`users`** | `user_id` | `UNIQUE(email)` — Customer & Admin accounts |
| **`movies`** | `movie_id` | `CHECK(duration_mins > 0)` — Normalized movie catalog (3NF) |
| **`screens`** | `screen_id` | `UNIQUE(screen_name)` — Auditorium dimensions & capacity (3NF) |
| **`shows`** | `show_id` | `FK(movie_id, screen_id)` — Scheduled showtimes & flash-sale status |
| **`show_seats`** | `show_seat_id` | `UNIQUE(show_id, row_label, seat_number)`, Composite Index `idx_show_status_expiry`, `version` |
| **`bookings`** | `booking_id` | `FK(user_id, show_id)` — Tracks `PENDING`, `CONFIRMED`, `EXPIRED`, `CANCELLED` |
| **`booking_seats`** | `booking_seat_id` | `UNIQUE(booking_id, show_seat_id)` — 1NF junction table for multi-seat bookings |
| **`seat_audit_logs`** | `log_id` | Populated automatically by `trg_after_show_seat_update` (`TIMESTAMP(3)`) |

---

## 📂 Modular Project Structure

```text
CAPSTONE PROJECT/
├── Database_Schema_Design/
│   ├── database_schema.drawio          # 3NF ER Diagram
│   ├── database_schema.sql             # 8 Tables, Index & AFTER UPDATE Trigger
│   └── seed_data.sql                   # Stored Procedures & Initial Seed Data
├── Backend/
│   ├── config/db.js                    # MySQL2 Promise Connection Pool
│   ├── services/                       # seatHoldService.js, showQueryService.js
│   ├── controllers/                    # auth, show, booking, admin, simulation, analytics
│   ├── routes/                         # Modular Express Routes (/api)
│   └── server.js                       # Express + Socket.io Server & 5s TTL Sweeper
└── Frontend/src/
    ├── pages/                          # Landing, Signup, Login, TheaterSearch, Booking, MyBookings, Analytics, Admin
    ├── components/                     # Modular UI (seatmap/, concurrency/, analytics/, theater/, bookings/, admin/)
    ├── hooks/                          # useCinemaApp.js, useAuthSession.js, useAdminActions.js
    ├── services/                       # API Services & ticketPdfService.js (Boarding-Pass PDF)
    └── utils/                          # authUtils.js, seatHelpers.js, analyticsMath.js
```

---

## 🛠️ Quick Local Setup

1. **Database (MySQL 8.0):**
   ```sql
   SOURCE Database_Schema_Design/database_schema.sql;
   SOURCE Database_Schema_Design/seed_data.sql;
   ```
2. **Backend (`http://localhost:5000`):**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
3. **Frontend (`http://localhost:5173`):**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
