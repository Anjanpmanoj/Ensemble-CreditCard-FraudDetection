import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Explain from "./pages/Explain";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";

function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --lime:    #b9f94e;
          --lime2:   #d4fc7a;
          --red:     #ff3b3b;
          --amber:   #ffb020;
          --surface: #0d0f0a;
          --s1:      #131509;
          --s2:      #1a1e0e;
          --s3:      #222712;
          --border:  rgba(185,249,78,0.12);
          --border2: rgba(185,249,78,0.25);
          --text:    #eef5e0;
          --muted:   rgba(220,240,180,0.45);
          --font-d:  'Bebas Neue', sans-serif;
          --font-b:  'Outfit', sans-serif;
          --r:       10px;
          --r2:      16px;
          --r3:      22px;
          --trans:   0.2s cubic-bezier(0.16,1,0.3,1);
        }

        html, body { height: 100%; scroll-behavior: smooth; }

        body {
          font-family: var(--font-b);
          background: var(--surface);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--lime); border-radius: 99px; opacity: 0.4; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 12px rgba(185,249,78,0.3); }
          50%      { box-shadow: 0 0 28px rgba(185,249,78,0.6); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }

        .page-enter { animation: fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }

        /* Cards */
        .card {
          background: var(--s1);
          border: 1px solid var(--border);
          border-radius: var(--r3);
          transition: border-color var(--trans), transform var(--trans);
        }
        .card:hover { border-color: var(--border2); transform: translateY(-2px); }

        /* Buttons */
        .btn-primary {
          font-family: var(--font-d);
          letter-spacing: 0.06em;
          font-size: 1rem;
          padding: 0.6rem 1.6rem;
          border-radius: var(--r);
          border: none;
          background: var(--lime);
          color: #0a0c05;
          cursor: pointer;
          transition: filter var(--trans), transform var(--trans), box-shadow var(--trans);
          box-shadow: 0 4px 20px rgba(185,249,78,0.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(185,249,78,0.45);
        }

        .btn-ghost {
          font-family: var(--font-b);
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.6rem 1.4rem;
          border-radius: var(--r);
          border: 1px solid var(--border2);
          background: transparent;
          color: var(--text);
          cursor: pointer;
          transition: background var(--trans), border-color var(--trans);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-ghost:hover { background: rgba(185,249,78,0.06); border-color: var(--lime); }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(185,249,78,0.08);
          border: 1px solid rgba(185,249,78,0.2);
          border-radius: 99px;
          padding: 4px 12px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--lime);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Input */
        .inp {
          width: 100%;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(185,249,78,0.15);
          border-radius: var(--r);
          color: var(--text);
          font-family: var(--font-b);
          font-size: 0.85rem;
          padding: 0.5rem 0.75rem;
          outline: none;
          transition: border-color var(--trans), box-shadow var(--trans);
        }
        .inp:focus {
          border-color: var(--lime);
          box-shadow: 0 0 0 3px rgba(185,249,78,0.1);
        }
        .inp::placeholder { color: var(--muted); }

        /* Stat card */
        .stat-card {
          background: var(--s2);
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 1.1rem 1.25rem;
        }
        .stat-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.4rem;
        }
        .stat-value {
          font-family: var(--font-d);
          font-size: 1.9rem;
          letter-spacing: 0.03em;
          color: var(--lime);
          line-height: 1;
        }
        .stat-sub {
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 0.3rem;
        }

        /* Progress bar */
        .prog-track {
          height: 5px;
          background: rgba(185,249,78,0.1);
          border-radius: 99px;
          overflow: hidden;
          margin-top: 0.6rem;
        }
        .prog-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--lime), #7af542);
          border-radius: 99px;
          transition: width 0.7s cubic-bezier(0.16,1,0.3,1);
        }

        /* Ticker tape */
        .ticker-wrap {
          overflow: hidden;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--s1);
          padding: 0.45rem 0;
        }
        .ticker-inner {
          display: flex;
          gap: 3rem;
          white-space: nowrap;
          animation: ticker 28s linear infinite;
          width: max-content;
        }
        .ticker-item {
          font-family: var(--font-d);
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          color: var(--lime);
          opacity: 0.6;
        }

        h1,h2,h3 { font-family: var(--font-d); letter-spacing: 0.04em; }
      `}</style>

      {/* Ticker tape */}
      <div className="ticker-wrap" style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <div className="ticker-inner">
          {[...Array(2)].map((_, ri) =>
            ["CNN MODEL ACTIVE","LSTM READY","TRANSFORMER ONLINE","XGBOOST META-LEARNER ACTIVE","SHAP ENABLED","LIME ENABLED","FRAUD DETECTION SYSTEM V2","ENSEMBLE ACCURACY 97.4%","CREDITSAVER LIVE"].map((t, i) => (
              <span className="ticker-item" key={`${ri}-${i}`}>▸ {t}</span>
            ))
          )}
        </div>
      </div>

      <Navbar />

      <main style={{ padding: "2rem clamp(1rem,4vw,2.5rem) 4rem", position: "relative" }}>
        {/* Ambient glow */}
        <div style={{
          position: "fixed", top: "10vh", left: "5vw",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(185,249,78,0.05) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0
        }} />
        <div style={{
          position: "fixed", bottom: "5vh", right: "5vw",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(255,59,59,0.04) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/predict" element={<PageWrapper><Predict /></PageWrapper>} />
            <Route path="/upload" element={<PageWrapper><Upload /></PageWrapper>} />
            <Route path="/explain" element={<PageWrapper><Explain /></PageWrapper>} />
          </Routes>
        </div>
      </main>

      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1.2rem clamp(1rem,4vw,2.5rem)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--s1)"
      }}>
        <span style={{ fontFamily: "var(--font-d)", fontSize: "1.1rem", color: "var(--lime)", letterSpacing: "0.08em" }}>CREDITSAVER</span>
        <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Ensemble · XGBoost · SHAP · LIME — © {new Date().getFullYear()}</span>
      </footer>
    </BrowserRouter>
  );
}


