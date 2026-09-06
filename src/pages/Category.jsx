import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.title = catParam ? `${catParam} Notes | Notify` : "Category Notes | Notify";
    const fetchCategoryNotes = async () => {
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
    };

    fetchCategoryNotes();
  }, [catParam]);

  const meta = getMeta(catParam);

  if (loading) {
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

      <main className="container-fluid" style={{ maxWidth: "1280px", padding: "1.5rem 1.25rem 4rem" }}>
        {/* Category Hero Card */}
        <section
          className="category-hero-card animate-fade-in"
          style={{
            borderColor: meta.border,
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background: meta.color,
              opacity: 0.16,
              filter: "blur(35px)",
              pointerEvents: "none",
            }}
          />

          <div className="category-hero-content">
            <div className="category-hero-left">
              <div
                className="category-hero-icon"
                style={{
                  background: meta.bg,
                  border: `2px solid ${meta.border}`,
                }}
              >
                {meta.icon}
              </div>

              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: meta.color,
                    }}
                  >
                    Category Hub
                  </span>
                  <span style={{ color: "var(--text-subtle)" }}>•</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {notes.length} {notes.length === 1 ? "note" : "notes"}
                  </span>
                </div>

                <h1 className="category-hero-title">{catParam}</h1>
                <p className="category-hero-desc">{meta.desc}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                className="btn-brand-secondary"
                onClick={() => navigate(-1)}
                style={{ padding: "0.6rem 1.1rem" }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <Link
                to="/createNote"
                className="btn-brand-primary"
                style={{ padding: "0.6rem 1.25rem" }}
              >
                <Plus size={16} />
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
            subtitle={`Be the first to create a note or documentation for ${catParam}.`}
            actionText={`Add ${catParam} Note`}
            actionLink="/createNote"
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
