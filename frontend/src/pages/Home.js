import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Credit Card Fraud Detection</h1>
        <p style={styles.subtitle}>
          Ensemble Deep Learning (CNN + LSTM + Transformer) with XGBoost meta-model
          and Explainable AI (SHAP + LIME).
        </p>

        <div style={styles.btnRow}>
          <Link to="/predict" style={styles.primaryBtn}>🚀 Start Prediction</Link>
          <Link to="/explain" style={styles.secondaryBtn}>🔍 View Explainability</Link>
        </div>
      </div>

      <div style={styles.grid}>
        <Card title="📌 Models Used" text="CNN, LSTM, Transformer → stacked into XGBoost for final fraud decision." />
        <Card title="⚖️ Imbalanced Handling" text="SMOTE / ADASYN to handle class imbalance and reduce bias." />
        <Card title="🧠 Explainable AI" text="SHAP and LIME highlight which features contributed to fraud prediction." />
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div style={styles.card}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ marginTop: 8, color: "#555" }}>{text}</p>
    </div>
  );
}

const styles = {
  wrapper: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
  hero: {
    padding: "25px",
    border: "1px solid #eee",
    borderRadius: "14px",
    background: "#fafafa",
  },
  title: { margin: 0, fontSize: "34px" },
  subtitle: { marginTop: "10px", color: "#555", fontSize: "16px", lineHeight: 1.4 },
  btnRow: { display: "flex", gap: "12px", marginTop: "18px" },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "black",
    color: "white",
    textDecoration: "none",
    fontWeight: "700"
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "white",
    border: "1px solid #ddd",
    color: "#111",
    textDecoration: "none",
    fontWeight: "700"
  },
  grid: {
    marginTop: "20px",
    display: "grid",
    gap: "14px",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
  },
  card: {
    padding: "16px",
    border: "1px solid #eee",
    borderRadius: "14px",
    background: "white"
  }
};
