import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { API_BASE } from "../config";

export default function Upload() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (!res.data || res.data.length === 0) {
          alert("No rows found in CSV.");
          return;
        }

        setHeaders(Object.keys(res.data[0]));
        setRows(res.data);
        setSelectedIndex(null);
        setResult(null);
      },
    });
  };

  const predictRow = async () => {
    if (selectedIndex === null) {
      alert("Select a row first.");
      return;
    }

    const row = rows[selectedIndex];

    // Expecting 30 features in CSV.
    // If your CSV includes "Class", we ignore it.
    const values = Object.keys(row)
      .filter((k) => k.toLowerCase() !== "class")
      .map((k) => Number(row[k]));

    if (values.length !== 30) {
      alert(`CSV row must contain exactly 30 feature values. Got: ${values.length}`);
      return;
    }

    if (values.some((x) => Number.isNaN(x))) {
      alert("CSV contains invalid number values.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(`${API_BASE}/predict`, {
        features: values,
      });

      setResult(res.data);
    } catch (e) {
      console.log(e);
      alert("Backend error. Check API url + CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Upload CSV</h2>
          <p className="text-white/70">
            Upload a CSV file (30 features per row). Select a row and predict.
          </p>
        </div>
      </div>

      {/* Upload */}
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="font-bold text-white/80 mb-3">Choose CSV File</div>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/15"
        />

        {rows.length > 0 && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={predictRow}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict Selected Row"}
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      {rows.length > 0 && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 overflow-auto">
          <div className="font-bold text-white/80 mb-3">
            Preview Rows ({rows.length})
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60">
                <th className="text-left p-2">Select</th>
                {headers.slice(0, 6).map((h) => (
                  <th key={h} className="text-left p-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="border-t border-white/10">
                  <td className="p-2">
                    <input
                      type="radio"
                      name="rowSelect"
                      checked={selectedIndex === idx}
                      onChange={() => setSelectedIndex(idx)}
                    />
                  </td>

                  {headers.slice(0, 6).map((h) => (
                    <td key={h} className="p-2 text-white/80">
                      {String(row[h]).slice(0, 10)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs text-white/60 mt-3">
            Showing first 10 rows and first 6 columns for preview.
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="font-bold text-white/80 mb-3">Prediction Result</div>

          <div className="grid md:grid-cols-2 gap-4">
            <ResultCard label="Final Decision" value={result.final_label} big />
            <ResultCard label="CNN Probability" value={result.cnn_prob?.toFixed(4)} />
            <ResultCard label="LSTM Probability" value={result.lstm_prob?.toFixed(4)} />
            <ResultCard label="Transformer Probability" value={result.transformer_prob?.toFixed(4)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ label, value, big }) {
  return (
    <div className={`rounded-2xl bg-black/30 border border-white/10 p-4 ${big ? "md:col-span-2" : ""}`}>
      <div className="text-sm text-white/60 font-semibold">{label}</div>
      <div className={`${big ? "text-2xl" : "text-lg"} font-black mt-1`}>
        {value}
      </div>
    </div>
  );
}
