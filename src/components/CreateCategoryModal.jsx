import React, { useState, useEffect, useRef } from "react";
import { X, FolderPlus, Plus, Check } from "lucide-react";
import { useCategory } from "../context/CategoryContext";

const PRESET_ICONS = [
  "⚡", "🚀", "💛", "⚛️", "🍃", "🌐", "🗄️", "🎨",
  "🎓", "🤖", "🧠", "💻", "🎯", "📚", "💡", "🛡️",
  "⚙️", "📊", "🌍", "🧪", "📝", "🔥", "🏆", "💎",
  "✨", "📌", "💼", "🔒", "🎵", "☁️", "📱", "🎮"
];

const PRESET_COLORS = [
  { name: "Blue", hex: "#3b82f6" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Orange", hex: "#f97316" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Slate", hex: "#64748b" },
];

export default function CreateCategoryModal() {
  const { isModalOpen, closeCreateModal, addCategory } = useCategory();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⚡");
  const [color, setColor] = useState("#3b82f6");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setIcon("⚡");
      setColor("#3b82f6");
      setDesc("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeCreateModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeCreateModal]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await addCategory({
      name: name.trim(),
      icon,
      color,
      desc: desc.trim(),
    });
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "fadeIn 0.15s ease-out",
      }}
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          closeCreateModal();
        }
      }}
    >
      <div
        ref={modalRef}
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "1.75rem",
          position: "relative",
          boxShadow: "var(--shadow-xl)",
          animation: "slideDown 0.15s ease-out",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            paddingBottom: "0.85rem",
            borderBottom: "1px solid var(--surface-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-subtle)",
                border: "1px solid var(--primary-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
              }}
            >
              <FolderPlus size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>Create Category</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Organize notes into custom knowledge topics
              </p>
            </div>
          </div>

          <button
            type="button"
            className="search-clear-btn"
            onClick={closeCreateModal}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Preview Card */}
        <div
          style={{
            padding: "0.85rem 1rem",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-subtle)",
            border: "1px solid var(--surface-border)",
            marginBottom: "1.25rem",
          }}
        >
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
            Preview
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "var(--radius-sm)",
                background: `${color}18`,
                border: `1px solid ${color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
              }}
            >
              {icon}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                className="badge-pill"
                style={{
                  background: `${color}18`,
                  color: color,
                  border: `1px solid ${color}44`,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.65rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>{icon}</span>
                <span>{name.trim() || "Category Name"}</span>
              </div>
              {desc && (
                <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", margin: "0.25rem 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {desc}
                </p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              htmlFor="cat-name-input"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Category Name <span style={{ color: "var(--accent-rose)" }}>*</span>
            </label>
            <input
              id="cat-name-input"
              ref={inputRef}
              type="text"
              className="input-modern"
              placeholder="e.g. System Design, DevOps, AI, Personal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              required
            />
          </div>

          {/* Icon / Emoji Picker */}
          <div style={{ marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <label
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Select Icon
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value || "📁")}
                maxLength={4}
                style={{
                  width: "42px",
                  textAlign: "center",
                  padding: "2px",
                  borderRadius: "4px",
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface)",
                  fontSize: "0.95rem",
                }}
                title="Type custom emoji"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "0.3rem",
                maxHeight: "105px",
                overflowY: "auto",
                padding: "4px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--surface-border)",
                background: "var(--surface-subtle)",
              }}
            >
              {PRESET_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  style={{
                    background: icon === emoji ? "var(--surface-hover)" : "transparent",
                    border: `1px solid ${icon === emoji ? "var(--primary-border)" : "transparent"}`,
                    borderRadius: "4px",
                    padding: "3px",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Picker */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Accent Color
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: c.hex,
                    border: `2px solid ${color === c.hex ? "var(--surface)" : "transparent"}`,
                    boxShadow: color === c.hex ? `0 0 0 2px ${c.hex}` : "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    transition: "transform 0.12s ease",
                    transform: color === c.hex ? "scale(1.1)" : "scale(1)",
                  }}
                  title={c.name}
                >
                  {color === c.hex && <Check size={13} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="cat-desc-input"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Description <span style={{ color: "var(--text-subtle)", fontWeight: 400 }}>(Optional)</span>
            </label>
            <input
              id="cat-desc-input"
              type="text"
              className="input-modern"
              placeholder="e.g. Distributed architectures, scalability & interview notes"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
            <button
              type="button"
              className="btn-brand-secondary"
              onClick={closeCreateModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-brand-primary"
              disabled={loading || !name.trim()}
            >
              <Plus size={15} />
              <span>{loading ? "Creating..." : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
