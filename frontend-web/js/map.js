/**
 * SMART CITY GUIDE - INTERACTIVE LEAFLET MAP MODULE
 * Real-time map rendering, custom colored pins, popups, and layer filtering.
 */

class SmartCityMap {
    constructor() {
        this.map = null;
        this.markersLayer = null;
        this.userLocation = { lat: 28.6139, lng: 77.2090 }; // Metropolis City Center
        this.userMarker = null;
    }

    init(mapContainerId = 'smart-map') {
        const container = document.getElementById(mapContainerId);
        if (!container || this.map) return;

        // Initialize Leaflet Map
        this.map = L.map(mapContainerId, {
            center: [this.userLocation.lat, this.userLocation.lng],
            zoom: 13,
            zoomControl: false
        });

        // Add Zoom Control at bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors | Smart City Mission',
            maxZoom: 19
        }).addTo(this.map);

        this.markersLayer = L.layerGroup().addTo(this.map);

        // Render User Location Pin
        this.renderUserLocationMarker();

        // Try HTML5 Geolocation
        this.detectUserGPS();
    }

    detectUserGPS() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    this.userLocation.lat = pos.coords.latitude;
                    this.userLocation.lng = pos.coords.longitude;
                    this.renderUserLocationMarker();
                },
                (err) => {
                    console.log("Using default city center coordinates.");
                },
                { timeout: 5000 }
            );
        }
    }

    renderUserLocationMarker() {
        if (!this.map) return;
        if (this.userMarker) {
            this.userMarker.setLatLng([this.userLocation.lat, this.userLocation.lng]);
            return;
        }

        const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `<div class="user-pulse-dot"><i class="fas fa-street-view"></i></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], { icon: userIcon })
            .addTo(this.map)
            .bindPopup('<b><i class="fas fa-location-arrow"></i> You are here</b><br>Metropolis Smart Citizen Node');
    }

    renderPlacesOnMap(places, emergencyFacilities = []) {
        if (!this.map || !this.markersLayer) return;
        this.markersLayer.clearLayers();

        // Add City Places
        places.forEach(place => {
            const isHeritage = place.categoryId === 1;
            const isPark = place.categoryId === 2;
            const isFood = place.categoryId === 4;

            let iconColor = '#2563eb'; // blue
            let iconClass = 'fa-map-pin';
            if (isHeritage) { iconColor = '#b45309'; iconClass = 'fa-landmark'; }
            else if (isPark) { iconColor = '#059669'; iconClass = 'fa-tree'; }
            else if (isFood) { iconColor = '#ea580c'; iconClass = 'fa-utensils'; }

            const customIcon = L.divIcon({
                className: 'city-map-marker',
                html: `<div class="map-pin-badge" style="background-color: ${iconColor};">
                        <i class="fas ${iconClass}"></i>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -28]
            });

            const popupContent = `
                <div class="map-popup-card">
                    <img src="${place.imageUrl}" alt="${place.title}" class="map-popup-img">
                    <div class="map-popup-body">
                        <span class="map-popup-badge">${place.categoryName || 'Attraction'}</span>
                        <h4 class="map-popup-title">${place.title}</h4>
                        <p class="map-popup-addr"><i class="fas fa-location-dot"></i> ${place.address}</p>
                        <div class="map-popup-footer">
                            <span class="map-popup-rating"><i class="fas fa-star text-amber-500"></i> ${place.ratingAvg}</span>
                            <span class="map-popup-fee">${place.entryFee > 0 ? '₹' + place.entryFee : 'Free Entry'}</span>
                        </div>
                        <button onclick="window.smartCityApp.openPlaceModal(${place.id})" class="map-popup-btn">
                            View Guide & Details
                        </button>
                    </div>
                </div>
            `;

            L.marker([place.lat, place.lng], { icon: customIcon })
                .bindPopup(popupContent)
                .addTo(this.markersLayer);
        });

        // Add Emergency Facilities
        emergencyFacilities.forEach(facility => {
            let iconColor = '#dc2626'; // red for hospital/emergency
            let iconClass = 'fa-hospital';
            if (facility.type === 'POLICE_STATION') { iconColor = '#1e3a8a'; iconClass = 'fa-shield-halved'; }
            else if (facility.type === 'FIRE_STATION') { iconColor = '#ea580c'; iconClass = 'fa-fire-extinguisher'; }
            else if (facility.type === 'BLOOD_BANK') { iconColor = '#e11d48'; iconClass = 'fa-droplet'; }

            const emIcon = L.divIcon({
                className: 'city-emergency-marker',
                html: `<div class="map-pin-badge emergency-pin" style="background-color: ${iconColor};">
                        <i class="fas ${iconClass}"></i>
                       </div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 34],
                popupAnchor: [0, -30]
            });

            const emPopup = `
                <div class="map-popup-card emergency-popup">
                    <div class="map-popup-body">
                        <span class="map-popup-badge badge-emergency">${facility.type.replace('_', ' ')}</span>
                        <h4 class="map-popup-title">${facility.facilityName}</h4>
                        <p class="map-popup-addr"><i class="fas fa-map-pin"></i> ${facility.address}</p>
                        ${facility.availableIcuBeds > 0 ? `<p class="map-popup-icu"><b>ICU Beds Available:</b> ${facility.availableIcuBeds}</p>` : ''}
                        <div class="map-popup-footer">
                            <a href="tel:${facility.emergencyContact.split('/')[0].trim()}" class="map-popup-sos-btn">
                                <i class="fas fa-phone-alt"></i> Call ${facility.emergencyContact.split('/')[0]}
                            </a>
                        </div>
                    </div>
                </div>
            `;

            L.marker([facility.lat, facility.lng], { icon: emIcon })
                .bindPopup(emPopup)
                .addTo(this.markersLayer);
        });
    }

    flyToLocation(lat, lng, zoom = 15) {
        if (this.map) {
            this.map.flyTo([lat, lng], zoom, { duration: 1.2 });
        }
    }
}

window.smartCityMap = new SmartCityMap();
