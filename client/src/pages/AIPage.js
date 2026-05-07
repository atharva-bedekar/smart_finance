// client/src/pages/AIPage.js
import { useState } from "react";
import api     from "../api";
import Card    from "../components/Card";
import Spinner from "../components/Spinner";

const QUERIES = [
  { id:"savings",  label:"💡 Savings Tips",      desc:"Actionable ways to save more this month"       },
  { id:"anomaly",  label:"🔍 Anomaly Detection",  desc:"Unusual spending patterns vs budget"           },
  { id:"score",    label:"📊 Health Score",        desc:"Your overall financial wellness score"         },
  { id:"forecast", label:"📅 Monthly Forecast",    desc:"Will you end the month in surplus or deficit?" },
];

export default function AIPage() {
  const [active,  setActive]  = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const ask = async (q) => {
    setActive(q.id); setLoading(true); setResult(null); setError("");
    try {
      const r = await api.post(`/ai/${q.id}`);
      setResult(r.data.result);
    } catch (e) {
      setError(e.response?.data?.error || "AI request failed. Check your ANTHROPIC_API_KEY.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize:24, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif",
        marginBottom:6, letterSpacing:"-0.3px" }}>AI Financial Insights</h2>
      <p style={{ color:"var(--muted)", fontSize:14, marginBottom:28 }}>
        Powered by Claude · personalized analysis of your real transaction data
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
        {QUERIES.map(q => (
          <button key={q.id} onClick={() => ask(q)} disabled={loading}
            style={{ padding:16, background: active===q.id ? "#6366f120" : "var(--surface)",
              border:`1px solid ${active===q.id ? "#6366f160" : "var(--border)"}`,
              borderRadius:12, cursor: loading ? "not-allowed" : "pointer",
              textAlign:"left", transition:"all .2s", opacity: loading && active!==q.id ? 0.5 : 1,
            }}>
            <div style={{ fontSize:15, fontWeight:600, color: active===q.id ? "#818cf8" : "#ccc", marginBottom:6 }}>
              {q.label}
            </div>
            <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.5 }}>{q.desc}</div>
          </button>
        ))}
      </div>

      <Card style={{ minHeight:280 }}>
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:12, color:"var(--muted)", fontSize:14 }}>
            <Spinner /> Analyzing your financial data with Claude AI…
          </div>
        )}
        {!loading && error && (
          <div style={{ color:"var(--red)", fontSize:14 }}>{error}</div>
        )}
        {!loading && !error && !result && (
          <div style={{ color:"#444", fontSize:14, textAlign:"center", paddingTop:60 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
            Select an analysis type above to get AI-powered insights.
          </div>
        )}
        {!loading && result && (
          <div>
            <div style={{ fontSize:11, color:"var(--accent)", marginBottom:14, fontWeight:700, letterSpacing:"1px" }}>
              {QUERIES.find(q=>q.id===active)?.label.toUpperCase()}
            </div>
            <div style={{ color:"#ccc", fontSize:15, lineHeight:1.85, whiteSpace:"pre-wrap" }}>{result}</div>
          </div>
        )}
      </Card>
    </div>
  );
}
