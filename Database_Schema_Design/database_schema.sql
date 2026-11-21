CREATE DATABASE IF NOT EXISTS flash_movie_booking;
USE flash_movie_booking;

DROP TRIGGER IF EXISTS trg_after_show_seat_update;
DROP TABLE IF EXISTS seat_audit_logs;
DROP TABLE IF EXISTS booking_seats;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS show_seats;
DROP TABLE IF EXISTS shows;
DROP TABLE IF EXISTS screens;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    duration_mins INT NOT NULL,
    CONSTRAINT pk_movies PRIMARY KEY (movie_id),
    CONSTRAINT chk_movies_duration CHECK (duration_mins > 0)
) ENGINE=InnoDB;

CREATE TABLE screens (
    screen_id INT AUTO_INCREMENT,
    screen_name VARCHAR(100) NOT NULL,
    total_rows INT NOT NULL,
    seats_per_row INT NOT NULL,
    total_capacity INT NOT NULL,
    CONSTRAINT pk_screens PRIMARY KEY (screen_id),
    CONSTRAINT uk_screens_name UNIQUE (screen_name),
    CONSTRAINT chk_screens_rows CHECK (total_rows > 0),
    CONSTRAINT chk_screens_seats CHECK (seats_per_row > 0),
    CONSTRAINT chk_screens_capacity CHECK (total_capacity = total_rows * seats_per_row)
) ENGINE=InnoDB;

CREATE TABLE shows (
    show_id INT AUTO_INCREMENT,
    movie_id INT NOT NULL,
    screen_id INT NOT NULL,
    show_datetime DATETIME NOT NULL,
    is_flash_sale BOOLEAN NOT NULL DEFAULT FALSE,
    sale_start_time DATETIME NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('UPCOMING', 'OPEN', 'SOLD_OUT', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    CONSTRAINT pk_shows PRIMARY KEY (show_id),
    CONSTRAINT fk_shows_movie FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    CONSTRAINT fk_shows_screen FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE RESTRICT,
    CONSTRAINT uk_screen_showtime UNIQUE (screen_id, show_datetime),
    CONSTRAINT chk_shows_available CHECK (available_seats >= 0)
) ENGINE=InnoDB;

CREATE TABLE show_seats (
    show_seat_id INT AUTO_INCREMENT,
    show_id INT NOT NULL,
    row_label CHAR(1) NOT NULL,
    seat_number INT NOT NULL,
    seat_code VARCHAR(5) NOT NULL,
    tier ENUM('CLASSIC', 'PRIME', 'RECLINER') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('AVAILABLE', 'HELD', 'BOOKED') NOT NULL DEFAULT 'AVAILABLE',
    held_by_user_id INT NULL,
    held_until DATETIME NULL,
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_show_seats PRIMARY KEY (show_seat_id),
    CONSTRAINT fk_show_seats_show FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE,
    CONSTRAINT fk_show_seats_user FOREIGN KEY (held_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT uk_show_seat UNIQUE (show_id, row_label, seat_number),
    CONSTRAINT chk_seat_number CHECK (seat_number > 0),
    CONSTRAINT chk_seat_price CHECK (price >= 0),
    INDEX idx_show_status_expiry (show_id, status, held_until)
) ENGINE=InnoDB;

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    lock_mode ENUM('PESSIMISTIC', 'OPTIMISTIC') NOT NULL DEFAULT 'PESSIMISTIC',
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME NULL,
    CONSTRAINT pk_bookings PRIMARY KEY (booking_id),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_show FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE RESTRICT,
    CONSTRAINT chk_bookings_amount CHECK (total_amount >= 0)
) ENGINE=InnoDB;

CREATE TABLE booking_seats (
    booking_seat_id INT AUTO_INCREMENT,
    booking_id INT NOT NULL,
    show_seat_id INT NOT NULL,
    price_at_booking DECIMAL(10, 2) NOT NULL,
    CONSTRAINT pk_booking_seats PRIMARY KEY (booking_seat_id),
    CONSTRAINT fk_bseats_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_bseats_show_seat FOREIGN KEY (show_seat_id) REFERENCES show_seats(show_seat_id) ON DELETE RESTRICT,
    CONSTRAINT uk_booking_seat UNIQUE (booking_id, show_seat_id)
) ENGINE=InnoDB;

CREATE TABLE seat_audit_logs (
    log_id BIGINT AUTO_INCREMENT,
    show_seat_id INT NOT NULL,
    show_id INT NOT NULL,
    seat_code VARCHAR(5) NOT NULL,
    old_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    acted_by_user_id INT NULL,
    old_version INT NOT NULL,
    new_version INT NOT NULL,
    changed_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT pk_seat_audit_logs PRIMARY KEY (log_id),
    CONSTRAINT fk_audit_show_seat FOREIGN KEY (show_seat_id) REFERENCES show_seats(show_seat_id) ON DELETE CASCADE
) ENGINE=InnoDB;

DELIMITER $$

CREATE TRIGGER trg_after_show_seat_update
AFTER UPDATE ON show_seats
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status OR OLD.version <> NEW.version THEN
        INSERT INTO seat_audit_logs (
            show_seat_id,
            show_id,
            seat_code,
            old_status,
            new_status,
            acted_by_user_id,
            old_version,
            new_version
        ) VALUES (
            NEW.show_seat_id,
            NEW.show_id,
            NEW.seat_code,
            OLD.status,
            NEW.status,
            NEW.held_by_user_id,
            OLD.version,
            NEW.version
        );
    END IF;

    IF OLD.status = 'AVAILABLE' AND NEW.status IN ('HELD', 'BOOKED') THEN
        UPDATE shows
        SET available_seats = available_seats - 1,
            status = IF(available_seats - 1 = 0, 'SOLD_OUT', status)
        WHERE show_id = NEW.show_id;
    ELSEIF OLD.status IN ('HELD', 'BOOKED') AND NEW.status = 'AVAILABLE' THEN
        UPDATE shows
        SET available_seats = available_seats + 1,
            status = 'OPEN'
        WHERE show_id = NEW.show_id;
    END IF;
END$$

DELIMITER ;
