import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { API_BASE } from "../config";

function ResultCard({ label, value, big, color }) {
  return (
    <div style={{
      background: "var(--s2)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "1rem 1.1rem",
      gridColumn: big ? "1 / -1" : "auto",
    }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontFamily: "var(--font-d)",
        fontSize: big ? "2rem" : "1.3rem",
        letterSpacing: "0.04em",
        color: color || "var(--lime)",
        lineHeight: 1,
      }}>
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function Upload() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (!res.data || res.data.length === 0) {
          alert("No rows found in CSV.");
          return;
        }
        setHeaders(Object.keys(res.data[0]));
        setRows(res.data);
        setSelectedIndex(null);
        setResult(null);
      },
    });
  };

  const predictRow = async () => {
    if (selectedIndex === null) { alert("Select a row first."); return; }
    const row = rows[selectedIndex];
    const values = Object.keys(row)
      .filter((k) => k.toLowerCase() !== "class")
      .map((k) => Number(row[k]));
    if (values.length !== 30) {
      alert(`CSV row must contain exactly 30 feature values. Got: ${values.length}`);
      return;
    }
    if (values.some((x) => Number.isNaN(x))) {
      alert("CSV contains invalid number values.");
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post(`${API_BASE}/predict`, { features: values });
      setResult(res.data);
    } catch (e) {
      console.log(e);
      alert("Backend error. Check API url + CORS.");
    } finally {
      setLoading(false);
    }
  };

  const isFraud = result?.final_label?.toLowerCase().includes("fraud");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        marginBottom: "2rem",
        animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div className="badge" style={{ marginBottom: 10 }}>Batch Inference</div>
        <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1 }}>UPLOAD CSV</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 6 }}>
          Upload a CSV with 30 features per row. Select any row and run the ensemble prediction.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className="card"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
        style={{
          padding: "2.5rem",
          textAlign: "center",
          borderStyle: "dashed",
          borderColor: dragging ? "var(--lime)" : "rgba(185,249,78,0.2)",
          background: dragging ? "rgba(185,249,78,0.04)" : "var(--s1)",
          transition: "all 0.2s",
          marginBottom: "1.5rem",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("csv-input").click()}
      >
        <div style={{
          fontFamily: "var(--font-d)",
          fontSize: "2rem",
          color: "rgba(185,249,78,0.3)",
          marginBottom: 10,
          letterSpacing: "0.08em",
        }}>
          {rows.length > 0 ? `✓ ${rows.length} ROWS LOADED` : "DROP CSV HERE"}
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1.2rem" }}>
          {rows.length > 0
            ? `${headers.length} columns detected · Click to reload`
            : "Drag & drop or click to browse — requires 30 feature columns"}
        </p>
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {rows.length === 0 && (
          <button className="btn-ghost" style={{ fontSize: "0.82rem" }} onClick={(e) => { e.stopPropagation(); document.getElementById("csv-input").click(); }}>
            Browse File
          </button>
        )}
        {rows.length > 0 && (
          <button
            className="btn-primary"
            disabled={loading || selectedIndex === null}
            style={{
              opacity: (loading || selectedIndex === null) ? 0.5 : 1,
              cursor: (loading || selectedIndex === null) ? "not-allowed" : "pointer",
            }}
            onClick={(e) => { e.stopPropagation(); predictRow(); }}
          >
            {loading ? "⟳ Predicting..." : "▸ Predict Selected Row"}
          </button>
        )}
      </div>

      {/* Table */}
      {rows.length > 0 && (
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem", overflowX: "auto" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em" }}>
              PREVIEW ROWS
            </div>
            <div className="badge">{rows.length} total · showing first 10</div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>
                  Select
                </th>
                {headers.slice(0, 6).map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  style={{
                    cursor: "pointer",
                    background: selectedIndex === idx ? "rgba(185,249,78,0.06)" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (selectedIndex !== idx) e.currentTarget.style.background = "rgba(185,249,78,0.03)"; }}
                  onMouseLeave={e => { if (selectedIndex !== idx) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{
                      width: 16, height: 16,
                      borderRadius: "50%",
                      border: `2px solid ${selectedIndex === idx ? "var(--lime)" : "rgba(185,249,78,0.25)"}`,
                      background: selectedIndex === idx ? "var(--lime)" : "transparent",
                      transition: "all 0.15s",
                    }} />
                  </td>
                  {headers.slice(0, 6).map((h) => (
                    <td key={h} style={{ padding: "10px 10px", color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                      {String(row[h]).slice(0, 10)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 10 }}>
            Showing first 10 rows and first 6 columns for preview. All 30 features are used for prediction.
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card" style={{
          padding: "1.5rem",
          borderColor: isFraud ? "rgba(255,59,59,0.4)" : "rgba(185,249,78,0.4)",
          animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em", marginBottom: "1rem" }}>
            PREDICTION RESULT
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            <ResultCard label="Final Decision" value={result.final_label} big color={isFraud ? "var(--red)" : "var(--lime)"} />
            <ResultCard label="CNN Probability" value={result.cnn_prob?.toFixed(4)} color="#b9f94e" />
            <ResultCard label="LSTM Probability" value={result.lstm_prob?.toFixed(4)} color="#06b6d4" />
            <ResultCard label="Transformer Probability" value={result.transformer_prob?.toFixed(4)} color="#f97316" />
          </div>
        </div>
      )}
    </div>
  );
}
