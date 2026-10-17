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
  const [mode, setMode] = useState("manual");
  const [features, setFeatures] = useState(Array(30).fill(""));
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  

  const setVal = (i, v) => {
    const copy = [...features];
    copy[i] = v;
    setFeatures(copy);
  };

  const fillZeros = () => setFeatures(Array(30).fill("0"));

  const parseJson = (raw) => {
    setJsonInput(raw);
    setJsonError("");
    if (!raw.trim()) { setFeatures(Array(30).fill("")); return; }
    try {
      const parsed = JSON.parse(raw);
      const arr = parsed?.features;
      if (!Array.isArray(arr))       { setJsonError("JSON must have a 'features' array."); return; }
      if (arr.length !== 30)         { setJsonError(`Expected 30 values, got ${arr.length}.`); return; }
      if (arr.some((x) => isNaN(x))) { setJsonError("All values must be numbers."); return; }
      setFeatures(arr.map(String));
    } catch {
      setJsonError("Invalid JSON — check your format.");
    }
  };

  const predict = async () => {
    try {
      setLoading(true);
      setResult(null);
      const nums = features.map((x) => Number(x));
      if (nums.some((x) => Number.isNaN(x))) {
        alert("Enter only numbers in all 30 fields.");
        return;
      }
      const user_id = localStorage.getItem("user_id");

      const res = await axios.post(`${API_BASE}/predict`, {
      features: nums,
      user_id: user_id
      });
      setResult(res.data);
    } catch (e) {
      console.log(e);
      alert("Backend error. Check API URL and CORS.");
    } finally {
      setLoading(false);
    }
  };

  const isFraud = result?.final_label?.toLowerCase().includes("fraud");
  const isReady = features.every((v) => v !== "") && !jsonError;

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
            Enter 30 feature values manually or paste a JSON payload — the model decides.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          {mode === "manual" && (
            <button onClick={fillZeros} className="btn-ghost" style={{ fontSize: "0.82rem" }}>
              Fill Zeros
            </button>
          )}
          <button
            onClick={predict}
            disabled={loading || !isReady}
            className="btn-primary"
            style={{ opacity: (loading || !isReady) ? 0.6 : 1, cursor: (loading || !isReady) ? "not-allowed" : "pointer" }}
          >
            {loading ? "⟳ Running..." : "▸ Predict"}
          </button>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{
        display: "flex",
        gap: 4,
        marginBottom: "1.25rem",
        background: "var(--s2)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 4,
        width: "fit-content",
      }}>
        {[
          { key: "manual", label: "⌨ Manual Input" },
          { key: "paste",  label: "{ } Paste JSON"  },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setMode(key); setResult(null); setJsonError(""); }}
            style={{
              fontFamily: "var(--font-b)",
              fontWeight: 600,
              fontSize: "0.8rem",
              padding: "0.45rem 1rem",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s",
              background: mode === key ? "var(--lime)" : "transparent",
              color: mode === key ? "#0a0c05" : "var(--muted)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0,340px)", gap: "1.5rem" }}>

        {/* Left panel */}
        {mode === "manual" ? (
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: "1.2rem",
            }}>
              <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em" }}>
                TRANSACTION FEATURES
              </div>
              <div className="badge">30 inputs</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {features.map((v, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em",
                    color: "var(--muted)", marginBottom: 4, textTransform: "uppercase",
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
        ) : (
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: "1.2rem",
            }}>
              <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em" }}>
                PASTE JSON PAYLOAD
              </div>
              <div className="badge">{ } format</div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => parseJson(e.target.value)}
              placeholder={`{\n  "features": [-3.04, 1.08, 2.28, 0.32, ...30 values]\n}`}
              rows={16}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${jsonError ? "rgba(255,59,59,0.5)" : "rgba(185,249,78,0.15)"}`,
                borderRadius: 10,
                color: "var(--text)",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                padding: "0.9rem 1rem",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.75,
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = jsonError ? "rgba(255,59,59,0.6)" : "var(--lime)"}
              onBlur={e => e.target.style.borderColor = jsonError ? "rgba(255,59,59,0.5)" : "rgba(185,249,78,0.15)"}
            />

            {/* Validation feedback */}
            {jsonError ? (
              <div style={{ marginTop: 8, fontSize: "0.75rem", color: "#ff6b6b", display: "flex", gap: 6 }}>
                <span>✗</span>{jsonError}
              </div>
            ) : jsonInput && isReady ? (
              <div style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--lime)", display: "flex", gap: 6 }}>
                <span>✓</span>30 features parsed — ready to predict
              </div>
            ) : null}

            {/* Format hint */}
            <div style={{
              marginTop: "1rem",
              background: "rgba(185,249,78,0.03)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              fontSize: "0.72rem",
              color: "var(--muted)",
              lineHeight: 1.7,
            }}>
              <span style={{ color: "var(--lime)", fontWeight: 700 }}>Expected format:</span>
              {" "}a JSON object with a{" "}
              <code style={{ color: "var(--lime)", background: "rgba(185,249,78,0.08)", padding: "1px 5px", borderRadius: 4 }}>
                "features"
              </code>
              {" "}key containing exactly <strong style={{ color: "var(--text)" }}>30 numeric values</strong>.
            </div>
          </div>
        )}

        {/* Right panel — result */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Decision */}
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
              <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--muted)", fontSize: "0.82rem" }}>
                <div style={{
                  fontFamily: "var(--font-d)", fontSize: "2.5rem",
                  color: "rgba(185,249,78,0.15)", letterSpacing: "0.08em", marginBottom: 8,
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
              <ProbBar label="CNN"         value={result?.cnn_prob}         color="#b9f94e" />
              <ProbBar label="LSTM"        value={result?.lstm_prob}        color="#06b6d4" />
              <ProbBar label="Transformer" value={result?.transformer_prob} color="#f97316" />
            </div>
            {!result && (
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center", marginTop: 8 }}>
                Awaiting inference...
              </div>
            )}
          </div>
            {/* 🔥 SHAP EXPLANATION */}
{result?.shap_values && (
  <div className="card" style={{ padding: "1.25rem" }}>
    <div style={{
      fontFamily: "var(--font-d)",
      fontSize: "1rem",
      letterSpacing: "0.06em",
      marginBottom: "1rem"
    }}>
      MODEL EXPLANATION (SHAP)
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Object.entries(result.shap_values).map(([key, val]) => {
        const positive = val > 0;

        return (
          <div key={key} style={{
            background: "var(--s2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "0.8rem 1rem"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                fontWeight: 600
              }}>
                {key}
              </span>

              <span style={{
                fontFamily: "var(--font-d)",
                fontSize: "0.95rem",
                color: positive ? "var(--lime)" : "var(--red)"
              }}>
                {val.toFixed(4)}
              </span>
            </div>

            <div className="prog-track" style={{ marginTop: 6 }}>
              <div
                className="prog-fill"
                style={{
                  width: `${Math.min(Math.abs(val) * 100, 100)}%`,
                  background: positive
                    ? "linear-gradient(90deg, var(--lime), #7af542)"
                    : "linear-gradient(90deg, var(--red), #ff6b6b)"
                }}
              />
            </div>

            <div style={{
              fontSize: "0.65rem",
              color: "var(--muted)",
              marginTop: 4
            }}>
              {positive ? "↑ pushes toward FRAUD" : "↓ pushes toward NORMAL"}
            </div>
          </div>
        );
      })}
    </div>

          {!result && (
      <div style={{
        fontSize: "0.72rem",
        color: "var(--muted)",
        textAlign: "center",
        marginTop: 8
      }}>
        Awaiting explanation...
      </div>
    )}
  </div>
)}
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
