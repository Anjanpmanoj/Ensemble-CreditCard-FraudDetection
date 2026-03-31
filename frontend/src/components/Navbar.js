import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/predict", label: "Predict" },
    { to: "/upload", label: "Upload" },
    { to: "/explain", label: "Explain" },
  ];

  return (
    <nav style={{
      position: "sticky",
      top: "29px", // sits below ticker
      zIndex: 100,
      borderBottom: "1px solid rgba(185,249,78,0.12)",
      background: "rgba(13,15,10,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 clamp(1rem,4vw,2.5rem)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 10,
            background: "var(--lime)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-d)",
            fontSize: "1.1rem",
            color: "#0a0c05",
            letterSpacing: "0.04em",
            flexShrink: 0,
            boxShadow: "0 0 16px rgba(185,249,78,0.4)",
          }}>CS</div>
          <div>
            <div style={{ fontFamily: "var(--font-d)", fontSize: "1.2rem", letterSpacing: "0.1em", color: "var(--text)", lineHeight: 1 }}>
              CREDITSAVER
            </div>
            <div style={{ fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.08em", marginTop: 2 }}>
              FRAUD DETECTION · ENSEMBLE · XAI
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: "var(--font-b)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  letterSpacing: "0.04em",
                  padding: "0.45rem 0.9rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  color: active ? "var(--lime)" : "var(--muted)",
                  background: active ? "rgba(185,249,78,0.08)" : "transparent",
                  border: active ? "1px solid rgba(185,249,78,0.2)" : "1px solid transparent",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--text)";
                    e.currentTarget.style.background = "rgba(185,249,78,0.04)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Status pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(185,249,78,0.06)",
          border: "1px solid rgba(185,249,78,0.18)",
          borderRadius: 99,
          padding: "5px 12px",
          flexShrink: 0,
        }}>
          <div style={{
            width: 7, height: 7,
            borderRadius: "50%",
            background: "var(--lime)",
            animation: "pulseGlow 1.8s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--lime)", letterSpacing: "0.08em" }}>
            LIVE
          </span>
        </div>
      </div>
    </nav>
  );
}

  
