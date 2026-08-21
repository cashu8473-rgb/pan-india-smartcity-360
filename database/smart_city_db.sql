-- ==============================================================================
-- PAN-INDIA SMART CITY GUIDE & CITIZEN SERVICES DATABASE SCHEMA
-- Database: MySQL 8.0+
-- Comprehensive Pan-India Coverage: All 28 States & 8 Union Territories
-- Covers Mega Metros, Tier-2/3 Cities, Local Heritage Streets, Alleys & Bazaars
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `smart_city_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_city_db`;

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS `event_bookings`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `grievances`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `emergency_facilities`;
DROP TABLE IF EXISTS `city_places`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `cities`;
DROP TABLE IF EXISTS `states`;
DROP TABLE IF EXISTS `users`;

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
    `user_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `role` ENUM('ROLE_CITIZEN', 'ROLE_TOURIST', 'ROLE_ADMIN', 'ROLE_OFFICER') DEFAULT 'ROLE_CITIZEN',
    `state` VARCHAR(50) DEFAULT 'Delhi',
    `city` VARCHAR(50) DEFAULT 'New Delhi',
    `city_zone` VARCHAR(50) DEFAULT 'Central Zone',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 2. STATES & CITIES MASTER TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE `states` (
    `state_id` INT AUTO_INCREMENT PRIMARY KEY,
    `state_name` VARCHAR(60) NOT NULL UNIQUE,
    `state_code` VARCHAR(10) NOT NULL UNIQUE,
    `type` ENUM('STATE', 'UNION_TERRITORY') DEFAULT 'STATE',
    `capital_city` VARCHAR(60) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `cities` (
    `city_id` INT AUTO_INCREMENT PRIMARY KEY,
    `state_id` INT NOT NULL,
    `city_name` VARCHAR(60) NOT NULL,
    `tier` ENUM('TIER_1', 'TIER_2', 'TIER_3') DEFAULT 'TIER_1',
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `famous_for` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT `fk_city_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`state_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `code` VARCHAR(30) NOT NULL UNIQUE,
    `icon` VARCHAR(50) DEFAULT 'fas fa-map-marker-alt',
    `description` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. CITY PLACES, HERITAGE STREETS & LOCAL GEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `city_places` (
    `place_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `state` VARCHAR(60) NOT NULL,
    `city` VARCHAR(60) NOT NULL,
    `street_name` VARCHAR(150) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `tagline` VARCHAR(255) DEFAULT NULL,
    `description` TEXT NOT NULL,
    `zone` VARCHAR(50) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `pincode` VARCHAR(10) DEFAULT '110001',
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `entry_fee` DECIMAL(8, 2) DEFAULT 0.00,
    `opening_hours` VARCHAR(100) DEFAULT '09:00 AM - 06:00 PM',
    `contact_phone` VARCHAR(25) DEFAULT NULL,
    `website_url` VARCHAR(255) DEFAULT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `rating_avg` DECIMAL(3, 2) DEFAULT 4.50,
    `total_reviews` INT DEFAULT 0,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `is_verified` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_places_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. EMERGENCY FACILITIES & HELPLINE TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `emergency_facilities` (
    `facility_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `facility_name` VARCHAR(150) NOT NULL,
    `type` ENUM('HOSPITAL', 'POLICE_STATION', 'FIRE_STATION', 'BLOOD_BANK', 'DISASTER_MANAGEMENT') NOT NULL,
    `state` VARCHAR(60) NOT NULL,
    `city` VARCHAR(60) NOT NULL,
    `street_name` VARCHAR(150) NOT NULL,
    `zone` VARCHAR(50) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `pincode` VARCHAR(10) DEFAULT '110001',
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `emergency_contact` VARCHAR(35) NOT NULL,
    `ambulance_contact` VARCHAR(35) DEFAULT NULL,
    `available_icu_beds` INT DEFAULT 0,
    `is_24x7` BOOLEAN DEFAULT TRUE,
    `status` ENUM('OPERATIONAL', 'HIGH_DEMAND', 'MAINTENANCE') DEFAULT 'OPERATIONAL',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 6. CITIZEN GRIEVANCES & CIVIC ISSUE TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `grievances` (
    `grievance_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `tracking_token` VARCHAR(30) NOT NULL UNIQUE,
    `user_id` BIGINT DEFAULT NULL,
    `citizen_name` VARCHAR(100) NOT NULL,
    `citizen_phone` VARCHAR(25) NOT NULL,
    `citizen_email` VARCHAR(100) DEFAULT NULL,
    `state` VARCHAR(60) NOT NULL DEFAULT 'Delhi',
    `city` VARCHAR(60) NOT NULL DEFAULT 'New Delhi',
    `street_name` VARCHAR(150) NOT NULL,
    `category` ENUM('ROAD_POTHOLE', 'STREET_LIGHT', 'GARBAGE_COLLECTION', 'WATER_LEAKAGE', 'TRAFFIC_SIGNAL', 'PUBLIC_PARK', 'SEWAGE_DRAINAGE', 'OTHER') NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `zone` VARCHAR(50) NOT NULL,
    `location_address` VARCHAR(255) NOT NULL,
    `pincode` VARCHAR(10) DEFAULT '110001',
    `latitude` DECIMAL(10, 8) DEFAULT NULL,
    `longitude` DECIMAL(11, 8) DEFAULT NULL,
    `image_url` VARCHAR(500) DEFAULT NULL,
    `status` ENUM('SUBMITTED', 'IN_REVIEW', 'DISPATCHED', 'RESOLVED', 'REJECTED') DEFAULT 'SUBMITTED',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    `assigned_department` VARCHAR(100) DEFAULT 'Municipal Corporation',
    `officer_notes` TEXT DEFAULT NULL,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `resolved_at` TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT `fk_grievance_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 7. CITY EVENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `events` (
    `event_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `organizer` VARCHAR(100) NOT NULL,
    `state` VARCHAR(60) NOT NULL,
    `city` VARCHAR(60) NOT NULL,
    `street_name` VARCHAR(150) NOT NULL,
    `venue_name` VARCHAR(150) NOT NULL,
    `zone` VARCHAR(50) NOT NULL,
    `start_date` DATETIME NOT NULL,
    `end_date` DATETIME NOT NULL,
    `entry_fee` DECIMAL(8, 2) DEFAULT 0.00,
    `total_seats` INT NOT NULL,
    `booked_seats` INT DEFAULT 0,
    `description` TEXT NOT NULL,
    `banner_image` VARCHAR(500) DEFAULT NULL,
    `status` ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'UPCOMING',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 8. EVENT PASS BOOKINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `event_bookings` (
    `booking_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_ref` VARCHAR(30) NOT NULL UNIQUE,
    `event_id` BIGINT NOT NULL,
    `user_id` BIGINT DEFAULT NULL,
    `attendee_name` VARCHAR(100) NOT NULL,
    `attendee_email` VARCHAR(100) NOT NULL,
    `attendee_phone` VARCHAR(25) NOT NULL,
    `num_tickets` INT DEFAULT 1,
    `total_amount` DECIMAL(8, 2) DEFAULT 0.00,
    `payment_status` ENUM('PAID', 'PENDING', 'FREE') DEFAULT 'FREE',
    `qr_code_hash` VARCHAR(255) NOT NULL,
    `booked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_booking_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 9. PLACE REVIEWS & RATINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `reviews` (
    `review_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `place_id` BIGINT NOT NULL,
    `user_id` BIGINT DEFAULT NULL,
    `author_name` VARCHAR(100) NOT NULL,
    `rating` INT CHECK (rating BETWEEN 1 AND 5),
    `comment` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reviews_place` FOREIGN KEY (`place_id`) REFERENCES `city_places` (`place_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX `idx_places_state_city` ON `city_places` (`state`, `city`);
CREATE INDEX `idx_places_street` ON `city_places` (`street_name`);
CREATE INDEX `idx_places_category` ON `city_places` (`category_id`);
CREATE INDEX `idx_emergency_state_city` ON `emergency_facilities` (`state`, `city`);
CREATE INDEX `idx_emergency_type` ON `emergency_facilities` (`type`);
CREATE INDEX `idx_grievance_token` ON `grievances` (`tracking_token`);
CREATE INDEX `idx_grievance_status` ON `grievances` (`status`);

-- ------------------------------------------------------------------------------
-- SEED DATA INSERTIONS: ALL INDIAN STATES & UNION TERRITORIES
-- ------------------------------------------------------------------------------
INSERT INTO `states` (`state_id`, `state_name`, `state_code`, `type`, `capital_city`) VALUES
(1, 'Delhi (NCR)', 'DL', 'UNION_TERRITORY', 'New Delhi'),
(2, 'Maharashtra', 'MH', 'STATE', 'Mumbai'),
(3, 'Rajasthan', 'RJ', 'STATE', 'Jaipur'),
(4, 'Uttar Pradesh', 'UP', 'STATE', 'Lucknow'),
(5, 'Karnataka', 'KA', 'STATE', 'Bengaluru'),
(6, 'West Bengal', 'WB', 'STATE', 'Kolkata'),
(7, 'Tamil Nadu', 'TN', 'STATE', 'Chennai'),
(8, 'Telangana', 'TS', 'STATE', 'Hyderabad'),
(9, 'Kerala', 'KL', 'STATE', 'Thiruvananthapuram'),
(10, 'Punjab', 'PB', 'STATE', 'Chandigarh'),
(11, 'Madhya Pradesh', 'MP', 'STATE', 'Bhopal'),
(12, 'Gujarat', 'GJ', 'STATE', 'Gandhinagar'),
(13, 'Himachal Pradesh', 'HP', 'STATE', 'Shimla'),
(14, 'Goa', 'GA', 'STATE', 'Panaji'),
(15, 'Jammu & Kashmir', 'JK', 'UNION_TERRITORY', 'Srinagar'),
(16, 'Assam', 'AS', 'STATE', 'Dispur'),
(17, 'Uttarakhand', 'UK', 'STATE', 'Dehradun'),
(18, 'Bihar', 'BR', 'STATE', 'Patna'),
(19, 'Odisha', 'OD', 'STATE', 'Bhubaneswar'),
(20, 'Andhra Pradesh', 'AP', 'STATE', 'Amaravati'),
(21, 'Haryana', 'HR', 'STATE', 'Chandigarh'),
(22, 'Jharkhand', 'JH', 'STATE', 'Ranchi'),
(23, 'Chhattisgarh', 'CG', 'STATE', 'Raipur'),
(24, 'Puducherry', 'PY', 'UNION_TERRITORY', 'Pondicherry'),
(25, 'Chandigarh', 'CH', 'UNION_TERRITORY', 'Chandigarh'),
(26, 'Sikkim', 'SK', 'STATE', 'Gangtok'),
(27, 'Meghalaya', 'ML', 'STATE', 'Shillong'),
(28, 'Manipur', 'MN', 'STATE', 'Imphal');

-- Cities
INSERT INTO `cities` (`city_id`, `state_id`, `city_name`, `tier`, `latitude`, `longitude`, `famous_for`) VALUES
(1, 1, 'New Delhi', 'TIER_1', 28.6139000, 77.2090000, 'National Capital, Monuments, Street Food & Metro'),
(2, 2, 'Mumbai', 'TIER_1', 19.0760000, 72.8777000, 'Financial Capital, Marine Drive, Bollywood & Sea Link'),
(3, 2, 'Pune', 'TIER_2', 18.5204000, 73.8567000, 'Oxford of the East, IT Hub & Heritage Forts'),
(4, 3, 'Jaipur', 'TIER_2', 26.9124000, 75.7873000, 'Pink City, Forts, Palaces & Johari Bazaar'),
(5, 3, 'Udaipur', 'TIER_2', 24.5854000, 73.7125000, 'City of Lakes, Royal Palaces & Ghats'),
(6, 4, 'Varanasi', 'TIER_2', 25.3176000, 82.9739000, 'Spiritual Capital, Ganga Ghats & Silk Weaving'),
(7, 4, 'Lucknow', 'TIER_2', 26.8467000, 80.9462000, 'City of Nawabs, Awadhi Kebabs & Chikankari'),
(8, 5, 'Bengaluru', 'TIER_1', 12.9716000, 77.5946000, 'Silicon Valley of India, Garden City & Tech Parks'),
(9, 5, 'Mysuru', 'TIER_2', 12.2958000, 76.6394000, 'Heritage Palace, Sandalwood & Silk'),
(10, 6, 'Kolkata', 'TIER_1', 22.5726000, 88.3639000, 'City of Joy, Cultural Heritage, Tramways & Sweets'),
(11, 7, 'Chennai', 'TIER_1', 13.0827000, 80.2707000, 'Marina Beach, Carnatic Music & Temples'),
(12, 8, 'Hyderabad', 'TIER_1', 17.3850000, 78.4867000, 'City of Pearls, Charminar & Hyderabadi Biryani'),
(13, 9, 'Kochi', 'TIER_2', 9.9312000, 76.2673000, 'Queen of Arabian Sea, Fort Kochi & Spice Streets'),
(14, 10, 'Amritsar', 'TIER_2', 31.6340000, 74.8723000, 'Golden Temple, Wagah Border & Punjabi Kulcha'),
(15, 11, 'Indore', 'TIER_2', 22.7196000, 75.8577000, 'Cleanest City of India, Chhappan Dukan & Sarafa'),
(16, 12, 'Ahmedabad', 'TIER_1', 23.0225000, 72.5714000, 'UNESCO World Heritage City, Riverfront & Bazaars'),
(17, 13, 'Shimla', 'TIER_3', 31.1048000, 77.1734000, 'Queen of Hills, Mall Road & Ridge Promenade'),
(18, 14, 'Panaji', 'TIER_3', 15.4909000, 73.8278000, 'Fontainhas Latin Quarter, Beaches & Heritage Churches'),
(19, 15, 'Srinagar', 'TIER_2', 34.0837000, 74.7973000, 'Dal Lake Shikara, Boulevard Road & Mughal Gardens'),
(20, 16, 'Guwahati', 'TIER_2', 26.1445000, 91.7362000, 'Gateway to Northeast, Kamakhya & Brahmaputra');

-- Categories
INSERT INTO `categories` (`category_id`, `name`, `code`, `icon`, `description`) VALUES
(1, 'Heritage & Monuments', 'HERITAGE', 'fa-landmark', 'UNESCO heritage monuments, grand citadels, forts and royal palaces'),
(2, 'Parks, Ghats & Lakes', 'PARKS', 'fa-tree', 'Waterfront ghats, scenic botanical gardens, eco-parks and lakes'),
(3, 'Museums & Science', 'MUSEUMS', 'fa-palette', 'Science centers, planetariums, and national museums'),
(4, 'Food & Culinary Streets', 'FOOD', 'fa-utensils', 'Famous night food streets, khau gallis, and authentic regional cuisines'),
(5, 'Smart Transit & EV', 'TRANSIT', 'fa-subway', 'Metro networks, transit interchanges, and EV fast charging hubs'),
(6, 'Artisan Bazaars & Streets', 'SHOPPING', 'fa-shopping-bag', 'Traditional handicraft markets, silk lanes, and heritage bazaars');

-- ------------------------------------------------------------------------------
-- SEED DATA: PAN-INDIA CITY PLACES, FAMOUS LOCAL STREETS & GULLIES
-- ------------------------------------------------------------------------------
INSERT INTO `city_places` (`place_id`, `category_id`, `state`, `city`, `street_name`, `title`, `tagline`, `description`, `zone`, `address`, `pincode`, `latitude`, `longitude`, `entry_fee`, `opening_hours`, `contact_phone`, `image_url`, `rating_avg`, `total_reviews`, `is_featured`) VALUES
-- Delhi NCR
(1, 1, 'Delhi (NCR)', 'New Delhi', 'Netaji Subhash Marg, Chandni Chowk', 'Red Fort (Lal Qila) & Heritage Corridor', '17th Century Mughal Citadel & Sound-Light Spectacle', 'Historic Mughal fortress of red sandstone. Features Diwan-i-Aam, royal pavilions, museums, and evening laser sound shows.', 'North Zone', 'Netaji Subhash Marg, Chandni Chowk', '110006', 28.6562000, 77.2410000, 50.00, '08:00 AM - 07:00 PM', '+91-11-23270000', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80', 4.85, 1420, TRUE),
(2, 4, 'Delhi (NCR)', 'New Delhi', 'Gali Paranthe Wali, Chandni Chowk', 'Paranthe Wali Gali & Sweet Street', 'Centuries-Old Traditional Culinary Alley', 'Famous narrow gully in Old Delhi serving over 30 varieties of deep-fried paranthas, rabri, and lassi since the 1870s.', 'Central Zone', 'Gali Paranthe Wali, Near Katra Neel, Chandni Chowk', '110006', 28.6558000, 77.2305000, 0.00, '09:00 AM - 11:30 PM', '+91-11-23265544', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', 4.80, 3100, TRUE),
(3, 6, 'Delhi (NCR)', 'New Delhi', 'Sri Aurobindo Marg, INA Market', 'Dilli Haat Crafts & Food Village', 'Open-Air Artisan Bazaar with All Indian State Stalls', 'Government accredited craft emporium where master weavers and craftsmen from all 28 Indian states display live pottery and textiles.', 'South Zone', 'Opposite INA Market, Sri Aurobindo Marg', '110023', 28.5732000, 77.2085000, 30.00, '10:30 AM - 10:00 PM', '+91-11-26119055', 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1000&q=80', 4.70, 920, TRUE),

-- Maharashtra (Mumbai & Pune)
(4, 1, 'Maharashtra', 'Mumbai', 'Netaji Subhash Chandra Bose Road', 'Marine Drive Promenade & Queen''s Necklace', 'Iconic 3.6-km C-Shaped Coastal Boulevard', 'Spectacular sunset promenade curving along the Arabian Sea coast. Features Art Deco architecture, walking promenade, and breezy evening vistas.', 'South Mumbai', 'Netaji Subhash Chandra Bose Road, Chowpatty to Nariman Point', '400020', 18.9432000, 72.8230000, 0.00, '24 Hours Open', '+91-22-22820000', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80', 4.90, 4800, TRUE),
(5, 4, 'Maharashtra', 'Mumbai', 'Khau Galli, Ghatkopar East', 'Ghatkopar Khau Galli & Fusion Street', 'Mumbai''s Capital for 100+ Gourmet Street Delicacies', 'Vibrant food street famous for cheese burst dosas, melting sandwiches, pani puri variants, and falooda towers.', 'Central Mumbai', 'Vallabh Bagh Lane, Ghatkopar East', '400077', 19.0850000, 72.9080000, 0.00, '02:00 PM - 01:30 AM', '+91-22-25010000', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80', 4.75, 2300, FALSE),
(6, 6, 'Maharashtra', 'Pune', 'Fergusson College Road (FC Road)', 'FC Road & Deccan Youth Shopping Boulevard', 'Trendy Street Cafes, Bookshops & Fashion Stalls', 'Lively pedestrian college street lined with trendy boutiques, authentic Irani cafes, Puneri street chaat, and bookstores.', 'West Zone', 'Shivajinagar, FC Road, Pune', '411004', 18.5246000, 73.8415000, 0.00, '10:00 AM - 11:00 PM', '+91-20-25650000', 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1000&q=80', 4.65, 1250, FALSE),

-- Rajasthan (Jaipur & Udaipur)
(7, 1, 'Rajasthan', 'Jaipur', 'Hawa Mahal Road, Badi Chaupar, Johari Bazaar', 'Hawa Mahal & Pink City Heritage Bazaar', 'Palace of Winds with 953 Intricately Carved Jharokhas', '1799 pink and red sandstone marvel overlooking the historic Johari and Bapu Bazaars, famed for Kundan jewelry and bandhani fabrics.', 'Heritage Core', 'Badi Chaupar, Hawa Mahal Marg, Jaipur', '302002', 26.9239000, 75.8267000, 50.00, '09:00 AM - 05:30 PM', '+91-141-2618862', 'https://images.unsplash.com/photo-1603228254119-e6a528dc5686?auto=format&fit=crop&w=1000&q=80', 4.88, 3850, TRUE),
(8, 2, 'Rajasthan', 'Udaipur', 'Gangaur Ghat Marg, Old City', 'Lake Pichola & Gangaur Ghat Promenade', 'Enchanting Royal Waterfront & Sunset Boating', 'Pristine freshwater lake surrounded by the City Palace, Jag Mandir, and sunset boating jetties with Rajasthani folk music on the ghats.', 'Old City Zone', 'Gangaur Ghat Marg, Near Bagore Ki Haveli, Udaipur', '313001', 24.5797000, 73.6800000, 30.00, '06:00 AM - 10:00 PM', '+91-294-2419010', 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=80', 4.92, 2900, TRUE),

-- Uttar Pradesh (Varanasi & Lucknow)
(9, 2, 'Uttar Pradesh', 'Varanasi', 'Dashashwamedh Ghat Road, Godowlia', 'Dashashwamedh Ghat & Ganga Maha Aarti', 'The World''s Oldest Living Spiritual Promenade', 'The focal ghat of Kashi where 7 brass lamps light up the sacred Ganga evening aarti, surrounded by Banarasi silk weaver lanes.', 'Heritage Ghats', 'Dashashwamedh Ghat Road, Godowlia, Varanasi', '221001', 25.3076000, 83.0104000, 0.00, '24 Hours Open (Aarti 06:45 PM)', '+91-542-2505000', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80', 4.96, 5600, TRUE),
(10, 4, 'Uttar Pradesh', 'Lucknow', 'Nazirabad Road, Aminabad Market', 'Aminabad Food Street & Tunday Kababi Gali', 'Century-Old Royal Awadhi Culinary Destination', 'World famous street known for melt-in-mouth Galawati kebabs, Mughlai parathas, Sheermal, and Royal Lucknowi Chikankari stalls.', 'Old City Zone', 'Nazirabad Road, Aminabad, Lucknow', '226018', 26.8450000, 80.9250000, 0.00, '11:00 AM - 12:30 AM', '+91-522-2620000', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', 4.85, 4100, TRUE),

-- Karnataka (Bengaluru & Mysuru)
(11, 2, 'Karnataka', 'Bengaluru', 'Mavalli, Lalbagh Fort Road', 'Lalbagh Botanical Garden & Glass House', '240-Acre Garden with 1,800+ Exotic Flora & Lake', 'Historic royal garden commissioned by Hyder Ali. Features the iconic London Crystal Palace-inspired Glass House, lotus lake, and bonsai park.', 'South Bengaluru', 'Lalbagh Fort Road, Mavalli, Bengaluru', '560004', 12.9507000, 77.5848000, 25.00, '06:00 AM - 07:00 PM', '+91-80-26570181', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80', 4.80, 2600, TRUE),
(12, 4, 'Karnataka', 'Bengaluru', 'Old Tharagupet, Sajjan Rao Circle', 'VV Puram Thindi Beedi (Food Street)', 'Pure Vegetarian Street Food Hub with 30+ Stalls', 'Famous pedestrian evening street serving hot butter masala dosas, congress buns, paddus, rasgulla chaat, and filter coffee.', 'Basavanagudi', 'Old Tharagupet, VV Puram, Bengaluru', '560004', 12.9520000, 77.5750000, 0.00, '05:30 PM - 11:30 PM', '+91-80-22440000', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80', 4.82, 3400, TRUE),

-- West Bengal (Kolkata)
(13, 1, 'West Bengal', 'Kolkata', 'Queen''s Way, Maidan', 'Victoria Memorial Hall & Royal Gardens', 'White Makrana Marble British-Era Heritage Monument', 'Grand architectural landmark dedicated to Queen Victoria, housing royal art galleries, manicured fountains, and horse-drawn carriage lanes.', 'Central Kolkata', '1, Queen''s Way, Maidan, Kolkata', '700071', 22.5448000, 88.3426000, 30.00, '10:00 AM - 06:00 PM', '+91-33-22231890', 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80', 4.88, 3700, TRUE),
(14, 4, 'West Bengal', 'Kolkata', 'Mother Teresa Sarani, Park Street', 'Park Street Dining & Heritage Cafe Corridor', 'Kolkata''s Historic Food & Cultural High Street', 'Colonial boulevard celebrated for legendary jazz cafes, authentic Chelo kebabs, Continental bistros, and iconic Christmas illuminations.', 'Central Kolkata', 'Park Street, Mother Teresa Sarani, Kolkata', '700016', 22.5510000, 88.3530000, 0.00, '11:00 AM - 12:00 AM', '+91-33-22290000', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80', 4.82, 2900, TRUE),

-- Tamil Nadu (Chennai)
(15, 2, 'Tamil Nadu', 'Chennai', 'Kamarajar Salai, Triplicane', 'Marina Beach Promenade & Lighthouse', 'World''s Second Longest Natural Urban Beach (13 km)', 'Sandy coastline along the Bay of Bengal featuring statues of Tamil scholars, horse rides, hot sundal & fish fry stalls, and high-tech lighthouse.', 'East Coast Zone', 'Kamarajar Salai, Triplicane, Chennai', '600005', 13.0499000, 80.2824000, 0.00, '24 Hours Open', '+91-44-25380000', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80', 4.70, 4200, TRUE),

-- Telangana (Hyderabad)
(16, 1, 'Telangana', 'Hyderabad', 'Charminar Road, Chudi Bazaar', 'Charminar & Laad Bazaar Pearl Street', '1591 Four-Minaret Monument & Bangle Street', 'Iconic Hyderabad landmark with four grand arches and minarets, surrounded by the dazzling Laad Bazaar known for lacquer bangles and Basra pearls.', 'Old City Zone', 'Charminar Road, Char Kaman, Hyderabad', '500002', 17.3616000, 78.4747000, 25.00, '09:00 AM - 05:30 PM', '+91-40-24520000', 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1000&q=80', 4.86, 4400, TRUE),

-- Kerala (Kochi)
(17, 1, 'Kerala', 'Kochi', 'Princess Street, Fort Kochi', 'Fort Kochi Princess Street & Chinese Fishing Nets', 'Colonial Dutch & Portuguese Heritage Alleys', 'Picturesque cobblestone street lined with Dutch villas, heritage spice warehouses, vibrant art cafes, and iconic cantilevered Chinese fishing nets.', 'Coastal Zone', 'Princess Street, Fort Kochi, Kochi', '682001', 9.9650000, 76.2420000, 0.00, '24 Hours Open', '+91-484-2216500', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80', 4.84, 2100, TRUE),

-- Punjab (Amritsar)
(18, 1, 'Punjab', 'Amritsar', 'Heritage Street, Katra Ahluwalia', 'Sri Harmandir Sahib (Golden Temple) Corridor', 'World Spiritual Center of Peace & 24x7 Langar', 'Gilded Sikh sanctuary floating in the sacred Amrit Sarovar lake, accessible through a cobblestone pedestrian heritage street with Punjabi craft shops.', 'Walled City', 'Heritage Street, Katra Ahluwalia, Amritsar', '143006', 31.6200000, 74.8765000, 0.00, '24 Hours Open', '+91-183-2553957', 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80', 4.98, 8900, TRUE),

-- Madhya Pradesh (Indore)
(19, 4, 'Madhya Pradesh', 'Indore', '56 Dukan Street, New Palasia', 'Chhappan Dukan (56 Shops) Smart Food Street', 'India''s Cleanest FSSAI Certified Street Food Plaza', 'Famous culinary boulevard with exactly 56 specialty shops serving Indori Poha Jalebi, Johnny Hotdog, Johri Shikanji, and khopra patties.', 'Central Indore', 'New Palasia, 56 Dukan Street, Indore', '452001', 22.7244000, 75.8839000, 0.00, '06:00 AM - 11:00 PM', '+91-731-2530000', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80', 4.90, 3900, TRUE),

-- Himachal Pradesh (Shimla)
(20, 2, 'Himachal Pradesh', 'Shimla', 'Mall Road & The Ridge Promenade', 'The Ridge & Mall Road Alpine Promenade', 'Pedestrian Himalayan High Street with Panoramic Peaks', 'Famous vehicle-free mountain promenade overlooking the snow-capped Pir Panjal range, Tudor-style Christ Church, and Himachali woolen stalls.', 'Himalayan Ridge', 'The Mall Road, Near Scandal Point, Shimla', '171001', 31.1048000, 77.1734000, 0.00, '08:00 AM - 10:30 PM', '+91-177-2651000', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80', 4.88, 3100, TRUE),

-- Goa
(21, 6, 'Goa', 'Panaji', 'Rua 31 de Janeiro, Fontainhas', 'Fontainhas Latin Quarter & Portuguese Street', 'UNESCO Heritage Alleys with Pastel-Colored Colonial Mansions', 'Asia''s oldest Latin quarter featuring narrow cobblestone streets, red-tiled roofed villas, Portuguese bakeries, and live fado music venues.', 'Heritage Panaji', 'Rua 31 de Janeiro, Fontainhas, Panaji', '403001', 15.4989000, 73.8315000, 0.00, '24 Hours Open', '+91-832-2420000', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', 4.82, 1950, TRUE);

-- Emergency Facilities across India
INSERT INTO `emergency_facilities` (`facility_id`, `facility_name`, `type`, `state`, `city`, `street_name`, `zone`, `address`, `pincode`, `latitude`, `longitude`, `emergency_contact`, `ambulance_contact`, `available_icu_beds`) VALUES
(1, 'AIIMS Apex Trauma & Multi-Specialty Hospital', 'HOSPITAL', 'Delhi (NCR)', 'New Delhi', 'Sri Aurobindo Marg, Ansari Nagar', 'South Delhi', 'Ansari Nagar, Sri Aurobindo Marg, New Delhi', '110029', 28.5672000, 77.2100000, '102 / +91-11-26588500', '+91-11-26588700', 54),
(2, 'Central Metropolis Police Headquarters', 'POLICE_STATION', 'Delhi (NCR)', 'New Delhi', 'Jai Singh Road, Connaught Place', 'Central Delhi', 'Jai Singh Road, Near Civic Center, New Delhi', '110001', 28.6270000, 77.2150000, '100 / 112 / +91-11-23490000', NULL, 0),
(3, 'King Edward Memorial (KEM) Hospital', 'HOSPITAL', 'Maharashtra', 'Mumbai', 'Acharya Donde Marg, Parel', 'South Mumbai', 'Acharya Donde Marg, Parel, Mumbai', '400012', 19.0020000, 72.8420000, '102 / +91-22-24107000', '+91-22-24107100', 38),
(4, 'Sawai Man Singh (SMS) Government Hospital', 'HOSPITAL', 'Rajasthan', 'Jaipur', 'Jawahar Lal Nehru Marg, Ashok Nagar', 'Central Jaipur', 'JLN Marg, Ashok Nagar, Jaipur', '302004', 26.8990000, 75.8150000, '102 / +91-141-2560291', '+91-141-2560292', 32),
(5, 'Sir Sunderlal Hospital & BHU Trauma Center', 'HOSPITAL', 'Uttar Pradesh', 'Varanasi', 'Banaras Hindu University Campus', 'South Varanasi', 'BHU Campus, Lanka, Varanasi', '221005', 25.2750000, 82.9980000, '102 / +91-542-2369000', '+91-542-2369100', 28),
(6, 'Victoria Hospital & Bangalore Medical College', 'HOSPITAL', 'Karnataka', 'Bengaluru', 'Fort Road, Near City Market', 'Central Bengaluru', 'Fort Road, KR Market, Bengaluru', '560002', 12.9620000, 77.5750000, '102 / +91-80-26701150', '+91-80-26701151', 40),
(7, 'SSKM Hospital & Institute of Post Graduate Medical Education', 'HOSPITAL', 'West Bengal', 'Kolkata', 'AJC Bose Road, Bhowanipore', 'South Kolkata', '244, AJC Bose Road, Bhowanipore, Kolkata', '700020', 22.5390000, 88.3440000, '102 / +91-33-22231589', '+91-33-22231590', 30);
