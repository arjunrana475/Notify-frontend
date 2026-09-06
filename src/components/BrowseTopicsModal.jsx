import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag,
  Search,
  X,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  FileText,
  Pin,
  ExternalLink,
  Layers,
} from "lucide-react";
import { useCategory } from "../context/CategoryContext";
import "../styles/BrowseTopicsModal.css";

export default function BrowseTopicsModal({
  isOpen,
  onClose,
  notes = [],
  onSelectTopic,
}) {
  const navigate = useNavigate();
  const { getMeta } = useCategory();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [sortBy, setSortBy] = useState("count"); // "count" | "alpha"

  // Aggregate all unique topics and calculate frequency
  const topicStats = useMemo(() => {
    const map = {};
    notes.forEach((note) => {
      if (Array.isArray(note.topics)) {
        note.topics.forEach((t) => {
          if (typeof t === "string") {
            const clean = t.trim().replace(/^#/, "");
            if (clean) {
              const lower = clean.toLowerCase();
              if (!map[lower]) {
                map[lower] = { name: clean, count: 0, notes: [] };
              }
              map[lower].count += 1;
              map[lower].notes.push(note);
            }
          }
        });
      }
    });

    let list = Object.values(map);

    if (sortBy === "count") {
      list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    } else if (sortBy === "alpha") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [notes, sortBy]);

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topicStats;
    const q = searchQuery.toLowerCase().trim();
    return topicStats.filter((t) => t.name.toLowerCase().includes(q));
  }, [topicStats, searchQuery]);

  // Notes matching currently selected topic
  const matchingNotes = useMemo(() => {
    if (!selectedTopic) return [];
    const target = topicStats.find(
      (t) => t.name.toLowerCase() === selectedTopic.toLowerCase()
    );
    return target ? target.notes : [];
  }, [selectedTopic, topicStats]);

  // Reset or initialize selection when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      if (topicStats.length > 0 && !selectedTopic) {
        setSelectedTopic(topicStats[0].name);
      }
    }
  }, [isOpen, topicStats]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyFilter = (topicName) => {
    if (onSelectTopic && typeof onSelectTopic === "function") {
      onSelectTopic(topicName);
    }
    onClose();
  };

  return (
    <div className="topic-modal-overlay" onClick={onClose}>
      <div className="topic-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="topic-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "var(--radius-md)",
                background: "var(--accent-emerald-subtle, rgba(16, 185, 129, 0.15))",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-emerald)",
                fontSize: "1.25rem",
              }}
            >
              🏷️
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  margin: 0,
                  fontFamily: "var(--font-display)",
                }}
              >
                Browse Notes by Topics & Tags
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Explore {topicStats.length} topics across {notes.length} notes in your workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-brand-ghost"
            onClick={onClose}
            style={{ padding: "0.45rem", borderRadius: "var(--radius-md)" }}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="topic-modal-body">
          {/* Search & Sort Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div className="topic-search-box" style={{ flex: 1, minWidth: "240px" }}>
              <Search size={17} color="var(--text-muted)" />
              <input
                type="text"
                className="topic-search-input"
                placeholder="Search topics (e.g. leetcode, hooks, async)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <SlidersHorizontal size={15} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "0.55rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface-subtle)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="count">Sort: Most Used 🔥</option>
                <option value="alpha">Sort: Alphabetical 🔤</option>
              </select>
            </div>
          </div>

          {/* Topics Cloud */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.6rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-subtle)",
                }}
              >
                Available Topics ({filteredTopics.length})
              </span>
              {selectedTopic && (
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Viewing #{selectedTopic}
                </span>
              )}
            </div>

            {filteredTopics.length === 0 ? (
              <div
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  background: "var(--surface-subtle)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px dashed var(--surface-border)",
                  color: "var(--text-muted)",
                }}
              >
                <Tag size={28} style={{ opacity: 0.5, marginBottom: "0.5rem" }} />
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>
                  {topicStats.length === 0
                    ? "No topics or tags found on your notes yet. Add tags like #react, #dsa when creating notes!"
                    : `No topics match "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <div className="topic-cloud-container">
                {filteredTopics.map((topic) => {
                  const isActive =
                    selectedTopic &&
                    selectedTopic.toLowerCase() === topic.name.toLowerCase();
                  return (
                    <button
                      key={topic.name}
                      type="button"
                      className={`topic-pill-btn ${isActive ? "active" : ""}`}
                      onClick={() => setSelectedTopic(topic.name)}
                    >
                      <Tag size={13} />
                      <span>#{topic.name}</span>
                      <span className="topic-pill-count">{topic.count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Topic Notes Preview */}
          {selectedTopic && matchingNotes.length > 0 && (
            <div className="topic-notes-preview-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Sparkles size={16} color="var(--primary-light)" />
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--text-main)",
                      margin: 0,
                    }}
                  >
                    Notes tagged with #{selectedTopic}{" "}
                    <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                      ({matchingNotes.length})
                    </span>
                  </h4>
                </div>

                <button
                  type="button"
                  className="btn-brand-primary"
                  onClick={() => handleApplyFilter(selectedTopic)}
                  style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}
                >
                  <span>Filter Workspace with #{selectedTopic}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
                {matchingNotes.map((note) => {
                  const catMeta = getMeta(note.category);
                  return (
                    <div
                      key={note._id}
                      className="topic-note-item"
                      onClick={() => {
                        onClose();
                        navigate(`/note/${note._id}`);
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {note.isPinned && (
                            <Pin size={13} color="var(--primary-light)" fill="currentColor" />
                          )}
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "0.92rem",
                              color: "var(--text-main)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {note.title}
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {note.content || "No content preview"}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        {note.category && (
                          <span
                            className={`badge-pill ${catMeta.isCustom ? "" : catMeta.colorClass}`}
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.2rem 0.6rem",
                              background: catMeta.isCustom ? catMeta.bg : undefined,
                              color: catMeta.isCustom ? catMeta.color : undefined,
                            }}
                          >
                            <span>{catMeta.icon}</span>
                            <span>{note.category}</span>
                          </span>
                        )}
                        <ArrowRight size={15} color="var(--text-muted)" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="topic-modal-footer">
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Tip: Click on any topic chip on note cards to quickly filter notes.
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              type="button"
              className="btn-brand-ghost"
              onClick={() => handleApplyFilter(null)}
              style={{ fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
            >
              Clear Topic Filter
            </button>
            <button
              type="button"
              className="btn-brand-secondary"
              onClick={onClose}
              style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
