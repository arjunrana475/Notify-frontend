import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";
import Swal from "sweetalert2";
import SearchBar from "./SearchBar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCategory } from "../context/CategoryContext";
import {
  FileText,
  Pin,
  Archive,
  Plus,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

const Navigation = ({ onSearch, initialSearch = "" }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const { categories, getMeta, openCreateModal } = useCategory();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const menuRef = useRef(null);
  const catRef = useRef(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sign Out?",
      text: "You can sign back in anytime to access your notes.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--text-muted)",
      confirmButtonText: "Sign Out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await logout();

      await Swal.fire({
        icon: "success",
        title: "Signed Out",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Please try again.",
      });
    }
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-notify-wrapper">
      <div className="navbar-notify-glass">
        {/* Brand Logo */}
        <Link to="/" className="nb-brand" onClick={() => setIsOpen(false)}>
          <div className="nb-logo-icon-box">
            <FileText size={18} />
          </div>
          <div className="nb-brand-text">
            <span className="nb-wordmark">Notify</span>
            <span className="nb-tagline">Knowledge Hub</span>
          </div>
        </Link>

        {/* Global Search Bar Center */}
        <div className="nb-search-center">
          <SearchBar onSearch={onSearch} initialValue={initialSearch} />
        </div>

        {/* Desktop Nav Items */}
        <div className="nb-nav-actions nb-desktop-nav">
          {/* Category Dropdown */}
          <div className="nb-cat-dropdown-container" ref={catRef}>
            <button
              className="nb-cat-trigger"
              type="button"
              onClick={() => setCategoryOpen((prev) => !prev)}
              aria-expanded={categoryOpen}
            >
              <Layers size={15} color="var(--text-muted)" />
              <span>Categories</span>
              <ChevronDown
                size={13}
                style={{
                  transform: categoryOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s ease",
                }}
              />
            </button>

            {categoryOpen && (
              <div className="nb-cat-menu-card">
                {categories.map((catName) => {
                  const meta = getMeta(catName);
                  return (
                    <Link
                      key={catName}
                      className="nb-cat-menu-item"
                      to={`/category/${encodeURIComponent(catName)}`}
                      onClick={() => setCategoryOpen(false)}
                    >
                      <div className="nb-cat-item-left">
                        <span className="nb-cat-emoji">{meta.icon}</span>
                        <span>{catName}</span>
                      </div>
                    </Link>
                  );
                })}

                <button
                  type="button"
                  className="nb-cat-menu-item"
                  style={{
                    color: "var(--primary)",
                    fontWeight: 600,
                    borderTop: "1px solid var(--surface-border)",
                    marginTop: "0.2rem",
                    paddingTop: "0.5rem",
                    background: "none",
                    border: "none",
                    width: "100%",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onClick={() => {
                    setCategoryOpen(false);
                    openCreateModal();
                  }}
                >
                  <div className="nb-cat-item-left">
                    <Plus size={14} color="var(--primary)" />
                    <span>New Category</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <Link
            to="/get_all_pinned_notes"
            className={`nb-nav-link ${isActive("/get_all_pinned_notes") ? "active" : ""}`}
          >
            <Pin size={14} />
            <span>Pinned</span>
          </Link>

          <Link
            to="/get_all_archived_notes"
            className={`nb-nav-link ${isActive("/get_all_archived_notes") ? "active" : ""}`}
          >
            <Archive size={14} />
            <span>Archive</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="nb-theme-btn"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* New Note CTA */}
          <Link to="/createNote" className="btn-brand-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}>
            <Plus size={15} />
            <span>New Note</span>
          </Link>

          {/* User Profile / Auth */}
          {isLoggedIn && user ? (
            <div className="nb-user-container" ref={menuRef}>
              <button
                className="nb-avatar-button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div className="nb-avatar-circle">{initials}</div>
                <span className="nb-user-name">{user.name.split(" ")[0]}</span>
                <ChevronDown size={12} color="var(--text-muted)" />
              </button>

              {userMenuOpen && (
                <div className="nb-user-dropdown">
                  <div className="nb-user-dropdown-header">
                    <div className="nb-avatar-circle" style={{ width: 32, height: 32 }}>
                      {initials}
                    </div>
                    <div className="nb-user-dropdown-info">
                      <span className="nb-dropdown-title">{user.name}</span>
                      <span className="nb-dropdown-sub">{user.email || "Active User"}</span>
                    </div>
                  </div>

                  <button
                    className="nb-dropdown-item nb-dropdown-danger"
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                className="btn-brand-secondary"
                style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                className="btn-brand-primary"
                style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Actions (Theme + Menu) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button
            type="button"
            className="nb-theme-btn"
            style={{ display: "flex" }}
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="nb-mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="glass-panel nb-mobile-drawer open">
          <div style={{ marginBottom: "0.5rem" }}>
            <SearchBar onSearch={onSearch} initialValue={initialSearch} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <Link
              to="/createNote"
              className="btn-brand-primary"
              style={{ width: "100%", justifyContent: "center", marginBottom: "0.3rem" }}
              onClick={() => setIsOpen(false)}
            >
              <Plus size={15} />
              <span>Create Note</span>
            </Link>

            <Link
              to="/"
              className={`nb-nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <FileText size={15} />
              <span>All Notes</span>
            </Link>

            <Link
              to="/get_all_pinned_notes"
              className={`nb-nav-link ${isActive("/get_all_pinned_notes") ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <Pin size={15} />
              <span>Pinned Notes</span>
            </Link>

            <Link
              to="/get_all_archived_notes"
              className={`nb-nav-link ${isActive("/get_all_archived_notes") ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <Archive size={15} />
              <span>Archived Notes</span>
            </Link>

            <div style={{ padding: "0.5rem 0", borderTop: "1px solid var(--surface-border)" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Categories
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.4rem" }}>
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={`/category/${encodeURIComponent(c)}`}
                    className="badge-pill cat-badge-other"
                    onClick={() => setIsOpen(false)}
                    style={{ fontSize: "0.76rem", padding: "0.25rem 0.55rem" }}
                  >
                    {c}
                  </Link>
                ))}
                <button
                  type="button"
                  className="badge-pill"
                  style={{
                    fontSize: "0.76rem",
                    padding: "0.25rem 0.55rem",
                    borderStyle: "dashed",
                    borderColor: "var(--surface-border-strong)",
                    color: "var(--text-main)",
                    background: "var(--surface)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                  onClick={() => {
                    setIsOpen(false);
                    openCreateModal();
                  }}
                >
                  <Plus size={12} />
                  <span>New Category</span>
                </button>
              </div>
            </div>

            <div style={{ paddingTop: "0.5rem", borderTop: "1px solid var(--surface-border)" }}>
              {isLoggedIn && user ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div className="nb-avatar-circle" style={{ width: 28, height: 28 }}>
                      {initials}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{user.name}</span>
                  </div>
                  <button
                    className="btn-brand-ghost nb-dropdown-danger"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    className="btn-brand-secondary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/login");
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    className="btn-brand-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/register");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
