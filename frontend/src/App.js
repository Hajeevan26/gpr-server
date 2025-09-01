import React, { useState } from "react";
import axios from "axios";

function App() {
  const [AS, setAS] = useState("");
  const [AC, setAC] = useState("");
  const [CE, setCE] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/predict", {
        AS, AC, CE
      });
      setResult(res.data.prediction);
    } catch (err) {
      console.error(err);
      alert("Error making prediction");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>GPR Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>AS (mm): </label>
          <input value={AS} onChange={(e) => setAS(e.target.value)} />
        </div>
        <div>
          <label>AC: </label>
          <input value={AC} onChange={(e) => setAC(e.target.value)} />
        </div>
        <div>
          <label>CE (J): </label>
          <input value={CE} onChange={(e) => setCE(e.target.value)} />
        </div>
        <button type="submit">Predict</button>
      </form>
      {result !== null && (
        <h3>Predicted Dependent Variable = {result.toFixed(6)}</h3>
      )}
    </div>
  );
}

export default App;
