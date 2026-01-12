import { useState } from "react";
import axios from "axios";
import ELDLog from "./components/ELDLog";
import RouteMap from "./components/RouteMap";

export default function App() {
  const [form, setForm] = useState({
    current_lng: "",
    current_lat: "",
    pickup_lng: "",
    pickup_lat: "",
    dropoff_lng: "",
    dropoff_lat: "",
    cycle_used: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = [
      form.current_lng,
      form.current_lat,
      form.pickup_lng,
      form.pickup_lat,
      form.dropoff_lng,
      form.dropoff_lat,
      form.cycle_used
    ].map(Number);

    if (values.some(Number.isNaN)) {
      alert("Fill all fields with valid numbers");
      return;
    }

    try {
      const res = await axios.post("https://sublinear-genie-ingrately.ngrok-free.app/api/trip/", {
        current: [values[0], values[1]],
        pickup: [values[2], values[3]],
        dropoff: [values[4], values[5]],
        cycle_used: values[6]
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend error. Check Django terminal.");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Trip Planner</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h4>Current Location</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="number" step="any" name="current_lng" placeholder="Longitude" onChange={handleChange} />
              <input type="number" step="any" name="current_lat" placeholder="Latitude" onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Pickup Location</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="number" step="any" name="pickup_lng" placeholder="Longitude" onChange={handleChange} />
              <input type="number" step="any" name="pickup_lat" placeholder="Latitude" onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Dropoff Location</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="number" step="any" name="dropoff_lng" placeholder="Longitude" onChange={handleChange} />
              <input type="number" step="any" name="dropoff_lat" placeholder="Latitude" onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Current Cycle Used (hrs)</h4>
            <input type="number" name="cycle_used" onChange={handleChange} />
          </div>

          <button type="submit">Submit</button>
        </form>

        {result && (
          <div>
            <h3>Trip Summary</h3>
            <p><strong>Distance:</strong> {result.distance_km} km</p>
            <p><strong>Duration:</strong> {result.duration_hours} hrs</p>

            <h3 style={{ marginTop: "20px" }}>Route Map</h3>
            <RouteMap geometry={result.route_geometry} />

            <h3 style={{ marginTop: "20px" }}>ELD Logs</h3>
            {result.daily_logs.map((log) => (
              <ELDLog key={log.day} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
