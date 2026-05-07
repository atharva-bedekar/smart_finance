// client/src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage     from "./pages/DashboardPage";
import TransactionsPage  from "./pages/TransactionsPage";
import BudgetPage        from "./pages/BudgetPage";
import AIPage            from "./pages/AIPage";
import Layout            from "./components/Layout";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color:"#555", padding:40 }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index          element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budget"       element={<BudgetPage />} />
        <Route path="ai"           element={<AIPage />} />
      </Route>
    </Routes>
  );
}
