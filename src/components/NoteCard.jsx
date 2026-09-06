import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";
import Swal from "sweetalert2";
import { useCategory } from "../context/CategoryContext";
import { Pin, Archive, ExternalLink } from "lucide-react";
import "../styles/NoteCard.css";

const NoteCard = ({ note }) => {
  const navigate = useNavigate();
  const { getMeta } = useCategory();
  const [currentNote, setCurrentNote] = useState(note);
  const [categoryCount, setCategoryCount] = useState(0);

  // Sync if prop note changes
  useEffect(() => {
    setCurrentNote(note);
  }, [note]);

  const handlePin = async (e) => {
    e.stopPropagation();
    const isPinning = !currentNote.isPinned;

    try {
      // Optimistic update
      setCurrentNote((prev) => ({ ...prev, isPinned: isPinning }));

      const response = await API.patch(
        `/api/notes/${currentNote._id}/pin`
      );

      if (response.data.note) {
        setCurrentNote(response.data.note);
      }

      Swal.fire({
        icon: "success",
        title: isPinning ? "Note Pinned 📌" : "Note Unpinned",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    } catch {
      // Revert on error
      setCurrentNote((prev) => ({ ...prev, isPinned: !isPinning }));
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
      setCurrentNote((prev) => ({ ...prev, isArchived: isArchiving }));

      const response = await API.patch(
        `/api/notes/${currentNote._id}/archive`
      );

      if (response.data.note) {
        setCurrentNote(response.data.note);
      }

      Swal.fire({
        icon: "success",
        title: isArchiving ? "Note Archived 📦" : "Note Unarchived",
        timer: 1000,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    } catch {
      setCurrentNote((prev) => ({ ...prev, isArchived: !isArchiving }));
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

  useEffect(() => {
    const fetchCategoryCount = async () => {
      if (!currentNote.category) return;
      try {
        const response = await API.get(
          `/api/notes/category/${encodeURIComponent(
            currentNote.category
          )}/count`
        );
        setCategoryCount(response.data.count);
      } catch {
        // silent fallback
      }
    };
    fetchCategoryCount();
  }, [currentNote.category]);

  const catMeta = getMeta(currentNote.category);
  const authorName = currentNote.user?.name || "Author";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            {categoryCount > 0 && <span className="note-cat-count">{categoryCount}</span>}
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
            <ExternalLink size={12} />
            <span>Link</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
