// client/src/pages/TransactionsPage.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api     from "../api";
import Card    from "../components/Card";
import Spinner from "../components/Spinner";

const CATEGORIES = ["Food","Rent","Travel","Shopping","Health","Entertainment","Utilities","Salary","Freelance","Investment","Other"];
const I = { padding:"9px 12px", background:"#0a0a0f", border:"1px solid #222",
            borderRadius:8, color:"#ccc", fontSize:13, width:"100%", outline:"none" };

export default function TransactionsPage() {
  const { user } = useAuth();
  const cur = user?.currency || "₹";

  const [txns,    setTxns]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState({ type:"all", category:"all", month:"" });
  const [showForm,setShowForm]= useState(false);
  const [editItem,setEditItem]= useState(null);
  const [form, setForm]       = useState({ type:"expense", category:"Food", amount:"", note:"", date: today() });
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState("");

  function today() { return new Date().toISOString().split("T")[0]; }

  const load = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (filter.type !== "all") params.type = filter.type;
    if (filter.category !== "all") params.category = filter.category;
    if (filter.month) params.month = filter.month;
    const r = await api.get("/transactions", { params });
    setTxns(r.data.transactions);
    setTotal(r.data.total);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditItem(null); setForm({ type:"expense", category:"Food", amount:"", note:"", date:today() }); setShowForm(true); };
  const openEdit = (t) => { setEditItem(t); setForm({ type:t.type, category:t.category, amount:String(t.amount), note:t.note||"", date:t.date.split("T")[0] }); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.amount || !form.date) { setError("Amount and date are required."); return; }
    setSaving(true); setError("");
    const body = { ...form, amount: parseFloat(form.amount) };
    try {
      if (editItem) await api.put(`/transactions/${editItem.id}`, body);
      else          await api.post("/transactions", body);
      setShowForm(false); setEditItem(null); load();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to save transaction.");
    } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    load();
  };

  return (
    <div className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", letterSpacing:"-0.3px" }}>Transactions</h2>
          <p style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>{total} records</p>
        </div>
        <button onClick={openNew} style={{ padding:"10px 18px", background:"var(--accent)", color:"#fff",
          border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>+ Add</button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {[["all","All"],["income","Income"],["expense","Expense"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(f=>({...f,type:v}))}
            style={{ padding:"7px 14px", borderRadius:8, border:"1px solid", cursor:"pointer", fontSize:13, fontWeight:500,
              borderColor: filter.type===v ? "var(--accent)" : "#222",
              background:  filter.type===v ? "#6366f120" : "transparent",
              color:       filter.type===v ? "#818cf8" : "#666"
            }}>{l}</button>
        ))}
        <select value={filter.category} onChange={e => setFilter(f=>({...f,category:e.target.value}))}
          style={{...I, width:"auto"}}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="month" value={filter.month} onChange={e => setFilter(f=>({...f,month:e.target.value}))}
          style={{...I, width:"auto"}} />
      </div>

      {/* Form */}
      {showForm && (
        <Card style={{ marginBottom:20, border:"1px solid #6366f140" }}>
          <div style={{ fontWeight:600, marginBottom:16, color:"#ccc" }}>{editItem?"Edit":"New"} Transaction</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
            <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={I}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={I}>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
              placeholder="Amount" type="number" style={I} />
            <input value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
              type="date" style={I} />
            <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}
              placeholder="Note" style={I} />
          </div>
          {error && <div style={{ color:"#ef4444", fontSize:13, marginTop:10 }}>{error}</div>}
          <div style={{ display:"flex", gap:10, marginTop:14 }}>
            <button onClick={handleSubmit} disabled={saving} style={{ padding:"9px 20px", background:"var(--accent)",
              color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer" }}>
              {saving ? "Saving…" : editItem ? "Update" : "Add"}
            </button>
            <button onClick={()=>{setShowForm(false);setEditItem(null);}}
              style={{ padding:"9px 20px", background:"transparent", color:"#666", border:"1px solid #222",
                borderRadius:8, fontSize:14, cursor:"pointer" }}>Cancel</button>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card style={{ padding:0, overflow:"hidden" }}>
        {loading ? (
          <div style={{ padding:40, textAlign:"center" }}><Spinner /></div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)" }}>
                {["Date","Type","Category","Amount","Note",""].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:12, color:"var(--muted)", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id} style={{ borderBottom:"1px solid #0f0f18" }}>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"#666" }}>{t.date?.split("T")[0]}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ padding:"3px 8px", borderRadius:6, fontSize:12, fontWeight:500,
                      background: t.type==="income" ? "#10b98120" : "#ef444420",
                      color:      t.type==="income" ? "#10b981"   : "#ef4444"
                    }}>{t.type}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ padding:"3px 8px", borderRadius:6, fontSize:12, background:"var(--border)", color:"#888" }}>{t.category}</span>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:14, fontWeight:600,
                    color: t.type==="income" ? "#10b981" : "#ef4444"
                  }}>{t.type==="income"?"+":"-"}{cur}{t.amount.toLocaleString()}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"#555" }}>{t.note||"—"}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>openEdit(t)} style={{ padding:"4px 10px", background:"#6366f120",
                        color:"#818cf8", border:"none", borderRadius:6, fontSize:12, cursor:"pointer" }}>Edit</button>
                      <button onClick={()=>del(t.id)} style={{ padding:"4px 10px", background:"#ef444420",
                        color:"#ef4444", border:"none", borderRadius:6, fontSize:12, cursor:"pointer" }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && txns.length === 0 && (
          <div style={{ padding:40, textAlign:"center", color:"#444", fontSize:14 }}>No transactions found</div>
        )}
      </Card>
    </div>
  );
}
