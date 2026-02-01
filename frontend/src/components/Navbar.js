import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const NavLink = ({ to, label }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
          active
            ? "bg-white/10 border border-white/15"
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 grid place-items-center font-black text-black">
            CS
          </div>

          <div>
            <div className="font-extrabold text-lg leading-5">CreditSaver</div>
            <div className="text-xs text-white/60">
              Fraud Detection • Ensemble • XAI
            </div>
          </div>
        </div>

      <div className="flex items-center gap-2">
  <NavLink to="/" label="Home" />
  <NavLink to="/dashboard" label="Dashboard" />
  <NavLink to="/predict" label="Predict" />
  <NavLink to="/upload" label="Upload" />
  <NavLink to="/explain" label="Explain" />
</div>

      </div>
    </div>
  );
}
  