import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={styles.nav}>
      <div style={styles.brand}>💳 FraudGuard AI</div>

      <div style={styles.links}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/predict">Predict</Link>
        <Link style={styles.link} to="/explain">Explain</Link>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  brand: {
    fontWeight: "700",
    fontSize: "18px",
  },
  links: {
    display: "flex",
    gap: "14px",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "600",
  }
};
