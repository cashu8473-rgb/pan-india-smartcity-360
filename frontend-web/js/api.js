/**
 * SMART CITY GUIDE - PAN-INDIA API & DATA ACCESS LAYER
 * Handles REST calls with automatic offline fallback to LocalStorage/Pan-India Mock Data.
 */

const API_BASE_URL = 'http://localhost:8080/api/v1';

class SmartCityAPI {
    constructor() {
        this.backendAvailable = null;
        this.initStorage();
    }

    initStorage() {
        // Overwrite or populate with full Pan-India dataset
        localStorage.setItem('sc_places', JSON.stringify(SMART_CITY_MOCK.places));
        localStorage.setItem('sc_emergency', JSON.stringify(SMART_CITY_MOCK.emergencyFacilities));
        localStorage.setItem('sc_grievances', JSON.stringify(SMART_CITY_MOCK.grievances));
        localStorage.setItem('sc_events', JSON.stringify(SMART_CITY_MOCK.events));
        if (!localStorage.getItem('sc_bookings')) {
            localStorage.setItem('sc_bookings', JSON.stringify([]));
        }
    }

    async checkBackend() {
        if (this.backendAvailable !== null) return this.backendAvailable;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);
            const res = await fetch(`${API_BASE_URL}/places`, { signal: controller.signal });
            clearTimeout(timeoutId);
            this.backendAvailable = res.ok;
        } catch (e) {
            this.backendAvailable = false;
        }
        return this.backendAvailable;
    }

    // --- PAN-INDIA PLACES ---
    async getPlaces(query = '', state = 'All India', city = 'All Cities', categoryId = null) {
        const isBackend = await this.checkBackend();
        if (isBackend) {
            try {
                let url = `${API_BASE_URL}/places?`;
                if (query) url += `search=${encodeURIComponent(query)}&`;
                if (state && state !== 'All India') url += `state=${encodeURIComponent(state)}&`;
                if (city && city !== 'All Cities') url += `city=${encodeURIComponent(city)}&`;
                if (categoryId && categoryId !== 'all') url += `categoryId=${categoryId}&`;
                const res = await fetch(url);
                if (res.ok) return await res.json();
            } catch (err) {
                console.warn('API call failed, fallback to local storage', err);
            }
        }

        // Local Storage filter
        let places = JSON.parse(localStorage.getItem('sc_places') || '[]');
        if (state && state !== 'All India') {
            places = places.filter(p => p.state.toLowerCase() === state.toLowerCase());
        }
        if (city && city !== 'All Cities') {
            places = places.filter(p => p.city.toLowerCase() === city.toLowerCase());
        }
        if (categoryId && categoryId !== 'all') {
            places = places.filter(p => p.categoryId == categoryId);
        }
        if (query) {
            const q = query.toLowerCase();
            places = places.filter(p => 
                p.title.toLowerCase().includes(q) || 
                (p.streetName && p.streetName.toLowerCase().includes(q)) ||
                p.description.toLowerCase().includes(q) ||
                p.address.toLowerCase().includes(q) ||
                p.city.toLowerCase().includes(q) ||
                p.state.toLowerCase().includes(q) ||
                (p.pincode && p.pincode.includes(q))
            );
        }
        return places;
    }

    async getPlaceById(id) {
        const places = JSON.parse(localStorage.getItem('sc_places') || '[]');
        return places.find(p => p.id == id) || null;
    }

    async addPlaceReview(placeId, review) {
        const places = JSON.parse(localStorage.getItem('sc_places') || '[]');
        const place = places.find(p => p.id == placeId);
        if (place) {
            if (!place.reviews) place.reviews = [];
            place.reviews.unshift({
                author: review.author || 'Anonymous Traveler',
                rating: review.rating || 5,
                date: 'Just now',
                comment: review.comment
            });
            place.totalReviews = (place.totalReviews || 0) + 1;
            const sum = place.reviews.reduce((acc, r) => acc + r.rating, 0);
            place.ratingAvg = parseFloat((sum / place.reviews.length).toFixed(2));
            localStorage.setItem('sc_places', JSON.stringify(places));
            return place;
        }
        return null;
    }

    // --- EMERGENCY FACILITIES ---
    async getEmergencyFacilities(userLat = 28.6139, userLng = 77.2090, state = 'All India', city = 'All Cities') {
        const isBackend = await this.checkBackend();
        if (isBackend) {
            try {
                const res = await fetch(`${API_BASE_URL}/emergency/nearest?lat=${userLat}&lng=${userLng}`);
                if (res.ok) return await res.json();
            } catch (err) {}
        }

        let facilities = JSON.parse(localStorage.getItem('sc_emergency') || '[]');
        if (state && state !== 'All India') {
            facilities = facilities.filter(f => f.state.toLowerCase() === state.toLowerCase());
        }
        if (city && city !== 'All Cities') {
            facilities = facilities.filter(f => f.city.toLowerCase() === city.toLowerCase());
        }

        return facilities.map(f => {
            const dist = this.calculateDistance(userLat, userLng, f.lat, f.lng);
            return { ...f, distanceInKm: parseFloat(dist.toFixed(2)) };
        }).sort((a, b) => a.distanceInKm - b.distanceInKm);
    }

    // --- GRIEVANCES ---
    async getGrievances(status = 'ALL') {
        let list = JSON.parse(localStorage.getItem('sc_grievances') || '[]');
        if (status && status !== 'ALL') {
            list = list.filter(g => g.status === status);
        }
        return list;
    }

    async submitGrievance(data) {
        const list = JSON.parse(localStorage.getItem('sc_grievances') || '[]');
        const token = 'GRV-2026-' + Math.floor(1000 + Math.random() * 9000);
        
        let dept = "Municipal Corporation";
        if (data.category === "ROAD_POTHOLE") dept = "Public Works Department (PWD)";
        else if (data.category === "STREET_LIGHT") dept = "City Electricity & Energy Board";
        else if (data.category === "GARBAGE_COLLECTION") dept = "Smart Waste & Sanitation Board";
        else if (data.category === "WATER_LEAKAGE") dept = "Municipal Water & Sewerage Board";
        else if (data.category === "TRAFFIC_SIGNAL") dept = "Traffic Police & Smart Mobility";

        const newGrievance = {
            id: Date.now(),
            trackingToken: token,
            citizenName: data.citizenName || 'Citizen',
            citizenPhone: data.citizenPhone || '+91-9800000000',
            citizenEmail: data.citizenEmail || '',
            state: data.state || 'Delhi (NCR)',
            city: data.city || 'New Delhi',
            streetName: data.streetName || data.locationAddress,
            category: data.category || 'OTHER',
            title: data.title,
            description: data.description,
            zone: data.zone || 'Central Zone',
            locationAddress: data.locationAddress,
            status: 'SUBMITTED',
            priority: data.priority || 'MEDIUM',
            assignedDepartment: dept,
            officerNotes: 'Complaint received and queued for area inspection.',
            submittedAt: new Date().toLocaleString(),
            resolvedAt: null
        };

        list.unshift(newGrievance);
        localStorage.setItem('sc_grievances', JSON.stringify(list));
        return newGrievance;
    }

    async trackGrievance(token) {
        const list = JSON.parse(localStorage.getItem('sc_grievances') || '[]');
        return list.find(g => g.trackingToken.toUpperCase() === token.trim().toUpperCase()) || null;
    }

    async updateGrievanceStatus(id, newStatus, notes) {
        const list = JSON.parse(localStorage.getItem('sc_grievances') || '[]');
        const item = list.find(g => g.id == id);
        if (item) {
            item.status = newStatus;
            if (notes) item.officerNotes = notes;
            if (newStatus === 'RESOLVED') item.resolvedAt = new Date().toLocaleString();
            localStorage.setItem('sc_grievances', JSON.stringify(list));
            return item;
        }
        return null;
    }

    // --- EVENTS & PASSES ---
    async getEvents() {
        return JSON.parse(localStorage.getItem('sc_events') || '[]');
    }

    async bookEventPass(bookingData) {
        const events = JSON.parse(localStorage.getItem('sc_events') || '[]');
        const event = events.find(e => e.id == bookingData.eventId);
        if (!event) throw new Error('Event not found');

        const qty = parseInt(bookingData.numTickets) || 1;
        event.bookedSeats = (event.bookedSeats || 0) + qty;
        localStorage.setItem('sc_events', JSON.stringify(events));

        const passRef = 'EPASS-2026-' + Math.floor(1000 + Math.random() * 9000);
        const pass = {
            bookingId: Date.now(),
            bookingRef: passRef,
            eventId: event.id,
            eventTitle: event.title,
            venue: event.venueName,
            streetName: event.streetName,
            city: event.city,
            state: event.state,
            eventDate: event.startDate,
            attendeeName: bookingData.attendeeName,
            attendeeEmail: bookingData.attendeeEmail,
            attendeePhone: bookingData.attendeePhone,
            numTickets: qty,
            totalAmount: event.entryFee * qty,
            paymentStatus: (event.entryFee > 0) ? 'PAID' : 'FREE',
            qrCodeHash: `VERIFIED-INDIA-${event.city.toUpperCase()}-${passRef}-TICKETS-${qty}`,
            bookedAt: new Date().toLocaleString()
        };

        const bookings = JSON.parse(localStorage.getItem('sc_bookings') || '[]');
        bookings.unshift(pass);
        localStorage.setItem('sc_bookings', JSON.stringify(bookings));
        return pass;
    }

    async getDashboardAnalytics() {
        const places = JSON.parse(localStorage.getItem('sc_places') || '[]');
        const emergency = JSON.parse(localStorage.getItem('sc_emergency') || '[]');
        const grievances = JSON.parse(localStorage.getItem('sc_grievances') || '[]');
        const events = JSON.parse(localStorage.getItem('sc_events') || '[]');
        const bookings = JSON.parse(localStorage.getItem('sc_bookings') || '[]');

        const resolved = grievances.filter(g => g.status === 'RESOLVED').length;
        const active = grievances.length - resolved;

        return {
            totalPlaces: places.length,
            totalStatesCovered: 28,
            totalEmergencyUnits: emergency.length,
            totalGrievances: grievances.length,
            resolvedGrievances: resolved,
            activeGrievances: active,
            resolutionRatePercent: grievances.length > 0 ? Math.round((resolved / grievances.length) * 100) : 100,
            totalEvents: events.length,
            totalPassesIssued: bookings.length + 320,
            activeIcuBeds: emergency.reduce((acc, curr) => acc + (curr.availableIcuBeds || 0), 0)
        };
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

window.smartCityAPI = new SmartCityAPI();
