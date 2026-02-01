import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        {/* Left */}
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm">
            ⚡ Live Fraud Scoring System
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Credit Card Fraud Detection{" "}
            <span className="text-emerald-300">Made Smart</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            CreditSaver uses CNN, LSTM, and Transformer as base learners and
            combines their predictions using XGBoost stacking. Includes SHAP/LIME
            for explainable AI outputs.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/predict"
              className="px-5 py-3 rounded-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:opacity-90 transition"
            >
              🚀 Start Prediction
            </Link>

            <Link
              to="/explain"
              className="px-5 py-3 rounded-2xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              🔍 View Explanations
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <MiniStat title="Models" value="CNN / LSTM / TRF" />
            <MiniStat title="Meta" value="XGBoost" />
            <MiniStat title="XAI" value="SHAP + LIME" />
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="text-sm text-white/70 font-semibold">
              Pipeline Overview
            </div>

            <div className="mt-4 space-y-3">
              <Step n="01" t="Preprocessing" d="Scaling, split, SMOTE / ADASYN" />
              <Step n="02" t="Deep Models" d="CNN + LSTM + Transformer outputs" />
              <Step n="03" t="Stacking" d="XGBoost combines probabilities" />
              <Step n="04" t="Explainability" d="SHAP & LIME insights" />
            </div>
          </div>

          <div className="absolute -top-10 -right-6 w-40 h-40 bg-emerald-400/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-6 w-40 h-40 bg-cyan-400/30 blur-3xl rounded-full" />
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <FeatureCard
          title="📌 Stacking Ensemble"
          text="Base deep models output probabilities → XGBoost decides final fraud class."
        />
        <FeatureCard
          title="🧠 Strong Learning"
          text="CNN for local patterns, LSTM for feature sequences, Transformer for attention."
        />
        <FeatureCard
          title="🔍 Explainability"
          text="SHAP/LIME tells why it predicted fraud, increasing trust and transparency."
        />
      </div>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-white/60 font-semibold">{title}</div>
      <div className="text-sm md:text-base font-black">{value}</div>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
      <div className="font-extrabold">{title}</div>
      <p className="text-white/70 mt-2 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Step({ n, t, d }) {
  return (
    <div className="flex gap-3 items-start rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="w-10 h-10 rounded-2xl bg-white/10 grid place-items-center font-black text-white">
        {n}
      </div>
      <div>
        <div className="font-bold">{t}</div>
        <div className="text-white/70 text-sm">{d}</div>
      </div>
    </div>
  );
}

