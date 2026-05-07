// client/src/charts/SavingsTrend.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SavingsTrend({ data, currency = "₹" }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" />
        <XAxis dataKey="month" tick={{ fill:"#555", fontSize:12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:"#555", fontSize:11 }} axisLine={false} tickLine={false}
          tickFormatter={v => `${currency}${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={{ background:"#1a1a24", border:"none", borderRadius:8, color:"#fff", fontSize:13 }}
          formatter={v => [`${currency}${v.toLocaleString()}`, "Savings"]} />
        <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2.5}
          dot={{ fill:"#10b981", r:4 }} activeDot={{ r:6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
