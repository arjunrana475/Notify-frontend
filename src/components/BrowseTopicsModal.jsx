import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag,
  Search,
  X,
  ArrowRight,
  SlidersHorizontal,
  Pin,
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
  }, [isOpen, topicStats, selectedTopic]);

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
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-subtle)",
                border: "1px solid var(--surface-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
              }}
            >
              <Tag size={17} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  margin: 0,
                  fontFamily: "var(--font-display)",
                }}
              >
                Topics & Tags Explorer
              </h3>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                {topicStats.length} topics across {notes.length} notes
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-brand-ghost"
            onClick={onClose}
            style={{ padding: "0.35rem", borderRadius: "var(--radius-md)" }}
            title="Close"
          >
            <X size={18} />
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
              gap: "0.65rem",
              flexWrap: "wrap",
            }}
          >
            <div className="topic-search-box" style={{ flex: 1, minWidth: "220px" }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                className="topic-search-input"
                placeholder="Search topics..."
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
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <SlidersHorizontal size={14} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "0.45rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface)",
                  color: "var(--text-main)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="count">Sort: Most Used</option>
                <option value="alpha">Sort: Alphabetical (A-Z)</option>
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
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--text-subtle)",
                }}
              >
                Topics ({filteredTopics.length})
              </span>
              {selectedTopic && (
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Viewing #{selectedTopic}
                </span>
              )}
            </div>

            {filteredTopics.length === 0 ? (
              <div
                style={{
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  background: "var(--surface-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--surface-border)",
                  color: "var(--text-muted)",
                }}
              >
                <Tag size={22} style={{ opacity: 0.4, marginBottom: "0.35rem" }} />
                <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 500 }}>
                  {topicStats.length === 0
                    ? "No topics or tags found. Add tags like #react, #dsa when creating notes."
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
                      <Tag size={12} />
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
                  marginBottom: "0.65rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <h4
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      margin: 0,
                    }}
                  >
                    Notes tagged #{selectedTopic}{" "}
                    <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                      ({matchingNotes.length})
                    </span>
                  </h4>
                </div>

                <button
                  type="button"
                  className="btn-brand-primary"
                  onClick={() => handleApplyFilter(selectedTopic)}
                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                >
                  <span>Filter by #{selectedTopic}</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "4px" }}>
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
                            gap: "0.4rem",
                            marginBottom: "0.15rem",
                          }}
                        >
                          {note.isPinned && (
                            <Pin size={12} color="var(--primary)" fill="currentColor" />
                          )}
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.88rem",
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
                            fontSize: "0.76rem",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {note.content || "No content preview"}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {note.category && (
                          <span
                            className={`badge-pill ${catMeta.isCustom ? "" : catMeta.colorClass}`}
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.15rem 0.45rem",
                              background: catMeta.isCustom ? catMeta.bg : undefined,
                              color: catMeta.isCustom ? catMeta.color : undefined,
                            }}
                          >
                            <span>{catMeta.icon}</span>
                            <span>{note.category}</span>
                          </span>
                        )}
                        <ArrowRight size={14} color="var(--text-muted)" />
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
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Tip: Click on topic chips on note cards to filter directly.
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn-brand-ghost"
              onClick={() => handleApplyFilter(null)}
              style={{ fontSize: "0.82rem", padding: "0.35rem 0.75rem" }}
            >
              Clear Filter
            </button>
            <button
              type="button"
              className="btn-brand-secondary"
              onClick={onClose}
              style={{ fontSize: "0.82rem", padding: "0.35rem 0.85rem" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
