import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/admin/dashboard");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 8,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    color: "#2D2A26",
    background: "#FFFFFF",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FDF8F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      cursor: "auto",
      overflow: "auto",
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        padding: "48px 40px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28, fontWeight: 600, color: "#2D2A26",
            marginBottom: 4,
          }}>
            Rinkya Designs
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11, color: "#D4829A",
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            Admin Login
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{
              display: "block",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11, fontWeight: 600,
              color: "#2D2A26", marginBottom: 6,
              letterSpacing: "0.05em",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11, fontWeight: 600,
              color: "#2D2A26", marginBottom: 6,
              letterSpacing: "0.05em",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12, color: "#CC4444",
              padding: "10px 14px",
              background: "rgba(200,50,50,0.05)",
              borderRadius: 8,
              border: "1px solid rgba(200,50,50,0.1)",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 0",
              background: loading ? "rgba(212,130,154,0.5)" : "#D4829A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
              marginTop: 8,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
