import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../components/Navbar";
import { Home, Plus, ArrowLeft, Search, Compass, BookOpen } from "lucide-react";
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
          maxWidth: "860px",
          padding: "2rem 1.25rem 5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "75vh",
          position: "relative",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "15%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <div
          className="glass-panel animate-fade-in"
          style={{
            width: "100%",
            padding: "3.5rem 2rem",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              borderRadius: "var(--radius-pill)",
              background: "rgba(244, 63, 94, 0.12)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "var(--accent-rose)",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <Compass size={16} />
            <span>404 Error • Lost in Space</span>
          </div>

          {/* Large 404 Headline */}
          <h1
            style={{
              fontSize: "clamp(3.5rem, 8vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginBottom: "1rem",
              background: "linear-gradient(135deg, var(--primary) 0%, #ec4899 50%, var(--secondary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </h1>

          <h2
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: "0.75rem",
            }}
          >
            Oops! This page took a wrong turn.
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              maxWidth: "520px",
              margin: "0 auto 2.2rem",
              lineHeight: 1.6,
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
              gap: "0.85rem",
              marginBottom: "2.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-brand-secondary"
              style={{ padding: "0.7rem 1.4rem" }}
            >
              <ArrowLeft size={17} />
              <span>Go Back</span>
            </button>

            <Link
              to="/"
              className="btn-brand-primary"
              style={{ padding: "0.7rem 1.4rem" }}
            >
              <Home size={17} />
              <span>Workspace Home</span>
            </Link>

            <Link
              to="/createNote"
              className="btn-brand-secondary"
              style={{ padding: "0.7rem 1.4rem" }}
            >
              <Plus size={17} />
              <span>Create Note</span>
            </Link>
          </div>

          {/* Quick Categories Navigation */}
          <div
            style={{
              paddingTop: "1.75rem",
              borderTop: "1px solid var(--surface-border)",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--text-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.85rem",
              }}
            >
              Or explore popular topics
            </span>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.45rem",
              }}
            >
              {category.slice(0, 6).map((catName) => (
                <Link
                  key={catName}
                  to={`/category/${encodeURIComponent(catName)}`}
                  className="badge-pill cat-badge-other"
                  style={{ fontSize: "0.82rem", padding: "0.35rem 0.75rem" }}
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
