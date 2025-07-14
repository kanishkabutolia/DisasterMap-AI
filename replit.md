# DisasterMap AI

## Overview

DisasterMap AI is a comprehensive GIS-based disaster analysis web application that provides real-time visualization and analysis of disaster-prone regions. The application integrates satellite data, AI prediction capabilities, and interactive mapping to create a professional dashboard for disaster monitoring and risk assessment. Built as a space-tech internship project, it focuses on being completely software-based with no hardware requirements and uses only free/open-source tools.

## System Architecture

### Backend Architecture
- **Flask Framework**: Lightweight Python web framework serving as the main backend
- **RESTful API Design**: Endpoints for weather data, disaster information, and analytics
- **Modular Structure**: Separated concerns with dedicated modules for weather API integration, GeoJSON utilities, and ML predictions

### Frontend Architecture
- **Server-Side Rendering**: Flask templates with Jinja2 templating engine
- **Interactive Mapping**: Leaflet.js for dynamic map visualization with multiple layer support
- **Responsive Design**: Bootstrap 5 dark theme for professional UI across devices
- **Real-time Updates**: JavaScript-based client-side functionality for live data updates

### Data Management
- **File-Based Storage**: GeoJSON files for disaster zone data storage
- **In-Memory Storage**: Temporary storage for bookmarks and session data
- **External APIs**: OpenWeatherMap integration for real-time weather data

## Key Components

### Core Application (`app.py`)
- Main Flask application with route definitions
- API endpoints for weather and disaster data
- Session management and error handling
- Integration point for all backend services

### Weather Integration (`weather_api.py`)
- OpenWeatherMap API wrapper
- Real-time weather data retrieval
- Error handling and timeout management
- Data formatting and normalization

### GeoJSON Utilities (`utils.py`)
- Spatial data processing and manipulation
- Distance calculations using Haversine formula
- Report generation for specific regions
- File-based data loading mechanisms

### ML Prediction Module (`ml_model/predict_disaster.py`)
- Placeholder implementation for disaster risk classification
- Extensible architecture for future AI model integration
- Risk assessment algorithms for multiple disaster types
- Structured for TensorFlow/Keras model deployment

### Frontend Dashboard (`templates/dashboard.html`)
- Responsive web interface with Bootstrap components
- Leaflet.js map integration with multiple tile layers
- Interactive controls for layer management
- Real-time clock and search functionality

### Client-Side Logic (`static/dashboard.js`)
- DisasterMapApp class for application state management
- Map initialization and layer control
- Event handling for user interactions
- AJAX requests for backend API communication

## Data Flow

1. **User Interaction**: User selects disaster type or searches for location
2. **Frontend Processing**: JavaScript captures events and makes API requests
3. **Backend Processing**: Flask routes handle requests and process data
4. **External API Calls**: Weather data fetched from OpenWeatherMap
5. **Data Retrieval**: GeoJSON files loaded and processed
6. **Response Formatting**: Data formatted and returned to frontend
7. **Map Visualization**: Leaflet.js renders data layers on interactive map
8. **Analytics Display**: Chart.js visualizes trends and statistics

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework for Python backend
- **Requests**: HTTP library for external API calls
- **Pandas/NumPy**: Data processing and analysis
- **Logging**: Built-in Python logging for debugging

### Frontend Dependencies
- **Leaflet.js**: Open-source interactive mapping library
- **Bootstrap 5**: Responsive CSS framework with dark theme
- **Chart.js**: Data visualization and analytics charts
- **Font Awesome**: Icon library for UI elements

### External Services
- **OpenWeatherMap API**: Real-time weather data provider
- **OpenStreetMap**: Tile server for map base layers
- **Esri ArcGIS**: Satellite imagery tile provider

### Planned ML Dependencies
- **TensorFlow/Keras**: Machine learning framework (for future implementation)
- **Satellite Data APIs**: Space-based imagery sources (to be integrated)

## Deployment Strategy

### Development Environment
- **Local Development**: Flask development server with debug mode
- **File-Based Configuration**: Environment variables for API keys
- **Static Asset Serving**: Flask static file serving for development

### Production Considerations
- **Database Migration**: Replace in-memory storage with persistent database
- **Environment Configuration**: Secure API key management
- **Performance Optimization**: Caching strategies for API responses
- **Scalability**: Consider containerization and cloud deployment

### Security Measures
- **API Key Protection**: Environment variable storage
- **Input Validation**: Request parameter sanitization
- **Error Handling**: Graceful degradation and user feedback
- **CORS Configuration**: Cross-origin request management

## Changelog

Changelog:
- July 07, 2025. Initial setup
- July 07, 2025. Enhanced global mapping with worldwide disaster data coverage
  - Added global disaster data for major cities across all continents
  - Implemented world map view with multiple tile layers (Street, Satellite, Topographic, Terrain)
  - Added coordinate display and enhanced map navigation controls
  - Created quick navigation buttons for major world regions
  - Enhanced disaster popups with detailed city/country information
  - Added functional map controls for global view and layer management
  - Improved data export functionality for active disaster types

## User Preferences

Preferred communication style: Simple, everyday language.