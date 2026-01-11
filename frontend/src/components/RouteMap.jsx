import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Default marker
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Fuel marker (simple circle emoji style)
const fuelIcon = new L.DivIcon({
  html: "⛽",
  className: "",
  iconSize: [20, 20]
});

export default function RouteMap({ geometry }) {
  if (!Array.isArray(geometry) || geometry.length === 0) {
    return <p>Map data unavailable</p>;
  }

  // Convert [lng, lat] → [lat, lng]
  const positions = geometry.map(([lng, lat]) => [lat, lng]);

  const start = positions[0];
  const pickup = positions[Math.floor(positions.length * 0.3)];
  const dropoff = positions[positions.length - 1];

  // Simulated fuel stop (around middle if trip is long)
  const fuelStop =
    positions.length > 20
      ? positions[Math.floor(positions.length / 2)]
      : null;

  return (
    <MapContainer
      center={start}
      zoom={6}
      style={{ height: "400px", width: "100%", marginBottom: "20px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route line */}
      <Polyline positions={positions} />

      {/* Start */}
      <Marker position={start} icon={defaultIcon}>
        <Popup>Current Location (Start)</Popup>
      </Marker>

      {/* Pickup */}
      <Marker position={pickup} icon={defaultIcon}>
        <Popup>Pickup Location (1 hr On Duty)</Popup>
      </Marker>

      {/* Fuel stop */}
      {fuelStop && (
        <Marker position={fuelStop} icon={fuelIcon}>
          <Popup>Fuel Stop</Popup>
        </Marker>
      )}

      {/* Dropoff */}
      <Marker position={dropoff} icon={defaultIcon}>
        <Popup>Dropoff Location (1 hr On Duty)</Popup>
      </Marker>
    </MapContainer>
  );
}
