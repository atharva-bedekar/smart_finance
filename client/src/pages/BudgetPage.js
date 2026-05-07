// client/src/pages/BudgetPage.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api     from "../api";
import Card    from "../components/Card";
import Spinner from "../components/Spinner";

const CATS   = ["Food","Rent","Travel","Shopping","Health","Entertainment","Utilities"];
const COLORS = ["#f97316","#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}

export default function BudgetPage() {
  const { user } = useAuth();
  const cur = user?.currency || "₹";
  const month = currentMonth();

  const [budgets,  setBudgets]  = useState({});
  const [spent,    setSpent]    = useState({});
  const [editing,  setEditing]  = useState({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const [bRes, tRes] = await Promise.all([
      api.get("/budgets", { params: { month } }),
      api.get("/transactions", { params: { month, type:"expense" } }),
    ]);
    const b = {};
    bRes.data.forEach(x => { b[x.category] = x.amount; });
    setBudgets(b);
    const s = {};
    tRes.data.transactions.forEach(t => { s[t.category] = (s[t.category]||0) + t.amount; });
    setSpent(s);
    setLoading(false);
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const save = async (cat, amount) => {
    setSaving(s => ({...s, [cat]:true}));
    await api.post("/budgets", { category:cat, amount:parseFloat(amount), month });
    setSaving(s => ({...s, [cat]:false}));
    setEditing(e => ({...e, [cat]:false}));
    load();
  };

  if (loading) return <div style={{ padding:60, textAlign:"center" }}><Spinner size={28} /></div>;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize:24, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif",
        marginBottom:6, letterSpacing:"-0.3px" }}>Budget Planner</h2>
      <p style={{ color:"var(--muted)", fontSize:14, marginBottom:28 }}>
        Monthly budgets · {month}
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        {CATS.map((cat, i) => {
          const budget = budgets[cat] || 0;
          const s      = spent[cat]   || 0;
          const pct    = budget > 0 ? Math.min((s/budget)*100, 100) : 0;
          const over   = budget > 0 && s > budget;
          const near   = pct >= 80 && !over;
          const color  = over ? "#ef4444" : near ? "#f59e0b" : "#10b981";

          return (
            <Card key={cat} style={{ border:`1px solid ${over ? "#ef444330" : "var(--border)"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:COLORS[i] }} />
                  <span style={{ fontWeight:600, fontSize:15, color:"#ddd" }}>{cat}</span>
                  {over && <span style={{ fontSize:11, color:"#ef4444", background:"#ef444415",
                    padding:"2px 6px", borderRadius:4 }}>Over Budget!</span>}
                  {near && <span style={{ fontSize:11, color:"#f59e0b", background:"#f59e0b15",
                    padding:"2px 6px", borderRadius:4 }}>Nearing Limit</span>}
                </div>
                <button onClick={() => setEditing(e=>({...e,[cat]:!e[cat]}))}
                  style={{ background:"transparent", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:13 }}>✏️</button>
              </div>

              {editing[cat] && (
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <input type="number" defaultValue={budget} id={`b-${cat}`}
                    style={{ flex:1, padding:"7px 10px", background:"#0a0a0f", border:"1px solid #333",
                      borderRadius:8, color:"#fff", fontSize:13, outline:"none" }} />
                  <button onClick={() => save(cat, document.getElementById(`b-${cat}`).value)}
                    disabled={saving[cat]}
                    style={{ padding:"7px 14px", background:"var(--accent)", color:"#fff",
                      border:"none", borderRadius:8, fontSize:13, cursor:"pointer" }}>
                    {saving[cat] ? "…" : "Save"}
                  </button>
                </div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <span style={{ color, fontWeight:600 }}>{cur}{s.toLocaleString()} spent</span>
                <span style={{ color:"var(--muted)" }}>{budget > 0 ? `of ${cur}${budget.toLocaleString()}` : "No budget set"}</span>
              </div>
              {budget > 0 && (
                <>
                  <div style={{ height:8, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:color,
                      borderRadius:99, transition:"width .4s ease" }} />
                  </div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:6 }}>
                    {over
                      ? `${cur}${(s-budget).toLocaleString()} over`
                      : `${cur}${(budget-s).toLocaleString()} remaining`
                    } · {pct.toFixed(0)}%
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
