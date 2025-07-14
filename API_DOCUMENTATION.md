# DisasterMap AI - API Documentation

This document provides comprehensive documentation for the DisasterMap AI REST API.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. Future versions may implement API key-based authentication.

## Rate Limiting

No rate limiting is currently implemented. Future versions will include rate limiting for production use.

## Response Format

All API responses are in JSON format with the following structure:

### Success Response
```json
{
  "data": { ... },
  "status": "success",
  "message": "Request completed successfully"
}
```

### Error Response
```json
{
  "error": "Error description",
  "status": "error",
  "code": 400
}
```

## Endpoints

### Weather API

#### Get Weather Data
Get current weather information for specific coordinates.

**Endpoint:** `GET /api/weather/{lat}/{lon}`

**Parameters:**
- `lat` (path, required): Latitude coordinate (-90 to 90)
- `lon` (path, required): Longitude coordinate (-180 to 180)

**Example Request:**
```bash
curl http://localhost:5000/api/weather/40.7128/-74.0060
```

**Example Response:**
```json
{
  "temperature": 22.5,
  "feels_like": 24.1,
  "humidity": 65,
  "pressure": 1013,
  "description": "Partly Cloudy",
  "icon": "02d",
  "wind_speed": 3.5,
  "wind_direction": 180,
  "visibility": 10,
  "city": "New York",
  "country": "US"
}
```

**Error Responses:**
- `500`: Weather API unavailable
- `400`: Invalid coordinates

---

### Disaster Data API

#### Get Disaster Data by Type
Retrieve disaster data for a specific disaster type.

**Endpoint:** `GET /api/disaster-data/{disaster_type}`

**Parameters:**
- `disaster_type` (path, required): Type of disaster
  - Valid values: `flood`, `wildfire`, `drought`, `earthquake`

**Example Request:**
```bash
curl http://localhost:5000/api/disaster-data/flood
```

**Example Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.0060, 40.7128]
      },
      "properties": {
        "city": "New York",
        "country": "United States",
        "severity": "High",
        "risk_level": "high",
        "population_affected": 500000,
        "area_km2": 150.5,
        "last_updated": "2025-07-07T12:00:00Z"
      }
    }
  ]
}
```

**Error Responses:**
- `400`: Invalid disaster type
- `500`: Failed to load disaster data

---

### Search API

#### Search City Coordinates
Search for city coordinates by name.

**Endpoint:** `GET /api/search/{city_name}`

**Parameters:**
- `city_name` (path, required): Name of the city to search

**Example Request:**
```bash
curl http://localhost:5000/api/search/New%20York
```

**Example Response:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "name": "New York",
  "country": "US",
  "state": "New York"
}
```

**Error Responses:**
- `404`: City not found
- `500`: Search API unavailable

---

### Bookmarks API

#### Get All Bookmarks
Retrieve all user bookmarks.

**Endpoint:** `GET /api/bookmarks`

**Example Request:**
```bash
curl http://localhost:5000/api/bookmarks
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "New York Office",
    "lat": 40.7128,
    "lon": -74.0060,
    "timestamp": "2025-07-07T12:00:00Z"
  },
  {
    "id": 2,
    "name": "Tokyo Branch",
    "lat": 35.6762,
    "lon": 139.6503,
    "timestamp": "2025-07-07T13:00:00Z"
  }
]
```

#### Add New Bookmark
Add a new location bookmark.

**Endpoint:** `POST /api/bookmarks`

