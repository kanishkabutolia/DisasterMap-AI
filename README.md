# DisasterMap AI

A comprehensive GIS-based disaster analysis web application that provides real-time visualization and analysis of disaster-prone regions using satellite data, AI prediction, and interactive mapping.

## 🎯 Project Overview

DisasterMap AI is a space-tech internship project that creates an interactive dashboard for disaster monitoring and analysis. The application integrates multiple data sources and technologies to provide actionable insights for disaster preparedness and response.

## ✨ Features

### Core Functionality
- **Interactive Leaflet.js Map**: Real-time disaster visualization with multiple layer support
- **Multi-Disaster Analysis**: Floods, wildfires, droughts, and earthquakes monitoring
- **Weather Integration**: Live weather data from OpenWeatherMap API
- **AI Risk Assessment**: Machine learning-based disaster risk classification
- **Data Export**: Download reports in CSV or GeoJSON formats
- **Search & Navigation**: City search with automatic map centering
- **Bookmark System**: Save and manage vulnerable locations

### Advanced Features
- **Real-time Clock**: UTC timestamp display
- **Analytics Dashboard**: Trend analysis with Chart.js visualizations
- **Risk Distribution**: Visual breakdown of risk levels
- **Historical Data**: Compare current vs historical disaster patterns
- **Responsive Design**: Mobile-friendly interface
- **Professional UI**: Bootstrap-based dark theme

## 🛠️ Technology Stack

### Backend
- **Flask**: Web framework and API routing
- **Python**: Core backend logic
- **OpenWeatherMap API**: Real-time weather data
- **GeoJSON**: Spatial data handling
- **NumPy/Pandas**: Data processing and analysis

### Frontend
- **HTML5/CSS3**: Modern web standards
- **Bootstrap 5**: Responsive UI framework
- **Leaflet.js**: Interactive mapping library
- **Chart.js**: Data visualization
- **Vanilla JavaScript**: Client-side functionality

### Machine Learning
- **TensorFlow/Keras**: ML model framework (placeholder)
- **Satellite Data Processing**: Feature extraction
- **Risk Classification**: Multi-disaster assessment

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- OpenWeatherMap API key (free tier available)

### Quick Start
1. **Install dependencies**: `pip install -r requirements.txt`
2. **Run the application**: `python app.py`
3. **Open browser**: Navigate to `http://localhost:5000`

### Environment Variables (Optional)
For weather features, create a `.env` file:
```bash
export OPENWEATHER_API_KEY="your_api_key_here"
export SESSION_SECRET="your_secret_key_here"
