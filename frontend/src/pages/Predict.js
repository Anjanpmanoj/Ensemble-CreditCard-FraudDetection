import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function Predict() {
  const [features, setFeatures] = useState(Array(30).fill(""));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const fillZeros = () => setFeatures(Array(30).fill("0"));

  const predict = async () => {
    try {
      setLoading(true);
      setResult(null);

      const nums = features.map((x) => Number(x));
      if (nums.some((x) => Number.isNaN(x))) {
        alert("Please enter only numbers in all 30 fields!");
        return;
      }

      const res = await axios.post(`${API_BASE}/predict`, {
        features: nums,
      });

      setResult(res.data);
    } catch (err) {
      console.log(err);
      alert("Error calling backend. Check backend running + CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={{ marginTop: 0 }}>🧪 Prediction Page</h2>
      <p style={{ color: "#555" }}>
        Enter 30 transaction feature values (same preprocessing as dataset).
      </p>

      <div style={styles.actions}>
        <button onClick={fillZeros} style={styles.secondaryBtn}>Fill 0</button>
        <button onClick={predict} style={styles.primaryBtn} disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      <div style={styles.grid}>
        {features.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={`Feature ${i + 1}`}
            style={styles.input}
          />
        ))}
      </div>

      {result && (
        <div style={styles.resultCard}>
          <h3 style={{ marginTop: 0 }}>✅ Result</h3>

          <p><b>CNN Probability:</b> {result.cnn_prob?.toFixed(4)}</p>
          <p><b>LSTM Probability:</b> {result.lstm_prob?.toFixed(4)}</p>
          <p><b>Transformer Probability:</b> {result.transformer_prob?.toFixed(4)}</p>

          <hr />

          <p style={{ fontSize: 18 }}>
            <b>Final:</b> {result.final_label}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
  actions: { display: "flex", gap: "10px", margin: "10px 0 18px 0" },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "black",
    color: "white",
    border: "none",
    fontWeight: "700",
    cursor: "pointer"
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "white",
    border: "1px solid #ddd",
    fontWeight: "700",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gap: "8px",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"
  },
  input: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd"
  },
  resultCard: {
    marginTop: "20px",
    padding: "16px",
    border: "1px solid #eee",
    borderRadius: "14px",
    background: "#fafafa",
    maxWidth: "520px"
  }
};
