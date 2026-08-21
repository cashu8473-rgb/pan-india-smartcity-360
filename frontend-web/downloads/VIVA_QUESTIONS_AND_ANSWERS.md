# Smart City Guide Project - Comprehensive Viva Voce Questions & Answers Guide

This document contains **30+ detailed Viva Voce questions & model answers** for final year university examinations and project defense.

---

### Category 1: Project Architecture & Domain
#### Q1: What is the core purpose and scope of the "Smart City Guide" project?
**Answer:**
The Smart City Guide is an integrated e-governance and civic navigation web application designed to bridge the interaction gap between municipal administration, citizens, and tourists. It provides:
1. Curated cultural, historical, and public transit navigation with interactive GIS mapping.
2. Real-time emergency healthcare and SOS dispatch with live hospital ICU bed availability.
3. Automated citizen grievance redressal system with unique tracking tokens and department routing.
4. Digital event ticketing and pass booking with dynamic cryptographic QR codes.
5. Administrative telemetry dashboard for urban planning analytics.

#### Q2: Why is this project relevant to the "Smart Cities Mission"?
**Answer:**
Modern smart cities rely on data interconnectivity, citizen participation, and rapid emergency response. This project centralizes essential city utilities into a unified digital platform, reducing response times for civic repairs and healthcare emergencies.

---

### Category 2: Backend Architecture & Java Technologies
#### Q3: Why did you choose Java and Spring Boot 3 over traditional PHP or Python Django?
**Answer:**
1. **Performance & Scalability:** Java provides strong type safety, robust multithreading, and enterprise memory management.
2. **Spring Boot Ecosystem:** Embedded Tomcat, zero XML configuration, dependency injection, and automatic ORM integration via Spring Data JPA.
3. **RESTful Architecture:** Clear separation of concerns between Controller, Service, and Repository layers.

#### Q4: Explain the architectural layers in your Spring Boot application.
**Answer:**
- **Controller Layer (`@RestController`):** Handles incoming HTTP requests (GET, POST, PATCH), deserializes JSON, and delegates to services.
- **Service Layer (`@Service`):** Contains business logic, calculations (such as Haversine distance matrix and token generation), and transaction management (`@Transactional`).
- **Repository / DAO Layer (`@Repository`):** Extends `JpaRepository` to perform CRUD queries and custom JPQL/native SQL queries.
- **Entity / Model Layer (`@Entity`):** Represents relational MySQL database tables mapped via JPA annotations.

#### Q5: What is the Haversine Formula and where is it applied in your code?
**Answer:**
The Haversine formula calculates the great-circle distance between two points on the surface of a sphere given their longitudes and latitudes:
$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
In our project, it is implemented in `EmergencyService.java` to compute the real-time distance in kilometers between the citizen's current GPS location and all emergency hospitals, fire stations, and police stations.

---

### Category 3: Database & MySQL
#### Q6: How are table relationships structured in MySQL (`smart_city_db`)?
**Answer:**
- `categories` &rarr; `city_places` (One-to-Many via `category_id`)
- `users` &rarr; `grievances` (One-to-Many via `user_id`)
- `events` &rarr; `event_bookings` (One-to-Many via `event_id` with `ON DELETE CASCADE`)
- `city_places` &rarr; `reviews` (One-to-Many via `place_id`)

#### Q7: What stored procedures did you write in MySQL?
**Answer:**
1. `sp_GetNearestEmergencyFacilities(lat, lng, type, maxLimit)`: Calculates distance using SQL trigonometry functions directly on the database engine.
2. `sp_GetCityDashboardStats()`: Aggregates real-time count of places, active grievances, resolution rate, and upcoming events in a single execution.

#### Q8: How did you optimize query performance in MySQL?
**Answer:**
We created composite and single-column B-Tree indexes on frequently queried and sorted columns:
- `idx_places_category` on `city_places(category_id)`
- `idx_emergency_type` on `emergency_facilities(type)`
- `idx_grievance_token` on `grievances(tracking_token)`
- `idx_events_date` on `events(start_date, status)`

---

### Category 4: Frontend & Resilience
#### Q9: What happens if the MySQL server or Spring Boot backend is temporarily down during a live presentation?
**Answer:**
The frontend utilizes a **Hybrid Data Layer (`api.js`)**. It performs an asynchronous health probe to the Java backend. If the backend is unreachable, it seamlessly switches to HTML5 `LocalStorage` and built-in mock datasets. This guarantees that all UI functions (filtering, complaint submission, tracking timeline, map popups, QR pass generation) continue to function smoothly without throwing errors.

#### Q10: How does the QR Code Pass generation work?
**Answer:**
When an attendee reserves a pass, the application generates a cryptographic tracking string (`VERIFIED-SMARTCITY-EPASS-XXXX-TICKETS-N`). This hash is converted into a scannable QR matrix on the frontend, allowing event marshals to scan and authenticate passes at city venue gates.
