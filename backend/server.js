const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === Model hyperparameters ===
const L = 3.1933;
const sF = 0.0496;
const beta = [0.2752, 0.0089, 0.0207, -0.0752];
const mu = [15.0, 4.0, 224.4];
const sg = [5.3191, 0.7087, 159.0286];

// === Compressed model arrays ===
const A = [83.2444, -16.8600, 23.5862, -38.6274, /* ... rest of values ... */];
const Z = [
  [-1.2220, -1.4111, -1.4111],
  [-1.2220, -1.4111, -1.4111],
  // ... rest of rows ...
];

// Prediction function
function predict(AS, AC, CE) {
  // Standardize
  const x = [(AS - mu[0]) / sg[0], (AC - mu[1]) / sg[1], (CE - mu[2]) / sg[2]];

  // Linear basis term
  const f0 = beta[0] + beta[1] * x[0] + beta[2] * x[1] + beta[3] * x[2];

  // Distances to active set
  const r = Z.map(z => Math.sqrt((z[0] - x[0]) ** 2 + (z[1] - x[1]) ** 2 + (z[2] - x[2]) ** 2));

  // Exponential kernel
  const k = r.map(val => sF ** 2 * Math.exp(-val / L));

  // Prediction
  const y = f0 + k.reduce((sum, ki, idx) => sum + ki * A[idx], 0);

  return y;
}

// API endpoint
app.post("/predict", (req, res) => {
  const { AS, AC, CE } = req.body;
  if ([AS, AC, CE].some(v => v === undefined)) {
    return res.status(400).json({ error: "Missing inputs" });
  }
  const result = predict(parseFloat(AS), parseFloat(AC), parseFloat(CE));
  res.json({ prediction: result });
});

app.listen(5000, () => console.log("Server running on port 5000"));
