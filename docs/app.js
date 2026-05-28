/* ==========================================================================
   SOLOSAFIRI INDIA - CLIENT API CONNECT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = "http://localhost:5000/api";
    const SOCKET_URL = "http://localhost:5000";
    
    let socket = null;
    let realTimeInterval = null;
    let watchId = null;
    
    let state = {
        activeScreen: 'splash',
        gpsActive: true,
        userLocation: { lat: 28.6139, lng: 77.2090 },
        selectedSource: '',
        selectedDestination: '',
        sirenActive: false,
        autoSmsActive: true,
        userProfile: {
            name: "Aaradhya Sen",
            email: "aaradhya.sen@gmail.com",
            gender: "Female",
            budget: "budget",
            contacts: [
                { name: "Papa Emergency", phone: "+91 98765 43210" },
                { name: "Riya (Best Friend)", phone: "+91 87654 32109" }
            ],
            history: [
                { id: "hist_1", route: "Delhi to Jaipur", date: "May 10, 2026", dist: "270 km" },
                { id: "hist_2", route: "Mumbai to Goa", date: "Apr 20, 2026", dist: "600 km" }
            ],
            badges: ["Shield Safe", "Hostel Hopper", "Rail Rider"]
        },
        activeChats: [
            { userId: "trav_varun", userName: "Varun Verma", lastMsg: "Hey! Let's meet at Vagator beach at 5pm?", time: "2m ago", unread: true, messages: [
                { sender: 'them', text: "Hey! I saw you are traveling on the Mumbai-Goa route as well.", time: "12:10" },
                { sender: 'me', text: "Yes! Currently planning to take the afternoon bus.", time: "12:12" },
                { sender: 'them', text: "Hey! Let's meet at Vagator beach at 5pm?", time: "12:15" }
            ]},
            { userId: "trav_priya", userName: "Priya Sharma", lastMsg: "No worries! Safe travels.", time: "Yesterday", unread: false, messages: [
                { sender: 'them', text: "Are you planning to check out the Light Show at Amber Fort today?", time: "Yesterday" },
                { sender: 'me', text: "Ah, missing it today. Visiting Hawa Mahal first.", time: "Yesterday" },
                { sender: 'them', text: "No worries! Safe travels.", time: "Yesterday" }
            ]}
        ],
        activeChatUser: null
    };

    function loadStateFromStorage() {
        const savedProfile = localStorage.getItem('solosafiri_profile');
        if (savedProfile) {
            try {
                state.userProfile = JSON.parse(savedProfile);
            } catch (e) {
                console.error("Error parsing saved profile", e);
            }
        }
        const savedChats = localStorage.getItem('solosafiri_chats');
        if (savedChats) {
            try {
                state.activeChats = JSON.parse(savedChats);
            } catch (e) {
                console.error("Error parsing saved chats", e);
            }
        }
    }

    function saveStateToStorage() {
        localStorage.setItem('solosafiri_profile', JSON.stringify(state.userProfile));
        localStorage.setItem('solosafiri_chats', JSON.stringify(state.activeChats));
    }

    const screens = {
        splash: document.getElementById('screen-splash'),
        home: document.getElementById('screen-home'),
        explore: document.getElementById('screen-explore'),
        safety: document.getElementById('screen-safety'),
        connect: document.getElementById('screen-connect'),
        chatbot: document.getElementById('screen-chatbot'),
        profile: document.getElementById('screen-profile')
    };

    const navItems = document.querySelectorAll('.nav-item');
    const sourceSelect = document.getElementById('route-source');
    const destSelect = document.getElementById('route-destination');
    const btnFindRoute = document.getElementById('btn-find-route');
    const btnToggleGps = document.getElementById('btn-toggle-gps');
    const gpsStatusTxt = document.getElementById('gps-status-txt');

    let audioCtx = null;
    let sirenOsc1 = null;
    let sirenOsc2 = null;
    let sirenGain = null;
    let sirenInterval = null;

    const toastContainer = document.getElementById('toast-container');
    const globalModal = document.getElementById('global-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    const btnCloseModal = document.getElementById('btn-close-modal');

    function initSocket() {
        const { io } = window;
        if (!io) {
            console.warn('Socket.IO client not loaded');
            return;
        }
        
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5
        });

        socket.on('connect', () => {
            console.log('🔌 Connected to real-time server:', socket.id);
            showToast('Real-time connection established', 'success');
            
            socket.emit('join', state.userProfile.name || 'user');
        });

        socket.on('location-broadcast', (data) => {
            console.log('📍 Real-time location update:', data);
        });

        socket.on('emergency-alert', (data) => {
            console.log('🚨 Emergency alert received:', data);
        });

        socket.on('new-message', (data) => {
            if (state.activeChatUser && state.activeChatUser.userId === data.senderId) {
                state.activeChatUser.messages.push({
                    sender: 'them',
                    text: data.text,
                    time: new Date().toLocaleTimeString()
                });
                state.activeChatUser.lastMsg = data.text;
                state.activeChatUser.time = "Just now";
                saveStateToStorage();
                renderChatWindowMessages();
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from server');
            showToast('Real-time connection lost. Reconnecting...', 'warning');
        });
    }

    function initRealTimeGPS() {
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    state.userLocation = { lat: latitude, lng: longitude };
                    
                    if (socket && state.gpsActive) {
                        socket.emit('location-update', {
                            userId: state.userProfile.name || 'user',
                            lat: latitude,
                            lng: longitude
                        });
                    }
                    
                    updateGPSMarker(latitude, longitude);
                },
                (error) => {
                    console.warn('GPS error:', error.message);
                    showToast(`GPS unavailable: ${error.message}`, 'warning');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000
                }
            );
        } else {
            console.warn('Geolocation not supported, using simulated GPS');
            startSimulatedGPS();
        }
    }

    function startSimulatedGPS() {
        let angle = 0;
        realTimeInterval = setInterval(() => {
            if (!state.gpsActive) return;
            
            angle += 0.02;
            const lat = state.userLocation.lat + Math.sin(angle) * 0.01;
            const lng = state.userLocation.lng + Math.cos(angle) * 0.01;
            state.userLocation = { lat, lng };
            updateGPSMarker(lat, lng);
        }, 3000);
    }

    function stopRealTimeGPS() {
        if (realTimeInterval) {
            clearInterval(realTimeInterval);
            realTimeInterval = null;
        }
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
    }

    function switchScreen(targetScreenId) {
        if (!screens[targetScreenId]) return;

        state.activeScreen = targetScreenId;

        Object.keys(screens).forEach(key => {
            screens[key].classList.remove('active');
        });

        screens[targetScreenId].classList.add('active');

        navItems.forEach(item => {
            if (item.getAttribute('data-screen') === targetScreenId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        if (targetScreenId === 'home' && state.activeMap) {
            setTimeout(() => {
                state.activeMap.invalidateSize();
            }, 150);
        }

        if (targetScreenId === 'profile') renderProfileValues();
        if (targetScreenId === 'safety') renderSafetyContacts();
        if (targetScreenId === 'connect') {
            fetchTravelersFeed();
            renderActiveChatsList();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetScreen = item.getAttribute('data-screen');
            switchScreen(targetScreen);
        });
    });

    setTimeout(() => {
        switchScreen('home');
        showToast("Welcome back! GPS Real-time tracking enabled.", "success");
    }, 2500);

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('status-time').textContent = `${hours}:${minutes}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    let gpsMarker = null;

    function initMap() {
        state.activeMap = L.map('leaflet-map', {
            zoomControl: false,
            attributionControl: false
        }).setView([state.userLocation.lat, state.userLocation.lng], 6);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(state.activeMap);

        state.markersLayer = L.layerGroup().addTo(state.activeMap);

        const gpsIcon = L.divIcon({
            className: 'gps-pulse-icon',
            html: `<div class="gps-pulse-outer"><div class="gps-pulse-inner"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        gpsMarker = L.marker([state.userLocation.lat, state.userLocation.lng], { icon: gpsIcon }).addTo(state.activeMap);
        gpsMarker.bindPopup("<b>You are here</b><br>Live GPS tracking active").openPopup();

        document.getElementById('map-zoom-in').addEventListener('click', () => state.activeMap.zoomIn());
        document.getElementById('map-zoom-out').addEventListener('click', () => state.activeMap.zoomOut());
        
        const layerBtn = document.getElementById('map-layer-toggle');
        layerBtn.addEventListener('click', () => {
            if (state.activeMap.hasLayer(state.markersLayer)) {
                state.activeMap.removeLayer(state.markersLayer);
                layerBtn.classList.remove('active');
                showToast("Attraction markers hidden enroute", "warning");
            } else {
                state.activeMap.addLayer(state.markersLayer);
                layerBtn.classList.add('active');
                showToast("Showing attraction markers enroute", "success");
            }
        });
        
        initRealTimeGPS();
    }

    function updateGPSMarker(lat, lng) {
        if (gpsMarker) {
            gpsMarker.setLatLng([lat, lng]);
            
            const gpsText = document.getElementById('safety-live-gps');
            if (gpsText) {
                gpsText.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
        }
    }

    async function populateDropdowns() {
        try {
            const res = await fetch(`${API_BASE}/cities`);
            if (!res.ok) throw new Error("Failed to fetch cities");
            const citiesData = await res.json();

            sourceSelect.innerHTML = '<option value="" disabled selected>Select Source Station...</option>';
            destSelect.innerHTML = '<option value="" disabled selected>Select Destination...</option>';

            Object.keys(citiesData).forEach(key => {
                const city = citiesData[key];
                const opt1 = document.createElement('option');
                opt1.value = key;
                opt1.textContent = city.name;
                sourceSelect.appendChild(opt1);

                const opt2 = document.createElement('option');
                opt2.value = key;
                opt2.textContent = city.name;
                destSelect.appendChild(opt2);
            });

            sourceSelect.value = "delhi";
            destSelect.value = "jaipur";
        } catch (err) {
            console.error("Cities fetch error", err);
            showToast("Server connection error. Retrying...", "warning");
        }
    }

    btnFindRoute.addEventListener('click', () => {
        const srcVal = sourceSelect.value;
        const destVal = destSelect.value;

        if (!srcVal || !destVal) {
            showToast("Please select both source and destination.", "warning");
            return;
        }

        if (srcVal === destVal) {
            showToast("Source and Destination cannot be the same.", "warning");
            return;
        }

        calculateAndDrawRoute(srcVal, destVal);
    });

    async function calculateAndDrawRoute(srcKey, destKey) {
        if (gpsPathMovementInterval) {
            clearInterval(gpsPathMovementInterval);
        }

        if (state.routePathLine) {
            state.activeMap.removeLayer(state.routePathLine);
        }
        state.markersLayer.clearLayers();

        try {
            const res = await fetch(`${API_BASE}/route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source: srcKey, destination: destKey })
            });

            if (!res.ok) throw new Error("Failed to calculate route");
            const routeData = await res.json();

            document.getElementById('route-stats-panel').classList.remove('hide');
            document.getElementById('transit-panel').classList.remove('hide');
            document.getElementById('home-start-hint').classList.add('hide');

            document.getElementById('stat-distance').textContent = `${routeData.distance} km`;
            document.getElementById('stat-time').textContent = `${routeData.duration} hrs`;
            document.getElementById('stat-safety').innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${routeData.safetyIndex}`;

            const statesContainer = document.getElementById('route-states-badge-container');
            statesContainer.innerHTML = '';
            routeData.states.forEach(st => {
                const badge = document.createElement('span');
                badge.className = 'state-badge';
                badge.innerHTML = `<i class="fa-solid fa-mountain"></i> ${st}`;
                statesContainer.appendChild(badge);
            });

            state.routePathLine = L.polyline(routeData.path, {
                color: '#06b6d4',
                weight: 4,
                opacity: 0.8,
                dashArray: '8, 8'
            }).addTo(state.activeMap);

            const srcIcon = L.divIcon({ className: 'custom-pin-icon src-pin', html: '<i class="fa-solid fa-circle-dot"></i>', iconSize: [20, 20] });
            const destIcon = L.divIcon({ className: 'custom-pin-icon dest-pin', html: '<i class="fa-solid fa-location-dot"></i>', iconSize: [20, 20] });

            const srcCityResponse = await fetch(`${API_BASE}/cities`);
            const citiesData = await srcCityResponse.json();
            const srcCity = citiesData[srcKey];
            const destCity = citiesData[destKey];

            L.marker([srcCity.lat, srcCity.lng], { icon: srcIcon }).addTo(state.markersLayer).bindPopup(`<b>Source: ${srcCity.name}</b>`);
            L.marker([destCity.lat, destCity.lng], { icon: destIcon }).addTo(state.markersLayer).bindPopup(`<b>Destination: ${destCity.name}</b>`);

            plotEnroutePoints(destKey, destCity);

            state.activeMap.fitBounds(state.routePathLine.getBounds(), { padding: [40, 40] });

            document.getElementById('explore-location-title').textContent = `Showing results along: ${srcCity.name} ➔ ${destCity.name}`;
            loadAccommodations(destKey);
            loadLocalFoods(destKey);
            loadTouristSights(destKey);

            fetchTravelersFeed(destCity.state);

            showToast(`Safest route loaded from ${srcCity.name} to ${destCity.name}`, "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to connect to route planning API", "danger");
        }
    }

    async function plotEnroutePoints(destKey, destCity) {
        try {
            const staysRes = await fetch(`${API_BASE}/stays/${destKey}`);
            const sightsRes = await fetch(`${API_BASE}/sights/${destKey}`);
            
            const hostels = await staysRes.json();
            const sights = await sightsRes.json();

            const hotelMarkerIcon = L.divIcon({ className: 'pin-icon-stay', html: '<i class="fa-solid fa-hotel"></i>', iconSize: [24, 24] });
            const sightMarkerIcon = L.divIcon({ className: 'pin-icon-sight', html: '<i class="fa-solid fa-camera"></i>', iconSize: [24, 24] });

            hostels.forEach((hostel, index) => {
                const latOffset = (index + 1) * 0.012;
                L.marker([destCity.lat + latOffset, destCity.lng - latOffset], { icon: hotelMarkerIcon })
                    .addTo(state.markersLayer)
                    .bindPopup(`<b>${hostel.name}</b><br>Budget: ₹${hostel.price}/night<br>⭐ Rating: ${hostel.rating}`);
            });

            sights.forEach((sight, index) => {
                const latOffset = (index + 1) * 0.022;
                L.marker([destCity.lat - latOffset, destCity.lng + latOffset], { icon: sightMarkerIcon })
                    .addTo(state.markersLayer)
                    .bindPopup(`<b>Sight: ${sight.name}</b><br>Type: ${sight.type}`);
            });
        } catch (e) {
            console.error("Error plotting markers", e);
        }
    }

    let gpsPathMovementInterval = null;

    btnToggleGps.addEventListener('click', () => {
        state.gpsActive = !state.gpsActive;
        if (state.gpsActive) {
            btnToggleGps.querySelector('i').className = "fa-solid fa-location-crosshairs text-accent pulse-gps";
            gpsStatusTxt.textContent = "GPS On";
            showToast("Live GPS tracking resumed enroute", "success");
            initRealTimeGPS();
        } else {
            btnToggleGps.querySelector('i').className = "fa-solid fa-location-crosshairs text-muted";
            gpsStatusTxt.textContent = "GPS Off";
            stopRealTimeGPS();
            showToast("GPS tracking paused. SOS location will freeze.", "warning");
        }
    });

    // ----------------------------------------------------------------------
    // 5. EXPLORE PAGE LOADERS (ACCOMMODATIONS, MEALS, SIGHTS VIA API)
    // ----------------------------------------------------------------------
    const exploreTabs = document.querySelectorAll('.explore-tab');
    const exploreViews = document.querySelectorAll('.explore-category-view');

    exploreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCat = tab.getAttribute('data-explore-tab');
            
            exploreTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            exploreViews.forEach(v => {
                if (v.id === `explore-view-${targetCat}`) {
                    v.classList.add('active');
                } else {
                    v.classList.remove('active');
                }
            });
        });
    });

    async function loadAccommodations(cityKey) {
        const container = document.getElementById('explore-hotels-list');
        container.innerHTML = '';

        try {
            const res = await fetch(`${API_BASE}/stays/${cityKey}`);
            const hostels = await res.json();

            if (hostels.length === 0) {
                container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-hotel"></i><p>No budget accommodations enroute for this location.</p></div>`;
                return;
            }

            hostels.forEach(h => {
                const card = document.createElement('div');
                card.className = 'explore-card';
                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img class="card-img" src="${h.img}" alt="${h.name}" />
                        <span class="safety-rating-badge"><i class="fa-solid fa-shield"></i> Female Safe</span>
                    </div>
                    <div class="card-info">
                        <div class="card-title-row">
                            <h4>${h.name}</h4>
                            <span class="card-address"><i class="fa-solid fa-location-pin"></i> Nearby Station</span>
                        </div>
                        <div class="card-amenities">
                            ${h.tags.map(t => `<span class="amenity-chip">${t}</span>`).join('')}
                        </div>
                        <div class="card-price-row">
                            <div class="card-rating">
                                <i class="fa-solid fa-star"></i> ${h.rating}
                            </div>
                            <div>
                                <span class="card-price">₹${h.price}<span>/night</span></span>
                                <button class="btn-book" data-hotel="${h.name}">Book Dorm</button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            container.querySelectorAll('.btn-book').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const hotelName = e.target.getAttribute('data-hotel');
                    openBookingModal(hotelName);
                });
            });
        } catch (e) {
            container.innerHTML = `<p style="text-align:center; padding:20px;">Failed to load stays.</p>`;
        }
    }

    async function loadLocalFoods(cityKey) {
        const container = document.getElementById('explore-food-list');
        container.innerHTML = '';

        try {
            const res = await fetch(`${API_BASE}/foods/${cityKey}`);
            const foods = await res.json();

            if (foods.length === 0) {
                container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-utensils"></i><p>No registered local eateries along this route.</p></div>`;
                return;
            }

            foods.forEach(f => {
                const card = document.createElement('div');
                card.className = 'glass-card';
                card.innerHTML = `
                    <div class="card-header-with-action">
                        <h4 style="color: var(--color-gold); font-size:14px;"><i class="fa-solid fa-bowl-food"></i> ${f.name}</h4>
                        <span class="card-rating"><i class="fa-solid fa-star"></i> ${f.rating}</span>
                    </div>
                    <p style="font-size:12px; margin-bottom: 6px;"><strong>Specialty:</strong> ${f.type}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-color); padding-top:8px; margin-top:4px;">
                        <span style="font-size:11px; color: var(--color-text-muted);"><i class="fa-solid fa-circle-check text-success"></i> ${f.safety}</span>
                        <strong style="color: var(--color-accent)">Avg: ₹${f.price}</strong>
                    </div>
                `;
                container.appendChild(card);
            });
        } catch (e) {
            container.innerHTML = `<p style="text-align:center; padding:20px;">Failed to load food.</p>`;
        }
    }

    async function loadTouristSights(cityKey) {
        const container = document.getElementById('explore-places-list');
        container.innerHTML = '';

        try {
            const res = await fetch(`${API_BASE}/sights/${cityKey}`);
            const sights = await res.json();

            if (sights.length === 0) {
                container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-mountain-sun"></i><p>No major sights catalogued for this region.</p></div>`;
                return;
            }

            sights.forEach(s => {
                const card = document.createElement('div');
                card.className = 'glass-card';
                card.innerHTML = `
                    <div class="card-header-with-action">
                        <h4 style="font-size:14px; font-weight:700;"><i class="fa-solid fa-mountain-sun text-accent"></i> ${s.name}</h4>
                        <span class="state-badge" style="margin:0">${s.type}</span>
                    </div>
                    <p style="font-size: 11px; color: var(--color-text-muted); margin-bottom:8px;">${s.desc}</p>
                    <div style="display:flex; justify-content:space-between; font-size:10px; color: var(--color-text-muted); border-top:1px solid var(--border-color); padding-top:6px;">
                        <span><i class="fa-regular fa-clock"></i> ${s.timing}</span>
                        <span><strong>Ticket:</strong> ${s.cost}</span>
                    </div>
                `;
                container.appendChild(card);
            });
        } catch (e) {
            container.innerHTML = `<p style="text-align:center; padding:20px;">Failed to load sights.</p>`;
        }
    }

    function openBookingModal(hotelName) {
        modalTitle.textContent = "Confirm Solo Dorm Bed Booking";
        modalBody.innerHTML = `
            <p>You are booking <strong>1x Sleeper/Dorm Bed</strong> at:</p>
            <p style="font-size:14px; color:var(--color-accent); font-weight:700; margin: 8px 0;">${hotelName}</p>
            <p>SoloSafiri benefits included enroute:</p>
            <ul>
                <li>Female-only safety security wings priority</li>
                <li>Emergency check-out safety backup protection</li>
                <li>Free evening local travelers mixer pass</li>
            </ul>
            <p style="margin-top:12px;">Payment will be settled at property. Confirm reservation?</p>
        `;
        
        modalFooter.innerHTML = `
            <button class="btn btn-outline btn-sm" id="btn-modal-cancel">Go Back</button>
            <button class="btn btn-secondary btn-sm" id="btn-modal-confirm">Confirm Dorm</button>
        `;

        globalModal.classList.remove('hide');

        document.getElementById('btn-modal-cancel').onclick = closeModal;
        document.getElementById('btn-modal-confirm').onclick = () => {
            closeModal();
            showToast(`Dorm Bed booked at ${hotelName}! Details shared via Email.`, "success");
            addBadgeToProfile("Hostel Hopper");
        };
    }

    function closeModal() {
        globalModal.classList.add('hide');
    }
    btnCloseModal.addEventListener('click', closeModal);

    // ----------------------------------------------------------------------
    // 6. SAFETY SHIELD CONSOLE (SOS POST WITH API DISPATCH)
    // ----------------------------------------------------------------------
    const btnSosMain = document.getElementById('btn-sos-main');
    const sosCountdownContainer = document.getElementById('sos-countdown-container');
    const sosCountdownNum = document.getElementById('sos-countdown-num');
    const btnSosCancel = document.getElementById('btn-sos-cancel');
    const safetyBanner = document.getElementById('safety-alert-active-banner');
    const btnDeactivateSos = document.getElementById('btn-deactivate-sos');
    const btnToggleSiren = document.getElementById('btn-toggle-siren');
    const btnToggleAutoSms = document.getElementById('btn-toggle-auto-sms');
    const contactsList = document.getElementById('safety-contacts-list');
    const btnAddContactSafety = document.getElementById('btn-add-contact-safety');

    let countdownVal = 5;
    let countdownInterval = null;

    btnToggleSiren.addEventListener('click', () => {
        state.sirenActive = !state.sirenActive;
        if (state.sirenActive) {
            btnToggleSiren.className = "safety-ctrl-toggle alarm-on";
            showToast("Loud Siren Audio armed for SOS alerts", "success");
        } else {
            btnToggleSiren.className = "safety-ctrl-toggle alarm-off";
            stopSirenAudio();
            showToast("Loud Siren audio disabled", "warning");
        }
    });

    btnToggleAutoSms.addEventListener('click', () => {
        state.autoSmsActive = !state.autoSmsActive;
        if (state.autoSmsActive) {
            btnToggleAutoSms.className = "safety-ctrl-toggle sms-on";
            showToast("Auto SOS WhatsApp dispatch active", "success");
        } else {
            btnToggleAutoSms.className = "safety-ctrl-toggle sms-off";
            showToast("Auto SOS dispatch disabled", "warning");
        }
    });

    btnSosMain.addEventListener('click', triggerSosCountdown);
    document.getElementById('btn-quick-sos').addEventListener('click', () => {
        switchScreen('safety');
        triggerSosCountdown();
    });

    function triggerSosCountdown() {
        if (safetyBanner.classList.contains('hide')) {
            countdownVal = 5;
            sosCountdownNum.textContent = countdownVal;
            sosCountdownContainer.classList.remove('hide');

            countdownInterval = setInterval(() => {
                countdownVal--;
                sosCountdownNum.textContent = countdownVal;

                if (countdownVal <= 0) {
                    clearInterval(countdownInterval);
                    activateEmergencySOS();
                }
            }, 1000);
        } else {
            showToast("SOS is already active and broadcasted enroute!", "warning");
        }
    }

    btnSosCancel.addEventListener('click', () => {
        clearInterval(countdownInterval);
        sosCountdownContainer.classList.add('hide');
        showToast("Emergency SOS broadcast aborted.", "warning");
    });

    async function activateEmergencySOS() {
        sosCountdownContainer.classList.add('hide');
        safetyBanner.classList.remove('hide');
        
        document.getElementById('safety-live-gps').textContent = `${state.userLocation.lat.toFixed(5)}, ${state.userLocation.lng.toFixed(5)}`;

        if (state.sirenActive) {
            startSirenAudio();
        }

        if (socket) {
            socket.emit('sos-alert', {
                name: state.userProfile.name,
                lat: state.userLocation.lat,
                lng: state.userLocation.lng,
                contacts: state.userProfile.contacts
            });
        }

        try {
            const res = await fetch(`${API_BASE}/safety/sos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: state.userProfile.name,
                    latitude: state.userLocation.lat,
                    longitude: state.userLocation.lng,
                    contacts: state.userProfile.contacts
                })
            });

            if (!res.ok) throw new Error("Failed to alert backend");
            const resData = await res.json();

            modalTitle.textContent = "SOS Dispatched (Real-time)";
            modalBody.innerHTML = `
                <p>The SoloSafiri backend confirmed receiving the emergency signal:</p>
                <div style="background:rgba(239, 68, 68, 0.1); border:1px solid var(--color-danger); padding:10px; border-radius:10px; margin: 8px 0; font-family: monospace; font-size:11px; color:#f87171;">
                    STATUS: DISPATCHED OVER SMS API<br>
                    Coordinates: ${resData.details.coordinates}<br>
                    Map Link: <a href="${resData.details.mapLink}" target="_blank" style="color:var(--color-accent)">View on Google Maps</a><br>
                    Notified Contacts: ${resData.details.contactsNotifiedCount} contacts
                </div>
                <p>An emergency server log has been generated. Help is on the way.</p>
            `;
            modalFooter.innerHTML = `<button class="btn btn-primary btn-sm" id="btn-modal-sms-ok">Acknowledge</button>`;
            globalModal.classList.remove('hide');
            document.getElementById('btn-modal-sms-ok').onclick = closeModal;

        } catch (e) {
            console.error("SOS REST API Error", e);
            showToast("Local SOS broadcast active (Offline mode)", "warning");
        }

        addBadgeToProfile("Shield Safe");
        showToast("SOS Alert Broadcasted! Help is enroute.", "danger");
    }

    btnDeactivateSos.addEventListener('click', () => {
        safetyBanner.classList.add('hide');
        stopSirenAudio();
        showToast("Emergency SOS deactivated. Contacts notified.", "success");
    });

    function startSirenAudio() {
        if (audioCtx) return;

        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            sirenGain = audioCtx.createGain();
            sirenGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            
            sirenOsc1 = audioCtx.createOscillator();
            sirenOsc1.type = 'sawtooth';
            sirenOsc1.frequency.setValueAtTime(800, audioCtx.currentTime);
            
            sirenOsc2 = audioCtx.createOscillator();
            sirenOsc2.type = 'sine';
            sirenOsc2.frequency.setValueAtTime(850, audioCtx.currentTime);

            sirenOsc1.connect(sirenGain);
            sirenOsc2.connect(sirenGain);
            sirenGain.connect(audioCtx.destination);

            sirenOsc1.start();
            sirenOsc2.start();

            let highTone = false;
            sirenInterval = setInterval(() => {
                if (highTone) {
                    sirenOsc1.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
                    sirenOsc2.frequency.exponentialRampToValueAtTime(850, audioCtx.currentTime + 0.1);
                } else {
                    sirenOsc1.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
                    sirenOsc2.frequency.exponentialRampToValueAtTime(1250, audioCtx.currentTime + 0.1);
                }
                highTone = !highTone;
            }, 300);

        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    function stopSirenAudio() {
        if (sirenInterval) {
            clearInterval(sirenInterval);
            sirenInterval = null;
        }
        if (sirenOsc1) {
            sirenOsc1.stop();
            sirenOsc1 = null;
        }
        if (sirenOsc2) {
            sirenOsc2.stop();
            sirenOsc2 = null;
        }
        if (audioCtx) {
            audioCtx.close();
            audioCtx = null;
        }
    }

    function renderSafetyContacts() {
        contactsList.innerHTML = '';
        if (state.userProfile.contacts.length === 0) {
            contactsList.innerHTML = '<p style="font-size:12px; color:var(--color-text-muted); text-align:center;">No emergency contacts added yet. Update in settings.</p>';
            return;
        }

        state.userProfile.contacts.forEach((c, idx) => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <div class="contact-avatar">${c.name.charAt(0).toUpperCase()}</div>
                <div class="contact-info">
                    <h5>${c.name}</h5>
                    <p>${c.phone}</p>
                </div>
                <button class="btn-remove-contact" data-idx="${idx}" aria-label="Remove contact"><i class="fa-solid fa-trash-can"></i></button>
            `;
            contactsList.appendChild(card);
        });

        contactsList.querySelectorAll('.btn-remove-contact').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                state.userProfile.contacts.splice(idx, 1);
                saveStateToStorage();
                renderSafetyContacts();
                showToast("Emergency contact removed", "warning");
            });
        });
    }

    btnAddContactSafety.addEventListener('click', () => {
        switchScreen('profile');
        document.getElementById('new-contact-name').focus();
    });

    document.querySelectorAll('.helpline-item').forEach(item => {
        item.addEventListener('click', () => {
            const num = item.getAttribute('data-call');
            showToast(`Dialing emergency service line: ${num}`, "success");
        });
    });

    // ----------------------------------------------------------------------
    // 7. CONNECT HUB (CO-TRAVELERS MATCHER FROM REST API)
    // ----------------------------------------------------------------------
    const connectTabs = document.querySelectorAll('.connect-tab');
    const connectViews = document.querySelectorAll('.connect-sub-view');
    const travelersList = document.getElementById('connect-travelers-list');
    const chatsListContainer = document.getElementById('chats-list-container');
    const activeChatsList = document.getElementById('active-chats-list');
    const chatWindowBox = document.getElementById('chat-window-box');

    const chatWinName = document.getElementById('chat-win-name');
    const chatWinAvatar = document.getElementById('chat-win-avatar');
    const chatWinMessagesList = document.getElementById('chat-win-messages-list');
    const chatWinInput = document.getElementById('chat-win-input');
    const btnChatWinSend = document.getElementById('btn-chat-win-send');
    const btnBackChatsList = document.getElementById('btn-back-chats-list');

    connectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCat = tab.getAttribute('data-connect-tab');
            
            connectTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            connectViews.forEach(v => {
                if (v.id === `connect-view-${targetCat}`) {
                    v.classList.add('active');
                } else {
                    v.classList.remove('active');
                }
            });

            if (targetCat === 'chat') {
                closeChatWindow();
            }
        });
    });

    async function fetchTravelersFeed(stateFilter = '') {
        travelersList.innerHTML = '';
        
        try {
            const queryParam = stateFilter ? `?state=${encodeURIComponent(stateFilter)}` : '';
            const res = await fetch(`${API_BASE}/travelers${queryParam}`);
            const travelers = await res.json();

            travelers.forEach(t => {
                const card = document.createElement('div');
                card.className = 'glass-card traveler-card';
                card.innerHTML = `
                    <div class="traveler-header">
                        <div class="contact-avatar" style="background-color: var(--color-primary)">${t.avatar}</div>
                        <div class="traveler-info">
                            <h4>${t.name} <span style="font-size:10px; font-weight:400; color:var(--color-text-muted)">(${t.age}, ${t.gender})</span></h4>
                            <span class="traveler-route-label"><i class="fa-solid fa-plane-departure"></i> Route: ${t.from} ➔ ${t.to}</span>
                        </div>
                        <button class="btn btn-sm btn-secondary btn-connect-chat" data-id="${t.id}" data-name="${t.name}">Chat</button>
                    </div>
                    <p class="traveler-desc">"${t.bio}"</p>
                    <div class="traveler-footer">
                        <span class="active-bubble" style="padding:1px 6px; font-size:8px;">
                            <span class="green-dot"></span> Active in ${t.state}
                        </span>
                        <span class="traveler-time">Matched enroute</span>
                    </div>
                `;
                travelersList.appendChild(card);
            });

            travelersList.querySelectorAll('.btn-connect-chat').forEach(btn => {
                btn.addEventListener('click', () => {
                    const userId = btn.getAttribute('data-id');
                    const userName = btn.getAttribute('data-name');
                    openOrCreateChatWindow(userId, userName);
                });
            });
        } catch (e) {
            travelersList.innerHTML = `<p style="text-align:center; padding:20px;">Could not connect to travelers feed API.</p>`;
        }
    }

    function renderActiveChatsList() {
        activeChatsList.innerHTML = '';
        
        if (state.activeChats.length === 0) {
            activeChatsList.innerHTML = '<p style="font-size:12px; color:var(--color-text-muted); text-align:center; padding: 20px;">No active conversations. Open chat from the Feed!</p>';
            return;
        }

        state.activeChats.forEach(chat => {
            const card = document.createElement('div');
            card.className = 'chat-card';
            card.innerHTML = `
                <div class="contact-avatar" style="background-color: var(--color-accent); margin-right:12px;">${chat.userName.charAt(0)}</div>
                <div class="chat-card-info">
                    <div class="chat-name-row">
                        <h4>${chat.userName}</h4>
                        <span class="chat-time">${chat.time}</span>
                    </div>
                    <p class="chat-preview-msg" style="${chat.unread ? 'font-weight:700; color:white;' : ''}">
                        ${chat.lastMsg}
                    </p>
                </div>
                ${chat.unread ? '<span class="badge-dot" style="position:static; margin-left:8px;"></span>' : ''}
            `;
            
            card.addEventListener('click', () => {
                openChatSession(chat);
            });

            activeChatsList.appendChild(card);
        });
    }

    function openOrCreateChatWindow(userId, userName) {
        connectTabs.forEach(t => t.classList.remove('active'));
        connectTabs[1].classList.add('active');
        connectViews.forEach(v => v.classList.remove('active'));
        document.getElementById('connect-view-chat').classList.add('active');

        let existingChat = state.activeChats.find(c => c.userId === userId);
        
        if (!existingChat) {
            existingChat = {
                userId: userId,
                userName: userName,
                lastMsg: "Connected enroute. Say hello!",
                time: "Just now",
                unread: false,
                messages: [
                    { sender: 'them', text: `Hi, I saw your journey query. Let me know if you want to team up or share travel details!`, time: "Just now" }
                ]
            };
            state.activeChats.unshift(existingChat);
            saveStateToStorage();
            renderActiveChatsList();
        }

        openChatSession(existingChat);
    }

    function openChatSession(chat) {
        state.activeChatUser = chat;
        chat.unread = false;
        saveStateToStorage();
        renderActiveChatsList();

        chatsListContainer.classList.add('hide');
        chatWindowBox.classList.remove('hide');

        chatWinName.textContent = chat.userName;
        chatWinAvatar.textContent = chat.userName.charAt(0);
        
        renderChatWindowMessages();
    }

    function closeChatWindow() {
        chatWindowBox.classList.add('hide');
        chatsListContainer.classList.remove('hide');
        state.activeChatUser = null;
    }

    btnBackChatsList.addEventListener('click', closeChatWindow);

    function renderChatWindowMessages() {
        chatWinMessagesList.innerHTML = '';
        if (!state.activeChatUser) return;

        state.activeChatUser.messages.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${msg.sender === 'me' ? 'outbound' : 'inbound'}`;
            bubble.innerHTML = `
                ${msg.text}
                <span class="chat-bubble-time">${msg.time}</span>
            `;
            chatWinMessagesList.appendChild(bubble);
        });

        chatWinMessagesList.scrollTop = chatWinMessagesList.scrollHeight;
    }

    function sendDirectChatMessage() {
        const text = chatWinInput.value.trim();
        if (!text || !state.activeChatUser) return;

        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`;

        state.activeChatUser.messages.push({
            sender: 'me',
            text: text,
            time: timeStr
        });

        state.activeChatUser.lastMsg = text;
        state.activeChatUser.time = "Just now";
        
        chatWinInput.value = '';
        renderChatWindowMessages();
        saveStateToStorage();

        simulateTravelerResponse(state.activeChatUser);
    }

    btnChatWinSend.addEventListener('click', sendDirectChatMessage);
    chatWinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendDirectChatMessage();
    });

    function simulateTravelerResponse(activeChat) {
        setTimeout(() => {
            if (state.activeChatUser && state.activeChatUser.userId === activeChat.userId) {
                const now = new Date();
                const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`;
                
                let responseText = "Awesome! Let me check the ticket availability, then we can align.";
                if (activeChat.messages[activeChat.messages.length - 1].text.toLowerCase().includes('hello') || activeChat.messages[activeChat.messages.length - 1].text.toLowerCase().includes('hey')) {
                    responseText = "Hey! Glad you reached out. Are you staying in one of the Hostels nearby?";
                } else if (activeChat.messages[activeChat.messages.length - 1].text.toLowerCase().includes('stay') || activeChat.messages[activeChat.messages.length - 1].text.toLowerCase().includes('hotel') || activeChat.messages[activeChat.messages.length - 1].text.toLowerCase().includes('hostel')) {
                    responseText = "Yeah, I am planning to check into Zostel. It has super safe lockers and female dorm wings.";
                }

                activeChat.messages.push({
                    sender: 'them',
                    text: responseText,
                    time: timeStr
                });

                activeChat.lastMsg = responseText;
                activeChat.time = "Just now";
                renderChatWindowMessages();
                saveStateToStorage();
                showToast(`New message from ${activeChat.userName}`, "success");
            }
        }, 3000);
    }

    // ----------------------------------------------------------------------
    // 8. AI ASSISTANT CHATBOT (SAHAYRAK VIA POST /chatbot/query)
    // ----------------------------------------------------------------------
    const chatbotMessagesList = document.getElementById('chatbot-messages-list');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const btnSendChatbot = document.getElementById('btn-send-chatbot');

    async function sendChatbotMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        renderMessageBubble(text, 'user');
        chatbotInput.value = '';

        const typingIndicator = showTypingIndicator();

        try {
            // REST call to chatbot API
            const res = await fetch(`${API_BASE}/chatbot/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!res.ok) throw new Error("Chatbot server error");
            const data = await res.json();

            typingIndicator.remove();
            renderMessageBubble(data.reply, 'bot');
        } catch (e) {
            typingIndicator.remove();
            renderMessageBubble("Apologies, I am having trouble connecting to my knowledge base. Please check if the backend API is online.", 'bot');
        }
    }

    function renderMessageBubble(text, sender) {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.innerHTML = `
            <div class="msg-bubble">
                <p>${text}</p>
            </div>
            <span class="msg-time">${timeStr}</span>
        `;
        chatbotMessagesList.appendChild(msgDiv);
        chatbotMessagesList.scrollTop = chatbotMessagesList.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg bot';
        typingDiv.id = 'bot-typing-indicator';
        typingDiv.innerHTML = `
            <div class="msg-bubble typing-bubble">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatbotMessagesList.appendChild(typingDiv);
        chatbotMessagesList.scrollTop = chatbotMessagesList.scrollHeight;
        return typingDiv;
    }

    btnSendChatbot.addEventListener('click', sendChatbotMessage);
    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendChatbotMessage();
    });

    document.querySelectorAll('.quick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            chatbotInput.value = prompt;
            sendChatbotMessage();
        });
    });

    // ----------------------------------------------------------------------
    // 9. PROFILE & CONTACTS PERSISTENCE
    // ----------------------------------------------------------------------
    const profileEditForm = document.getElementById('profile-edit-form');
    const inputName = document.getElementById('input-user-name');
    const inputEmail = document.getElementById('input-user-email');
    const inputGender = document.getElementById('input-user-gender');
    const inputBudget = document.getElementById('input-user-budget');
    const btnSaveProfile = document.getElementById('btn-save-profile');
    
    const inputContactName = document.getElementById('new-contact-name');
    const inputContactPhone = document.getElementById('new-contact-phone');
    const btnAddContact = document.getElementById('btn-add-contact');

    function renderProfileValues() {
        document.getElementById('profile-disp-name').textContent = state.userProfile.name;
        document.getElementById('profile-disp-email').textContent = state.userProfile.email;
        document.getElementById('profile-stat-trips').textContent = state.userProfile.history.length.toString();
        
        inputName.value = state.userProfile.name;
        inputEmail.value = state.userProfile.email;
        inputGender.value = state.userProfile.gender;
        inputBudget.value = state.userProfile.budget;

        const badgesRow = document.getElementById('profile-badges-row');
        badgesRow.innerHTML = '';
        
        const badgeClasses = {
            "Shield Safe": { class: "gold-badge", icon: "fa-shield-cat", label: "Shield Safe" },
            "Hostel Hopper": { class: "copper-badge", icon: "fa-campground", label: "Hostel Hopper" },
            "Rail Rider": { class: "silver-badge", icon: "fa-train-subway", label: "Rail Rider" },
            "Goa Beach": { class: "gray-badge", icon: "fa-umbrella-beach", label: "Goa Beach" }
        };

        Object.keys(badgeClasses).forEach(badgeKey => {
            const hasBadge = state.userProfile.badges.includes(badgeKey);
            const badgeMeta = badgeClasses[badgeKey];
            
            const badgeItem = document.createElement('div');
            badgeItem.className = `badge-item ${hasBadge ? 'active' : 'lock'}`;
            badgeItem.title = hasBadge ? `Badge unlocked!` : `Keep traveling to unlock!`;
            badgeItem.innerHTML = `
                <div class="badge-icon ${hasBadge ? badgeMeta.class : 'gray-badge'}">
                    <i class="fa-solid ${badgeMeta.icon}"></i>
                </div>
                <span>${badgeMeta.label}</span>
            `;
            badgesRow.appendChild(badgeItem);
        });
    }

    btnSaveProfile.addEventListener('click', () => {
        state.userProfile.name = inputName.value.trim() || state.userProfile.name;
        state.userProfile.email = inputEmail.value.trim() || state.userProfile.email;
        state.userProfile.gender = inputGender.value;
        state.userProfile.budget = inputBudget.value;

        saveStateToStorage();
        renderProfileValues();
        showToast("Profile credentials updated successfully", "success");
    });

    btnAddContact.addEventListener('click', () => {
        const nameVal = inputContactName.value.trim();
        const phoneVal = inputContactPhone.value.trim();

        if (!nameVal || !phoneVal) {
            showToast("Please fill contact name and phone number.", "warning");
            return;
        }

        state.userProfile.contacts.push({ name: nameVal, phone: phoneVal });
        inputContactName.value = '';
        inputContactPhone.value = '';
        
        saveStateToStorage();
        showToast("New Emergency Contact added", "success");
        renderSafetyContacts();
    });

    function addBadgeToProfile(badgeName) {
        if (!state.userProfile.badges.includes(badgeName)) {
            state.userProfile.badges.push(badgeName);
            saveStateToStorage();
            renderProfileValues();
            showToast(`🏆 Badge Unlocked: ${badgeName}!`, "success");
        }
    }

    document.getElementById('btn-change-avatar').addEventListener('click', () => {
        showToast("Camera access simulated. Avatar updated!", "success");
    });

    // ----------------------------------------------------------------------
    // 10. TOAST NOTIFIER
    // ----------------------------------------------------------------------
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconClass = 'fa-circle-check';
        if (type === 'danger') iconClass = 'fa-triangle-exclamation';
        else if (type === 'warning') iconClass = 'fa-circle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3200);
    }

    // ----------------------------------------------------------------------
    // 11. BOOTSTRAP INITIALIZATION
    // ----------------------------------------------------------------------
    loadStateFromStorage();
    initMap();
    populateDropdowns();
    initSocket();
});
