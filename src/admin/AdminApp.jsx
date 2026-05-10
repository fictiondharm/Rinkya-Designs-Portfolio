import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Login from "./Login";
import Dashboard from "./Dashboard";
import UploadForm from "./UploadForm";

function AuthGuard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#FDF8F5",
        fontFamily: "'Outfit', sans-serif", color: "#D4829A", fontSize: 14,
      }}>
        Loading...
      </div>
    );
  }

  if (!session) return <Navigate to="/admin" replace />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const isDashboard = location.pathname === "/admin/dashboard";

  return (
    <div style={{ height: "100vh", background: "#FDF8F5", cursor: "auto", overflow: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "#FFFFFF", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22, fontWeight: 600,
              color: "#2D2A26",
            }}>Rinkya Designs</span>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 9, color: "#D4829A",
              letterSpacing: "0.2em", textTransform: "uppercase",
              marginLeft: 8,
            }}>Admin</span>
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/admin/dashboard" style={{
              textDecoration: "none",
              padding: "6px 16px", borderRadius: 100,
              fontSize: 11, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
              background: isDashboard ? "#D4829A" : "transparent",
              color: isDashboard ? "#FFFFFF" : "#2D2A26",
              border: "1px solid",
              borderColor: isDashboard ? "#D4829A" : "rgba(0,0,0,0.08)",
              transition: "all 0.2s",
            }}>Projects</Link>
            <Link to="/admin/upload" style={{
              textDecoration: "none",
              padding: "6px 16px", borderRadius: 100,
              fontSize: 11, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
              background: !isDashboard ? "#D4829A" : "transparent",
              color: !isDashboard ? "#FFFFFF" : "#2D2A26",
              border: "1px solid",
              borderColor: !isDashboard ? "#D4829A" : "rgba(0,0,0,0.08)",
              transition: "all 0.2s",
            }}>Add New</Link>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          padding: "8px 20px", borderRadius: 100,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "transparent", color: "#2D2A26",
          fontSize: 11, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
          cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.05em",
        }}>
          Logout
        </button>
      </div>
      <div style={{ padding: "32px", flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route element={<AuthGuard />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<UploadForm />} />
        <Route path="edit/:id" element={<UploadForm />} />
      </Route>
    </Routes>
  );
}
