#!/usr/bin/env python3
"""
DisasterMap AI - Local Development Server
Simple script to run the application locally with proper error handling
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['flask', 'requests', 'pandas', 'numpy']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} is missing")
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True

def run_app():
    """Run the Flask application"""
    try:
        print("\n🚀 Starting DisasterMap AI...")
        print("📍 Server will be available at: http://localhost:5000")
        print("📍 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Import and run the app
        from app import app
        app.run(host='localhost', port=5000, debug=True)
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure all dependencies are installed: pip install -r requirements.txt")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main function to start the application"""
    print("DisasterMap AI - Local Setup Check")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        return
    
    # Check if we're in the right directory
    if not os.path.exists('app.py'):
        print("❌ Error: app.py not found")
        print("Make sure you're in the DisasterMap_AI directory")
        return
    
    print("✅ Found app.py")
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Run the application
    run_app()

if __name__ == "__main__":
    main()