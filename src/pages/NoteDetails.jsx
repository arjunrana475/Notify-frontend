import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { getCategoryMeta } from "../constants/category.js";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  Edit,
  Trash2,
  Pin,
  Archive,
  ExternalLink,
  Share2,
} from "lucide-react";
import "../styles/NoteDetails.css";

export default function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryCount, setCategoryCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/notes/${id}`);
        setNote(response.data);

        // Fetch category count
        if (response.data?.category) {
          const categoryResponse = await API.get(
            `/api/notes/category/${encodeURIComponent(
              response.data.category
            )}/count`
          );
          setCategoryCount(categoryResponse.data.count);
        }
      } catch (error) {
        Swal.fire({
          title: "Note Not Found",
          text: error.response?.data?.message || "Unable to load note",
          icon: "error",
        }).then(() => {
          navigate("/");
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleCopy = () => {
    if (!note?.content) return;
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePin = async () => {
    if (!note) return;
    const isPinning = !note.isPinned;
    setNote((prev) => ({ ...prev, isPinned: isPinning }));

    try {
      const response = await API.patch(`/api/notes/${id}/pin`);
      if (response.data.note) setNote(response.data.note);

      Swal.fire({
        icon: "success",
        title: isPinning ? "Note Pinned 📌" : "Note Unpinned",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    } catch {
      setNote((prev) => ({ ...prev, isPinned: !isPinning }));
    }
  };

  const handleArchive = async () => {
    if (!note) return;
    const isArchiving = !note.isArchived;
    setNote((prev) => ({ ...prev, isArchived: isArchiving }));

    try {
      const response = await API.patch(`/api/notes/${id}/archive`);
      if (response.data.note) setNote(response.data.note);

      Swal.fire({
        icon: "success",
        title: isArchiving ? "Note Archived 📦" : "Note Restored",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    } catch {
      setNote((prev) => ({ ...prev, isArchived: !isArchiving }));
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Note?",
      text: "This action is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/api/notes/${id}`);

      await Swal.fire({
        icon: "success",
        title: "Note Deleted",
        text: "The note has been removed.",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Failed to delete note",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <Loader message="Loading note details..." />
      </>
    );
  }

  if (!note) return null;

  const catMeta = getCategoryMeta(note.category);
  const authorName = note.user?.name || "Anonymous";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const wordCount = note.content ? note.content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <Navigation />

      <main className="note-details-container animate-fade-in">
        <div className="note-details-card">
          {/* Top Bar: Back & Actions */}
          <div className="details-top-bar">
            <button
              className="btn-brand-ghost"
              onClick={() => navigate(-1)}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.88rem" }}
            >
              <ArrowLeft size={16} />
              <span>Back to notes</span>
            </button>

            <div className="details-action-group">
              <button
                type="button"
                className="btn-brand-ghost"
                onClick={handlePin}
                style={{
                  background: note.isPinned ? "var(--primary-subtle)" : "transparent",
                  color: note.isPinned ? "var(--primary-light)" : "var(--text-muted)",
                }}
                title={note.isPinned ? "Unpin note" : "Pin note"}
              >
                <Pin size={16} fill={note.isPinned ? "currentColor" : "none"} />
                <span>{note.isPinned ? "Pinned" : "Pin"}</span>
              </button>

              <button
                type="button"
                className="btn-brand-ghost"
                onClick={handleArchive}
                style={{
                  background: note.isArchived ? "rgba(245, 158, 11, 0.15)" : "transparent",
                  color: note.isArchived ? "var(--accent-amber)" : "var(--text-muted)",
                }}
                title={note.isArchived ? "Unarchive note" : "Archive note"}
              >
                <Archive size={16} fill={note.isArchived ? "currentColor" : "none"} />
                <span>{note.isArchived ? "Archived" : "Archive"}</span>
              </button>

              <button
                type="button"
                className="btn-brand-secondary"
                onClick={() => navigate(`/edit-note/${id}`)}
                style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
              >
                <Edit size={15} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                className="btn-brand-ghost nb-dropdown-danger"
                onClick={handleDelete}
                style={{ padding: "0.45rem 0.8rem", fontSize: "0.85rem" }}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Category Pill */}
          {note.category && (
            <div style={{ marginBottom: "1rem" }}>
              <Link
                to={`/category/${encodeURIComponent(note.category)}`}
                className={`badge-pill ${catMeta.colorClass}`}
                style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }}
              >
                <span>{catMeta.icon}</span>
                <span>{note.category}</span>
                {categoryCount > 0 && (
                  <span
                    style={{
                      background: "rgba(0,0,0,0.08)",
                      padding: "1px 6px",
                      borderRadius: "8px",
                      fontSize: "0.72rem",
                    }}
                  >
                    {categoryCount} notes
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Note Title */}
          <h1 className="details-title">{note.title}</h1>

          {/* Meta Bar */}
          <div className="details-meta-bar">
            <div className="details-author-chip">
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {authorInitials}
              </div>
              <span>{authorName}</span>
            </div>

            <div className="details-meta-item">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>

            <div className="details-meta-item">
              <Clock size={14} />
              <span>~{readTime} min read ({wordCount} words)</span>
            </div>
          </div>

          {/* Topics Chips */}
          {note.topics && note.topics.length > 0 && (
            <div className="details-topics-row">
              {note.topics.map((t, i) => (
                <span key={i} className="topic-chip" style={{ fontSize: "0.82rem", padding: "0.3rem 0.75rem" }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* External Link Card if attached */}
          {note.link && (
            <div className="details-link-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "var(--primary-subtle)",
                    border: "1px solid var(--primary-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary-light)",
                  }}
                >
                  <ExternalLink size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-main)" }}>
                    Attached Resource
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      maxWidth: "420px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {note.link}
                  </div>
                </div>
              </div>

              <a
                href={note.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand-primary"
                style={{ padding: "0.45rem 1rem", fontSize: "0.82rem" }}
              >
                <span>Open Resource</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Note Content Body */}
          <div className="details-content-box">
            <button
              className="details-copy-btn"
              onClick={handleCopy}
              title="Copy note content"
            >
              {copied ? (
                <>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span style={{ color: "var(--accent-emerald)" }}>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            {note.content}
          </div>

          {/* Bottom Footer Row */}
          <div className="details-bottom-bar">
            <button className="btn-brand-secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              <span>Back to Workspace</span>
            </button>

            <button
              className="btn-brand-ghost"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: note.title, text: note.content, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  Swal.fire({ icon: "success", title: "Link Copied!", timer: 1000, showConfirmButton: false, toast: true });
                }
              }}
            >
              <Share2 size={16} />
              <span>Share Note</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
