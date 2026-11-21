USE flash_movie_booking;

DROP PROCEDURE IF EXISTS sp_generate_show_seats;
DROP PROCEDURE IF EXISTS sp_reset_show_demo;

DELIMITER $$

CREATE PROCEDURE sp_generate_show_seats(IN p_show_id INT)
BEGIN
    DECLARE v_total_rows INT;
    DECLARE v_seats_per_row INT;
    DECLARE v_is_flash_sale BOOLEAN;
    DECLARE v_row_idx INT DEFAULT 1;
    DECLARE v_seat_num INT DEFAULT 1;
    DECLARE v_row_label CHAR(1);
    DECLARE v_tier VARCHAR(15);
    DECLARE v_price DECIMAL(10, 2);

    SELECT sc.total_rows, sc.seats_per_row, sh.is_flash_sale
    INTO v_total_rows, v_seats_per_row, v_is_flash_sale
    FROM shows sh
    INNER JOIN screens sc ON sh.screen_id = sc.screen_id
    WHERE sh.show_id = p_show_id;

    WHILE v_row_idx <= v_total_rows DO
        SET v_row_label = CHAR(64 + v_row_idx USING utf8mb4);

        IF v_row_idx <= 2 THEN
            SET v_tier = 'CLASSIC';
            SET v_price = IF(v_is_flash_sale, 99.00, 180.00);
        ELSEIF v_row_idx <= 4 THEN
            SET v_tier = 'PRIME';
            SET v_price = IF(v_is_flash_sale, 149.00, 280.00);
        ELSE
            SET v_tier = 'RECLINER';
            SET v_price = IF(v_is_flash_sale, 249.00, 450.00);
        END IF;

        SET v_seat_num = 1;
        WHILE v_seat_num <= v_seats_per_row DO
            INSERT IGNORE INTO show_seats (
                show_id,
                row_label,
                seat_number,
                seat_code,
                tier,
                price,
                status,
                held_by_user_id,
                held_until,
                version
            ) VALUES (
                p_show_id,
                v_row_label,
                v_seat_num,
                CONCAT(v_row_label, v_seat_num),
                v_tier,
                v_price,
                'AVAILABLE',
                NULL,
                NULL,
                1
            );
            SET v_seat_num = v_seat_num + 1;
        END WHILE;

        SET v_row_idx = v_row_idx + 1;
    END WHILE;
END$$

CREATE PROCEDURE sp_reset_show_demo(IN p_show_id INT)
BEGIN
    DECLARE v_total_seats INT DEFAULT 0;

    DELETE bs FROM booking_seats bs
    INNER JOIN bookings b ON bs.booking_id = b.booking_id
    WHERE b.show_id = p_show_id;

    DELETE FROM bookings WHERE show_id = p_show_id;

    UPDATE show_seats
    SET status = 'AVAILABLE',
        held_by_user_id = NULL,
        held_until = NULL,
        version = 1
    WHERE show_id = p_show_id;

    DELETE FROM seat_audit_logs WHERE show_id = p_show_id;

    SELECT COUNT(*) INTO v_total_seats
    FROM show_seats
    WHERE show_id = p_show_id;

    UPDATE shows
    SET available_seats = v_total_seats,
        status = 'OPEN'
    WHERE show_id = p_show_id;
END$$

DELIMITER ;

INSERT INTO users (full_name, email) VALUES
('Aarav Sharma', 'aarav.sharma@example.com'),
('Priya Patel', 'priya.patel@example.com'),
('Rohan Verma', 'rohan.verma@example.com'),
('Ananya Gupta', 'ananya.gupta@example.com'),
('Kabir Singh', 'kabir.singh@example.com'),
('Neha Kapoor', 'neha.kapoor@example.com'),
('Vikram Joshi', 'vikram.joshi@example.com'),
('Ishita Rao', 'ishita.rao@example.com'),
('Aditya Mehta', 'aditya.mehta@example.com'),
('Meera Nair', 'meera.nair@example.com');

INSERT INTO movies (title, genre, duration_mins) VALUES
('Avengers: Secret Wars (IMAX Premiere)', 'Action / Sci-Fi', 165),
('Interstellar (10th Anniversary IMAX)', 'Sci-Fi / Adventure', 169),
('Dune: Messiah (Dolby Premiere)', 'Sci-Fi / Drama', 155);

INSERT INTO screens (screen_name, total_rows, seats_per_row, total_capacity) VALUES
('Screen 1 - IMAX Laser', 6, 10, 60),
('Screen 2 - Dolby Atmos', 5, 10, 50);

INSERT INTO shows (
    movie_id,
    screen_id,
    show_datetime,
    is_flash_sale,
    sale_start_time,
    available_seats,
    status
) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL '19:00' HOUR_MINUTE), TRUE, NOW(), 60, 'OPEN'),
(2, 1, DATE_ADD(CURDATE(), INTERVAL '22:30' HOUR_MINUTE), FALSE, NOW(), 60, 'OPEN'),
(3, 2, DATE_ADD(CURDATE(), INTERVAL '20:00' HOUR_MINUTE), TRUE, NOW(), 50, 'OPEN');

CALL sp_generate_show_seats(1);
CALL sp_generate_show_seats(2);
CALL sp_generate_show_seats(3);

SELECT 
    sh.show_id,
    m.title AS movie_title,
    sc.screen_name,
    sh.is_flash_sale,
    sh.available_seats,
    COUNT(ss.show_seat_id) AS generated_seat_rows
FROM shows sh
JOIN movies m ON sh.movie_id = m.movie_id
JOIN screens sc ON sh.screen_id = sc.screen_id
LEFT JOIN show_seats ss ON sh.show_id = ss.show_id
GROUP BY sh.show_id, m.title, sc.screen_name, sh.is_flash_sale, sh.available_seats;
