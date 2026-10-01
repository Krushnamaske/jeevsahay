/**
 * Reusable FacilityMap component — mirrors Rescue Map UI and behavior.
 * Usage: FacilityMap.initPage({ facilityType, title, subtitle, listTitle, filterType, backLink })
 */
const FacilityMap = (function () {
    let map;
    let userMarker;
    let facilityMarkers = [];
    let userLocation = null;
    let facilities = [];
    let pageConfig = {};

    const DEFAULT_CENTER = { lat: 18.6298, lng: 73.7997 };

    function renderPageShell(config) {
        const root = document.getElementById("facility-map-app");
        if (!root) {
            return;
        }

        const assetPrefix = config.assetPrefix || "../../";
        const emergencyBanner = config.showEmergencyBanner
            ? `<div class="emergency-banner">
                    <div>🚨 Emergency Animal Rescue Helpline</div>
                    <div class="emergency-number">1800-XXX-XXXX</div>
                    <div style="font-size: 14px;">Available 24/7 for critical situations</div>
               </div>`
            : "";

        root.innerHTML = `
            <div class="container">
                <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
                    <a href="${assetPrefix}homepage.html" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                        <span class="fs-4">Jivsahayy</span>
                    </a>
                    <ul class="nav nav-pills">
                        <li class="nav-item"><a href="${assetPrefix}homepage.html" class="nav-link">Home</a></li>
                        <li class="nav-item"><a href="${assetPrefix}report_animal.html" class="nav-link">Report animal</a></li>
                        <li class="nav-item"><a href="#" class="nav-link">FAQs</a></li>
                        <li class="nav-item"><a href="${assetPrefix}about.html" class="nav-link">About</a></li>
                    </ul>
                </header>
            </div>

            <div class="container mt-4">
                ${emergencyBanner}
                <a href="${config.backLink}" class="back-link-btn">← Back</a>

                <div class="info-panel">
                    <h2 style="font-weight: 800; color: #2e7d32; margin-bottom: 10px;">${config.title}</h2>
                    <p style="color: #666; margin-bottom: 15px;">${config.subtitle}</p>
                    <button class="current-location-btn" id="facility-location-btn" type="button">📍 Use My Current Location</button>
                </div>

                <div class="row">
                    <div class="col-lg-7">
                        <div class="map-container">
                            <div id="map"></div>
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div class="info-panel">
                            <h4 style="font-weight: 700; margin-bottom: 20px;">${config.listTitle}</h4>
                            <div id="facility-list">
                                <div class="loading-indicator">
                                    <div class="spinner-border text-success" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p style="margin-top: 10px;">Finding facilities near you...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("facility-location-btn").addEventListener("click", getUserLocation);
    }

    function getAvailabilityLabel(availability) {
        if (availability === "available") {
            return { text: "● Available", className: "status-available" };
        }
        if (availability === "busy") {
            return { text: "○ Busy", className: "status-busy" };
        }
        return { text: "✕ Closed", className: "status-closed" };
    }

    function initMap() {
        map = L.map("map").setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        const customIcon = L.divIcon({
            className: "custom-marker",
            html: '<div style="background-color: #2e7d32; width: 35px; height: 35px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); color: white; font-size: 18px; margin-top: 4px; margin-left: 7px;">🐾</div></div>',
            iconSize: [35, 35],
            iconAnchor: [17, 35]
        });

        facilityMarkers = [];

        facilities.forEach(function (facility) {
            const marker = L.marker([facility.latitude, facility.longitude], { icon: customIcon }).addTo(map);
            const status = getAvailabilityLabel(facility.availability);

            marker.bindPopup(`
                <div style="font-family: 'Segoe UI', sans-serif; min-width: 200px;">
                    <strong style="color: #2e7d32; font-size: 16px;">${facility.name}</strong><br>
                    <span style="color: #666; font-size: 13px;">${facility.type}</span><br>
                    <div style="margin-top: 8px; color: #555; font-size: 13px;">📍 ${facility.address}</div>
                    <div style="margin-top: 6px; color: #666; font-size: 12px;">${facility.description}</div>
                    <div style="margin-top: 8px; font-weight: 600; color: ${facility.availability === "available" ? "#2e7d32" : facility.availability === "busy" ? "#f57c00" : "#c62828"};">
                        ${status.text}
                    </div>
                </div>
            `);

            marker.facilityId = facility.id;
            marker.on("click", function () {
                highlightFacility(facility.id);
            });
            facilityMarkers.push(marker);
        });

        getUserLocation();
    }

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserMarker();
                    map.setView([userLocation.lat, userLocation.lng], 13);
                    updateFacilityList();
                },
                function () {
                    userLocation = DEFAULT_CENTER;
                    updateFacilityList();
                }
            );
        } else {
            userLocation = DEFAULT_CENTER;
            updateFacilityList();
        }
    }

    function setUserMarker() {
        if (!userLocation) {
            return;
        }

        if (userMarker) {
            map.removeLayer(userMarker);
        }

        const userIcon = L.divIcon({
            className: "user-marker",
            html: '<div style="background-color: #1976d2; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 20px;">📍</div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
        userMarker.bindPopup('<strong style="color: #1976d2;">Your Location</strong>');
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function updateFacilityList() {
        const facilityList = document.getElementById("facility-list");
        if (!facilityList) {
            return;
        }

        const sortedFacilities = facilities.map(function (facility) {
            const distance = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, facility.latitude, facility.longitude)
                : 0;
            return Object.assign({}, facility, { distance: distance });
        }).sort(function (a, b) {
            return a.distance - b.distance;
        });

        let html = "";

        if (sortedFacilities.length === 0) {
            html = '<p style="color: #666;">No facilities found for this category.</p>';
        } else {
            sortedFacilities.forEach(function (facility) {
                const status = getAvailabilityLabel(facility.availability);
                html += `
                    <div class="facility-card" id="facility-${facility.id}" data-facility-id="${facility.id}">
                        <div class="facility-name">
                            ${facility.name}
                            <span class="availability-status ${status.className}">${status.text}</span>
                        </div>
                        <div class="facility-type">${facility.type}</div>
                        <div class="facility-address">📍 ${facility.address}</div>
                        <div class="distance-badge">
                            📍 ${facility.distance.toFixed(2)} km away | ⏱️ ~${Math.ceil(facility.distance * 3)} min
                        </div>
                        <p style="font-size: 13px; color: #666; margin: 8px 0 0;">${facility.description}</p>
                        <button class="directions-btn" type="button" data-lat="${facility.latitude}" data-lng="${facility.longitude}" data-name="${facility.name.replace(/"/g, "&quot;")}">
                            🗺️ Get Directions
                        </button>
                    </div>
                `;
            });
        }

        facilityList.innerHTML = html;

        facilityList.querySelectorAll(".facility-card").forEach(function (card) {
            card.addEventListener("click", function (event) {
                if (event.target.classList.contains("directions-btn")) {
                    return;
                }
                focusOnFacility(Number(card.dataset.facilityId));
            });
        });

        facilityList.querySelectorAll(".directions-btn").forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                getDirections(
                    Number(button.dataset.lat),
                    Number(button.dataset.lng),
                    button.dataset.name
                );
            });
        });
    }

    function focusOnFacility(facilityId) {
        const facility = facilities.find(function (item) {
            return item.id === facilityId;
        });

        if (!facility) {
            return;
        }

        map.setView([facility.latitude, facility.longitude], 15);
        const marker = facilityMarkers.find(function (item) {
            return item.facilityId === facilityId;
        });

        if (marker) {
            marker.openPopup();
        }

        highlightFacility(facilityId);
    }

    function highlightFacility(facilityId) {
        document.querySelectorAll(".facility-card").forEach(function (card) {
            card.classList.remove("active");
        });

        const card = document.getElementById("facility-" + facilityId);
        if (card) {
            card.classList.add("active");
            card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    function getDirections(lat, lng, name) {
        if (userLocation) {
            window.open(
                "https://www.google.com/maps/dir/?api=1&origin=" + userLocation.lat + "," + userLocation.lng +
                "&destination=" + lat + "," + lng + "&travelmode=driving",
                "_blank"
            );
        } else {
            window.open("https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng, "_blank");
        }
    }

    function initPage(config) {
        pageConfig = config;
        facilities = getFacilitiesByType(config.facilityType, config.filterType || null);
        renderPageShell(config);
        initMap();
    }

    return {
        initPage: initPage,
        focusOnFacility: focusOnFacility,
        getDirections: getDirections
    };
})();

window.FacilityMap = FacilityMap;
