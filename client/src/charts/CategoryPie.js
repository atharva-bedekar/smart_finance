// client/src/charts/CategoryPie.js
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#f97316","#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#84cc16"];

export default function CategoryPie({ data, currency = "₹" }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
            paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background:"#1a1a24", border:"none", borderRadius:8, color:"#fff", fontSize:13 }}
            formatter={v => [`${currency}${v.toLocaleString()}`, undefined]} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 12px", marginTop:8 }}>
        {data.slice(0,6).map((d,i) => (
          <div key={d.name} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#666" }}>
            <div style={{ width:8, height:8, borderRadius:2, background:COLORS[i%COLORS.length] }} />
            {d.name}
          </div>
        ))}
      </div>
    </>
  );
}
