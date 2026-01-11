import requests
import os

ORS_API_KEY = os.getenv("ORS_API_KEY")


def get_route(current, pickup, dropoff):
    if not ORS_API_KEY:
        raise Exception("ORS API key not found")

    url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"

    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "coordinates": [
            current,
            pickup,
            dropoff
        ]
    }

    res = requests.post(url, json=body, headers=headers)
    data = res.json()

    if "features" not in data:
        raise Exception(f"ORS error response: {data}")

    feature = data["features"][0]
    summary = feature["properties"]["summary"]
    geometry = feature["geometry"]["coordinates"]

    distance_km = summary["distance"] / 1000
    duration_hr = summary["duration"] / 3600

    return distance_km, duration_hr, geometry


def generate_logs(total_hours, cycle_used):
    remaining_cycle = 70 - cycle_used
    logs = []
    day = 1

    while total_hours > 0 and remaining_cycle > 0:
        driving = min(11, total_hours, remaining_cycle)
        on_duty = 2 if day == 1 else 0
        off_duty = 24 - driving - on_duty

        logs.append({
            "day": day,
            "driving_hours": round(driving, 2),
            "on_duty_hours": on_duty,
            "off_duty_hours": round(off_duty, 2)
        })

        total_hours -= driving
        remaining_cycle -= driving
        day += 1

    return logs
