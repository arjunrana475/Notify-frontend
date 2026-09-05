import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";
import { toast } from "react-toastify";
import Navigation from "../components/Navbar";
import { category, getCategoryMeta } from "../constants/category.js";
import {
  FilePlus,
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
} from "lucide-react";
import "../styles/CreateNote.css";

export default function CreateNote() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "preview"

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("DSA");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["DSA"]);
  const [link, setLink] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

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
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      return toast.error("Please provide a note title");
    }
    if (!content.trim()) {
      return toast.error("Please add note content");
    }

    // Include any trailing text in tagInput as a tag
    let finalTags = [...tags];
    if (tagInput.trim() && !finalTags.includes(tagInput.trim())) {
      finalTags.push(tagInput.trim());
    }

    try {
      setLoading(true);
      const notePayload = {
        title,
        content,
        category: selectedCategory,
        topics: finalTags,
        link,
        isPinned,
        isArchived,
      };

      const response = await API.post("/api/notes/", notePayload);

      toast.success(response.data?.message || "Note created successfully! 🚀");
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || "Failed to create note");
      } else {
        toast.error("Failed to connect to backend server");
      }
    } finally {
      setLoading(false);
    }
  };

  const catMeta = getCategoryMeta(selectedCategory);

  return (
    <>
      <Navigation />

      <main className="editor-container" onKeyDown={handleKeyDown}>
        <div className="editor-card animate-fade-in">
          {/* Header */}
          <div className="editor-header">
            <div className="editor-header-title">
              <div className="editor-header-icon">
                <FilePlus size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.45rem", margin: 0, color: "var(--text-main)" }}>Create New Note</h1>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                  Capture knowledge, code snippets, or ideas.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div
              style={{
                display: "flex",
                background: "var(--surface-hover)",
                padding: "3px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--surface-border)",
              }}
            >
              <button
                type="button"
                className="btn-brand-ghost"
                onClick={() => setActiveTab("edit")}
                style={{
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.82rem",
                  background: activeTab === "edit" ? "var(--surface)" : "transparent",
                  color: activeTab === "edit" ? "var(--primary-light)" : "var(--text-muted)",
                  boxShadow: activeTab === "edit" ? "var(--shadow-xs)" : "none",
                }}
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="btn-brand-ghost"
                onClick={() => setActiveTab("preview")}
                style={{
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.82rem",
                  background: activeTab === "preview" ? "var(--surface)" : "transparent",
                  color: activeTab === "preview" ? "var(--primary-light)" : "var(--text-muted)",
                  boxShadow: activeTab === "preview" ? "var(--shadow-xs)" : "none",
                }}
              >
                <Eye size={14} />
                <span>Live Preview</span>
              </button>
            </div>
          </div>

          {activeTab === "edit" ? (
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="title">
                  Note Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className="input-modern"
                  placeholder="e.g. Master Theorem & Dynamic Programming Paradigms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category Picker */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <Layers size={15} />
                  Select Category *
                </label>
                <div className="category-picker-grid">
                  {category.map((cat) => {
                    const meta = getCategoryMeta(cat);
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
                </div>
              </div>

              {/* Topics / Tag Chips */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <Tag size={15} />
                  Topics & Tags (press Enter or comma to add)
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
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="tag-inline-input"
                    placeholder={tags.length === 0 ? "Type tag & hit Enter..." : "Add more tags..."}
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
                  <LinkIcon size={15} />
                  Resource / Chat URL (Optional)
                </label>
                <input
                  id="link"
                  type="url"
                  className="input-modern"
                  placeholder="https://chatgpt.com/... or documentation link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {/* Content Body */}
              <div className="form-group-modern">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label className="form-label-modern" htmlFor="content" style={{ margin: 0 }}>
                    Note Content *
                  </label>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
                    {content.length} characters
                  </span>
                </div>
                <textarea
                  id="content"
                  className="textarea-modern"
                  placeholder="Write your thoughts, code snippets, notes, or copy-paste ideas..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="8"
                  required
                />
              </div>

              {/* Pin & Archive Toggles */}
              <div className="row g-3 form-group-modern">
                <div className="col-12 col-md-6">
                  <div
                    className={`switch-control-card ${isPinned ? "active" : ""}`}
                    onClick={() => setIsPinned(!isPinned)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <Pin size={18} color={isPinned ? "var(--primary-light)" : "var(--text-muted)"} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>Pin Note</div>
                        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          Keep this note at the top of your dashboard
                        </div>
                      </div>
                    </div>
                    <div className="switch-indicator-circle">
                      {isPinned && <Check size={14} />}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div
                    className={`switch-control-card ${isArchived ? "active" : ""}`}
                    onClick={() => setIsArchived(!isArchived)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <Archive size={18} color={isArchived ? "var(--accent-amber)" : "var(--text-muted)"} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>Archive Note</div>
                        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          Store away from main view
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
                      {isArchived && <Check size={14} />}
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
                  <ArrowLeft size={16} />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  className="btn-brand-primary"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Save Note (Ctrl+Enter)"}
                </button>
              </div>
            </form>
          ) : (
            /* Live Preview Mode */
            <div style={{ padding: "0.5rem 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <span className={`badge-pill ${catMeta.colorClass}`}>
                  {catMeta.icon} {selectedCategory}
                </span>
                {isPinned && <span className="badge-pill cat-badge-dsa">📌 Pinned</span>}
                {isArchived && <span className="badge-pill cat-badge-javascript">📦 Archived</span>}
              </div>

              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.75rem" }}>
                {title || "Untitled Note"}
              </h2>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                {tags.map((t) => (
                  <span key={t} className="topic-chip">
                    #{t}
                  </span>
                ))}
              </div>

              <div
                style={{
                  background: "var(--surface-hover)",
                  padding: "1.5rem",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  color: "var(--text-main)",
                  border: "1px solid var(--surface-border)",
                  marginBottom: "1.5rem",
                }}
              >
                {content || "No content entered yet..."}
              </div>

              {link && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-brand-secondary"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <LinkIcon size={14} />
                    <span>Attached Link: {link}</span>
                  </a>
                </div>
              )}

              <div className="editor-actions-row">
                <button
                  type="button"
                  className="btn-brand-secondary"
                  onClick={() => setActiveTab("edit")}
                >
                  <Edit3 size={15} />
                  <span>Back to Edit</span>
                </button>
                <button
                  type="button"
                  className="btn-brand-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Note"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
