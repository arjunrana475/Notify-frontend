import React, { useState, useEffect } from "react";
import API from "../services/api.js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Sign In | Notify";
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("All fields are required");
    setLoading(true);
    try {
      const { data } = await API.post("/api/auth/login", formData);

      const { success, message, user, token } = data;
      if (success) {
        toast.success(message || "Welcome back!");
        login(user, token);
        setFormData({ email: "", password: "" });
        setTimeout(() => {
          navigate("/");
        }, 300);
      } else {
        toast.error(message || "Invalid credentials");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to connect to backend");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
      }}
    >
      {/* Top right theme toggle */}
      <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", zIndex: 10 }}>
        <button
          type="button"
          className="nb-theme-btn"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div
        className="glass-panel animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-md)",
              background: "var(--primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.85rem",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <FileText size={20} />
          </div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>
            Welcome to Notify
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Sign in to access your notes & workspace
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                id="email"
                name="email"
                className="input-modern"
                style={{ paddingLeft: "2.3rem" }}
                placeholder="name@example.com"
                value={email}
                autoComplete="email"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                className="input-modern"
                style={{ paddingLeft: "2.3rem", paddingRight: "2.3rem" }}
                placeholder="••••••••"
                value={password}
                required
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-brand-primary"
            style={{ width: "100%", padding: "0.6rem", fontSize: "0.9rem" }}
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--surface-border)" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600, color: "var(--primary)" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
