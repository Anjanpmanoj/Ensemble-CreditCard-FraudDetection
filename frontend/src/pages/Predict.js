import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function Predict() {
  const [features, setFeatures] = useState(Array(30).fill(""));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const setVal = (i, v) => {
    const copy = [...features];
    copy[i] = v;
    setFeatures(copy);
  };

  const fillZeros = () => setFeatures(Array(30).fill("0"));

  const predict = async () => {
    try {
      setLoading(true);
      setResult(null);

      const nums = features.map((x) => Number(x));
      if (nums.some((x) => Number.isNaN(x))) {
        alert("Enter only numbers in all 30 fields.");
        return;
      }

      const res = await axios.post(`${API_BASE}/predict`, { features: nums });
      setResult(res.data);
    } catch (e) {
      console.log(e);
      alert("Backend error. Check API URL and CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Prediction</h2>
          <p className="text-white/70">
            Enter 30 feature values and get final fraud decision + probabilities.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fillZeros}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-semibold"
          >
            Fill 0
          </button>

          <button
            onClick={predict}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Inputs */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="font-bold text-white/80 mb-4">
            Transaction Features (30)
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="text-xs text-white/60 font-semibold">
                  F{i + 1}
                </div>
                <input
                  value={v}
                  onChange={(e) => setVal(i, e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-emerald-300 transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="font-bold text-white/80 mb-2">Result</div>

          {!result ? (
            <div className="text-white/60 text-sm mt-6">
              Run prediction to view result.
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
                <div className="text-sm text-white/60 font-semibold">
                  Final Decision
                </div>
                <div className="text-2xl font-black mt-1">
                  {result.final_label}
                </div>
              </div>

              <ProbRow label="CNN Probability" value={result.cnn_prob} />
              <ProbRow label="LSTM Probability" value={result.lstm_prob} />
              <ProbRow label="Transformer Probability" value={result.transformer_prob} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProbRow({ label, value }) {
  const pct = value ? Math.round(value * 100) : 0;

  return (
    <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70 font-semibold">{label}</div>
        <div className="font-black">{value?.toFixed(4)}</div>
      </div>

      <div className="h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-emerald-400 to-cyan-400"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="text-xs text-white/60 mt-1">{pct}%</div>
    </div>
  );
}

