import { Link } from "react-router-dom";

function MiniStat({ title, value }) {
  return (
    <div style={{
      background: "var(--s2)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r2)",
      padding: "0.9rem 1rem",
    }}>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontFamily: "var(--font-d)", fontSize: "1rem", letterSpacing: "0.06em", color: "var(--lime)" }}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text, delay = 0 }) {
  return (
    <div className="card" style={{
      padding: "1.5rem",
      animation: `fadeUp 0.5s ${delay}s cubic-bezier(0.16,1,0.3,1) both`,
    }}>
      <div style={{
        width: 44, height: 44,
        borderRadius: 10,
        background: "rgba(185,249,78,0.08)",
        border: "1px solid rgba(185,249,78,0.18)",
        display: "grid",
        placeItems: "center",
        fontSize: "1.3rem",
        marginBottom: "1rem",
      }}>{icon}</div>
      <div style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{title}</div>
      <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

function Step({ n, t, d }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{
        fontFamily: "var(--font-d)",
        fontSize: "1.4rem",
        color: "var(--lime)",
        opacity: 0.5,
        lineHeight: 1,
        width: 32,
        flexShrink: 0,
        letterSpacing: "0.04em",
      }}>{n}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 2 }}>{t}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Hero */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        alignItems: "center",
        marginBottom: "3rem",
        minHeight: "70vh",
      }}>
        {/* Left */}
        <div style={{ animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div className="badge" style={{ marginBottom: "1.5rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lime)", animation: "blink 1.4s infinite" }} />
            Live Fraud Scoring System
          </div>

          <h1 style={{
            fontSize: "clamp(3rem,6vw,5.5rem)",
            lineHeight: 0.92,
            marginBottom: "1.5rem",
            letterSpacing: "0.02em",
          }}>
            CREDIT<br />
            <span style={{ color: "var(--lime)" }}>FRAUD</span><br />
            DETECTION
          </h1>

          <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 460, marginBottom: "2rem" }}>
            CreditSaver deploys CNN, LSTM, and Transformer as deep base learners — combined via XGBoost stacking for maximum ensemble accuracy. SHAP & LIME explain every decision.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <Link to="/predict" className="btn-primary">▸ Start Prediction</Link>
            <Link to="/explain" className="btn-ghost">◈ View Explanations</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <MiniStat title="Models" value="CNN / LSTM / TRF" />
            <MiniStat title="Meta Learner" value="XGBoost" />
            <MiniStat title="XAI" value="SHAP + LIME" />
          </div>
        </div>

        {/* Right — pipeline card */}
        <div style={{ position: "relative", animation: "fadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}>
          {/* Glow blobs */}
          <div style={{
            position: "absolute", top: -40, right: -20,
            width: 200, height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(185,249,78,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -30, left: -20,
            width: 160, height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,59,59,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="card" style={{ padding: "2rem", position: "relative" }}>
            {/* Corner tag */}
            <div style={{
              position: "absolute", top: -1, right: 28,
              background: "var(--lime)", color: "#0a0c05",
              fontFamily: "var(--font-d)", fontSize: "0.7rem",
              letterSpacing: "0.1em",
              padding: "3px 10px",
              borderRadius: "0 0 8px 8px",
            }}>PIPELINE</div>

            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.5rem" }}>
              Inference Flow
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Step n="01" t="Preprocessing" d="Scaling, train/test split, SMOTE / ADASYN oversampling" />

              {/* Visual: 3 models */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
                background: "rgba(185,249,78,0.03)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "1rem",
              }}>
                {["CNN","LSTM","TRF"].map(m => (
                  <div key={m} style={{
                    textAlign: "center",
                    fontFamily: "var(--font-d)",
                    fontSize: "1.2rem",
                    letterSpacing: "0.08em",
                    color: "var(--lime)",
                    background: "rgba(185,249,78,0.06)",
                    borderRadius: 8,
                    padding: "0.6rem 0",
                  }}>{m}</div>
                ))}
                <div style={{ gridColumn: "1/-1", fontSize: "0.68rem", color: "var(--muted)", textAlign: "center", marginTop: 4 }}>
                  Base learner probability outputs
                </div>
              </div>

              <Step n="03" t="XGBoost Stacking" d="Meta-learner combines base model probabilities → final fraud decision" />
              <Step n="04" t="Explainability" d="SHAP global importance · LIME local attribution" />
            </div>

            {/* Live indicator */}
            <div style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>System Status</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--lime)", animation: "pulseGlow 1.8s infinite" }} />
                <span style={{ fontFamily: "var(--font-d)", fontSize: "0.85rem", color: "var(--lime)", letterSpacing: "0.08em" }}>ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "1rem",
        marginBottom: "3rem",
      }}>
        <FeatureCard delay={0} icon="⚡" title="STACKING ENSEMBLE" text="Base deep models output probability vectors → XGBoost meta-learner fuses them into a single, high-accuracy fraud decision." />
        <FeatureCard delay={0.08} icon="🧠" title="DEEP LEARNING CORE" text="CNN captures local feature correlations, LSTM models sequential patterns, Transformer applies full attention across all 30 features." />
        <FeatureCard delay={0.16} icon="🔍" title="EXPLAINABLE AI" text="SHAP gives global + local feature importance. LIME explains any single transaction with interpretable weights your team can trust." />
      </div>

      {/* Big stat bar */}
      <div style={{
        background: "var(--s1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r3)",
        padding: "1.5rem 2rem",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "1rem",
        textAlign: "center",
      }}>
        {[
          { v: "97.4%", l: "Ensemble Accuracy" },
          { v: "30", l: "Feature Inputs" },
          { v: "3 + 1", l: "Models (Base + Meta)" },
          { v: "< 40ms", l: "Avg Inference Time" },
        ].map(({ v, l }) => (
          <div key={l}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "2.2rem", color: "var(--lime)", letterSpacing: "0.04em", lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


