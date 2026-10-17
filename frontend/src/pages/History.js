import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function History() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      setError("You must be logged in to view history.");
      setLoading(false);
      return;
    }

    axios.get(`${API_BASE}/history/${user_id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load transaction history.");
        setLoading(false);
      });
  }, []);

  const isFraud = (prediction) => prediction?.includes("FRAUD");

  // ── Stats ─────────────────────────────────────────
  const total  = data.length;
  const frauds = data.filter(d => isFraud(d.prediction)).length;
  const normal = total - frauds;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span className="badge" style={{ marginBottom: "0.8rem" }}>📋 Transaction Log</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", marginBottom: "0.4rem" }}>
          TRANSACTION HISTORY
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          All past predictions run through the ensemble model
        </p>
      </div>

      {/* Stat row */}
      {!loading && !error && total > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          <div className="stat-card">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">all time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Fraud Detected</div>
            <div className="stat-value" style={{ color: "var(--red)" }}>{frauds}</div>
            <div className="stat-sub">{total ? ((frauds / total) * 100).toFixed(1) : 0}% of total</div>
            <div className="prog-track">
              <div className="prog-fill" style={{
                width: `${total ? (frauds / total) * 100 : 0}%`,
                background: "linear-gradient(90deg, var(--red), #ff7b7b)",
              }} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Normal</div>
            <div className="stat-value">{normal}</div>
            <div className="stat-sub">{total ? ((normal / total) * 100).toFixed(1) : 0}% of total</div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${total ? (normal / total) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          textAlign: "center", padding: "4rem",
          color: "var(--muted)", fontSize: "0.85rem",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "3px solid rgba(185,249,78,0.15)",
            borderTop: "3px solid var(--lime)",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem",
          }} />
          Loading transactions...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(255,59,59,0.08)",
          border: "1px solid rgba(255,59,59,0.25)",
          borderRadius: "var(--r2)",
          padding: "1.2rem 1.5rem",
          color: "var(--red)",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          ⚠ {error}
          {error.includes("logged in") && (
            <a href="/login" className="btn-primary" style={{ marginLeft: "auto", fontSize: "0.8rem", padding: "0.4rem 1rem" }}>
              Go to Login
            </a>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && total === 0 && (
        <div className="card" style={{
          textAlign: "center", padding: "4rem 2rem",
          color: "var(--muted)",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📭</div>
          <h3 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>NO TRANSACTIONS YET</h3>
          <p style={{ fontSize: "0.82rem", marginBottom: "1.5rem" }}>
            Run a prediction to see your history here
          </p>
          <a href="/predict" className="btn-primary">Go to Predict →</a>
        </div>
      )}

      {/* Transaction list */}
      {!loading && !error && total > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[...data].reverse().map((item, i) => {
            const fraud = isFraud(item.prediction);
            return (
              <div key={i} className="card" style={{
                padding: "1.1rem 1.4rem",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: "1rem",
                borderColor: fraud
                  ? "rgba(255,59,59,0.2)"
                  : "rgba(185,249,78,0.12)",
              }}>

                {/* Index + icon */}
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 10,
                  background: fraud
                    ? "rgba(255,59,59,0.1)"
                    : "rgba(185,249,78,0.08)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}>
                  {fraud ? "🚨" : "✅"}
                </div>

                {/* Middle info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{
                    fontFamily: "var(--font-d)",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                    color: fraud ? "var(--red)" : "var(--lime)",
                  }}>
                    {item.prediction}
                  </div>

                  {/* Model probs */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {[
                      { label: "CNN",         val: item.cnn_prob },
                      { label: "LSTM",        val: item.lstm_prob },
                      { label: "Transformer", val: item.transformer_prob },
                    ].map(({ label, val }) => (
                      <span key={label} style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                        {label}:{" "}
                        <span style={{ color: "var(--text)", fontWeight: 600 }}>
                          {val != null ? (val * 100).toFixed(1) + "%" : "—"}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timestamp + TX id */}
                <div style={{ textAlign: "right" }}>
                  {item.timestamp && (
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: 3 }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  )}
                  <div style={{
                    fontSize: "0.65rem",
                    color: "var(--muted)",
                    fontFamily: "monospace",
                    opacity: 0.5,
                  }}>
                    TX#{String(item.id).padStart(5, "0")}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}