import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { ArrowLeft, Plus } from "lucide-react";

export default function Pinned() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/notes/pinned");
        setNotes(response.data || []);
      } catch (error) {
        console.error("Failed to load pinned notes:", error);
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
        <Loader message="Loading pinned notes..." />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="container-fluid" style={{ maxWidth: "1280px", padding: "1.5rem 1.25rem 4rem" }}>
        {/* Pinned Hero Header */}
        <section
          className="glass-panel animate-fade-in"
          style={{
            padding: "2.2rem 2.2rem",
            marginBottom: "2rem",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient Orb */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", position: "relative", zIndex: 2 }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-lg)",
                background: "var(--primary-subtle)",
                border: "1px solid var(--primary-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-light)",
                fontSize: "1.8rem",
              }}
            >
              📌
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-light)", textTransform: "uppercase" }}>
                  Important Notes
                </span>
                <span style={{ color: "var(--text-subtle)" }}>•</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {notes.length} {notes.length === 1 ? "pinned note" : "pinned notes"}
                </span>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                Pinned Notes
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
            emoji="📌"
            title="No pinned notes yet"
            subtitle="Pin important notes to quickly access them at the top of your workspace."
            actionText="Browse All Notes"
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
