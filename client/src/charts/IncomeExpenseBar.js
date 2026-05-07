// client/src/charts/IncomeExpenseBar.js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function IncomeExpenseBar({ data, currency = "₹" }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" />
        <XAxis dataKey="month" tick={{ fill:"#555", fontSize:12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:"#555", fontSize:11 }} axisLine={false} tickLine={false}
          tickFormatter={v => `${currency}${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={{ background:"#1a1a24", border:"none", borderRadius:8, color:"#fff", fontSize:13 }}
          formatter={v => [`${currency}${v.toLocaleString()}`, undefined]} />
        <Legend wrapperStyle={{ fontSize:12, color:"#888" }} />
        <Bar dataKey="income"   name="Income"   fill="#6366f1"   radius={[4,4,0,0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#ef444460" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
