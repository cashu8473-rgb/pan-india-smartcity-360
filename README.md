# 🏙️ SMART CITY GUIDE & CITIZEN SERVICES WEB APPLICATION-- https://vercel.com/runtime-rebels9/pan-india-smartcity-360

> **Complete College Major / Final Year Project Submission Package**  
> **Tech Stack:** Java 17 / 21 &bull; Spring Boot 3 &bull; Hibernate JPA &bull; MySQL 8.0 &bull; RESTful APIs &bull; Responsive SPA

---

## 🌟 Project Overview
**SmartCity 360** is an enterprise-grade web application integrating:
1. 🏛️ **Tourism & Heritage Navigator**: Attractions, opening hours, ticket pricing, audio tours, and OpenStreetMap GPS pins.
2. 🚨 **24x7 Emergency SOS Radar**: One-click dialers (112, 102, 101, 1091), real-time distance calculator (Haversine Formula), and live ICU hospital bed availability.
3. 📢 **Citizen Grievance Redressal**: File complaints with auto-assigned municipal departments, GPS geotagging, unique token generation (`GRV-2026-XXXX`), and a 4-step live visual timeline status tracker.
4. 🎟️ **City Events & E-Pass Booking**: Cultural carnivals, tech summits, marathons with dynamic cryptographic QR code ticket generation and print-ready passes.
5. 📊 **Municipal Command Dashboard**: Official analytics (Chart.js), grievance dispatch board, and real-time city metrics.
6. 📄 **Printable PDF Source Code Book & Report**: Comprehensive project documentation, database ER diagrams, and Viva Voce preparation guide.

---

## 📁 Project Directory Structure
```
smart-city-guide/
├── backend-java/                                # Java Spring Boot REST API
│   ├── pom.xml                                  # Maven dependencies
│   └── src/main/
│       ├── java/com/smartcity/
│       │   ├── SmartCityApplication.java        # Spring Boot Entry Point
│       │   ├── config/                          # CORS and Security
│       │   ├── controller/                      # REST API Endpoints
│       │   ├── model/                           # JPA Relational Entities
│       │   ├── repository/                      # Spring Data JPA Repositories
│       │   └── service/                         # Business Logic & Haversine Distance
│       └── resources/
│           └── application.properties           # MySQL config
├── database/
│   ├── smart_city_db.sql                        # Schema, Tables, Stored Procedures & Seed Data
│   └── ER_DIAGRAM.md                            # Entity-Relationship breakdown
├── frontend-web/                                # Dynamic Web Portal
│   ├── index.html                               # Modern Single-Page Application
│   ├── css/style.css                            # Clean responsive design system
│   └── js/
│       ├── app.js                               # UI Navigation & Controller
│       ├── api.js                               # REST API & LocalStorage Hybrid Data Layer
│       ├── map.js                               # Leaflet.js Interactive GIS Mapping
│       └── mock-data.js                         # Seed dataset
├── docs-and-pdf/
│   ├── PROJECT_REPORT_AND_SOURCE_CODE.html      # Ready-to-Print / PDF Project Book
│   ├── VIVA_QUESTIONS_AND_ANSWERS.md            # 30+ Viva Voce Questions & Answers
│   └── README.md
└── run-project.bat                              # One-click start script
```

---

## 🚀 How to Run the Project

### Option A: Instant Web Portal Launch (Demo / Projector Presentation Mode)
1. Double-click `run-project.bat` or open `frontend-web/index.html` in any web browser.
2. The web application runs in full interactive mode with instant search, map markers, grievance tracking, SOS radar, and QR pass generation!

### Option B: Full-Stack Execution with Java & MySQL
1. **Setup MySQL Database:**
   ```sql
   CREATE DATABASE smart_city_db;
   USE smart_city_db;
   SOURCE database/smart_city_db.sql;
   ```
2. **Start Java Spring Boot Backend:**
   ```bash
   cd backend-java
   mvn spring-boot:run
   ```
   *The backend REST API will be live at `http://localhost:8080/api/v1`.*
3. **Open Frontend:**
   Open `frontend-web/index.html` in Chrome, Edge, or Firefox.

---

## 🖨️ How to Generate the PDF Source Code Book & Report
1. Open `docs-and-pdf/PROJECT_REPORT_AND_SOURCE_CODE.html` in Google Chrome or Microsoft Edge.
2. Click the blue **"Click to Print / Save as PDF"** button at the top (or press `Ctrl + P`).
3. Set **Destination:** `Save as PDF` &bull; **Paper size:** `A4` &bull; **Margins:** `Default`.
4. Click **Save**. You now have a complete, professional, submission-ready project report PDF with all source code!

---

## 🎓 Viva Voce Highlights
- **Architecture:** 3-Tier Enterprise Architecture (Presentation Layer &rarr; Application Layer &rarr; Persistence Layer).
- **Algorithms:** Haversine Great-Circle Distance Metric for Emergency Units.
- **Resilience:** Hybrid Data Layer with LocalStorage auto-fallback for offline reliability.
- **Security:** SQL Injection prevention via JPA Parameterized Queries and CORS filters.
