import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";
import Swal from "sweetalert2";
import SearchBar from "./SearchBar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCategory } from "../context/CategoryContext";
import {
  LayoutGrid,
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
  Tag,
  User,
  Sparkles,
} from "lucide-react";

export default function Navigation({ onSearch, initialSearch = "" }) {
  const { user, isLoggedIn, logout } = useAuth();
  const { categories, getMeta, openCreateModal } = useCategory();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
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
    : "U";

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

  // Close popups on click outside
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
    <>
      {/* =========================================================================
          1. Desktop Floating Left Dock Navigation Rail (as seen in image)
          ========================================================================= */}
      <aside className="dock-nav-rail d-none d-md-flex" aria-label="Main Navigation">
        {/* Brand Logo Wing Badge */}
        <Link to="/" className="dock-brand-badge" title="Notify Home">
          <div className="dock-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-4.5 0-8 3.5-8 8 0 4 3 6.5 7 9.5.5.4 1.5.4 2 0 4-3 7-5.5 7-9.5 0-4.5-3.5-8-8-8z" />
              <path d="M12 7v6" />
              <path d="M9 10l3 3 3-3" />
            </svg>
          </div>
        </Link>

        {/* Middle Navigation Action Icons Stack */}
        <div className="dock-nav-stack">
          {/* Dashboard / All Notes */}
          <Link
            to="/"
            className={`dock-nav-item ${isActive("/") ? "active" : ""}`}
            data-tooltip="All Notes"
            aria-label="All Notes"
          >
            <LayoutGrid size={20} />
          </Link>

          {/* Create Note */}
          <Link
            to="/createNote"
            className={`dock-nav-item ${isActive("/createNote") || isActive("/create-note") ? "active" : ""}`}
            data-tooltip="Create Note"
            aria-label="Create Note"
          >
            <Plus size={21} />
          </Link>

          {/* Pinned Notes */}
          <Link
            to="/get_all_pinned_notes"
            className={`dock-nav-item ${isActive("/get_all_pinned_notes") ? "active" : ""}`}
            data-tooltip="Pinned Notes"
            aria-label="Pinned Notes"
          >
            <Pin size={20} />
          </Link>

          {/* Archived Notes */}
          <Link
            to="/get_all_archived_notes"
            className={`dock-nav-item ${isActive("/get_all_archived_notes") ? "active" : ""}`}
            data-tooltip="Archived Notes"
            aria-label="Archived Notes"
          >
            <Archive size={20} />
          </Link>

          {/* Categories Popover Trigger */}
          <div className="dock-item-wrapper" ref={catRef}>
            <button
              type="button"
              className={`dock-nav-item ${categoryOpen ? "active" : ""}`}
              onClick={() => setCategoryOpen((v) => !v)}
              data-tooltip="Categories"
              aria-label="Categories"
            >
              <Layers size={20} />
            </button>

            {categoryOpen && (
              <div className="dock-flyout-menu animate-fade-in">
                <div className="dock-flyout-header">
                  <span>Categories</span>
                  <button
                    type="button"
                    className="dock-flyout-add-btn"
                    onClick={() => {
                      setCategoryOpen(false);
                      openCreateModal();
                    }}
                    title="Add category"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="dock-flyout-list">
                  {categories.map((catName) => {
                    const meta = getMeta(catName);
                    return (
                      <Link
                        key={catName}
                        to={`/category/${encodeURIComponent(catName)}`}
                        className="dock-flyout-item"
                        onClick={() => setCategoryOpen(false)}
                      >
                        <span className="dock-flyout-emoji">{meta.icon}</span>
                        <span className="dock-flyout-label">{catName}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            className="dock-nav-item dock-theme-btn"
            onClick={toggleTheme}
            data-tooltip={isDark ? "Light Mode" : "Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={20} color="var(--accent-amber)" /> : <Moon size={20} color="var(--accent-sky)" />}
          </button>
        </div>

        {/* Bottom User Avatar / Profile Menu */}
        <div className="dock-bottom-stack" ref={menuRef}>
          {isLoggedIn && user ? (
            <div className="dock-user-wrapper">
              <button
                type="button"
                className="dock-avatar-btn"
                onClick={() => setUserMenuOpen((v) => !v)}
                data-tooltip={user.name}
                aria-label="User Profile Menu"
              >
                <div className="dock-avatar-circle">{initials}</div>
                <span className="dock-avatar-online-dot"></span>
              </button>

              {userMenuOpen && (
                <div className="dock-user-flyout animate-fade-in">
                  <div className="dock-user-flyout-header">
                    <div className="dock-avatar-circle" style={{ width: 34, height: 34 }}>{initials}</div>
                    <div className="dock-user-info">
                      <div className="dock-user-name">{user.name}</div>
                      <div className="dock-user-email">{user.email || "Active Member"}</div>
                    </div>
                  </div>
                  <div className="dock-flyout-divider"></div>
                  <button
                    type="button"
                    className="dock-flyout-action-btn danger"
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
            <button
              type="button"
              className="dock-nav-item"
              onClick={() => navigate("/login")}
              data-tooltip="Sign In"
              aria-label="Sign In"
            >
              <User size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* =========================================================================
          2. Mobile Responsive Top Navigation Bar (< 768px)
          ========================================================================= */}
      <header className="mobile-top-bar d-md-none">
        <Link to="/" className="mobile-brand-link">
          <div className="dock-logo-icon" style={{ width: 34, height: 34 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-4.5 0-8 3.5-8 8 0 4 3 6.5 7 9.5.5.4 1.5.4 2 0 4-3 7-5.5 7-9.5 0-4.5-3.5-8-8-8z" />
              <path d="M12 7v6" />
              <path d="M9 10l3 3 3-3" />
            </svg>
          </div>
          <span className="mobile-brand-title">Notify</span>
        </Link>

        <div className="mobile-actions-right">
          <button
            type="button"
            className="mobile-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} color="var(--accent-amber)" /> : <Moon size={18} color="var(--primary-bright)" />}
          </button>

          <Link to="/createNote" className="mobile-new-btn">
            <Plus size={16} />
          </Link>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open Navigation Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="mobile-drawer-overlay animate-fade-in">
            <div className="mobile-drawer-content">
              <div className="mobile-drawer-search">
                <SearchBar onSearch={onSearch} initialValue={initialSearch} />
              </div>

              <div className="mobile-nav-list">
                <Link to="/" className={`mobile-nav-item ${isActive("/") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                  <LayoutGrid size={18} />
                  <span>All Notes</span>
                </Link>
                <Link to="/createNote" className={`mobile-nav-item ${isActive("/createNote") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                  <Plus size={18} />
                  <span>Create Note</span>
                </Link>
                <Link to="/get_all_pinned_notes" className={`mobile-nav-item ${isActive("/get_all_pinned_notes") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                  <Pin size={18} />
                  <span>Pinned Notes</span>
                </Link>
                <Link to="/get_all_archived_notes" className={`mobile-nav-item ${isActive("/get_all_archived_notes") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                  <Archive size={18} />
                  <span>Archived Notes</span>
                </Link>

                <div className="mobile-category-header">
                  <span>Categories</span>
                  <button
                    type="button"
                    className="mobile-cat-add"
                    onClick={() => {
                      setMobileOpen(false);
                      openCreateModal();
                    }}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <div className="mobile-category-tags">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to={`/category/${encodeURIComponent(c)}`}
                      className="badge-pill cat-badge-other"
                      onClick={() => setMobileOpen(false)}
                    >
                      {c}
                    </Link>
                  ))}
                </div>

                <div className="mobile-drawer-bottom">
                  {isLoggedIn && user ? (
                    <div className="mobile-user-row">
                      <div className="dock-avatar-circle" style={{ width: 32, height: 32 }}>{initials}</div>
                      <span className="mobile-user-name">{user.name}</span>
                      <button
                        type="button"
                        className="mobile-logout-btn"
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-brand-primary w-100"
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/login");
                      }}
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
