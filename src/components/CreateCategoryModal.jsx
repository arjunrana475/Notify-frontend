import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Plus, Check } from "lucide-react";
import { useCategory } from "../context/CategoryContext";

const PRESET_ICONS = [
  "⚡", "🚀", "💛", "⚛️", "🍃", "🌐", "🗄️", "🎨",
  "🎓", "🤖", "🧠", "💻", "🎯", "📚", "💡", "🛡️",
  "⚙️", "📊", "🌍", "🧪", "📝", "🔥", "🏆", "💎",
  "✨", "📌", "💼", "🔒", "🎵", "☁️", "📱", "🎮"
];

const PRESET_COLORS = [
  { name: "Indigo", hex: "#6366f1" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Orange", hex: "#f97316" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Teal", hex: "#14b8a6" },
];

export default function CreateCategoryModal() {
  const { isModalOpen, closeCreateModal, addCategory } = useCategory();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⚡");
  const [color, setColor] = useState("#6366f1");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setIcon("⚡");
      setColor("#6366f1");
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
    const result = await addCategory({
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
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
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
          maxWidth: "500px",
          padding: "2rem",
          position: "relative",
          boxShadow: "var(--shadow-xl)",
          animation: "slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
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
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--surface-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Create Category</h3>
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
            <X size={18} />
          </button>
        </div>

        {/* Live Preview Card */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-hover)",
            border: "1px solid var(--surface-border)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
            Live Preview
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-md)",
                background: `${color}22`,
                border: `1px solid ${color}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              {icon}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                className="badge-pill"
                style={{
                  background: `${color}22`,
                  color: color,
                  border: `1px solid ${color}55`,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  padding: "0.3rem 0.75rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>{icon}</span>
                <span>{name.trim() || "Category Name"}</span>
              </div>
              {desc && (
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.3rem 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {desc}
                </p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="cat-name-input"
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
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
              placeholder="e.g. System Design, AI, DevOps, Personal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              required
            />
          </div>

          {/* Icon / Emoji Picker */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Choose Emoji Icon
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value || "📁")}
                maxLength={4}
                style={{
                  width: "50px",
                  textAlign: "center",
                  padding: "2px",
                  borderRadius: "6px",
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface)",
                  fontSize: "1rem",
                }}
                title="Type custom emoji"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "0.35rem",
                maxHeight: "110px",
                overflowY: "auto",
                padding: "4px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--surface-border)",
                background: "var(--surface)",
              }}
            >
              {PRESET_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  style={{
                    background: icon === emoji ? "var(--primary-subtle)" : "transparent",
                    border: `1px solid ${icon === emoji ? "var(--primary)" : "transparent"}`,
                    borderRadius: "6px",
                    padding: "4px",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Picker */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Theme Accent Color
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: c.hex,
                    border: `2px solid ${color === c.hex ? "#ffffff" : "transparent"}`,
                    boxShadow: color === c.hex ? `0 0 0 2px ${c.hex}` : "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    transition: "transform 0.15s ease",
                    transform: color === c.hex ? "scale(1.15)" : "scale(1)",
                  }}
                  title={c.name}
                >
                  {color === c.hex && <Check size={14} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label
              htmlFor="cat-desc-input"
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "0.4rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Description <span style={{ color: "var(--text-subtle)", fontWeight: 500 }}>(Optional)</span>
            </label>
            <input
              id="cat-desc-input"
              type="text"
              className="input-modern"
              placeholder="e.g. Distributed architectures, scalability & interview prep"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
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
              <Plus size={16} />
              <span>{loading ? "Creating..." : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
