// DisasterMap AI Dashboard JavaScript

class DisasterMapApp {
    constructor() {
        this.map = null;
        this.currentLat = 40.7128;
        this.currentLon = -74.0060;
        this.selectedRadius = 10; // km
        this.layers = {
            flood: null,
            wildfire: null,
            drought: null,
            earthquake: null
        };
        this.bookmarks = [];
        
        this.init();
    }
    
    init() {
        this.initMap();
        this.initEventListeners();
        this.updateClock();
        this.loadBookmarks();
        this.loadAnalytics();
        
        // Load initial flood layer
        this.toggleLayer('flood', true);
    }
    
    initMap() {
        // Initialize Leaflet map with global view
        this.map = L.map('map', {
            center: [20, 0], // Center on world view
            zoom: 2,
            minZoom: 2,
            maxZoom: 18,
            worldCopyJump: true,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 1.0
        });
        
        // Add multiple tile layers for different views
        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        });
        
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
        });
        
        const topoLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
        });
        
        const terrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
        });
        
        const baseMaps = {
            "Street View": streetLayer,
            "Satellite": satelliteLayer,
            "Topographic": topoLayer,
            "Terrain": terrainLayer
        };
        
        streetLayer.addTo(this.map);
        L.control.layers(baseMaps).addTo(this.map);
        
        // Add scale control
        L.control.scale({
            imperial: true,
            metric: true
        }).addTo(this.map);
        
        // Add coordinates display
        this.coordinatesControl = L.control({position: 'bottomright'});
        this.coordinatesControl.onAdd = function(map) {
            this._div = L.DomUtil.create('div', 'coordinates-display');
            this._div.style.background = 'rgba(0,0,0,0.8)';
            this._div.style.color = 'white';
            this._div.style.padding = '5px';
            this._div.style.fontSize = '12px';
            this._div.style.borderRadius = '3px';
            this._div.innerHTML = 'Lat: 0.00, Lon: 0.00';
            return this._div;
        };
        this.coordinatesControl.addTo(this.map);
        
        // Update coordinates on mouse move
        this.map.on('mousemove', (e) => {
            if (this.coordinatesControl._div) {
                this.coordinatesControl._div.innerHTML = 
                    `Lat: ${e.latlng.lat.toFixed(4)}, Lon: ${e.latlng.lng.toFixed(4)}`;
            }
        });
        
        // Map click event for weather data and risk assessment
        this.map.on('click', (e) => {
            this.currentLat = e.latlng.lat;
            this.currentLon = e.latlng.lng;
            
            // Update selection info immediately with coordinates
            this.updateSelectionInfo(e.latlng.lat, e.latlng.lng, null, null);
            
            // Get weather and prediction data
            this.getWeatherData(e.latlng.lat, e.latlng.lng);
            this.getMlPrediction(e.latlng.lat, e.latlng.lng);
            
            // Add click marker
            if (this.clickMarker) {
                this.map.removeLayer(this.clickMarker);
            }
            this.clickMarker = L.marker([e.latlng.lat, e.latlng.lng], {
                icon: L.divIcon({
                    className: 'click-marker',
                    html: '<i class="fas fa-crosshairs" style="color: red; font-size: 20px;"></i>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(this.map);
        });
        
        // Update current position
        this.currentLat = 20;
        this.currentLon = 0;
    }
    
    initEventListeners() {
        // Layer toggle controls
        document.getElementById('flood-layer').addEventListener('change', (e) => {
            this.toggleLayer('flood', e.target.checked);
        });
        
        document.getElementById('wildfire-layer').addEventListener('change', (e) => {
            this.toggleLayer('wildfire', e.target.checked);
        });
        
        document.getElementById('drought-layer').addEventListener('change', (e) => {
            this.toggleLayer('drought', e.target.checked);
        });
        
        document.getElementById('earthquake-layer').addEventListener('change', (e) => {
            this.toggleLayer('earthquake', e.target.checked);
        });
        
        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => {
            this.searchCity();
        });
        
        document.getElementById('city-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCity();
            }
        });
        
        // Bookmark functionality
        document.getElementById('add-bookmark-btn').addEventListener('click', () => {
            this.addBookmark();
        });
        
        // Download report
        document.getElementById('download-report-btn').addEventListener('click', () => {
            this.downloadReport();
        });
        
        // Locate user
        document.getElementById('locate-btn').addEventListener('click', () => {
            this.locateUser();
        });
        
        // Sidebar toggle for mobile
        document.getElementById('toggle-sidebar').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('show');
        });
    }
    
    async toggleLayer(layerType, show) {
        if (show) {
            if (this.layers[layerType]) {
                this.map.addLayer(this.layers[layerType]);
                return;
            }
            
            try {
                const response = await fetch(`/api/disaster-data/${layerType}`);
                if (!response.ok) throw new Error('Failed to load disaster data');
                
                const data = await response.json();
                
                // Create layer with custom styling
                this.layers[layerType] = L.geoJSON(data, {
                    pointToLayer: (feature, latlng) => {
                        return this.createDisasterMarker(latlng, layerType, feature.properties);
                    },
                    onEachFeature: (feature, layer) => {
                        layer.bindPopup(this.createDisasterPopup(feature, layerType));
                    }
                });
                
                this.map.addLayer(this.layers[layerType]);
                
            } catch (error) {
                console.error(`Error loading ${layerType} data:`, error);
                this.showError(`Failed to load ${layerType} data`);
            }
        } else {
            if (this.layers[layerType]) {
                this.map.removeLayer(this.layers[layerType]);
            }
        }
    }
    
    createDisasterMarker(latlng, type, properties) {
        const colors = {
            flood: '#007bff',
            wildfire: '#dc3545',
            drought: '#ffc107',
            earthquake: '#6c757d'
        };
        
        const riskLevel = properties.risk_level || 'medium';
        const size = riskLevel === 'high' ? 12 : riskLevel === 'medium' ? 8 : 6;
        
        return L.circleMarker(latlng, {
            radius: size,
            fillColor: colors[type],
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
    }
    
    createDisasterPopup(feature, type) {
        const props = feature.properties;
        let additionalInfo = '';
        
        // Add type-specific information
        if (type === 'flood') {
            additionalInfo = `
                <p><strong>Population Affected:</strong> ${props.population_affected?.toLocaleString() || 'Unknown'}</p>
                <p><strong>Area:</strong> ${props.area_km2} km²</p>
            `;
        } else if (type === 'wildfire') {
            additionalInfo = `
                <p><strong>Acres Burned:</strong> ${props.acres_burned?.toLocaleString() || 'Unknown'}</p>
                <p><strong>Containment:</strong> ${props.containment_percent || 0}%</p>
            `;
        } else if (type === 'drought') {
            additionalInfo = `
                <p><strong>Drought Index:</strong> ${props.drought_index || 'Unknown'}</p>
                <p><strong>Duration:</strong> ${props.duration_weeks || 'Unknown'} weeks</p>
            `;
        } else if (type === 'earthquake') {
            additionalInfo = `
                <p><strong>Magnitude:</strong> ${props.magnitude || 'Unknown'}</p>
                <p><strong>Depth:</strong> ${props.depth_km || 'Unknown'} km</p>
                <p><strong>Fault System:</strong> ${props.fault_system || 'Unknown'}</p>
            `;
        }
        
        return `
            <div class="popup-disaster">
                <h6><i class="fas fa-${this.getDisasterIcon(type)}"></i> ${type.charAt(0).toUpperCase() + type.slice(1)} Alert</h6>
                <p><strong>Location:</strong> ${props.city || 'Unknown'}, ${props.country || 'Unknown'}</p>
                <p><strong>Severity:</strong> ${props.severity || 'Unknown'}</p>
                <p><strong>Risk Level:</strong> <span class="risk-${props.risk_level || 'medium'}">${(props.risk_level || 'medium').toUpperCase()}</span></p>
                ${additionalInfo}
                <p><strong>Last Updated:</strong> ${props.last_updated || 'Unknown'}</p>
                ${props.description ? `<p><em>${props.description}</em></p>` : ''}
                <button class="btn btn-sm btn-primary mt-2" onclick="app.getLocationWeather(${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]})">
                    <i class="fas fa-cloud-sun"></i> Get Weather
                </button>
            </div>
        `;
    }
    
    getDisasterIcon(type) {
        const icons = {
            flood: 'water',
            wildfire: 'fire',
            drought: 'sun',
            earthquake: 'mountain'
        };
        return icons[type] || 'exclamation-triangle';
    }
    
    async getWeatherData(lat, lon) {
        try {
            const response = await fetch(`/api/weather/${lat}/${lon}`);
            if (!response.ok) throw new Error('Weather data unavailable');
            
            const weather = await response.json();
            this.displayWeatherInfo(weather);
            
            // Update selection info with weather data
            this.lastWeatherData = weather;
            this.updateSelectionInfo(lat, lon, weather, this.lastPredictionData);
            
            // Add weather popup to map
            L.popup()
                .setLatLng([lat, lon])
                .setContent(this.createWeatherPopup(weather))
                .openOn(this.map);
                
        } catch (error) {
            console.error('Weather API error:', error);
            this.showError('Weather data unavailable');
        }
    }
    
    displayWeatherInfo(weather) {
        const panel = document.getElementById('weather-panel');
        panel.innerHTML = `
            <div class="card-body weather-info">
                <h6 class="card-title">${weather.city}, ${weather.country}</h6>
                <div class="weather-main mb-2">
                    <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}" class="weather-icon me-2">
                    <div>
                        <div class="h5 mb-0">${Math.round(weather.temperature)}°C</div>
                        <small class="text-muted">${weather.description}</small>
                    </div>
                </div>
                <div class="weather-details">
                    <small class="d-block">Feels like: ${Math.round(weather.feels_like)}°C</small>
                    <small class="d-block">Humidity: ${weather.humidity}%</small>
                    <small class="d-block">Wind: ${weather.wind_speed} m/s</small>
                    <small class="d-block">Pressure: ${weather.pressure} hPa</small>
                </div>
            </div>
        `;
    }
    
    createWeatherPopup(weather) {
        return `
            <div class="popup-weather">
                <div class="weather-main">
                    <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}" class="weather-icon">
                    <div>
                        <h6>${weather.city}, ${weather.country}</h6>
                        <p class="mb-1">${Math.round(weather.temperature)}°C - ${weather.description}</p>
                    </div>
                </div>
                <div class="weather-details">
                    <small>Humidity: ${weather.humidity}% | Wind: ${weather.wind_speed} m/s</small>
                </div>
            </div>
        `;
    }
    
    async getMlPrediction(lat, lon) {
        try {
            const response = await fetch(`/api/ml-predict?lat=${lat}&lon=${lon}`);
            const prediction = await response.json();
            
            this.displayRiskAssessment(prediction);
            
            // Update selection info with prediction data
            this.lastPredictionData = prediction;
            this.updateSelectionInfo(lat, lon, this.lastWeatherData, prediction);
        } catch (error) {
            console.error('ML prediction error:', error);
            document.getElementById('risk-panel').innerHTML = `
                <div class="card-body">
                    <p class="card-text text-light">AI analysis unavailable</p>
                </div>
            `;
        }
    }
    
    displayRiskAssessment(prediction) {
        const panel = document.getElementById('risk-panel');
        const riskLevel = prediction.risk_level || 'unknown';
        const confidence = prediction.confidence || 0;
        
        panel.innerHTML = `
            <div class="card-body">
                <h6 class="card-title text-light">Risk Assessment</h6>
                <p class="card-text">
                    <span class="risk-${riskLevel}">${riskLevel.toUpperCase()}</span> Risk
                </p>
                <div class="progress mb-2">
                    <div class="progress-bar" style="width: ${confidence * 100}%"></div>
                </div>
                <small class="text-muted">Confidence: ${Math.round(confidence * 100)}%</small>
            </div>
        `;
    }
    
    async searchCity() {
        const cityName = document.getElementById('city-search').value.trim();
        if (!cityName) return;
        
        try {
            const response = await fetch(`/api/search/${encodeURIComponent(cityName)}`);
            if (!response.ok) throw new Error('City not found');
            
            const city = await response.json();
            this.map.setView([city.lat, city.lon], 10);
            this.currentLat = city.lat;
            this.currentLon = city.lon;
            
            // Clear search input
            document.getElementById('city-search').value = '';
            
        } catch (error) {
            console.error('City search error:', error);
            this.showError('City not found');
        }
    }
    
    async addBookmark() {
        const cityName = prompt('Enter a name for this location:');
        if (!cityName) return;
        
        try {
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: cityName,
                    lat: this.currentLat,
                    lon: this.currentLon
                })
            });
            
            if (!response.ok) throw new Error('Failed to add bookmark');
            
            const bookmark = await response.json();
            this.bookmarks.push(bookmark);
            this.updateBookmarksList();
            this.showSuccess('Bookmark added successfully');
            
        } catch (error) {
            console.error('Bookmark error:', error);
            this.showError('Failed to add bookmark');
        }
    }
    
    async loadBookmarks() {
        try {
            const response = await fetch('/api/bookmarks');
            this.bookmarks = await response.json();
            this.updateBookmarksList();
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
        }
    }
    
    updateBookmarksList() {
        const container = document.getElementById('bookmarks-list');
        container.innerHTML = '';
        
        this.bookmarks.forEach(bookmark => {
            const item = document.createElement('div');
            item.className = 'bookmark-item bg-secondary text-light';
            item.innerHTML = `
                <i class="fas fa-bookmark me-2"></i>
                ${bookmark.name}
            `;
            item.addEventListener('click', () => {
                this.map.setView([bookmark.lat, bookmark.lon], 10);
                this.currentLat = bookmark.lat;
                this.currentLon = bookmark.lon;
            });
            container.appendChild(item);
        });
    }
    
    async downloadReport() {
        const format = document.getElementById('export-format').value;
        
        // Get currently active disaster type
        let activeType = 'flood'; // default
        const layerCheckboxes = ['flood', 'wildfire', 'drought', 'earthquake'];
        for (const type of layerCheckboxes) {
            if (document.getElementById(`${type}-layer`).checked) {
                activeType = type;
                break;
            }
        }
        
        const url = `/api/download-report?type=${activeType}&format=${format}&lat=${this.currentLat}&lon=${this.currentLon}&radius=${this.selectedRadius}`;
        
        try {
            window.open(url, '_blank');
            this.showSuccess(`${activeType.charAt(0).toUpperCase() + activeType.slice(1)} report download started`);
        } catch (error) {
            console.error('Download error:', error);
            this.showError('Failed to download report');
        }
    }
    
    getLocationWeather(lat, lon) {
        this.map.setView([lat, lon], 10);
        this.currentLat = lat;
        this.currentLon = lon;
        this.getWeatherData(lat, lon);
        this.getMlPrediction(lat, lon);
    }
    
    // Quick navigation functions for major global regions
    navigateToRegion(region) {
        const regions = {
            'north-america': [45, -100],
            'south-america': [-15, -60],
            'europe': [50, 10],
            'africa': [0, 20],
            'asia': [30, 100],
            'oceania': [-25, 140],
            'arctic': [75, 0],
            'antarctica': [-80, 0]
        };
        
        if (regions[region]) {
            this.map.setView(regions[region], 3);
        }
    }
    
    // Toggle all disaster layers at once
    toggleAllLayers(show) {
        const layerTypes = ['flood', 'wildfire', 'drought', 'earthquake'];
        layerTypes.forEach(type => {
            const checkbox = document.getElementById(`${type}-layer`);
            checkbox.checked = show;
            this.toggleLayer(type, show);
        });
    }
    
    locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.map.setView([lat, lon], 12);
                    this.currentLat = lat;
                    this.currentLon = lon;
                    this.getWeatherData(lat, lon);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.showError('Location access denied');
                }
            );
        } else {
            this.showError('Geolocation not supported');
        }
    }
    
    async loadAnalytics() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            
            this.updateStatistics(data);
            this.createTrendChart(data.trend_data);
            this.createRiskChart(data.risk_distribution);
            this.createDisasterTypesChart(data.by_type);
            this.updateActivityFeed();
            
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }
    
    updateStatistics(data) {
        // Statistics elements have been removed, so skip this function
        return;
    }
    
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const startValue = 0;
        const duration = 1500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = typeof targetValue === 'string' ? targetValue : currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    createTrendChart(trendData) {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.map(d => d.month),
                datasets: [{
                    label: 'Disaster Incidents',
                    data: trendData.map(d => d.incidents),
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
    }
    
    createRiskChart(riskData) {
        const ctx = document.getElementById('risk-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                datasets: [{
                    data: [riskData.high, riskData.medium, riskData.low],
                    backgroundColor: ['#dc3545', '#ffc107', '#28a745']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    createDisasterTypesChart(disasterData) {
        const ctx = document.getElementById('disaster-types-chart');
        if (!ctx) return;
        
        if (this.disasterTypesChart) {
            this.disasterTypesChart.destroy();
        }
        
        const labels = Object.keys(disasterData);
        const data = Object.values(disasterData);
        const colors = ['#007bff', '#dc3545', '#ffc107', '#6c757d'];
        
        this.disasterTypesChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
                datasets: [{
                    label: 'Active Incidents',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    updateActivityFeed() {
        const activities = [
            { type: 'flood', title: 'Flood Alert - Tokyo', time: '2 hours ago' },
            { type: 'wildfire', title: 'Wildfire - Madrid', time: '4 hours ago' },
            { type: 'earthquake', title: 'Earthquake - Santiago', time: '6 hours ago' },
            { type: 'drought', title: 'Drought Warning - Alice Springs', time: '8 hours ago' },
            { type: 'flood', title: 'Coastal Surge - New York', time: '10 hours ago' },
            { type: 'wildfire', title: 'Forest Fire - Sydney', time: '12 hours ago' }
        ];
        
        const feedContainer = document.getElementById('activity-feed');
        if (feedContainer) {
            feedContainer.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas fa-${this.getDisasterIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    updateSelectionInfo(lat, lon, weather, prediction) {
        const selectionInfo = document.getElementById('selection-info');
        if (selectionInfo) {
            selectionInfo.innerHTML = `
                <div class="mb-2">
                    <strong>Location:</strong> ${lat.toFixed(4)}°, ${lon.toFixed(4)}°
                </div>
                ${weather ? `
                    <div class="mb-2">
                        <strong>Weather:</strong> ${Math.round(weather.temperature)}°C, ${weather.description}
                    </div>
                ` : ''}
                ${prediction ? `
                    <div class="mb-2">
                        <strong>AI Risk Level:</strong> 
                        <span class="risk-${prediction.risk_level}">${prediction.risk_level.toUpperCase()}</span>
                        (${Math.round(prediction.confidence * 100)}% confidence)
                    </div>
                ` : ''}
                <div class="text-muted">
                    <small>Last updated: ${new Date().toLocaleTimeString()}</small>
                </div>
            `;
        }
    }
    
    showEmergencyContacts() {
        const contacts = `
            <div class="emergency-contacts">
                <h6>Global Emergency Numbers</h6>
                <div class="mb-2"><strong>USA:</strong> 911</div>
                <div class="mb-2"><strong>Europe:</strong> 112</div>
                <div class="mb-2"><strong>UK:</strong> 999</div>
                <div class="mb-2"><strong>Australia:</strong> 000</div>
                <div class="mb-2"><strong>Japan:</strong> 119</div>
                <div class="mb-2"><strong>India:</strong> 108</div>
                <hr>
                <div class="mb-2"><strong>WHO Emergency:</strong> +41 22 791 21 11</div>
                <div class="mb-2"><strong>UNDRR:</strong> +41 22 917 89 08</div>
            </div>
        `;
        
        alert('Emergency Contacts:\n\nUSA: 911\nEurope: 112\nUK: 999\nAustralia: 000\nJapan: 119\nIndia: 108\n\nWHO Emergency: +41 22 791 21 11\nUNDRR: +41 22 917 89 08');
    }
    
    generateGlobalReport() {
        const format = document.getElementById('export-format')?.value || 'csv';
        const url = `/api/download-report?type=global&format=${format}&lat=0&lon=0&radius=20000`;
        
        try {
            window.open(url, '_blank');
            this.showSuccess('Global report generation started');
        } catch (error) {
            console.error('Report generation error:', error);
            this.showError('Failed to generate global report');
        }
    }
    
    refreshData() {
        this.showSuccess('Refreshing data...');
        this.loadAnalytics();
        this.updateActivityFeed();
        
        // Refresh all visible layers
        const layerTypes = ['flood', 'wildfire', 'drought', 'earthquake'];
        layerTypes.forEach(type => {
            const checkbox = document.getElementById(`${type}-layer`);
            if (checkbox && checkbox.checked) {
                if (this.layers[type]) {
                    this.map.removeLayer(this.layers[type]);
                    this.layers[type] = null;
                }
                this.toggleLayer(type, true);
            }
        });
    }

    updateClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleString('en-US', {
                timeZone: 'UTC',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            document.getElementById('current-time').textContent = timeString + ' UTC';
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    showError(message) {
        // You could implement a toast notification system here
        console.error(message);
    }
    
    showSuccess(message) {
        // You could implement a toast notification system here
        console.log(message);
    }
}

// Initialize the application when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DisasterMapApp();
    window.app = app; // Make app globally accessible
});
