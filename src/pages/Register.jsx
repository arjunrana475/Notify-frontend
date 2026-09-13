import React, { useState, useEffect } from "react";
import API from "../services/api.js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FileText, User, Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
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
      toast.success(response.data.message || "Registration successful");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
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
          maxWidth: "420px",
          padding: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
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
            Create an Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Start capturing, categorizing, and organizing notes
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Full Name
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <User
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                id="name"
                name="name"
                className="input-modern"
                style={{ paddingLeft: "2.3rem" }}
                placeholder="e.g. Alex Morgan"
                value={name}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
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
          <div style={{ marginBottom: "1rem" }}>
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
                autoComplete="new-password"
                className="input-modern"
                style={{ paddingLeft: "2.3rem", paddingRight: "2.3rem" }}
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

          {/* Confirm Password */}
          <div style={{ marginBottom: "1.4rem" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Confirm Password
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
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                className="input-modern"
                style={{ paddingLeft: "2.3rem" }}
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
            style={{ width: "100%", padding: "0.6rem", fontSize: "0.9rem" }}
            disabled={loading}
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: "center", marginTop: "1.35rem", paddingTop: "1rem", borderTop: "1px solid var(--surface-border)" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 600, color: "var(--primary)" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
