import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { ArrowLeft, Plus } from "lucide-react";

export default function Archive() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/notes/archived");
        setNotes(response.data || []);
      } catch (error) {
        console.error("Failed to load archived notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <Loader message="Loading archive..." />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="container-fluid" style={{ maxWidth: "1280px", padding: "1.5rem 1.25rem 4rem" }}>
        {/* Archive Hero Header */}
        <section
          className="glass-panel animate-fade-in"
          style={{
            padding: "2.2rem 2.2rem",
            marginBottom: "2rem",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", position: "relative", zIndex: 2 }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              📦
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-amber)", textTransform: "uppercase" }}>
                  Archived Storage
                </span>
                <span style={{ color: "var(--text-subtle)" }}>•</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {notes.length} {notes.length === 1 ? "archived note" : "archived notes"}
                </span>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                Archived Notes
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative", zIndex: 2 }}>
            <button className="btn-brand-secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <Link to="/createNote" className="btn-brand-primary">
              <Plus size={16} />
              <span>Create Note</span>
            </Link>
          </div>
        </section>

        {/* Note Grid */}
        {notes.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="Archive is currently empty"
            subtitle="Notes you archive for later reference will be safely preserved here."
            actionText="Go to Workspace"
            actionLink="/"
          />
        ) : (
          <div className="row g-3 g-md-4">
            {notes.map((note) => (
              <div className="col-12 col-md-6 col-lg-4" key={note._id}>
                <NoteCard note={note} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
