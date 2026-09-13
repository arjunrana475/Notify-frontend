import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";
import Swal from "sweetalert2";
import { useCategory } from "../context/CategoryContext";
import { Pin, Archive, ExternalLink } from "lucide-react";
import "../styles/NoteCard.css";

const NoteCard = ({ note, onNoteUpdated }) => {
  const navigate = useNavigate();
  const { getMeta } = useCategory();
  const [currentNote, setCurrentNote] = useState(note);

  // Sync if prop note changes
  useEffect(() => {
    setCurrentNote(note);
  }, [note]);

  const handlePin = async (e) => {
    e.stopPropagation();
    const isPinning = !currentNote.isPinned;

    try {
      // Optimistic update
      const updated = { ...currentNote, isPinned: isPinning };
      setCurrentNote(updated);
      if (onNoteUpdated) onNoteUpdated(updated);

      const response = await API.patch(`/api/notes/${currentNote._id}/pin`);
      if (response.data.note) {
        setCurrentNote(response.data.note);
        if (onNoteUpdated) onNoteUpdated(response.data.note);
      }

      Swal.fire({
        icon: "success",
        title: isPinning ? "Note Pinned" : "Note Unpinned",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    } catch {
      // Revert on error
      const reverted = { ...currentNote, isPinned: !isPinning };
      setCurrentNote(reverted);
      if (onNoteUpdated) onNoteUpdated(reverted);
      Swal.fire({
        icon: "error",
        title: "Failed to update pin",
        toast: true,
        position: "bottom-end",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleArchive = async (e) => {
    e.stopPropagation();
    const isArchiving = !currentNote.isArchived;

    try {
      // Optimistic update
      const updated = { ...currentNote, isArchived: isArchiving };
      setCurrentNote(updated);
      if (onNoteUpdated) onNoteUpdated(updated);

      const response = await API.patch(`/api/notes/${currentNote._id}/archive`);
      if (response.data.note) {
        setCurrentNote(response.data.note);
        if (onNoteUpdated) onNoteUpdated(response.data.note);
      }

      Swal.fire({
        icon: "success",
        title: isArchiving ? "Note Archived" : "Note Restored",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    } catch {
      const reverted = { ...currentNote, isArchived: !isArchiving };
      setCurrentNote(reverted);
      if (onNoteUpdated) onNoteUpdated(reverted);
      Swal.fire({
        icon: "error",
        title: "Failed to update archive",
        toast: true,
        position: "bottom-end",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const catMeta = getMeta(currentNote.category);
  const authorName =
    typeof currentNote.user === "object" && currentNote.user?.name
      ? currentNote.user.name
      : "Author";
  const authorInitials = (
    authorName.trim()
      ? authorName
          .trim()
          .split(/\s+/)
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
      : "A"
  ).toUpperCase();

  const formattedDate = currentNote.createdAt
    ? new Date(currentNote.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={`modern-note-card animate-fade-in ${currentNote.isPinned ? "is-pinned" : ""}`}
      onClick={() => navigate(`/note/${currentNote._id}`)}
    >
      {/* Header: Category Badge & Quick Actions */}
      <div className="note-header-row">
        {currentNote.category ? (
          <div
            className={`note-category-tag ${catMeta.isCustom ? "" : catMeta.colorClass}`}
            style={{
              background: catMeta.isCustom ? catMeta.bg : undefined,
              color: catMeta.isCustom ? catMeta.color : undefined,
              borderColor: catMeta.isCustom ? catMeta.border : undefined,
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/category/${encodeURIComponent(currentNote.category)}`);
            }}
            title={`View all ${currentNote.category} notes`}
          >
            <span>{catMeta.icon}</span>
            <span>{currentNote.category}</span>
          </div>
        ) : (
          <div className="note-category-tag cat-badge-other">
            <span>📁</span>
            <span>Uncategorized</span>
          </div>
        )}

        {/* Quick Pin / Archive Action Buttons */}
        <div className="note-quick-actions">
          <button
            type="button"
            className={`note-icon-btn ${currentNote.isPinned ? "active-pin" : ""}`}
            onClick={handlePin}
            title={currentNote.isPinned ? "Unpin Note" : "Pin Note to Top"}
            aria-label="Pin Note"
          >
            <Pin size={13} fill={currentNote.isPinned ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            className={`note-icon-btn ${currentNote.isArchived ? "active-archive" : ""}`}
            onClick={handleArchive}
            title={currentNote.isArchived ? "Unarchive Note" : "Archive Note"}
            aria-label="Archive Note"
          >
            <Archive size={13} fill={currentNote.isArchived ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Note Title */}
      <h3 className="note-title-text">{currentNote.title}</h3>

      {/* Topics Badges */}
      {currentNote.topics && currentNote.topics.length > 0 && (
        <div className="note-topics-wrap">
          {currentNote.topics.map((topic, i) => {
            const cleanTopic = (topic || "").trim().replace(/^#/, "");
            if (!cleanTopic) return null;
            return (
              <span
                key={i}
                className="topic-chip"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/?topic=${encodeURIComponent(cleanTopic)}`);
                }}
                title={`Filter workspace by #${cleanTopic}`}
                style={{ cursor: "pointer" }}
              >
                #{cleanTopic}
              </span>
            );
          })}
        </div>
      )}

      {/* Content Snippet */}
      <p className="note-snippet-text">{currentNote.content}</p>

      {/* Footer Meta Row */}
      <div className="note-footer-row">
        <div className="note-meta-author">
          <div className="author-mini-avatar">{authorInitials}</div>
          <span className="author-meta-name">{authorName.split(" ")[0]}</span>
          <span className="note-date-text">• {formattedDate}</span>
        </div>

        {currentNote.link && (
          <a
            href={currentNote.link}
            target="_blank"
            rel="noopener noreferrer"
            className="note-link-indicator"
            onClick={(e) => e.stopPropagation()}
            title="Open attached resource"
          >
            <ExternalLink size={11} />
            <span>Link</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
