// client/src/pages/DashboardPage.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import Card    from "../components/Card";
import Spinner from "../components/Spinner";
import { IncomeExpenseBar, CategoryPie, SavingsTrend } from "../charts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function DashboardPage() {
  const { user } = useAuth();
  const cur = user?.currency || "₹";
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/transactions/summary?months=5")
      .then(r => setSummary(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding:60, textAlign:"center" }}><Spinner size={28} /></div>;

  const current  = summary[summary.length - 1] || {};
  const barData  = summary.map(s => {
    const [,m] = s.month.split("-");
    return { month: MONTHS[parseInt(m)-1], income: s.income, expenses: s.expenses };
  });
  const lineData  = summary.map(s => {
    const [,m] = s.month.split("-");
    return { month: MONTHS[parseInt(m)-1], savings: s.savings };
  });
  const pieData = Object.entries(current.categories || {}).map(([name, value]) => ({ name, value }));

  const cards = [
    { label:"Total Income",   value:`${cur}${(current.income||0).toLocaleString()}`,   color:"#10b981", icon:"📈" },
    { label:"Total Expenses", value:`${cur}${(current.expenses||0).toLocaleString()}`, color:"#ef4444", icon:"📉" },
    { label:"Net Balance",    value:`${cur}${(current.savings||0).toLocaleString()}`,  color:"#6366f1", icon:"💼" },
  ];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize:24, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif",
        marginBottom:6, letterSpacing:"-0.3px" }}>Dashboard</h2>
      <p style={{ color:"var(--muted)", fontSize:14, marginBottom:28 }}>
        Overview · {current.month || "—"}
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
        {cards.map(c => (
          <Card key={c.label}>
            <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontSize:24, fontWeight:700, color:c.color, fontFamily:"'Space Grotesk',sans-serif" }}>
              {c.value}
            </div>
            <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>{c.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20, marginBottom:20 }}>
        <Card>
          <div style={{ fontWeight:600, marginBottom:20, color:"#ccc", fontSize:14 }}>
            Income vs Expenses
          </div>
          <IncomeExpenseBar data={barData} currency={cur} />
        </Card>
        <Card>
          <div style={{ fontWeight:600, marginBottom:20, color:"#ccc", fontSize:14 }}>
            Expenses by Category
          </div>
          {pieData.length ? <CategoryPie data={pieData} currency={cur} /> :
            <div style={{ color:"var(--muted)", fontSize:13, paddingTop:60, textAlign:"center" }}>No data</div>}
        </Card>
      </div>

      <Card>
        <div style={{ fontWeight:600, marginBottom:20, color:"#ccc", fontSize:14 }}>Net Savings Trend</div>
        <SavingsTrend data={lineData} currency={cur} />
      </Card>
    </div>
  );
}
