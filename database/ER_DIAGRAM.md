# Smart City Database Architecture & ER Diagram Specification

## 1. Entity-Relationship (ER) Overview
The `smart_city_db` database is designed according to **3rd Normal Form (3NF)** standards with relational integrity, foreign key cascades/set-null constraints, and indexing for high performance.

```mermaid
erDiagram
    USERS ||--o{ GRIEVANCES : "files"
    USERS ||--o{ EVENT_BOOKINGS : "reserves"
    USERS ||--o{ REVIEWS : "writes"
    CATEGORIES ||--o{ CITY_PLACES : "classifies"
    CITY_PLACES ||--o{ REVIEWS : "receives"
    EVENTS ||--o{ EVENT_BOOKINGS : "contains"

    USERS {
        bigint user_id PK
        varchar full_name
        varchar email UK
        varchar password_hash
        varchar phone
        enum role
        varchar city_zone
        timestamp created_at
    }

    CATEGORIES {
        int category_id PK
        varchar name UK
        varchar code UK
        varchar icon
        varchar description
    }

    CITY_PLACES {
        bigint place_id PK
        int category_id FK
        varchar title
        varchar tagline
        text description
        varchar zone
        varchar address
        decimal latitude
        decimal longitude
        decimal entry_fee
        varchar opening_hours
        varchar image_url
        decimal rating_avg
        int total_reviews
        boolean is_featured
    }

    EMERGENCY_FACILITIES {
        bigint facility_id PK
        varchar facility_name
        enum type
        varchar zone
        varchar address
        decimal latitude
        decimal longitude
        varchar emergency_contact
        varchar ambulance_contact
        int available_icu_beds
        boolean is_24x7
        enum status
    }

    GRIEVANCES {
        bigint grievance_id PK
        varchar tracking_token UK
        bigint user_id FK
        varchar citizen_name
        varchar citizen_phone
        varchar citizen_email
        enum category
        varchar title
        text description
        varchar zone
        varchar location_address
        decimal latitude
        decimal longitude
        varchar image_url
        enum status
        enum priority
        varchar assigned_department
        timestamp submitted_at
        timestamp resolved_at
    }

    EVENTS {
        bigint event_id PK
        varchar title
        varchar category
        varchar organizer
        varchar venue_name
        varchar zone
        datetime start_date
        datetime end_date
        decimal entry_fee
        int total_seats
        int booked_seats
        text description
        varchar banner_image
        enum status
    }

    EVENT_BOOKINGS {
        bigint booking_id PK
        varchar booking_ref UK
        bigint event_id FK
        bigint user_id FK
        varchar attendee_name
        varchar attendee_email
        varchar attendee_phone
        int num_tickets
        decimal total_amount
        enum payment_status
        varchar qr_code_hash
        timestamp booked_at
    }

    REVIEWS {
        bigint review_id PK
        bigint place_id FK
        bigint user_id FK
        varchar author_name
        int rating
        text comment
        timestamp created_at
    }
```

---

## 2. Table Specifications & Relationships

| Table Name | Primary Key | Foreign Key References | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `user_id` | - | Manages Citizens, Tourists, Municipal Officers, and Admins. |
| `categories` | `category_id` | - | Defines taxonomy for attractions (Heritage, Parks, Museums, Food, Transit). |
| `city_places` | `place_id` | `category_id` &rarr; `categories(category_id)` | Stores smart city attractions, coordinates, opening hours, pricing. |
| `emergency_facilities` | `facility_id` | - | Emergency health, police, fire, blood bank stations with real-time bed counts. |
| `grievances` | `grievance_id` | `user_id` &rarr; `users(user_id)` | Citizen complaints with unique tracking token, GPS geotag, and status lifecycle. |
| `events` | `event_id` | - | City exhibitions, marathons, cultural summits with seat allocations. |
| `event_bookings` | `booking_id` | `event_id` &rarr; `events`, `user_id` &rarr; `users` | Issued digital E-Passes with cryptographic QR hash. |
| `reviews` | `review_id` | `place_id` &rarr; `city_places`, `user_id` &rarr; `users` | Crowdsourced ratings & feedback for city landmarks. |
