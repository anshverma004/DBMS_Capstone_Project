# 🎬 High-Concurrency Movie Flash-Sale & Seat Reservation Management System

A full-stack **Database Management Systems (DBMS) Capstone Project** engineered to solve real-world high-concurrency cinema seat reservation challenges (inspired by **BookMyShow** flash-sale premiere ticket drops) using **MySQL 8.0 (InnoDB)**, **Node.js + Express (MVC)**, **Socket.io**, and **React + Tailwind CSS**.

---

## 🌐 Live Cloud Deployment

* **Frontend (Vercel):** [https://dbms-capstone-project-ebon.vercel.app](https://dbms-capstone-project-ebon.vercel.app)
* **Backend API (Render):** [https://high-concurrency-movie-flash-sale-and.onrender.com/api/shows](https://high-concurrency-movie-flash-sale-and.onrender.com/api/shows)
* **Database:** Aiven Cloud MySQL 8.0 (`InnoDB` Engine with SSL)

---

## 🚀 Key DBMS & Concurrency Problems Solved

1. **Zero Double-Booking Under Flash-Sale Stampedes:**
   * Supports both **Pessimistic Row-Level Locking (`SELECT ... FOR UPDATE`)** and **Optimistic Concurrency Control (`version` column)** inside ACID transactions.
2. **Two-Phase Seat Reservation with 5-Minute TTL Auto-Expiry:**
   * Seats transition through `AVAILABLE` $\rightarrow$ `HELD (5-Minute TTL)` $\rightarrow$ `BOOKED`.
   * A background cleanup sweeper runs every **5 seconds** to automatically release expired holds back to `AVAILABLE` so abandoned checkouts never block inventory.
3. **Deadlock-Free Multi-Seat Group Bookings:**
   * Requested seat IDs are sorted in ascending order (`ORDER BY show_seat_id ASC`) before acquiring row locks, mathematically eliminating circular wait deadlocks.
4. **Database Trigger & Stored Procedures:**
   * **Trigger (`trg_after_show_seat_update`):** Automatically records millisecond-precision state & version transitions into `seat_audit_logs` (`TIMESTAMP(3)`) and synchronizes `shows.available_seats`.
   * **Stored Procedures:** `sp_generate_show_seats` (generates tiered auditorium seat layouts) and `sp_reset_show_demo` (resets show inventory for live evaluations).
5. **Real-Time WebSocket Synchronization & Live Stress-Test Benchmark:**
   * Built-in **50-to-200 Concurrent User Simulator** with a **Pessimistic vs. Optimistic Benchmark Comparison Table** and instant `Socket.io` seat broadcasts across tabs.

---

## 🧭 Multi-Page User Flow

1. **Landing Page (`pages/LandingPage.jsx`):** Public welcome screen with `Sign Up` and `Log In` navigation.
2. **Sign Up Page (`pages/SignupPage.jsx`):** Registers a new customer in the MySQL `users` table and redirects to the Login page.
3. **Log In Page (`pages/LoginPage.jsx`):** Authenticates the user and redirects to the City & Theater Search page.
4. **Theater Search Page (`pages/TheaterSearchPage.jsx`):** Filter theaters by City (*Gurugram*, *New Delhi*, *Mumbai*), Mall/Theater search query, Date tabs, and Showtime slots.
5. **Auditorium Seat Booking & Concurrency Lab (`pages/BookingPage.jsx`):** Tiered theater grid (`CLASSIC`, `PRIME`, `VIP RECLINER` with center aisle), 1-second live TTL countdown, UPI/Card Payment Modal, and 50-user Concurrency Stress-Tester.
6. **My Bookings & Printable M-Tickets (`pages/MyBookingsPage.jsx`):** View confirmed M-Tickets with QR codes and print/save as PDF.

---

## 🗄️ 3NF Normalized Database Schema (8 Tables)

| Table | Primary Key | Key Constraints & Purpose |
| :--- | :--- | :--- |
| **`users`** | `user_id` | `UNIQUE(email)` — Registered customers |
| **`movies`** | `movie_id` | `CHECK(duration_mins > 0)` — Normalized movie catalog (3NF) |
| **`screens`** | `screen_id` | `UNIQUE(screen_name)`, `CHECK(total_capacity = total_rows * seats_per_row)` |
| **`shows`** | `show_id` | `FK(movie_id)`, `FK(screen_id)`, `UNIQUE(screen_id, show_datetime)` |
| **`show_seats`** | `show_seat_id` | `UNIQUE(show_id, row_label, seat_number)`, `INDEX(show_id, status, held_until)`, `version` |
| **`bookings`** | `booking_id` | `FK(user_id)`, `FK(show_id)`, tracks `PENDING`, `CONFIRMED`, `EXPIRED`, `CANCELLED` |
| **`booking_seats`** | `booking_seat_id` | `UNIQUE(booking_id, show_seat_id)` — 1NF M:N junction table for multi-seat orders |
| **`seat_audit_logs`** | `log_id` | Populated automatically by `trg_after_show_seat_update` with `TIMESTAMP(3)` |

---

## 📂 Project Folder Structure

```text
CAPSTONE PROJECT/
├── Database_Schema_Design/
│   ├── database_schema.drawio      # 3NF ER Diagram (Crow's Foot Notation)
│   ├── database_schema.sql         # DDL Schema, Constraints, Index & Trigger
│   └── seed_data.sql               # Stored Procedures & Initial Seed Data
├── Backend/
│   ├── config/db.js                # MySQL2 Promise Connection Pool (limit: 30)
│   ├── controllers/                # authController.js, showController.js, bookingController.js
│   ├── routes/                     # authRoutes.js, showRoutes.js, bookingRoutes.js, apiRoutes.js
│   └── server.js                   # Express + Socket.io Server & 5s Expiry Sweeper
└── Frontend/src/
    ├── pages/                      # LandingPage, SignupPage, LoginPage, TheaterSearchPage, BookingPage, MyBookingsPage
    ├── components/                 # Navbar, SeatMap, ConcurrencyPanel, PaymentModal
    ├── constants/theaterData.js    # City, Theater & Showtime Slot Metadata
    ├── services/api.js             # REST API Client Layer
    └── App.jsx                     # Multi-Page Router & Socket.io Live Sync
```
