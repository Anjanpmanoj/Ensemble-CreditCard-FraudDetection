import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Dashboard</h2>
          <p className="text-white/70">
            Overview of your fraud detection system.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/predict"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold hover:opacity-90 transition"
          >
            🚀 Predict
          </Link>

          <Link
            to="/upload"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-semibold"
          >
            📄 Upload CSV
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Models" value="3 + XGBoost" sub="CNN • LSTM • Transformer" />
        <StatCard title="Explainability" value="Enabled" sub="SHAP • LIME" />
        <StatCard title="API Status" value="Online ✅" sub="Render backend" />
        <StatCard title="Frontend" value="Deployed ✅" sub="Vercel app" />
      </div>

      {/* Cards */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Panel
          title="Quick Actions"
          text="Run a quick prediction or upload a batch transaction file."
          buttons={
            <div className="flex gap-2 mt-4">
              <Link
                to="/predict"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold hover:opacity-90 transition"
              >
                Predict
              </Link>
              <Link
                to="/upload"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-semibold"
              >
                Upload CSV
              </Link>
            </div>
          }
        />

        <Panel
          title="About this project"
          text="CreditSaver uses stacking ensemble learning to detect fraud from transaction feature vectors (30 inputs)."
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
      <div className="text-xs text-white/60 font-semibold">{title}</div>
      <div className="text-2xl font-black mt-1">{value}</div>
      <div className="text-sm text-white/60 mt-2">{sub}</div>
    </div>
  );
}

function Panel({ title, text, buttons }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="font-extrabold text-lg">{title}</div>
      <p className="text-white/70 mt-2">{text}</p>
      {buttons}
    </div>
  );
}
