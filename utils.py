import json
import os
import math
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import random

class GeoJSONUtils:
    """Utility class for handling GeoJSON data and operations"""
    
    def __init__(self):
        self.data_dir = "data"
        
    def load_disaster_data(self, disaster_type: str) -> Dict:
        """Load disaster GeoJSON data"""
        filename = f"{disaster_type}_zones.geojson"
        filepath = os.path.join(self.data_dir, filename)
        
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Return empty GeoJSON if file doesn't exist
            return {
                "type": "FeatureCollection",
                "features": []
            }
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points in kilometers using Haversine formula"""
        R = 6371  # Earth's radius in kilometers
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat/2) * math.sin(delta_lat/2) + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * 
             math.sin(delta_lon/2) * math.sin(delta_lon/2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    def generate_report(self, disaster_type: str, lat: float, lon: float, radius: float) -> Dict:
        """Generate disaster report for a specific region"""
        disaster_data = self.load_disaster_data(disaster_type)
        
        # Filter features within the specified radius
        filtered_features = []
        for feature in disaster_data.get('features', []):
            if feature['geometry']['type'] == 'Point':
                feature_coords = feature['geometry']['coordinates']
                feature_lon, feature_lat = feature_coords[0], feature_coords[1]
                
                distance = self.calculate_distance(lat, lon, feature_lat, feature_lon)
                if distance <= radius:
                    # Add distance to properties
                    feature['properties']['distance_km'] = round(distance, 2)
                    filtered_features.append(feature)
        
        return {
            "type": "FeatureCollection",
            "metadata": {
                "report_type": disaster_type,
                "center_lat": lat,
                "center_lon": lon,
                "radius_km": radius,
                "generated_at": datetime.now().isoformat(),
                "total_features": len(filtered_features)
            },
            "features": filtered_features
        }
    
    def get_disaster_analytics(self) -> Dict:
        """Get analytics data for all disaster types"""
        disaster_types = ['flood', 'wildfire', 'drought', 'earthquake']
        analytics = {
            'total_incidents': 0,
            'by_type': {},
            'trend_data': [],
            'risk_distribution': {
                'high': 0,
                'medium': 0,
                'low': 0
            }
        }
        
        # Generate trend data for the last 12 months
        for i in range(12):
            month_date = datetime.now() - timedelta(days=30 * i)
            month_data = {
                'month': month_date.strftime('%Y-%m'),
                'incidents': random.randint(50, 200)  # Simulated data
            }
            analytics['trend_data'].insert(0, month_data)
        
        # Analyze each disaster type
        for disaster_type in disaster_types:
            data = self.load_disaster_data(disaster_type)
            feature_count = len(data.get('features', []))
            analytics['by_type'][disaster_type] = feature_count
            analytics['total_incidents'] += feature_count
            
            # Simulate risk distribution
            high_risk = random.randint(10, 30)
            medium_risk = random.randint(20, 50)
            low_risk = feature_count - high_risk - medium_risk
            
            analytics['risk_distribution']['high'] += max(0, high_risk)
            analytics['risk_distribution']['medium'] += max(0, medium_risk)
            analytics['risk_distribution']['low'] += max(0, low_risk)
        
        return analytics
    
    def create_geojson_feature(self, lat: float, lon: float, properties: Dict) -> Dict:
        """Create a GeoJSON feature"""
        return {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": properties
        }
    
    def validate_geojson(self, geojson_data: Dict) -> bool:
        """Validate GeoJSON structure"""
        try:
            required_fields = ['type', 'features']
            for field in required_fields:
                if field not in geojson_data:
                    return False
            
            if geojson_data['type'] != 'FeatureCollection':
                return False
            
            if not isinstance(geojson_data['features'], list):
                return False
            
            return True
        except (KeyError, TypeError):
            return False
