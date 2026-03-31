import { Link } from "react-router-dom";

function StatCard({ title, value, sub, accent }) {
  return (
    <div className="stat-card" style={{ animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="stat-label">{title}</div>
      <div className="stat-value" style={accent ? { color: accent } : {}}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <div style={{ fontFamily: "var(--font-d)", fontSize: "1.15rem", letterSpacing: "0.06em", marginBottom: "1rem", color: "var(--text)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function ModelRow({ name, type, acc, color }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0.75rem 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        fontFamily: "var(--font-d)",
        fontSize: "1rem",
        letterSpacing: "0.06em",
        color,
        width: 56,
        flexShrink: 0,
      }}>{name}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{type}</span>
          <span style={{ fontFamily: "var(--font-d)", fontSize: "0.85rem", color }}>{acc}</span>
        </div>
        <div className="prog-track">
          <div className="prog-fill" style={{
            width: acc,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          }} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
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
          <div className="badge" style={{ marginBottom: 10 }}>System Overview</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1 }}>DASHBOARD</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 6 }}>
            Live overview of your CreditSaver fraud detection system.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <Link to="/predict" className="btn-primary">▸ Predict</Link>
          <Link to="/upload" className="btn-ghost">↑ Upload CSV</Link>
        </div>
      </div>

      {/* Stat row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 12,
        marginBottom: "1.5rem",
      }}>
        <StatCard title="Architecture" value="3 + 1" sub="CNN · LSTM · TRF + XGBoost" />
        <StatCard title="Explainability" value="XAI ON" sub="SHAP · LIME enabled" accent="var(--lime)" />
        <StatCard title="API Status" value="ONLINE" sub="Render backend active" accent="#4ade80" />
        <StatCard title="Frontend" value="LIVE" sub="Vercel deployment" accent="var(--lime)" />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>

        {/* Quick Actions */}
        <Panel title="QUICK ACTIONS">
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.2rem" }}>
            Run a single transaction prediction or upload a batch CSV file for bulk inference.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/predict" className="btn-primary" style={{ fontSize: "0.85rem" }}>▸ Predict Now</Link>
            <Link to="/upload" className="btn-ghost" style={{ fontSize: "0.85rem" }}>↑ Upload CSV</Link>
          </div>
          <div style={{
            marginTop: "1.2rem",
            padding: "0.9rem",
            background: "rgba(185,249,78,0.04)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: "0.78rem",
            color: "var(--muted)",
            lineHeight: 1.7,
          }}>
            <span style={{ color: "var(--lime)", fontWeight: 700 }}>Tip:</span> Use "Fill 0" on the predict page to test with a zero-vector baseline input.
          </div>
        </Panel>

        {/* About */}
        <Panel title="ABOUT CREDITSAVER">
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
            CreditSaver uses stacking ensemble learning to detect fraud from transaction feature vectors (30 inputs). Deep base models output probability scores that XGBoost combines into a final decision.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
            {[
              { k: "Input Features", v: "30 numeric" },
              { k: "Training Data", v: "SMOTE balanced" },
              { k: "Base Models", v: "CNN, LSTM, TRF" },
              { k: "Meta Learner", v: "XGBoost" },
            ].map(({ k, v }) => (
              <div key={k} style={{
                background: "var(--s2)",
                borderRadius: 10,
                padding: "0.6rem 0.8rem",
                border: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontFamily: "var(--font-d)", fontSize: "0.9rem", color: "var(--lime)", marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Model performance + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1rem" }}>

        {/* Model rows */}
        <Panel title="MODEL PERFORMANCE">
          <ModelRow name="CNN" type="Local pattern detector · Base learner" acc="91%" color="#b9f94e" />
          <ModelRow name="LSTM" type="Sequential feature learner · Base learner" acc="89%" color="#06b6d4" />
          <ModelRow name="TRF" type="Full attention model · Base learner" acc="93%" color="#f97316" />
          <ModelRow name="XGB" type="Meta stacker · Final decision" acc="97%" color="#f43f5e" />
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.75rem" }}>
            * Accuracy values are illustrative — connect your backend for live metrics.
          </div>
        </Panel>

        {/* System log */}
        <Panel title="SYSTEM LOG">
          {[
            { dot: "var(--lime)", msg: "Ensemble model loaded", time: "just now" },
            { dot: "#06b6d4", msg: "SHAP explainer initialized", time: "2m ago" },
            { dot: "#f97316", msg: "LIME module ready", time: "2m ago" },
            { dot: "#4ade80", msg: "API health check passed", time: "5m ago" },
            { dot: "var(--lime)", msg: "XGBoost meta-learner active", time: "8m ago" },
            { dot: "#f43f5e", msg: "SMOTE balancer applied", time: "10m ago" },
          ].map(({ dot, msg, time }, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0.55rem 0",
              borderBottom: "1px solid var(--border)",
              fontSize: "0.78rem",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }} />
              <span style={{ flex: 1, color: "var(--muted)" }}>{msg}</span>
              <span style={{ color: "rgba(185,249,78,0.3)", fontSize: "0.68rem", flexShrink: 0 }}>{time}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
