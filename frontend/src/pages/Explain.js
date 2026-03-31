import { Link } from "react-router-dom";

function XaiCard({ title, subtitle, items, color, delay = 0 }) {
  return (
    <div className="card" style={{
      padding: "1.5rem",
      animation: `fadeUp 0.4s ${delay}s cubic-bezier(0.16,1,0.3,1) both`,
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: `${color}12`,
        border: `1px solid ${color}30`,
        borderRadius: 99,
        padding: "4px 12px",
        marginBottom: "1rem",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
        <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color }}>
          {subtitle}
        </span>
      </div>
      <div style={{ fontFamily: "var(--font-d)", fontSize: "1.3rem", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6,
              background: `${color}10`,
              border: `1px solid ${color}25`,
              display: "grid", placeItems: "center",
              flexShrink: 0,
              marginTop: 1,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
            </div>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureBar({ name, value, max = 1, color = "var(--lime)" }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontFamily: "var(--font-d)", fontSize: "0.85rem", letterSpacing: "0.06em", color: "var(--text)" }}>{name}</span>
        <span style={{ fontSize: "0.7rem", color, fontWeight: 700 }}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }} />
      </div>
    </div>
  );
}

export default function Explain() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        marginBottom: "2.5rem",
        animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div className="badge" style={{ marginBottom: 10 }}>Explainable AI</div>
        <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1 }}>EXPLAINABILITY</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 6, maxWidth: 560 }}>
          SHAP and LIME reveal exactly why the ensemble marked a transaction as fraud or legitimate — building trust through transparency.
        </p>
      </div>

      {/* XAI method cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <XaiCard
          delay={0}
          color="#b9f94e"
          subtitle="Global + Local"
          title="SHAP FEATURE IMPORTANCE"
          items={[
            "Shapley values assign each feature a contribution score for every prediction made by the ensemble.",
            "Global SHAP reveals which features matter most across all transactions in the dataset.",
            "Local SHAP shows exactly why this specific transaction was flagged — positive vs negative contributions.",
            "Works natively with XGBoost, providing tree SHAP for fast, exact computation.",
          ]}
        />
        <XaiCard
          delay={0.08}
          color="#06b6d4"
          subtitle="Local Explanation"
          title="LIME LOCAL ATTRIBUTION"
          items={[
            "LIME perturbs the input transaction and trains a local linear model to approximate the ensemble's decision boundary.",
            "Produces an interpretable list of features with signed weights — positive weights push toward fraud, negative toward legitimate.",
            "Model-agnostic: works identically regardless of which base learner (CNN, LSTM, TRF) dominates.",
            "Ideal for auditing individual flagged transactions and providing human-readable justification.",
          ]}
        />
      </div>

      {/* Sample SHAP chart (illustrative) */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}>
          <div style={{ fontFamily: "var(--font-d)", fontSize: "1.15rem", letterSpacing: "0.06em" }}>
            SAMPLE SHAP IMPORTANCE
          </div>
          <div className="badge">Illustrative · connect backend for live values</div>
        </div>
        <FeatureBar name="V14" value={0.84} color="#b9f94e" />
        <FeatureBar name="V4"  value={0.71} color="#b9f94e" />
        <FeatureBar name="V11" value={0.63} color="#06b6d4" />
        <FeatureBar name="V7"  value={0.58} color="#06b6d4" />
        <FeatureBar name="V3"  value={0.47} color="#f97316" />
        <FeatureBar name="V17" value={0.41} color="#f97316" />
        <FeatureBar name="Amount" value={0.35} color="#f43f5e" />
        <FeatureBar name="V10" value={0.28} color="#f43f5e" />
      </div>

      {/* Pipeline explainability steps */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ fontFamily: "var(--font-d)", fontSize: "1.15rem", letterSpacing: "0.06em", marginBottom: "1.25rem" }}>
            EXPLANATION PIPELINE
          </div>
          {[
            { n: "01", title: "Run Inference", desc: "Feed 30-feature vector through CNN, LSTM, Transformer, XGBoost stack." },
            { n: "02", title: "Extract SHAP Values", desc: "Compute TreeSHAP on XGBoost meta-learner output to get global feature importance." },
            { n: "03", title: "LIME Perturbation", desc: "Perturb input 500× and fit a local linear model to explain this specific prediction." },
            { n: "04", title: "Render Explanations", desc: "Display top-10 feature chart, confidence score, and plain-language reason summary." },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{
              display: "flex",
              gap: 14,
              padding: "0.85rem 0",
              borderBottom: "1px solid var(--border)",
              alignItems: "flex-start",
            }}>
              <div style={{
                fontFamily: "var(--font-d)",
                fontSize: "1.3rem",
                color: "var(--lime)",
                opacity: 0.4,
                lineHeight: 1,
                width: 30,
                flexShrink: 0,
                letterSpacing: "0.04em",
              }}>{n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Roadmap */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em", marginBottom: "1rem" }}>
              ROADMAP
            </div>
            {[
              { label: "Top 10 SHAP chart", done: false },
              { label: "Confidence score", done: false },
              { label: "Plain-language reason summary", done: false },
              { label: "LIME weights visualiser", done: false },
              { label: "Per-model SHAP breakdown", done: false },
            ].map(({ label, done }) => (
              <div key={label} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.55rem 0",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 18, height: 18,
                  borderRadius: 5,
                  border: `1px solid ${done ? "var(--lime)" : "rgba(185,249,78,0.2)"}`,
                  background: done ? "var(--lime)" : "transparent",
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                }}>
                  {done && <div style={{ width: 8, height: 8, borderRadius: 2, background: "#0a0c05" }} />}
                </div>
                <span style={{ fontSize: "0.8rem", color: done ? "var(--text)" : "var(--muted)" }}>{label}</span>
                {!done && <span style={{
                  marginLeft: "auto",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "var(--amber)",
                  letterSpacing: "0.08em",
                  background: "rgba(255,176,32,0.08)",
                  border: "1px solid rgba(255,176,32,0.2)",
                  borderRadius: 99,
                  padding: "2px 8px",
                }}>SOON</span>}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            background: "rgba(185,249,78,0.04)",
            border: "1px solid rgba(185,249,78,0.18)",
            borderRadius: "var(--r3)",
            padding: "1.25rem",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em", marginBottom: 8 }}>
              TRY AN EXPLANATION
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.65, marginBottom: "1rem" }}>
              Run a prediction first, then return here to see live SHAP & LIME outputs once the backend is connected.
            </p>
            <Link to="/predict" className="btn-primary" style={{ fontSize: "0.85rem" }}>
              ▸ Go to Predict
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
