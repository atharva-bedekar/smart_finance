// client/src/components/Layout.js
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to:"/dashboard",    label:"📊 Dashboard"    },
  { to:"/transactions", label:"💳 Transactions" },
  { to:"/budget",       label:"🎯 Budget"        },
  { to:"/ai",           label:"🤖 AI Insights"  },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* Sidebar */}
      <aside style={{ width:220, background:"var(--surface)", borderRight:"1px solid var(--border)",
        display:"flex", flexDirection:"column", padding:"24px 16px", position:"fixed", height:"100vh", zIndex:100 }}>
        <div style={{ fontSize:20, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif",
          padding:"0 8px", marginBottom:32, letterSpacing:"-0.3px" }}>💰 FinSmart</div>

        <nav style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
              display:"block", padding:"10px 12px", borderRadius:10,
              textDecoration:"none", fontSize:14, fontWeight:500,
              background: isActive ? "#6366f120" : "transparent",
              color:      isActive ? "#818cf8"   : "#888",
              transition: "all .15s",
            })}>{n.label}</NavLink>
          ))}
        </nav>

        <div style={{ borderTop:"1px solid var(--border)", paddingTop:16 }}>
          <div style={{ fontSize:13, color:"#777", marginBottom:2, padding:"0 4px" }}>{user?.name}</div>
          <div style={{ fontSize:11, color:"#444", marginBottom:12, padding:"0 4px" }}>{user?.email}</div>
          <button onClick={logout} style={{ width:"100%", padding:"8px 12px", background:"transparent",
            border:"1px solid #222", borderRadius:8, color:"#666", fontSize:13, cursor:"pointer" }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft:220, flex:1, padding:"28px 32px", minHeight:"100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}