**Request Body:**
```json
{
  "name": "Location Name",
  "lat": 40.7128,
  "lon": -74.0060
}
```

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"name": "Emergency Center", "lat": 40.7128, "lon": -74.0060}'
```

**Example Response:**
```json
{
  "id": 3,
  "name": "Emergency Center",
  "lat": 40.7128,
  "lon": -74.0060,
  "timestamp": "2025-07-07T14:00:00Z"
}
```

**Error Responses:**
- `400`: Invalid request data
- `500`: Failed to save bookmark

---

### Machine Learning API

#### Get AI Risk Prediction
Get AI-powered disaster risk prediction for specific coordinates.

**Endpoint:** `GET /api/ml-predict`

**Query Parameters:**
- `lat` (query, required): Latitude coordinate
- `lon` (query, required): Longitude coordinate

**Example Request:**
```bash
curl "http://localhost:5000/api/ml-predict?lat=40.7128&lon=-74.0060"
```

**Example Response:**
```json
{
  "risk_level": "medium",
  "confidence": 0.85,
  "predictions": {
    "flood": {
      "risk_score": 0.45,
      "risk_level": "medium",
      "factors": {
        "elevation": 0.3,
        "water_proximity": 0.7,
        "precipitation": 0.6
      }
    },
    "wildfire": {
      "risk_score": 0.2,
      "risk_level": "low",
      "factors": {
        "vegetation": 0.3,
        "temperature": 0.4,
        "dryness": 0.2
      }
    },
    "drought": {
      "risk_score": 0.3,
      "risk_level": "low",
      "factors": {
        "precipitation_deficit": 0.2,
        "temperature": 0.4,
        "vegetation_stress": 0.3
      }
    },
    "earthquake": {
      "risk_score": 0.6,
      "risk_level": "medium",
      "factors": {
        "seismic_zone": 1.0,
        "fault_proximity": 0.8,
        "historical_activity": 0.6
      }
    }
  },
  "features_extracted": 10,
  "timestamp": "2025-07-07T14:30:00Z"
}
```

**Error Responses:**
- `500`: ML prediction unavailable
- `400`: Invalid coordinates

---

### Analytics API

#### Get Disaster Analytics
Retrieve comprehensive disaster analytics data.

**Endpoint:** `GET /api/analytics`

**Example Request:**
```bash
curl http://localhost:5000/api/analytics
```

**Example Response:**
```json
{
  "total_incidents": 1250,
  "by_type": {
    "flood": 450,
    "wildfire": 320,
    "drought": 280,
    "earthquake": 200
  },
  "trend_data": [
    {
      "month": "2024-08",
      "incidents": 95
    },
    {
      "month": "2024-09",
      "incidents": 120
    }
  ],
  "risk_distribution": {
    "high": 125,
    "medium": 580,
    "low": 545
  }
}
```

**Error Responses:**
- `500`: Failed to load analytics

---

### Export API

#### Download Disaster Report
Download disaster report in specified format.

**Endpoint:** `GET /api/download-report`

**Query Parameters:**
- `type` (query, optional): Disaster type (default: "flood")
- `format` (query, optional): Export format - "csv" or "geojson" (default: "csv")
- `lat` (query, optional): Center latitude (default: 0)
- `lon` (query, optional): Center longitude (default: 0)
- `radius` (query, optional): Search radius in km (default: 10)

**Example Request:**
```bash
curl "http://localhost:5000/api/download-report?type=flood&format=csv&lat=40.7128&lon=-74.0060&radius=50"
```

**Response:**
- Content-Type: `text/csv` or `application/geo+json`
- File download with appropriate filename

**Error Responses:**
- `500`: Failed to generate report
- `400`: Invalid parameters

---

## Error Handling

### Common Error Codes

- **400 Bad Request**: Invalid request parameters
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error or external API failure

### Error Response Format

```json
{
  "error": "Detailed error message",
  "status": "error",
  "code": 400,
  "timestamp": "2025-07-07T14:30:00Z"
}
```

## Rate Limiting (Future)

Future versions will implement rate limiting:
- **Free tier**: 100 requests per minute
- **Premium tier**: 1000 requests per minute

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) for web applications.

## SDK and Libraries

### JavaScript SDK Example

```javascript
class DisasterMapAPI {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  async getWeather(lat, lon) {
    const response = await fetch(`${this.baseURL}/weather/${lat}/${lon}`);
    return response.json();
  }

  async getDisasterData(type) {
    const response = await fetch(`${this.baseURL}/disaster-data/${type}`);
    return response.json();
  }

  async searchCity(cityName) {
    const response = await fetch(`${this.baseURL}/search/${encodeURIComponent(cityName)}`);
    return response.json();
  }
}
```

### Python SDK Example

```python
import requests

class DisasterMapAPI:
    def __init__(self, base_url='http://localhost:5000/api'):
        self.base_url = base_url

    def get_weather(self, lat, lon):
        response = requests.get(f'{self.base_url}/weather/{lat}/{lon}')
        return response.json()

    def get_disaster_data(self, disaster_type):
        response = requests.get(f'{self.base_url}/disaster-data/{disaster_type}')
        return response.json()

    def search_city(self, city_name):
        response = requests.get(f'{self.base_url}/search/{city_name}')
        return response.json()
```

## Testing

### Unit Tests

```bash
# Test weather API
curl http://localhost:5000/api/weather/40.7128/-74.0060

# Test disaster data API
curl http://localhost:5000/api/disaster-data/flood

# Test search API
curl http://localhost:5000/api/search/London
```

### Integration Tests

Use the provided SDK examples to test API integration in your applications.

## Support

For API support, please:
1. Check this documentation
2. Review the troubleshooting section in README.md
3. Create an issue in the GitHub repository
4. Contact the development team

---

**Last Updated:** July 7, 2025
**API Version:** 1.0.0