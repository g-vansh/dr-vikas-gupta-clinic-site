#!/usr/bin/env python3
"""
OSRM Route Data Download Script
==============================

This script downloads real road route data from the OSRM API for all patient cities
and generates hardcoded coordinate arrays that can be used in the JavaScript map.

Usage: python3 download_routes.py
"""

import requests
import json
import time
from typing import List, Tuple, Dict, Optional

# Clinic coordinates (Dr. Gupta's location)
CLINIC_COORDS = [28.8285263, 78.7752077]

# Patient cities with their coordinates
PATIENT_CITIES = [
    {"name": "Sambhal", "coords": [28.58, 78.55]},
    {"name": "Rampur", "coords": [28.80, 79.02]},
    {"name": "Badaun", "coords": [28.03, 79.13]},
    {"name": "Bareilly", "coords": [28.37, 79.43]},
    {"name": "Meerut", "coords": [28.98, 77.70]},
    {"name": "Delhi NCR", "coords": [28.68, 77.10]},
    {"name": "Haldwani", "coords": [29.22, 79.52]},
    {"name": "Rudrapur", "coords": [28.98, 79.40]},
    {"name": "Bijnor", "coords": [29.37, 78.13]},
    {"name": "Gurugram", "coords": [28.46, 77.03]},
    {"name": "Kashipur", "coords": [29.21, 78.96]},
    {"name": "Noida", "coords": [28.58, 77.33]},
    {"name": "Ghaziabad", "coords": [28.67, 77.43]},
    {"name": "Faridabad", "coords": [28.41, 77.31]},
    {"name": "Aligarh", "coords": [27.88, 78.08]},
    {"name": "Muzaffarnagar", "coords": [29.47, 77.70]},
    {"name": "Saharanpur", "coords": [29.97, 77.55]},
    {"name": "Haridwar", "coords": [29.95, 78.16]}
]

# OSRM server URL (using public server for download)
OSRM_SERVER = "https://router.project-osrm.org"

def fetch_route(start_coords: List[float], end_coords: List[float], 
                max_retries: int = 3) -> Optional[List[List[float]]]:
    """
    Fetch route coordinates from OSRM API
    
    Args:
        start_coords: [lat, lon] of start point
        end_coords: [lat, lon] of end point
        max_retries: Maximum number of retry attempts
        
    Returns:
        List of [lat, lon] coordinates or None if failed
    """
    # Convert to lon,lat format for OSRM (OSRM expects lon,lat)
    start_str = f"{start_coords[1]},{start_coords[0]}"
    end_str = f"{end_coords[1]},{end_coords[0]}"
    
    url = f"{OSRM_SERVER}/route/v1/driving/{start_str};{end_str}"
    params = {
        'overview': 'full',
        'geometries': 'geojson'
    }
    
    for attempt in range(max_retries):
        try:
            print(f"  Fetching route (attempt {attempt + 1})...")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data['code'] == 'Ok' and data['routes']:
                # Get coordinates from the route geometry
                coordinates = data['routes'][0]['geometry']['coordinates']
                # Convert from [lon, lat] to [lat, lon] for Leaflet
                return [[coord[1], coord[0]] for coord in coordinates]
            else:
                print(f"    OSRM returned no route: {data.get('code', 'Unknown error')}")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"    Request failed: {e}")
            if attempt < max_retries - 1:
                print(f"    Retrying in 2 seconds...")
                time.sleep(2)
            else:
                print(f"    Max retries reached, giving up")
                return None
        except Exception as e:
            print(f"    Unexpected error: {e}")
            return None
    
    return None

def generate_javascript_routes() -> str:
    """
    Generate JavaScript code with hardcoded route data
    
    Returns:
        JavaScript code string with route data
    """
    routes_data = {}
    successful_routes = 0
    failed_routes = 0
    
    print("🚗 Downloading routes from OSRM...")
    print(f"Clinic location: {CLINIC_COORDS}")
    print(f"Number of patient cities: {len(PATIENT_CITIES)}")
    print("-" * 50)
    
    for i, city in enumerate(PATIENT_CITIES, 1):
        city_name = city['name']
        city_coords = city['coords']
        
        print(f"{i:2d}. {city_name:<15} ({city_coords[0]:.3f}, {city_coords[1]:.3f})")
        
        # Fetch route from clinic to city
        route_coords = fetch_route(CLINIC_COORDS, city_coords)
        
        if route_coords:
            routes_data[city_name] = route_coords
            successful_routes += 1
            print(f"    ✅ Success - {len(route_coords)} coordinates")
        else:
            # Fallback to straight line
            routes_data[city_name] = [CLINIC_COORDS, city_coords]
            failed_routes += 1
            print(f"    ❌ Failed - using direct line")
        
        # Rate limiting - be nice to public server
        time.sleep(0.2)
    
    print("-" * 50)
    print(f"📊 Summary:")
    print(f"   ✅ Successful routes: {successful_routes}")
    print(f"   ❌ Failed routes (direct): {failed_routes}")
    print(f"   📍 Total routes: {len(PATIENT_CITIES)}")
    
    # Generate JavaScript code
    js_code = """// Hardcoded route data downloaded from OSRM
// Generated by download_routes.py
const HARDCODED_ROUTES = {
"""
    
    for city_name, coords in routes_data.items():
        js_code += f'  "{city_name}": [\n'
        for coord in coords:
            js_code += f'    [{coord[0]:.6f}, {coord[1]:.6f}],\n'
        js_code += '  ],\n'
    
    js_code += """};

// Helper function to get route for a city
function getHardcodedRoute(cityName) {
  return HARDCODED_ROUTES[cityName] || null;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HARDCODED_ROUTES, getHardcodedRoute };
}
"""
    
    return js_code

def main():
    """Main function to download routes and generate JavaScript file"""
    print("🗺️  OSRM Route Data Downloader")
    print("=" * 50)
    
    try:
        # Generate JavaScript with route data
        js_code = generate_javascript_routes()
        
        # Write to file
        output_file = 'hardcoded_routes.js'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_code)
        
        print(f"\n💾 Route data saved to: {output_file}")
        print(f"📏 File size: {len(js_code)} characters")
        print("\n✨ Done! You can now use this file in your map implementation.")
        print("\nNext steps:")
        print("1. Include hardcoded_routes.js in your HTML")
        print("2. Replace OSRM API calls with getHardcodedRoute() function")
        print("3. Remove 'Real Road Routes' and 'Direct Routes' from legend")
        print("4. Update clinic icon to use fa-user-doctor")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())