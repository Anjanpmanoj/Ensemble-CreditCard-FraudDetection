export default function Explain() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-black">Explainability (XAI)</h2>
      <p className="text-white/70 mt-2">
        SHAP and LIME will explain why a transaction was predicted as fraud/normal.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Card
          title="SHAP Feature Importance"
          text="Shows top features that contributed to prediction (global + local)."
        />
        <Card
          title="LIME Local Explanation"
          text="Explains a single transaction prediction with interpretable weights."
        />
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="font-bold mb-2">Next Additions ✅</div>
        <ul className="list-disc ml-6 text-white/70 space-y-2">
          <li>Top 10 feature explanation chart</li>
          <li>Confidence score</li>
          <li>Reason text summary</li>
        </ul>
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
      <div className="font-extrabold">{title}</div>
      <p className="text-white/70 mt-2 text-sm">{text}</p>
    </div>
  );
}
