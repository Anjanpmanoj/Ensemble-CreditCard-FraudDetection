export default function Explain() {
  return (
    <div style={styles.wrapper}>
      <h2 style={{ marginTop: 0 }}>🔍 Explainability (XAI)</h2>
      <p style={{ color: "#555" }}>
        This page will display LIME / SHAP explanations for the last transaction.
      </p>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>✅ Coming Next</h3>
        <ul>
          <li>SHAP Feature Importance Bar Chart</li>
          <li>LIME Local Explanation for a single transaction</li>
          <li>Text explanation: “Why predicted fraud?”</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
  card: {
    padding: "16px",
    border: "1px solid #eee",
    borderRadius: "14px",
    background: "white",
    marginTop: "16px"
  }
};
