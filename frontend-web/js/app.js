/**
 * SMART CITY GUIDE & CITIZEN SERVICES - PAN-INDIA CONTROLLER
 * Handles State, City, and Local Street Level Navigation across India.
 */

class SmartCityApp {
    constructor() {
        this.currentView = 'explore';
        this.currentUserRole = 'ROLE_CITIZEN';
        this.currentStateFilter = 'All India';
        this.currentCityFilter = 'All Cities';
        this.currentCategoryFilter = 'all';
        this.searchQuery = '';
        this.chartInstance = null;

        this.cityCoordinates = {
            'All India': { lat: 22.5937, lng: 78.9629, zoom: 5 },
            'New Delhi': { lat: 28.6139, lng: 77.2090, zoom: 12 },
            'Mumbai': { lat: 18.9432, lng: 72.8230, zoom: 12 },
            'Pune': { lat: 18.5204, lng: 73.8567, zoom: 13 },
            'Jaipur': { lat: 26.9124, lng: 75.7873, zoom: 13 },
            'Udaipur': { lat: 24.5854, lng: 73.7125, zoom: 13 },
            'Varanasi': { lat: 25.3176, lng: 82.9739, zoom: 13 },
            'Lucknow': { lat: 26.8467, lng: 80.9462, zoom: 13 },
            'Bengaluru': { lat: 12.9716, lng: 77.5946, zoom: 12 },
            'Kolkata': { lat: 22.5726, lng: 88.3639, zoom: 12 },
            'Chennai': { lat: 13.0827, lng: 80.2707, zoom: 12 },
            'Hyderabad': { lat: 17.3850, lng: 78.4867, zoom: 12 },
            'Kochi': { lat: 9.9312, lng: 76.2673, zoom: 13 },
            'Amritsar': { lat: 31.6340, lng: 74.8723, zoom: 13 },
            'Indore': { lat: 22.7196, lng: 75.8577, zoom: 13 },
            'Shimla': { lat: 31.1048, lng: 77.1734, zoom: 14 },
            'Panaji': { lat: 15.4909, lng: 73.8278, zoom: 14 },
            'Srinagar': { lat: 34.0837, lng: 74.7973, zoom: 13 },
            'Guwahati': { lat: 26.1445, lng: 91.7362, zoom: 13 }
        };
    }

    async init() {
        this.populateStateAndCityDropdowns();
        this.setupEventListeners();
        await this.loadPlaces();
        await this.loadEmergencyUnits();
        await this.loadGrievances();
        await this.loadEvents();
        await this.loadDashboardStats();

        setTimeout(() => {
            if (window.smartCityMap) {
                window.smartCityMap.init('smart-map');
                this.syncMapMarkers();
            }
        }, 300);
    }

    populateStateAndCityDropdowns() {
        const stateSelect = document.getElementById('state-filter-select');
        const grievanceStateSelect = document.getElementById('grv-state-select');
        if (!stateSelect) return;

        stateSelect.innerHTML = SMART_CITY_MOCK.statesAndCities.map(s => 
            `<option value="${s.state}">${s.state}</option>`
        ).join('');

        if (grievanceStateSelect) {
            grievanceStateSelect.innerHTML = SMART_CITY_MOCK.statesAndCities
                .filter(s => s.state !== 'All India')
                .map(s => `<option value="${s.state}">${s.state}</option>`).join('');
        }

        this.updateCityDropdown();
    }

