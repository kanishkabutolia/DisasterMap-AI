# DisasterMap AI - Setup Instructions

## Quick Start

1. **Install Python 3.8+** if not already installed
2. **Navigate to project directory**:
   ```bash
   cd DisasterMap_AI
   ```

3. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application** (Choose one method):
   
   **Option A - Easy Setup (Recommended):**
   ```bash
   python run_local.py
   ```
   
   **Option B - Direct Run:**
   ```bash
   python app.py
   ```

6. **Open your browser** and go to: `http://localhost:5000`

## Optional: Weather API Setup

To enable weather features:
1. Get a free API key from https://openweathermap.org/api
2. Set environment variable:
   ```bash
   export OPENWEATHER_API_KEY="your_api_key_here"
   ```

## Features

- Interactive disaster mapping
- Real-time weather integration
- AI-powered risk assessment
- Data export (CSV/GeoJSON)
- City search and bookmarks
- Analytics dashboard

## Project Structure

```
DisasterMap_AI/
├── app.py                 # Main Flask application
├── main.py               # Application entry point
├── weather_api.py        # Weather API integration
├── utils.py              # GeoJSON utilities
├── templates/            # HTML templates
├── static/               # CSS, JS, assets
├── data/                 # Disaster data files
├── ml_model/             # AI prediction module
└── requirements.txt      # Python dependencies
```

## Technologies Used

- **Backend**: Flask, Python
- **Frontend**: HTML5, CSS3, Bootstrap, JavaScript
- **Mapping**: Leaflet.js
- **Charts**: Chart.js
- **APIs**: OpenWeatherMap
- **Data**: GeoJSON format

## Support

This is a space-tech internship project demonstrating GIS-based disaster analysis.
The application works completely offline except for weather API features.
