import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

function ProbBar({ label, value, color = "var(--lime)" }) {
  const pct = value ? Math.round(value * 100) : 0;
  return (
    <div style={{
      background: "var(--s2)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "1rem 1.1rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: "var(--font-d)", fontSize: "1rem", color, letterSpacing: "0.04em" }}>
          {value?.toFixed(4) ?? "—"}
        </span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 4 }}>{pct}%</div>
    </div>
  );
}

export default function Predict() {
  const [features, setFeatures] = useState(Array(30).fill(""));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const setVal = (i, v) => {
    const copy = [...features];
    copy[i] = v;
    setFeatures(copy);
  };

  const fillZeros = () => setFeatures(Array(30).fill("0"));

  const predict = async () => {
    try {
      setLoading(true);
      setResult(null);
      const nums = features.map((x) => Number(x));
      if (nums.some((x) => Number.isNaN(x))) {
        alert("Enter only numbers in all 30 fields.");
        return;
      }
      const res = await axios.post(`${API_BASE}/predict`, { features: nums });
      setResult(res.data);
    } catch (e) {
      console.log(e);
      alert("Backend error. Check API URL and CORS.");
    } finally {
      setLoading(false);
    }
  };

  const isFraud = result?.final_label?.toLowerCase().includes("fraud");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: "2rem",
        animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div>
          <div className="badge" style={{ marginBottom: 10 }}>Ensemble Inference</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1 }}>PREDICTION</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 6 }}>
            Enter 30 feature values and get a final fraud decision + model probabilities.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={fillZeros} className="btn-ghost" style={{ fontSize: "0.82rem" }}>
            Fill Zeros
          </button>
          <button
            onClick={predict}
            disabled={loading}
            className="btn-primary"
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "⟳ Running..." : "▸ Predict"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0,340px)", gap: "1.5rem" }}>

        {/* Feature grid */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.2rem",
          }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em" }}>
              TRANSACTION FEATURES
            </div>
            <div className="badge">30 inputs</div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 10,
          }}>
            {features.map((v, i) => (
              <div key={i}>
                <div style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}>F{i + 1}</div>
                <input
                  value={v}
                  onChange={(e) => setVal(i, e.target.value)}
                  placeholder="0.0"
                  className="inp"
                  style={{ fontSize: "0.8rem" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Result panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Decision box */}
          <div className="card" style={{
            padding: "1.5rem",
            borderColor: result
              ? isFraud ? "rgba(255,59,59,0.4)" : "rgba(185,249,78,0.4)"
              : "var(--border)",
            transition: "border-color 0.4s",
          }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1rem", letterSpacing: "0.06em", marginBottom: "1rem" }}>
              DECISION
            </div>

            {!result ? (
              <div style={{
                textAlign: "center",
                padding: "2.5rem 1rem",
                color: "var(--muted)",
                fontSize: "0.82rem",
              }}>
                <div style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "2.5rem",
                  color: "rgba(185,249,78,0.15)",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}>—</div>
                Run prediction to see result
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "2.8rem",
                  letterSpacing: "0.06em",
                  color: isFraud ? "var(--red)" : "var(--lime)",
                  lineHeight: 1,
                  marginBottom: 8,
                  animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
                }}>
                  {result.final_label}
                </div>
                <div style={{
                  display: "inline-block",
                  background: isFraud ? "rgba(255,59,59,0.1)" : "rgba(185,249,78,0.08)",
                  border: `1px solid ${isFraud ? "rgba(255,59,59,0.3)" : "rgba(185,249,78,0.2)"}`,
                  borderRadius: 99,
                  padding: "4px 14px",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: isFraud ? "var(--red)" : "var(--lime)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  {isFraud ? "⚠ Alert" : "✓ Clear"}
                </div>
              </div>
            )}
          </div>

          {/* Probability bars */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1rem", letterSpacing: "0.06em", marginBottom: "1rem" }}>
              MODEL PROBABILITIES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ProbBar label="CNN" value={result?.cnn_prob} color="#b9f94e" />
              <ProbBar label="LSTM" value={result?.lstm_prob} color="#06b6d4" />
              <ProbBar label="Transformer" value={result?.transformer_prob} color="#f97316" />
            </div>
            {!result && (
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center", marginTop: 8 }}>
                Awaiting inference...
              </div>
            )}
          </div>

          {/* XGBoost note */}
          <div style={{
            background: "rgba(185,249,78,0.04)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "0.9rem 1rem",
            fontSize: "0.75rem",
            color: "var(--muted)",
            lineHeight: 1.7,
          }}>
            <span style={{ color: "var(--lime)", fontWeight: 700, fontFamily: "var(--font-d)", letterSpacing: "0.06em" }}>XGBOOST</span>
            {" "}combines the three model outputs above to generate the final fraud decision shown in the Decision panel.
          </div>
        </div>
      </div>
    </div>
  );
}