    updateCityDropdown() {
        const stateSelect = document.getElementById('state-filter-select');
        const citySelect = document.getElementById('city-filter-select');
        if (!stateSelect || !citySelect) return;

        const selectedState = stateSelect.value;
        this.currentStateFilter = selectedState;

        const stateObj = SMART_CITY_MOCK.statesAndCities.find(s => s.state === selectedState);
        const cities = stateObj ? stateObj.cities : ["All Cities"];

        citySelect.innerHTML = cities.map(c => `<option value="${c}">${c}</option>`).join('');
        this.currentCityFilter = citySelect.value;
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = btn.dataset.view;
                if (target) {
                    this.switchView(target);
                }
            });
        });

        const stateSelect = document.getElementById('state-filter-select');
        if (stateSelect) {
            stateSelect.addEventListener('change', () => {
                this.updateCityDropdown();
                this.loadPlaces();
                this.syncMapWithSelectedLocation();
            });
        }

        const citySelect = document.getElementById('city-filter-select');
        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                this.currentCityFilter = e.target.value;
                this.loadPlaces();
                this.syncMapWithSelectedLocation();
            });
        }

        const heroSearchInput = document.getElementById('hero-search-input');
        if (heroSearchInput) {
            heroSearchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.loadPlaces();
            });
        }

        const roleSelector = document.getElementById('role-selector');
        if (roleSelector) {
            roleSelector.addEventListener('change', (e) => {
                this.currentUserRole = e.target.value;
                this.updateRoleUI();
            });
        }

        const grievanceForm = document.getElementById('grievance-submission-form');
        if (grievanceForm) {
            grievanceForm.addEventListener('submit', (e) => this.handleGrievanceSubmit(e));
        }

        const trackForm = document.getElementById('grievance-track-form');
        if (trackForm) {
            trackForm.addEventListener('submit', (e) => this.handleGrievanceTrack(e));
        }

        const passBookingForm = document.getElementById('pass-booking-form');
        if (passBookingForm) {
            passBookingForm.addEventListener('submit', (e) => this.handlePassBooking(e));
        }
    }

    syncMapWithSelectedLocation() {
        if (!window.smartCityMap || !window.smartCityMap.map) return;
        const city = this.currentCityFilter;
        const coords = this.cityCoordinates[city] || this.cityCoordinates[this.currentStateFilter] || this.cityCoordinates['All India'];
        if (coords) {
            window.smartCityMap.map.flyTo([coords.lat, coords.lng], coords.zoom, { duration: 1.5 });
        }
        this.syncMapMarkers();
    }

    switchView(viewName) {
        this.currentView = viewName;
        document.querySelectorAll('.nav-item-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        document.querySelectorAll('.view-section').forEach(sec => {
            sec.style.display = 'none';
        });

        const activeSec = document.getElementById(`view-${viewName}`);
        if (activeSec) {
            activeSec.style.display = 'block';
            window.scrollTo({ top: activeSec.offsetTop - 90, behavior: 'smooth' });
        }

        if (viewName === 'map' && window.smartCityMap) {
            setTimeout(() => {
                if (window.smartCityMap.map) window.smartCityMap.map.invalidateSize();
                this.syncMapMarkers();
            }, 200);
        }

        if (viewName === 'admin') {
            this.loadDashboardStats();
            this.renderAdminCharts();
        }
    }

    updateRoleUI() {
        const adminNav = document.getElementById('nav-admin-btn');
        if (adminNav) {
            adminNav.style.display = (this.currentUserRole === 'ROLE_ADMIN' || this.currentUserRole === 'ROLE_OFFICER') ? 'flex' : 'none';
        }
        this.showToast(`Switched profile to ${this.currentUserRole.replace('ROLE_', '')}`);
    }

    // --- DOWNLOAD HANDLER UTILITY ---
    triggerDirectDownload(fileName, targetUrl) {
        const link = document.createElement('a');
        link.href = targetUrl || `downloads/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast(`Downloading ${fileName}... Check your Downloads folder.`);
    }

    // --- PLACES RENDER ---
    async loadPlaces() {
        const container = document.getElementById('places-cards-container');
        if (!container) return;

        const places = await window.smartCityAPI.getPlaces(
            this.searchQuery, 
            this.currentStateFilter, 
            this.currentCityFilter, 
            this.currentCategoryFilter
        );
        
        if (places.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--slate-500); background: #fff; border-radius: var(--radius-md); border: 1px dashed var(--slate-300);">
                    <i class="fas fa-location-crosshairs" style="font-size: 2.5rem; color: var(--primary-500); margin-bottom: 12px;"></i>
                    <h3 style="color: var(--slate-800); margin-bottom: 6px;">No spots found in ${this.currentCityFilter}, ${this.currentStateFilter}</h3>
                    <p style="font-size: 0.9rem;">Try selecting "All India" or search another city, famous street, or category.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = places.map(place => `
            <div class="place-card">
                <div class="place-img-wrapper">
                    <img src="${place.imageUrl}" alt="${place.title}" loading="lazy">
                    <span class="place-tag-badge">${place.categoryName || 'Attraction'}</span>
                    <span class="place-rating-badge"><i class="fas fa-star" style="color: #f59e0b;"></i> ${place.ratingAvg}</span>
                </div>
                <div class="place-card-body">
                    <div class="place-zone-meta">
                        <i class="fas fa-map-pin"></i> <b>${place.city}, ${place.state}</b>
                    </div>
                    <div style="font-size: 0.775rem; color: #b45309; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
                        <i class="fas fa-road"></i> ${place.streetName || place.address}
                    </div>
                    <h3 class="place-title">${place.title}</h3>
                    <p class="place-desc">${place.description}</p>
                    <div class="place-details-row">
                        <span class="place-fee">${place.entryFee > 0 ? '₹' + place.entryFee + ' / Person' : 'Free Entry'}</span>
                        <button onclick="window.smartCityApp.openPlaceModal(${place.id})" class="place-btn-view">
                            <i class="fas fa-circle-info"></i> View Guide
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectQuickCity(cityName, stateName) {
        const stateSelect = document.getElementById('state-filter-select');
        const citySelect = document.getElementById('city-filter-select');
        if (stateSelect && citySelect) {
            stateSelect.value = stateName;
            this.updateCityDropdown();
            citySelect.value = cityName;
            this.currentCityFilter = cityName;
            this.loadPlaces();
            this.syncMapWithSelectedLocation();
            this.switchView('explore');
            this.showToast(`Exploring ${cityName}, ${stateName}`);
        }
    }

    async filterPlacesByCategory(categoryCode, element) {
        document.querySelectorAll('.hero-tag-btn').forEach(b => b.classList.remove('active'));
        if (element) element.classList.add('active');

        if (categoryCode === 'all') {
            this.currentCategoryFilter = 'all';
        } else {
            const catMap = { 'HERITAGE': 1, 'PARKS': 2, 'MUSEUMS': 3, 'FOOD': 4, 'TRANSIT': 5, 'SHOPPING': 6 };
            this.currentCategoryFilter = catMap[categoryCode] || null;
        }
        await this.loadPlaces();
        this.switchView('explore');
    }

    async openPlaceModal(placeId) {
        const place = await window.smartCityAPI.getPlaceById(placeId);
        if (!place) return;

        const modalBody = document.getElementById('place-modal-body');
        modalBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <img src="${place.imageUrl}" alt="${place.title}" style="width: 100%; height: 260px; object-fit: cover; border-radius: var(--radius-md);">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                    <span class="place-zone-meta"><i class="fas fa-location-dot"></i> ${place.city}, ${place.state} &bull; PIN: ${place.pincode || '110001'}</span>
                    <h2 style="font-size: 1.45rem; margin-top: 4px;">${place.title}</h2>
                    <div style="color: #b45309; font-weight: 600; font-size: 0.85rem; margin-top: 2px;">
                        <i class="fas fa-road"></i> Street / Alley: ${place.streetName || place.address}
                    </div>
                </div>
                <div style="font-size: 1.1rem; font-weight: 700; color: #f59e0b; background: var(--amber-50); padding: 4px 12px; border-radius: var(--radius-full);">
                    ★ ${place.ratingAvg} <span style="font-size: 0.8rem; color: var(--slate-500);">(${place.totalReviews || 0} reviews)</span>
                </div>
            </div>
            
            <p style="color: var(--slate-600); margin-bottom: 18px; line-height: 1.6;">${place.description}</p>

            <div style="background: var(--slate-50); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--slate-200); margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem;">
                    <div><i class="fas fa-clock text-primary-600"></i> <b>Timings:</b> ${place.openingHours}</div>
                    <div><i class="fas fa-ticket text-primary-600"></i> <b>Entry Fee:</b> ${place.entryFee > 0 ? '₹' + place.entryFee : 'Free'}</div>
                    <div><i class="fas fa-map-pin text-primary-600"></i> <b>Zone / Area:</b> ${place.zone}</div>
                    <div><i class="fas fa-phone text-primary-600"></i> <b>Helpline:</b> ${place.contactPhone || 'N/A'}</div>
                </div>
            </div>

            <!-- Audio Tour -->
            <div style="background: var(--primary-50); border: 1px solid var(--primary-100); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 38px; height: 38px; background: var(--primary-600); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-headphones"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 0.9rem;">Smart Indian Heritage Audio Tour</div>
                        <div style="font-size: 0.775rem; color: var(--slate-600);">Audio narration available in Hindi, English & Regional Languages</div>
                    </div>
                </div>
                <button onclick="window.smartCityApp.playAudioGuideDemo('${place.title.replace(/'/g, "\\'")}', '${place.city}')" style="background: var(--primary-600); color: #fff; padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 600;">
                    <i class="fas fa-play"></i> Play Tour
                </button>
            </div>

            <!-- Reviews -->
            <h4 style="margin-bottom: 12px;">Visitor Reviews & Recommendations</h4>
            <div id="place-reviews-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                ${(place.reviews || []).map(r => `
                    <div style="background: #fff; border: 1px solid var(--slate-200); padding: 12px; border-radius: var(--radius-sm);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <b style="font-size: 0.85rem;">${r.author}</b>
                            <span style="color: #f59e0b; font-size: 0.8rem;">${'★'.repeat(r.rating)}</span>
                        </div>
                        <p style="font-size: 0.825rem; color: var(--slate-600);">${r.comment}</p>
                    </div>
                `).join('')}
            </div>

            <!-- Add Review -->
            <div style="border-top: 1px solid var(--slate-200); padding-top: 16px;">
                <h5 style="margin-bottom: 10px;">Post a Traveler Review</h5>
                <form id="write-review-form" onsubmit="window.smartCityApp.handleReviewSubmit(event, ${place.id})">
                    <div class="form-group">
                        <input type="text" id="review-author" class="form-control" placeholder="Your Name" required>
                    </div>
                    <div class="form-row-2">
                        <div class="form-group">
                            <select id="review-rating" class="form-control">
                                <option value="5">★★★★★ (5/5 Excellent)</option>
                                <option value="4">★★★★☆ (4/5 Very Good)</option>
                                <option value="3">★★★☆☆ (3/5 Good)</option>
                                <option value="2">★★☆☆☆ (2/5 Average)</option>
                                <option value="1">★☆☆☆☆ (1/5 Poor)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" id="review-comment" class="form-control" placeholder="Share local food, best time to visit, street tips..." required>
                        </div>
                    </div>
                    <button type="submit" style="background: var(--primary-600); color: #fff; padding: 8px 18px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600;">
                        Submit Review
                    </button>
                </form>
            </div>
        `;

        this.openModal('place-modal');
    }

    async handleReviewSubmit(e, placeId) {
        e.preventDefault();
        const author = document.getElementById('review-author').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        const comment = document.getElementById('review-comment').value;

        await window.smartCityAPI.addPlaceReview(placeId, { author, rating, comment });
        this.showToast('Thank you! Your travel tip has been published.');
        this.openPlaceModal(placeId);
        this.loadPlaces();
    }

    playAudioGuideDemo(title, city) {
        const text = `Namaste and welcome to ${title} in ${city}. This landmark is equipped with smart QR informational plaques and heritage preservation sensors.`;
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(text);
            utter.rate = 0.95;
            window.speechSynthesis.speak(utter);
            this.showToast(`Playing audio guide for ${title}...`);
        } else {
            this.showToast('Smart audio narration active!');
        }
    }

    // --- EMERGENCY & SOS ---
    async loadEmergencyUnits() {
        const container = document.getElementById('emergency-units-container');
        if (!container) return;

        const facilities = await window.smartCityAPI.getEmergencyFacilities(28.6139, 77.2090, this.currentStateFilter, this.currentCityFilter);
        container.innerHTML = facilities.map(f => `
            <div class="emergency-card">
                <div class="emergency-card-header">
                    <span class="emergency-status-badge">${f.status}</span>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--rose-600);">${f.city}, ${f.state}</span>
                </div>
                <h4 class="emergency-card-title">${f.facilityName}</h4>
                <div style="font-size: 0.775rem; color: #b45309; font-weight: 600; margin-bottom: 4px;">
                    <i class="fas fa-road"></i> ${f.streetName || f.address}
                </div>
                <p class="emergency-card-address"><i class="fas fa-map-pin text-rose-600"></i> ${f.address}</p>
                
                ${f.availableIcuBeds > 0 ? `
                    <div class="emergency-beds-counter">
                        <span><i class="fas fa-bed-pulse"></i> <b>Live ICU Bed Availability:</b></span>
                        <span style="font-weight: 700; color: var(--emerald-600);">${f.availableIcuBeds} Beds Ready</span>
                    </div>
                ` : ''}

                <div class="emergency-card-actions">
                    <a href="tel:${f.emergencyContact.split('/')[0].trim()}" class="btn-emergency-call">
                        <i class="fas fa-phone-alt"></i> Call ${f.emergencyContact.split('/')[0]}
                    </a>
                    <button onclick="window.smartCityMap.flyToLocation(${f.lat}, ${f.lng}); window.smartCityApp.switchView('map');" class="btn-emergency-nav">
                        <i class="fas fa-map-location-dot"></i> Locate
                    </button>
                </div>
            </div>
        `).join('');
    }

    triggerSosAlert() {
        this.openModal('sos-alert-modal');
        this.showToast('🚨 SOS Emergency Radar Triggered across India!');
    }

    // --- GRIEVANCES ---
    async loadGrievances() {
        const listContainer = document.getElementById('recent-grievances-list');
        if (!listContainer) return;

        const grievances = await window.smartCityAPI.getGrievances();
        listContainer.innerHTML = grievances.slice(0, 6).map(g => {
            let statusColor = '#3b82f6';
            if (g.status === 'RESOLVED') statusColor = '#10b981';
            else if (g.status === 'DISPATCHED') statusColor = '#f59e0b';

            return `
                <div style="background: #fff; border: 1px solid var(--slate-200); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-weight: 700; font-size: 0.8rem; color: var(--slate-700);">${g.trackingToken}</span>
                        <span style="font-size: 0.75rem; font-weight: 700; background: ${statusColor}15; color: ${statusColor}; padding: 2px 8px; border-radius: var(--radius-full);">
                            ${g.status}
                        </span>
                    </div>
                    <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">${g.title}</div>
                    <div style="font-size: 0.775rem; color: #b45309; margin-bottom: 2px;"><i class="fas fa-road"></i> ${g.streetName || g.locationAddress}</div>
                    <div style="font-size: 0.775rem; color: var(--slate-500);"><i class="fas fa-building"></i> ${g.assignedDepartment} &bull; ${g.city || 'New Delhi'}, ${g.state || 'Delhi'}</div>
                </div>
            `;
        }).join('');
    }

    async handleGrievanceSubmit(e) {
        e.preventDefault();
        const citizenName = document.getElementById('grv-name').value;
        const citizenPhone = document.getElementById('grv-phone').value;
        const citizenEmail = document.getElementById('grv-email').value;
        const state = document.getElementById('grv-state-select').value;
        const city = document.getElementById('grv-city-input').value;
        const streetName = document.getElementById('grv-street-input').value;
        const category = document.getElementById('grv-category').value;
        const title = document.getElementById('grv-title').value;
        const description = document.getElementById('grv-desc').value;
        const zone = document.getElementById('grv-zone').value;
        const locationAddress = document.getElementById('grv-address').value;
        const priority = document.getElementById('grv-priority').value;

        const newGrv = await window.smartCityAPI.submitGrievance({
            citizenName, citizenPhone, citizenEmail, state, city, streetName, category, title, description, zone, locationAddress, priority
        });

        document.getElementById('grievance-submission-form').reset();
        document.getElementById('created-token-display').innerText = newGrv.trackingToken;
        document.getElementById('created-dept-display').innerText = newGrv.assignedDepartment;
        this.openModal('grievance-success-modal');

        this.loadGrievances();
        this.loadDashboardStats();
    }

    async handleGrievanceTrack(e) {
        e.preventDefault();
        const token = document.getElementById('track-token-input').value;
        const result = await window.smartCityAPI.trackGrievance(token);

        const container = document.getElementById('grievance-track-result');
        if (!result) {
            container.innerHTML = `
                <div style="background: var(--rose-50); border: 1px solid var(--rose-200); color: var(--rose-600); padding: 14px; border-radius: var(--radius-sm); text-align: center; font-size: 0.875rem; margin-top: 14px;">
                    <i class="fas fa-triangle-exclamation"></i> No grievance found with tracking token "${token}". Please check the ID.
                </div>
            `;
            return;
        }

        const isSub = true;
        const isInRev = result.status === 'IN_REVIEW' || result.status === 'DISPATCHED' || result.status === 'RESOLVED';
        const isDisp = result.status === 'DISPATCHED' || result.status === 'RESOLVED';
        const isRes = result.status === 'RESOLVED';

        container.innerHTML = `
            <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 20px; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div>
                        <span style="font-size: 0.775rem; color: var(--slate-500);">TRACKING TOKEN</span>
                        <h4 style="font-size: 1.15rem; color: var(--primary-700);">${result.trackingToken}</h4>
                    </div>
                    <span style="background: var(--primary-50); color: var(--primary-700); font-weight: 700; font-size: 0.8rem; padding: 4px 12px; border-radius: var(--radius-full);">
                        ${result.status}
                    </span>
                </div>

                <div class="timeline-stepper">
                    <div class="step-node ${isSub ? 'completed' : ''}">
                        <div class="step-circle"><i class="fas fa-check"></i></div>
                        <div class="step-label">Submitted</div>
                    </div>
                    <div class="step-node ${isInRev ? (isDisp ? 'completed' : 'active') : ''}">
                        <div class="step-circle"><i class="fas fa-magnifying-glass"></i></div>
                        <div class="step-label">In Review</div>
                    </div>
                    <div class="step-node ${isDisp ? (isRes ? 'completed' : 'active') : ''}">
                        <div class="step-circle"><i class="fas fa-truck-fast"></i></div>
                        <div class="step-label">Dispatched</div>
                    </div>
                    <div class="step-node ${isRes ? 'completed' : ''}">
                        <div class="step-circle"><i class="fas fa-circle-check"></i></div>
                        <div class="step-label">Resolved</div>
                    </div>
                </div>

                <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--slate-200); padding-top: 14px;">
                    <div><b>Issue Title:</b> ${result.title}</div>
                    <div><b>Department:</b> ${result.assignedDepartment}</div>
                    <div><b>Location:</b> ${result.streetName || result.locationAddress}, ${result.city || 'New Delhi'}, ${result.state || 'Delhi'}</div>
                    <div><b>Officer Remarks:</b> ${result.officerNotes || 'Action in progress'}</div>
                    ${result.resolvedAt ? `<div><b>Resolved Timestamp:</b> ${result.resolvedAt}</div>` : ''}
                </div>
            </div>
        `;
    }

    // --- EVENTS & PASSES ---
    async loadEvents() {
        const container = document.getElementById('events-cards-container');
        if (!container) return;

        const events = await window.smartCityAPI.getEvents();
        container.innerHTML = events.map(evt => `
            <div class="event-card">
                <div class="event-img-wrap">
                    <img src="${evt.bannerImage}" alt="${evt.title}">
                    <span class="event-date-chip"><i class="fas fa-calendar-day"></i> ${evt.startDate}</span>
                </div>
                <div class="event-body">
                    <span class="event-category-chip">${evt.category} &bull; ${evt.city}, ${evt.state}</span>
                    <h3 class="event-title">${evt.title}</h3>
                    <p class="event-venue"><i class="fas fa-location-dot"></i> ${evt.venueName} (${evt.streetName})</p>
                    <p style="font-size: 0.85rem; color: var(--slate-600); margin-bottom: 16px;">${evt.description}</p>
                    <div class="event-footer">
                        <span style="font-weight: 700; font-size: 0.95rem;">${evt.entryFee > 0 ? '₹' + evt.entryFee : 'Free Entry'}</span>
                        <button onclick="window.smartCityApp.openPassModal(${evt.id}, '${evt.title.replace(/'/g, "\\'")}', ${evt.entryFee}, '${evt.city}')" class="btn-book-pass">
                            <i class="fas fa-qrcode"></i> Get E-Pass
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openPassModal(eventId, eventTitle, entryFee, city) {
        document.getElementById('booking-event-id').value = eventId;
        document.getElementById('booking-event-title').innerText = `${eventTitle} (${city})`;
        document.getElementById('booking-event-fee').innerText = entryFee > 0 ? '₹' + entryFee + ' / Ticket' : 'Free Entry';
        this.openModal('event-pass-modal');
    }

    async handlePassBooking(e) {
        e.preventDefault();
        const eventId = document.getElementById('booking-event-id').value;
        const attendeeName = document.getElementById('pass-name').value;
        const attendeeEmail = document.getElementById('pass-email').value;
        const attendeePhone = document.getElementById('pass-phone').value;
        const numTickets = document.getElementById('pass-tickets').value;

        const pass = await window.smartCityAPI.bookEventPass({
            eventId, attendeeName, attendeeEmail, attendeePhone, numTickets
        });

        this.closeModal('event-pass-modal');

        const ticketContainer = document.getElementById('ticket-result-content');
        ticketContainer.innerHTML = `
            <div class="digital-ticket-pass" id="printable-ticket">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.3); padding-bottom: 12px; margin-bottom: 14px;">
                    <div style="text-align: left;">
                        <h3 style="color: #fff; font-size: 1.15rem;">${pass.eventTitle}</h3>
                        <span style="font-size: 0.8rem; color: #93c5fd;"><i class="fas fa-location-dot"></i> ${pass.venue}, ${pass.city}</span>
                    </div>
                    <span style="background: #10b981; color: #fff; font-weight: 700; font-size: 0.75rem; padding: 4px 10px; border-radius: var(--radius-full);">
                        ${pass.paymentStatus}
                    </span>
                </div>

                <div class="ticket-qr-frame">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pass.qrCodeHash)}" alt="Pass QR Code" style="width: 140px; height: 140px; display: block;">
                </div>

                <div style="font-family: monospace; font-size: 0.95rem; letter-spacing: 1px; color: #38bdf8; margin-bottom: 12px;">
                    ${pass.bookingRef}
                </div>

                <div style="text-align: left; font-size: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #cbd5e1; border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 12px;">
                    <div><b>Attendee:</b> ${pass.attendeeName}</div>
                    <div><b>Passes:</b> ${pass.numTickets} Person(s)</div>
                    <div><b>Total Paid:</b> ₹${pass.totalAmount}</div>
                    <div><b>Timestamp:</b> ${pass.bookedAt}</div>
                </div>
            </div>
            <div style="margin-top: 18px; display: flex; gap: 12px;">
                <button onclick="window.print()" style="flex: 1; background: var(--primary-600); color: #fff; padding: 10px; border-radius: var(--radius-sm); font-weight: 600;">
                    <i class="fas fa-print"></i> Print / Download Pass
                </button>
            </div>
        `;

        this.openModal('ticket-viewer-modal');
        this.loadDashboardStats();
    }

    // --- ADMIN DASHBOARD ---
    async loadDashboardStats() {
        const stats = await window.smartCityAPI.getDashboardAnalytics();
        const elPlaces = document.getElementById('kpi-total-places');
        if (elPlaces) elPlaces.innerText = stats.totalPlaces;

        const elEmergency = document.getElementById('kpi-total-emergency');
        if (elEmergency) elEmergency.innerText = stats.totalEmergencyUnits;

        const elGrievances = document.getElementById('kpi-active-grievances');
        if (elGrievances) elGrievances.innerText = stats.activeGrievances;

        const elResolution = document.getElementById('kpi-resolution-rate');
        if (elResolution) elResolution.innerText = stats.resolutionRatePercent + '%';

        const elBeds = document.getElementById('kpi-icu-beds');
        if (elBeds) elBeds.innerText = stats.activeIcuBeds;

        const adminTableBody = document.getElementById('admin-grievance-tbody');
        if (adminTableBody) {
            const grievances = await window.smartCityAPI.getGrievances();
            adminTableBody.innerHTML = grievances.map(g => `
                <tr>
                    <td><b>${g.trackingToken}</b></td>
                    <td>${g.citizenName}</td>
                    <td>${g.category}</td>
                    <td>${g.city || 'New Delhi'}, ${g.state || 'Delhi'}</td>
                    <td>
                        <span style="font-weight: 700; font-size: 0.75rem; padding: 3px 8px; border-radius: var(--radius-full); 
                            background: ${g.status === 'RESOLVED' ? '#ecfdf5' : '#eff6ff'}; 
                            color: ${g.status === 'RESOLVED' ? '#059669' : '#2563eb'};">
                            ${g.status}
                        </span>
                    </td>
                    <td>
                        <select onchange="window.smartCityApp.updateAdminGrievanceStatus(${g.id}, this.value)" style="padding: 4px; font-size: 0.8rem; border-radius: 4px; border: 1px solid var(--slate-300);">
                            <option value="SUBMITTED" ${g.status === 'SUBMITTED' ? 'selected' : ''}>Submitted</option>
                            <option value="IN_REVIEW" ${g.status === 'IN_REVIEW' ? 'selected' : ''}>In Review</option>
                            <option value="DISPATCHED" ${g.status === 'DISPATCHED' ? 'selected' : ''}>Dispatched</option>
                            <option value="RESOLVED" ${g.status === 'RESOLVED' ? 'selected' : ''}>Resolved</option>
                        </select>
                    </td>
                </tr>
            `).join('');
        }
    }

    async updateAdminGrievanceStatus(id, newStatus) {
        await window.smartCityAPI.updateGrievanceStatus(id, newStatus, 'Status updated by Municipal Admin.');
        this.showToast(`Grievance #${id} marked as ${newStatus}`);
        this.loadDashboardStats();
        this.loadGrievances();
    }

    renderAdminCharts() {
        const ctx = document.getElementById('admin-analytics-chart');
        if (!ctx || typeof Chart === 'undefined') return;

        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Road Potholes & Streets', 'Lighting & Power', 'Waste Management', 'Water Pipelines', 'Traffic & Transit', 'Heritage Sites'],
                datasets: [{
                    data: [35, 25, 20, 12, 5, 3],
                    backgroundColor: ['#2563eb', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#64748b'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    async syncMapMarkers() {
        if (!window.smartCityMap) return;
        const places = await window.smartCityAPI.getPlaces('', this.currentStateFilter, this.currentCityFilter, this.currentCategoryFilter);
        const emergency = await window.smartCityAPI.getEmergencyFacilities(28.6139, 77.2090, this.currentStateFilter, this.currentCityFilter);
        window.smartCityMap.renderPlacesOnMap(places, emergency);
    }

    openModal(modalId) {
        const el = document.getElementById(modalId);
        if (el) el.classList.add('active');
    }

    closeModal(modalId) {
        const el = document.getElementById(modalId);
        if (el) el.classList.remove('active');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #0f172a;
            color: #fff;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `<i class="fas fa-circle-check" style="color: #34d399;"></i> <span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
}

window.smartCityApp = new SmartCityApp();
document.addEventListener('DOMContentLoaded', () => {
    window.smartCityApp.init();
});
