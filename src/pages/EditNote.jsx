import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { useCategory } from "../context/CategoryContext";
import {
  FileEdit,
  Pin,
  Archive,
  Link as LinkIcon,
  Tag,
  Layers,
  Eye,
  Edit3,
  X,
  ArrowLeft,
  Check,
  Plus,
} from "lucide-react";
import "../styles/CreateNote.css";

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, getMeta, openCreateModal } = useCategory();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("DSA");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [link, setLink] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/notes/${id}`);
        const n = response.data;
        document.title = n.title ? `Edit: ${n.title} | Notify` : "Edit Note | Notify";
        setTitle(n.title || "");
        setContent(n.content || "");
        setSelectedCategory(n.category || "DSA");
        setTags(Array.isArray(n.topics) ? n.topics : []);
        setLink(n.link || "");
        setIsPinned(!!n.isPinned);
        setIsArchived(!!n.isArchived);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Unable to fetch note details",
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

  // Tag chip handlers
  const handleAddTag = (tagToAdd) => {
    const clean = tagToAdd.trim().replace(/^#/, "");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Keyboard shortcut Ctrl+Enter to save
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleUpdate(e);
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      return Swal.fire("Warning", "Title cannot be empty", "warning");
    }

    let finalTags = [...tags];
    if (tagInput.trim() && !finalTags.includes(tagInput.trim())) {
      finalTags.push(tagInput.trim());
    }

    setUpdating(true);
    try {
      const payload = {
        title,
        content,
        category: selectedCategory,
        topics: finalTags,
        link,
        isPinned,
        isArchived,
      };

      await API.put(`/api/notes/${id}`, payload);

      await Swal.fire({
        title: "Saved",
        text: "Your changes have been saved.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate(`/note/${id}`);
    } catch (error) {
      Swal.fire({
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update note",
        icon: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const catMeta = getMeta(selectedCategory);

  if (loading) {
    return (
      <>
        <Navigation />
        <Loader message="Loading note editor..." />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="editor-container" onKeyDown={handleKeyDown}>
        <div className="editor-card animate-fade-in">
          {/* Header */}
          <div className="editor-header">
            <div className="editor-header-title">
              <div className="editor-header-icon">
                <FileEdit size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>Edit Note</h1>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                  Modify title, content, category, or tags.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div
              style={{
                display: "flex",
                background: "var(--surface-subtle)",
                padding: "2px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--surface-border)",
              }}
            >
              <button
                type="button"
                className="btn-brand-ghost"
                onClick={() => setActiveTab("edit")}
                style={{
                  padding: "0.3rem 0.7rem",
                  fontSize: "0.8rem",
                  background: activeTab === "edit" ? "var(--surface)" : "transparent",
                  color: activeTab === "edit" ? "var(--primary)" : "var(--text-muted)",
                  boxShadow: activeTab === "edit" ? "var(--shadow-xs)" : "none",
                }}
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="btn-brand-ghost"
                onClick={() => setActiveTab("preview")}
                style={{
                  padding: "0.3rem 0.7rem",
                  fontSize: "0.8rem",
                  background: activeTab === "preview" ? "var(--surface)" : "transparent",
                  color: activeTab === "preview" ? "var(--primary)" : "var(--text-muted)",
                  boxShadow: activeTab === "preview" ? "var(--shadow-xs)" : "none",
                }}
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {activeTab === "edit" ? (
            <form onSubmit={handleUpdate}>
              {/* Title */}
              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="title">
                  Note Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className="input-modern"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category Picker */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <Layers size={14} />
                  Category
                </label>
                <div className="category-picker-grid">
                  {categories.map((cat) => {
                    const meta = getMeta(cat);
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`category-pick-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        <span>{meta.icon}</span>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="category-pick-btn"
                    style={{
                      borderStyle: "dashed",
                      borderColor: "var(--surface-border-strong)",
                      color: "var(--text-muted)",
                    }}
                    onClick={() => openCreateModal((newCatName) => setSelectedCategory(newCatName))}
                    title="Create custom category"
                  >
                    <Plus size={14} />
                    <span>New Category</span>
                  </button>
                </div>
              </div>

              {/* Topics / Tag Chips */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <Tag size={14} />
                  Topics & Tags
                </label>
                <div className="tag-input-container">
                  {tags.map((t) => (
                    <span key={t} className="tag-badge-removable">
                      #{t}
                      <button
                        type="button"
                        className="tag-remove-btn"
                        onClick={() => handleRemoveTag(t)}
                        title="Remove tag"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="tag-inline-input"
                    placeholder="Add tag and hit Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => {
                      if (tagInput.trim()) handleAddTag(tagInput);
                    }}
                  />
                </div>
              </div>

              {/* Link Input */}
              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="link">
                  <LinkIcon size={14} />
                  Attached Link
                </label>
                <input
                  id="link"
                  type="url"
                  className="input-modern"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {/* Content Body */}
              <div className="form-group-modern">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label className="form-label-modern" htmlFor="content" style={{ margin: 0 }}>
                    Note Content *
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                    {content.length} chars
                  </span>
                </div>
                <textarea
                  id="content"
                  className="textarea-modern"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="9"
                  required
                />
              </div>

              {/* Pin & Archive Toggles */}
              <div className="row g-2 form-group-modern">
                <div className="col-12 col-md-6">
                  <div
                    className={`switch-control-card ${isPinned ? "active" : ""}`}
                    onClick={() => setIsPinned(!isPinned)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Pin size={16} color={isPinned ? "var(--primary)" : "var(--text-muted)"} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)" }}>Pin Note</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          Keep this note at top of dashboard
                        </div>
                      </div>
                    </div>
                    <div className="switch-indicator-circle">
                      {isPinned && <Check size={12} />}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div
                    className={`switch-control-card ${isArchived ? "active" : ""}`}
                    onClick={() => setIsArchived(!isArchived)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Archive size={16} color={isArchived ? "var(--accent-amber)" : "var(--text-muted)"} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)" }}>Archive Note</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          Store away from main workspace
                        </div>
                      </div>
                    </div>
                    <div
                      className="switch-indicator-circle"
                      style={{
                        background: isArchived ? "var(--accent-amber)" : "transparent",
                        borderColor: isArchived ? "var(--accent-amber)" : "var(--surface-border-strong)",
                      }}
                    >
                      {isArchived && <Check size={12} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="editor-actions-row">
                <button
                  type="button"
                  className="btn-brand-secondary"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="btn-brand-primary"
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            /* Live Preview Mode */
            <div style={{ padding: "0.25rem 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.85rem" }}>
                <span className={`badge-pill ${catMeta.colorClass}`}>
                  {catMeta.icon} {selectedCategory}
                </span>
                {isPinned && (
                  <span className="badge-pill cat-badge-dsa" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <Pin size={11} /> Pinned
                  </span>
                )}
                {isArchived && (
                  <span className="badge-pill cat-badge-javascript" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <Archive size={11} /> Archived
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.6rem" }}>
                {title || "Untitled Note"}
              </h2>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.25rem" }}>
                {tags.map((t) => (
                  <span key={t} className="topic-chip">
                    #{t}
                  </span>
                ))}
              </div>

              <div
                style={{
                  background: "var(--surface-subtle)",
                  padding: "1.25rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  color: "var(--text-main)",
                  border: "1px solid var(--surface-border)",
                  marginBottom: "1.25rem",
                }}
              >
                {content || "No content..."}
              </div>

              <div className="editor-actions-row">
                <button
                  type="button"
                  className="btn-brand-secondary"
                  onClick={() => setActiveTab("edit")}
                >
                  <Edit3 size={14} />
                  <span>Back to Edit</span>
                </button>
                <button
                  type="button"
                  className="btn-brand-primary"
                  onClick={handleUpdate}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
