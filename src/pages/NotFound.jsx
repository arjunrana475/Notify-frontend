import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../components/Navbar";
import { Home, Plus, ArrowLeft, Compass } from "lucide-react";
import { category } from "../constants/category.js";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Page Not Found | Notify";
  }, []);

  return (
    <>
      <Navigation />

      <main
        className="container-fluid"
        style={{
          maxWidth: "780px",
          padding: "2rem 1.25rem 4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          position: "relative",
        }}
      >
        <div
          className="glass-panel animate-fade-in"
          style={{
            width: "100%",
            padding: "3rem 2rem",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.3rem 0.75rem",
              borderRadius: "var(--radius-xs)",
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.25)",
              color: "var(--accent-rose)",
              fontSize: "0.78rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            <Compass size={14} />
            <span>404 Error • Page Not Found</span>
          </div>

          {/* 404 Headline */}
          <h1
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "0.75rem",
              color: "var(--text-main)",
            }}
          >
            404
          </h1>

          <h2
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              fontWeight: 600,
              color: "var(--text-main)",
              marginBottom: "0.6rem",
            }}
          >
            Page not found
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              maxWidth: "460px",
              margin: "0 auto 1.75rem",
              lineHeight: 1.5,
            }}
          >
            The note, category, or URL you are looking for might have been removed, renamed, or is temporarily unavailable.
          </p>

          {/* Primary Action Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.65rem",
              marginBottom: "2rem",
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-brand-secondary"
              style={{ padding: "0.55rem 1.15rem" }}
            >
              <ArrowLeft size={15} />
              <span>Go Back</span>
            </button>

            <Link
              to="/"
              className="btn-brand-primary"
              style={{ padding: "0.55rem 1.15rem" }}
            >
              <Home size={15} />
              <span>Workspace Home</span>
            </Link>

            <Link
              to="/createNote"
              className="btn-brand-secondary"
              style={{ padding: "0.55rem 1.15rem" }}
            >
              <Plus size={15} />
              <span>Create Note</span>
            </Link>
          </div>

          {/* Quick Categories Navigation */}
          <div
            style={{
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--surface-border)",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "0.76rem",
                fontWeight: 600,
                color: "var(--text-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "0.75rem",
              }}
            >
              Or explore popular topics
            </span>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.35rem",
              }}
            >
              {category.slice(0, 6).map((catName) => (
                <Link
                  key={catName}
                  to={`/category/${encodeURIComponent(catName)}`}
                  className="badge-pill cat-badge-other"
                  style={{ fontSize: "0.78rem", padding: "0.25rem 0.65rem" }}
                >
                  {catName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
