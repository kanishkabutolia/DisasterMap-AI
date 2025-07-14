import os
import logging
from flask import Flask, render_template, request, jsonify, send_file
from weather_api import WeatherAPI
from utils import GeoJSONUtils
import json
from datetime import datetime
import pandas as pd
from io import StringIO, BytesIO

# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Initialize utilities
weather_api = WeatherAPI()
geojson_utils = GeoJSONUtils()

# In-memory storage for bookmarks (in production, use a database)
bookmarks = []

@app.route('/')
def dashboard():
    """Main dashboard route"""
    return render_template('dashboard.html')

@app.route('/api/weather/<lat>/<lon>')
def get_weather(lat, lon):
    """Get weather data for specific coordinates"""
    try:
        weather_data = weather_api.get_weather(float(lat), float(lon))
        return jsonify(weather_data)
    except Exception as e:
        app.logger.error(f"Weather API error: {str(e)}")
        return jsonify({'error': 'Failed to fetch weather data'}), 500

@app.route('/api/disaster-data/<disaster_type>')
def get_disaster_data(disaster_type):
    """Get disaster data for specific type"""
    try:
        valid_types = ['flood', 'wildfire', 'drought', 'earthquake']
        if disaster_type not in valid_types:
            return jsonify({'error': 'Invalid disaster type'}), 400
        
        data = geojson_utils.load_disaster_data(disaster_type)
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"Disaster data error: {str(e)}")
        return jsonify({'error': 'Failed to load disaster data'}), 500

@app.route('/api/search/<city_name>')
def search_city(city_name):
    """Search for city coordinates"""
    try:
        coordinates = weather_api.get_city_coordinates(city_name)
        return jsonify(coordinates)
    except Exception as e:
        app.logger.error(f"City search error: {str(e)}")
        return jsonify({'error': 'City not found'}), 404

@app.route('/api/bookmarks', methods=['GET', 'POST'])
def handle_bookmarks():
    """Handle bookmark operations"""
    if request.method == 'GET':
        return jsonify(bookmarks)
    
    elif request.method == 'POST':
        data = request.get_json()
        bookmark = {
            'id': len(bookmarks) + 1,
            'name': data.get('name'),
            'lat': data.get('lat'),
            'lon': data.get('lon'),
            'timestamp': datetime.now().isoformat()
        }
        bookmarks.append(bookmark)
        return jsonify(bookmark)

@app.route('/api/download-report')
def download_report():
    """Download disaster report for selected region"""
    try:
        # Get parameters from request
        disaster_type = request.args.get('type', 'flood')
        format_type = request.args.get('format', 'csv')
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        radius = float(request.args.get('radius', 10))  # km
        
        # Generate report data
        report_data = geojson_utils.generate_report(disaster_type, lat, lon, radius)
        
        if format_type == 'csv':
            # Convert to CSV
            df = pd.DataFrame(report_data['features'])
            csv_buffer = StringIO()
            df.to_csv(csv_buffer, index=False)
            csv_buffer.seek(0)
            
            # Create downloadable file
            output = BytesIO()
            output.write(csv_buffer.getvalue().encode('utf-8'))
            output.seek(0)
            
            return send_file(
                output,
                mimetype='text/csv',
                as_attachment=True,
                download_name=f'{disaster_type}_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
            )
        
        else:  # geojson
            output = BytesIO()
            output.write(json.dumps(report_data, indent=2).encode('utf-8'))
            output.seek(0)
            
            return send_file(
                output,
                mimetype='application/geo+json',
                as_attachment=True,
                download_name=f'{disaster_type}_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.geojson'
            )
            
    except Exception as e:
        app.logger.error(f"Report generation error: {str(e)}")
        return jsonify({'error': 'Failed to generate report'}), 500

@app.route('/api/ml-predict')
def ml_predict():
    """ML disaster prediction endpoint"""
    try:
        from ml_model.predict_disaster import DisasterPredictor
        
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        
        predictor = DisasterPredictor()
        prediction = predictor.predict_risk(lat, lon)
        
        return jsonify(prediction)
    except Exception as e:
        app.logger.error(f"ML prediction error: {str(e)}")
        return jsonify({'error': 'ML prediction unavailable', 'risk_level': 'unknown'}), 500

@app.route('/api/analytics')
def get_analytics():
    """Get disaster analytics data"""
    try:
        analytics_data = geojson_utils.get_disaster_analytics()
        return jsonify(analytics_data)
    except Exception as e:
        app.logger.error(f"Analytics error: {str(e)}")
        return jsonify({'error': 'Failed to load analytics'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
