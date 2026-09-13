import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { ArrowLeft, Plus, Pin } from "lucide-react";

export default function Pinned() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPinned = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/notes/pinned");
      setNotes(response.data || []);
    } catch (error) {
      console.error("Failed to load pinned notes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Pinned Notes | Notify";
    fetchPinned();
  }, [fetchPinned]);

  const handleNoteUpdated = useCallback((updatedNote) => {
    setNotes((prevNotes) => {
      if (!updatedNote.isPinned) {
        return prevNotes.filter((n) => n._id !== updatedNote._id);
      }
      return prevNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n));
    });
  }, []);

  if (loading && notes.length === 0) {
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

      <main className="container-fluid" style={{ maxWidth: "1240px", padding: "1.25rem 1.25rem 3.5rem" }}>
        {/* Pinned Header */}
        <section
          className="glass-panel animate-fade-in"
          style={{
            padding: "1.5rem 1.75rem",
            marginBottom: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-subtle)",
                border: "1px solid var(--primary-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
              }}
            >
              <Pin size={20} />
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase" }}>
                  Important Notes
                </span>
                <span style={{ color: "var(--text-subtle)" }}>•</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {notes.length} {notes.length === 1 ? "pinned note" : "pinned notes"}
                </span>
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
                Pinned Notes
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button className="btn-brand-secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <Link to="/createNote" className="btn-brand-primary">
              <Plus size={15} />
              <span>Create Note</span>
            </Link>
          </div>
        </section>

        {/* Note Grid */}
        {notes.length === 0 ? (
          <EmptyState
            icon={<Pin size={22} />}
            title="No pinned notes yet"
            subtitle="Pin important notes to quickly access them at the top of your workspace."
            actionText="Browse All Notes"
            actionLink="/"
          />
        ) : (
          <div className="row g-3">
            {notes.map((note) => (
              <div className="col-12 col-md-6 col-lg-4" key={note._id}>
                <NoteCard note={note} onNoteUpdated={handleNoteUpdated} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
