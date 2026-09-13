import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api.js";
import Loader from "../components/Loader";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Navigation from "../components/Navbar";
import { useCategory } from "../context/CategoryContext";
import { ArrowLeft, Plus } from "lucide-react";
import "../styles/Category.css";

export default function Category() {
  const { category: catParam } = useParams();
  const { getMeta } = useCategory();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(
        `/api/notes/category/${encodeURIComponent(catParam)}`
      );
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Failed to fetch category notes:", error);
    } finally {
      setLoading(false);
    }
  }, [catParam]);

  useEffect(() => {
    document.title = catParam ? `${catParam} Notes | Notify` : "Category Notes | Notify";
    fetchCategoryNotes();
  }, [catParam, fetchCategoryNotes]);

  const handleNoteUpdated = useCallback((updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  }, []);

  const meta = getMeta(catParam);

  if (loading && notes.length === 0) {
    return (
      <>
        <Navigation />
        <Loader message={`Loading ${catParam} notes...`} />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="container-fluid" style={{ maxWidth: "1240px", padding: "1.25rem 1.25rem 3.5rem" }}>
        {/* Category Hero Card */}
        <section
          className="category-hero-card animate-fade-in"
          style={{
            borderColor: meta.border,
          }}
        >
          <div className="category-hero-content">
            <div className="category-hero-left">
              <div
                className="category-hero-icon"
                style={{
                  background: meta.bg,
                  borderColor: meta.border,
                }}
              >
                {meta.icon}
              </div>

              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: meta.color,
                    }}
                  >
                    Category Hub
                  </span>
                  <span style={{ color: "var(--text-subtle)" }}>•</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    {notes.length} {notes.length === 1 ? "note" : "notes"}
                  </span>
                </div>

                <h1 className="category-hero-title">{catParam}</h1>
                <p className="category-hero-desc">{meta.desc}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                className="btn-brand-secondary"
                onClick={() => navigate(-1)}
                style={{ padding: "0.45rem 0.9rem" }}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <Link
                to="/createNote"
                className="btn-brand-primary"
                style={{ padding: "0.45rem 1rem" }}
              >
                <Plus size={15} />
                <span>New {catParam} Note</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <EmptyState
            emoji={meta.icon}
            title={`No notes in ${catParam} yet`}
            subtitle={`Create your first note for ${catParam}.`}
            actionText={`Add ${catParam} Note`}
            actionLink="/createNote"
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
