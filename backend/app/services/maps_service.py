import requests
from typing import List, Dict, Any

REGIONAL_HOTLINES = {
    "South Africa": {
        "National Emergency (Mobile)": "112",
        "Ambulance and Fire": "10177",
        "Police": "10111",
        "SADAG Mental Health Helpline": "0800 567 567",
        "Poison Control": "0861 555 777"
    },
    "Kenya": {
        "National Emergency": "999",
        "Police": "112",
        "Ambulance": "1199",
        "Red Cross": "1199"
    },
    "Uganda": {
        "National Emergency": "999",
        "Police": "112",
        "Ambulance (Red Cross)": "0414 258 564"
    }
}

def get_nearest_clinics(lat: float, lon: float, radius_meters: int = 5000) -> List[Dict[str, Any]]:
    """
    Queries the free OpenStreetMap Overpass API to find hospitals and clinics 
    within a specific radius of the user's GPS coordinates.
    """
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json][timeout:10];
    (
      node["amenity"="clinic"](around:{radius_meters},{lat},{lon});
      node["amenity"="hospital"](around:{radius_meters},{lat},{lon});
    );
    out 5;
    """
    
    try:
        response = requests.post(overpass_url, data=overpass_query)
        response.raise_for_status()
        data = response.json()
        
        clinics = []
        for element in data.get("elements", []):
            tags = element.get("tags", {})
            name = tags.get("name", "Unnamed Medical Facility")
            
            street = tags.get("addr:street", "")
            city = tags.get("addr:city", "")
            address = f"{street}, {city}".strip(", ")

            hours = tags.get("opening_hours", "Hours not listed - Please call ahead")
            
            clinics.append({
                "name": name,
                "address": address if address else "Address not listed",
                "hours": hours,
                "latitude": element.get("lat"),
                "longitude": element.get("lon")
            })
            
        return clinics

    except Exception as e:
        print(f"Overpass API Error: {e}")
        return []

# --- Quick Test Block ---
if __name__ == "__main__":
    # Testing with coordinates roughly in Johannesburg
    test_lat, test_lon = -26.2041, 28.0473 
    print("--- Testing Map Service ---")
    results = get_nearest_clinics(test_lat, test_lon)
    
    for c in results:
        print(f" {c['name']} - {c['address']} - {c['hours']}")