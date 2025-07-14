import os
import requests
import logging
from typing import Dict, Optional

class WeatherAPI:
    """OpenWeatherMap API integration"""
    
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY", "your_api_key_here")
        self.base_url = "http://api.openweathermap.org/data/2.5"
        self.geo_url = "http://api.openweathermap.org/geo/1.0"
        
    def get_weather(self, lat: float, lon: float) -> Dict:
        """Get current weather for coordinates"""
        try:
            url = f"{self.base_url}/weather"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key,
                'units': 'metric'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Format weather data
            weather_info = {
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'].title(),
                'icon': data['weather'][0]['icon'],
                'wind_speed': data['wind']['speed'],
                'wind_direction': data['wind'].get('deg', 0),
                'visibility': data.get('visibility', 0) / 1000,  # Convert to km
                'city': data['name'],
                'country': data['sys']['country']
            }
            
            return weather_info
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Weather API request failed: {str(e)}")
            raise Exception(f"Weather API unavailable: {str(e)}")
        except KeyError as e:
            logging.error(f"Weather API response format error: {str(e)}")
            raise Exception("Invalid weather data format")
    
    def get_city_coordinates(self, city_name: str) -> Dict:
        """Get coordinates for a city name"""
        try:
            url = f"{self.geo_url}/direct"
            params = {
                'q': city_name,
                'limit': 1,
                'appid': self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if not data:
                raise Exception("City not found")
            
            city_info = data[0]
            return {
                'lat': city_info['lat'],
                'lon': city_info['lon'],
                'name': city_info['name'],
                'country': city_info.get('country', ''),
                'state': city_info.get('state', '')
            }
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Geocoding API request failed: {str(e)}")
            raise Exception(f"Geocoding API unavailable: {str(e)}")
        except (KeyError, IndexError) as e:
            logging.error(f"Geocoding API response error: {str(e)}")
            raise Exception("City not found")
    
    def get_weather_forecast(self, lat: float, lon: float, days: int = 5) -> Dict:
        """Get weather forecast for coordinates"""
        try:
            url = f"{self.base_url}/forecast"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key,
                'units': 'metric',
                'cnt': days * 8  # 8 forecasts per day (every 3 hours)
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Process forecast data
            forecasts = []
            for item in data['list']:
                forecast = {
                    'datetime': item['dt_txt'],
                    'temperature': item['main']['temp'],
                    'description': item['weather'][0]['description'].title(),
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed']
                }
                forecasts.append(forecast)
            
            return {
                'city': data['city']['name'],
                'country': data['city']['country'],
                'forecasts': forecasts
            }
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Forecast API request failed: {str(e)}")
            raise Exception(f"Forecast API unavailable: {str(e)}")
        except KeyError as e:
            logging.error(f"Forecast API response format error: {str(e)}")
            raise Exception("Invalid forecast data format")
