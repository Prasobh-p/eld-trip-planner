import { useState } from "react";
import axios from "axios";

export default function TripForm() {
  const [form, setForm] = useState({
    current: "",
    pickup: "",
    dropoff: "",
    cycle_used: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/trip/",
      form
    );
    setResult(res.data);
  };

  return (
    <>
      <input name="current" placeholder="Current location" onChange={handleChange} />
      <br />
      <input name="pickup" placeholder="Pickup location" onChange={handleChange} />
      <br />
      <input name="dropoff" placeholder="Dropoff location" onChange={handleChange} />
      <br />
      <input name="cycle_used" type="number" placeholder="Cycle used (hrs)" onChange={handleChange} />
      <br />
      <button onClick={submit}>Submit</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </>
  );
}
