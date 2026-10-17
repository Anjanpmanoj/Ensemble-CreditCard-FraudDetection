import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        await axios.post(`${API_BASE}/signup`, { username, password });
        setMode("login");
        setError("");
        alert("Account created! Please log in.");
      } else {
        const res = await axios.post(`${API_BASE}/login`, { username, password });
        localStorage.setItem("user_id", res.data.user_id);
        window.location.href = "/predict";
      }
    } catch (err) {
      setError(mode === "login" ? "Invalid credentials. Try again." : "Signup failed. Username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div className="card" style={{
        width: "100%",
        maxWidth: 420,
        padding: "2.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 14,
            background: "var(--lime)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-d)",
            fontSize: "1.3rem",
            color: "#0a0c05",
            margin: "0 auto 1rem",
            boxShadow: "0 0 24px rgba(185,249,78,0.4)",
          }}>CS</div>

          <h2 style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>
            {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            {mode === "login"
              ? "Sign in to access your fraud history"
              : "Register to start tracking transactions"}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: "flex",
          background: "rgba(0,0,0,0.3)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          padding: 4,
          gap: 4,
        }}>
          {["login", "signup"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                fontFamily: "var(--font-d)",
                fontSize: "0.9rem",
                letterSpacing: "0.06em",
                padding: "0.45rem",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: mode === m ? "var(--lime)" : "transparent",
                color: mode === m ? "#0a0c05" : "var(--muted)",
              }}
            >
              {m === "login" ? "LOGIN" : "SIGN UP"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <label style={{
              fontSize: "0.68rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--muted)", display: "block", marginBottom: 6,
            }}>Username</label>
            <input
              className="inp"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div>
            <label style={{
              fontSize: "0.68rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--muted)", display: "block", marginBottom: 6,
            }}>Password</label>
            <input
              className="inp"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(255,59,59,0.08)",
            border: "1px solid rgba(255,59,59,0.25)",
            borderRadius: "var(--r)",
            padding: "0.6rem 0.9rem",
            fontSize: "0.78rem",
            color: "var(--red)",
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Please wait..." : mode === "login" ? "LOGIN →" : "CREATE ACCOUNT →"}
        </button>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--muted)" }}>
          {mode === "login"
            ? "No account? Switch to Sign Up above"
            : "Already have an account? Switch to Login above"}
        </p>

      </div>
    </div>
  );
}