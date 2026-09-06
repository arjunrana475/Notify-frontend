import React, { useState, useEffect } from "react";
import API from "../services/api.js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Create Account | Notify";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const response = await API.post("/api/auth/register", {
        name,
        email,
        password,
      });
      toast.success(response.data.message || "Registration successful! 🎉");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 750);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to connect to backend server");
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
      <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 10 }}>
        <button
          type="button"
          className="nb-theme-btn"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
        </button>
      </div>

      {/* Ambient background glows */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          right: "20%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "20%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="glass-panel animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2.5rem 2.2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 20px -3px rgba(99, 102, 241, 0.45)",
            }}
          >
            <Sparkles size={26} />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.3rem" }}>
            Create an Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Start capturing, categorizing, and organizing notes
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Full Name
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <User
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                id="name"
                name="name"
                className="input-modern"
                style={{ paddingLeft: "2.5rem" }}
                placeholder="e.g. Alex Morgan"
                value={name}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                id="email"
                name="email"
                className="input-modern"
                style={{ paddingLeft: "2.5rem" }}
                placeholder="name@example.com"
                value={email}
                autoComplete="email"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="new-password"
                className="input-modern"
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                placeholder="At least 6 characters"
                value={password}
                required
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1.6rem" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                className="input-modern"
                style={{ paddingLeft: "2.5rem" }}
                placeholder="Re-enter password"
                value={confirmPassword}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-brand-primary"
            style={{ width: "100%", padding: "0.75rem", fontSize: "0.95rem" }}
            disabled={loading}
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.2rem", borderTop: "1px solid var(--surface-border)" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 700, color: "var(--primary-light)" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
