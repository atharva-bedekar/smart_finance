// client/src/pages/LoginPage.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const I = { padding:"11px 14px", background:"#0a0a0f", border:"1px solid #222",
            borderRadius:10, color:"#fff", fontSize:14, width:"100%", outline:"none" };

export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setF] = useState({ email:"", password:"" });
  const [err,  setE] = useState("");
  const [busy, setB] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setE(""); setB(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setE(err.response?.data?.error || "Login failed");
    } finally { setB(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex",
      alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:420, background:"var(--surface)", border:"1px solid var(--border)",
        borderRadius:20, padding:"40px 36px" }} className="fade-in">
        <div style={{ marginBottom:32 }}>
          <div style={{ fontSize:28, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif",
            letterSpacing:"-0.5px" }}>💰 FinSmart</div>
          <div style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>Sign in to your account</div>
        </div>

        <form onSubmit={handle} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <input value={form.email} onChange={e => setF(f=>({...f,email:e.target.value}))}
            placeholder="Email" type="email" required style={I} />
          <input value={form.password} onChange={e => setF(f=>({...f,password:e.target.value}))}
            placeholder="Password" type="password" required style={I} />
          {err && <div style={{ color:"var(--red)", fontSize:13 }}>{err}</div>}
          <button type="submit" disabled={busy} style={{ padding:12, background:"var(--accent)", color:"#fff",
            border:"none", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", opacity:busy?.6:1 }}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop:20, textAlign:"center", fontSize:14, color:"var(--muted)" }}>
          No account?{" "}
          <Link to="/register" style={{ color:"var(--accent)", textDecoration:"none", fontWeight:500 }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
