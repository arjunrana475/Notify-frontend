import { useEffect, useState, useMemo, useCallback } from "react";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import BrowseTopicsModal from "../components/BrowseTopicsModal.jsx";
import {
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X,
  Tag,
  FileText,
  Pin,
  Archive,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  ExternalLink,
  BookOpen,
  Code2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCategory } from "../context/CategoryContext";
import "../styles/Home.css";

export default function Home() {
  const { user: currentUser, isLoggedIn } = useAuth();
  const { categories, getMeta, openCreateModal } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTopic, setActiveTopic] = useState(() => searchParams.get("topic") || "");
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | title
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");

  const totalNotes = allNotes.length;
  const pinnedNotes = allNotes.filter((note) => note.isPinned).length;
  const archivedNotes = allNotes.filter((note) => note.isArchived).length;

  // Calculate total words written across all notes
  const totalWords = useMemo(() => {
    return allNotes.reduce((acc, note) => {
      const words = (note.content || "").trim().split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);
  }, [allNotes]);

  const totalTopics = useMemo(() => {
    return new Set(
      allNotes
        .flatMap((note) => note.topics || [])
        .map((t) => (typeof t === "string" ? t.trim().replace(/^#/, "").toLowerCase() : ""))
        .filter(Boolean)
    ).size;
  }, [allNotes]);

  // Greeting time calculations
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const userName = currentUser?.name ? currentUser.name.split(" ")[0] : "Creator";

  const fetchNotes = useCallback(async () => {
    if (!isLoggedIn) {
      setAllNotes([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await API.get("/api/notes");
      setAllNotes(response.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setAllNotes([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    document.title = "Notify — Notes & Knowledge Hub";
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const query = searchParams.get("search");
    const topicParam = searchParams.get("topic");

    if (topicParam !== null) {
      setActiveTopic(topicParam ? topicParam.trim().replace(/^#/, "") : "");
    }

    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (val.trim()) {
        newParams.set("search", val.trim());
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("search");
      return newParams;
    });
  };

  const handleTopicSelect = useCallback(
    (topic) => {
      const clean = topic ? topic.trim().replace(/^#/, "") : "";
      setActiveTopic(clean);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (clean) {
          newParams.set("topic", clean);
        } else {
          newParams.delete("topic");
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const handleNoteUpdated = useCallback((updatedNote) => {
    setAllNotes((prevNotes) =>
      prevNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  }, []);

  const handleNoteDeleted = useCallback((deletedId) => {
    setAllNotes((prevNotes) => prevNotes.filter((n) => n._id !== deletedId));
  }, []);

  // Filter and sort notes
  const displayedNotes = useMemo(() => {
    let result = [...allNotes];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((n) => {
        const titleMatch = (n.title || "").toLowerCase().includes(q);
        const contentMatch = (n.content || "").toLowerCase().includes(q);
        const categoryMatch = (n.category || "").toLowerCase().includes(q);
        const topicMatch = Array.isArray(n.topics) && n.topics.some((t) => (t || "").toLowerCase().includes(q));
        return titleMatch || contentMatch || categoryMatch || topicMatch;
      });
    }

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((n) => (n.category || "").toLowerCase() === activeCategory.toLowerCase());
    }

    // Topic filter
    if (activeTopic) {
      const targetTopic = activeTopic.toLowerCase();
      result = result.filter((n) =>
        Array.isArray(n.topics) &&
        n.topics.some((t) => typeof t === "string" && t.trim().replace(/^#/, "").toLowerCase() === targetTopic)
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [allNotes, searchQuery, activeCategory, activeTopic, sortBy]);

  // Recent 3 notes for the Recent Notes widget
  const recentFlowNotes = useMemo(() => {
    return allNotes.slice(0, 3);
  }, [allNotes]);

  // Top pinned notes
  const pinnedList = useMemo(() => {
    return allNotes.filter((n) => n.isPinned).slice(0, 3);
  }, [allNotes]);

  return (
    <>
      <Navigation onSearch={(q) => setSearchQuery(q)} initialSearch={searchQuery} />

      <main className="dashboard-layout">
        {/* =========================================================================
            1. Top Header (Greeting + Search Pill + New Note Action)
            ========================================================================= */}
        <header className="dashboard-top-header animate-fade-in">
          <div className="dashboard-greeting-box">
            <span className="dashboard-greeting-sub">{greetingText}, {userName}</span>
            <h1 className="dashboard-greeting-title">What are you working on today?</h1>
          </div>

          <div className="dashboard-top-actions">
            {/* Global Search Pill */}
            <div className="dashboard-search-pill-wrapper">
              <Search size={16} className="dashboard-search-pill-icon" />
              <input
                type="text"
                className="dashboard-search-pill-input"
                placeholder="Search notes, topics, tags..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search notes"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="dashboard-search-pill-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Create Note CTA Button */}
            <Link to="/createNote" className="dashboard-create-cta-btn">
              <Plus size={16} />
              <span>New Note</span>
            </Link>
          </div>
        </header>

        {/* =========================================================================
            2. Top 2-Column Grid (Hero Notes Banner + Workspace Overview Card)
            ========================================================================= */}
        <section className="dashboard-top-grid animate-fade-in">
          {/* Hero Notes Card */}
          <div className="hero-wellness-card">
            <div className="hero-wellness-bg-glow"></div>
            <div className="hero-wellness-content">
              <h2 className="hero-wellness-title">Capture & Organize Ideas</h2>
              <p className="hero-wellness-desc">
                Your personal workspace for code snippets, algorithms, and daily learnings.
              </p>
              <Link to="/createNote" className="hero-wellness-btn">
                <span>Create Note</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Notes Count Badge */}
            <div className="hero-wellness-social">
              <div className="hero-avatar-stack">
                <div className="hero-mini-avatar">⚡</div>
                <div className="hero-mini-avatar">🚀</div>
                <div className="hero-mini-avatar">📁</div>
              </div>
              <span className="hero-social-text">{totalNotes} Notes in Workspace</span>
            </div>

            {/* Developer / Notes Code & Book SVG Illustration */}
            <div className="hero-wellness-illustration">
              <svg width="140" height="140" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80" cy="80" r="70" fill="url(#heroNoteGrad)" fillOpacity="0.2" />
                <rect x="42" y="38" width="76" height="92" rx="12" fill="#1B4F5C" stroke="#38BDF8" strokeWidth="2.5" />
                {/* Code / Note lines */}
                <rect x="54" y="54" width="34" height="5" rx="2.5" fill="#7BE0D6" />
                <rect x="54" y="66" width="52" height="4" rx="2" fill="#E0F2FE" fillOpacity="0.8" />
                <rect x="54" y="76" width="44" height="4" rx="2" fill="#E0F2FE" fillOpacity="0.8" />
                <rect x="54" y="86" width="30" height="4" rx="2" fill="#38BDF8" />
                <rect x="54" y="96" width="48" height="4" rx="2" fill="#E0F2FE" fillOpacity="0.6" />
                <circle cx="102" cy="112" r="10" fill="#14B8A6" />
                <path d="M102 108v8M98 112h8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <defs>
                  <linearGradient id="heroNoteGrad" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Workspace Overview Card */}
          <div className="pulse-overview-card">
            <div className="pulse-overview-header">
              <div className="pulse-header-left">
                <FileText size={17} color="#0284c7" />
                <span>Workspace Overview</span>
              </div>
              <div className="pulse-sync-badge">
                <Sparkles size={11} />
                <span>Synced</span>
              </div>
            </div>

            <div className="pulse-overview-body">
              <div>
                <div className="pulse-stat-number">
                  <span>{totalNotes}</span>
                  <span className="pulse-stat-unit">notes saved</span>
                </div>
                <p className="pulse-stat-desc">
                  {pinnedNotes} pinned notes • {totalTopics} unique tags across your knowledge base.
                </p>
              </div>

              {/* Modern Layered Notes Graphic */}
              <div className="pulse-graphic-box">
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="24" width="56" height="60" rx="8" fill="rgba(14, 165, 233, 0.15)" stroke="#0EA5E9" strokeWidth="2.5" />
                  <rect x="30" y="16" width="56" height="60" rx="8" fill="var(--surface-card)" stroke="#14B8A6" strokeWidth="2.5" />
                  <path d="M42 32h24M42 42h32M42 52h20" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Category Filter Pills Dock */}
            <div className="pulse-category-dock">
              <button
                type="button"
                className={`pulse-cat-pill ${activeCategory === "All" ? "active" : ""}`}
                onClick={() => setActiveCategory("All")}
              >
                <span>🌐 All</span>
              </button>
              {categories.map((catName) => {
                const meta = getMeta(catName);
                const isActive = activeCategory.toLowerCase() === catName.toLowerCase();
                return (
                  <button
                    key={catName}
                    type="button"
                    className={`pulse-cat-pill ${isActive ? "active" : ""}`}
                    onClick={() => setActiveCategory(catName)}
                  >
                    <span>{meta.icon}</span>
                    <span>{catName}</span>
                  </button>
                );
              })}
              <button
                type="button"
                className="pulse-cat-pill"
                onClick={() => openCreateModal()}
                style={{ borderStyle: "dashed" }}
              >
                <Plus size={11} />
                <span>New</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. Bottom 3-Column Widget Grid (Pinned Notes, Topics Hub, Recent Notes)
            ========================================================================= */}
        <section className="dashboard-widget-grid animate-fade-in">
          {/* Widget 1: Pinned Notes Hub */}
          <div className="widget-stat-card">
            <div className="widget-card-header">
              <div className="widget-card-title-box">
                <Pin size={16} color="#0284C7" />
                <span>Pinned Notes</span>
              </div>
              <Link to="/get_all_pinned_notes" style={{ fontSize: "0.74rem", color: "var(--primary)", fontWeight: 700 }}>
                View All →
              </Link>
            </div>

            <div>
              <div className="widget-stat-main">
                {pinnedNotes} <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>pinned</span>
              </div>
              <div className="widget-stat-sub">
                Pinned items stay at the top of your workspace
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.85rem" }}>
              {pinnedList.length > 0 ? (
                pinnedList.map((n) => (
                  <Link
                    key={n._id}
                    to={`/note/${n._id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.35rem 0.6rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-subtle)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      📌 {n.title}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{n.category}</span>
                  </Link>
                ))
              ) : (
                <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", padding: "0.4rem 0" }}>
                  No pinned notes yet. Click the pin icon on any note.
                </div>
              )}
            </div>
          </div>

          {/* Widget 2: Topics & Content Stats */}
          <div className="widget-stat-card">
            <div className="widget-card-header">
              <div className="widget-card-title-box">
                <Tag size={16} color="#14B8A6" />
                <span>Topics & Tags</span>
              </div>
              <button
                type="button"
                className="btn-brand-ghost"
                style={{ fontSize: "0.74rem", padding: "0 0.2rem", color: "var(--primary)", fontWeight: 700 }}
                onClick={() => setIsTopicModalOpen(true)}
              >
                Browse →
              </button>
            </div>

            <div>
              <div className="widget-stat-main">
                {totalTopics} <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>tags</span>
              </div>
              <div className="widget-stat-sub">
                {totalWords.toLocaleString()} total words written
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.85rem" }}>
              {allNotes
                .flatMap((n) => n.topics || [])
                .filter(Boolean)
                .slice(0, 6)
                .map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    className="topic-chip"
                    style={{ fontSize: "0.72rem", padding: "0.2rem 0.55rem" }}
                    onClick={() => handleTopicSelect(t.replace(/^#/, ""))}
                  >
                    #{t.replace(/^#/, "")}
                  </button>
                ))}
            </div>
          </div>

          {/* Widget 3: Recent Notes Flow */}
          <div className="widget-schedule-card">
            <div className="widget-card-header" style={{ marginBottom: "0.85rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--surface-border)" }}>
              <div className="widget-card-title-box">
                <Clock size={16} color="#0EA5E9" />
                <span>Recent Notes</span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {allNotes.length} notes in total
              </span>
            </div>

            {/* Recent Notes List */}
            <div className="schedule-notes-list">
              {recentFlowNotes.length > 0 ? (
                recentFlowNotes.map((note) => {
                  const meta = getMeta(note.category);
                  return (
                    <div key={note._id} className="schedule-note-row">
                      <div className="schedule-note-left">
                        <div className="schedule-note-icon">{meta.icon}</div>
                        <div>
                          <div className="schedule-note-title">{note.title}</div>
                          <div className="schedule-note-meta">
                            <span>{note.category}</span>
                            <span>•</span>
                            <span>{Array.isArray(note.topics) && note.topics[0] ? `#${note.topics[0]}` : "Note"}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/note/${note._id}`} className="schedule-start-btn">
                        Open
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "1.25rem 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  No recent notes. Click &quot;+ New Note&quot; to write one!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. Workspace Notes Explorer Section
            ========================================================================= */}
        <section className="workspace-explorer-section">
          {/* Header & Controls */}
          <div className="workspace-explorer-header">
            <div className="workspace-title-box">
              <h2 className="workspace-title">All Notes</h2>
              <span className="workspace-count-badge">{displayedNotes.length}</span>
            </div>

            <div className="workspace-toolbar-right">
              {/* Browse Topics Trigger */}
              <button
                type="button"
                className="btn-brand-secondary"
                style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
                onClick={() => setIsTopicModalOpen(true)}
              >
                <Tag size={14} />
                <span>Browse Topics ({totalTopics})</span>
              </button>

              {/* Sort Selector */}
              <select
                className="workspace-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort notes"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>

              {/* View Mode Toggle */}
              <div className="workspace-view-toggle-box">
                <button
                  type="button"
                  className={`workspace-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`workspace-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {(activeCategory !== "All" || activeTopic || searchQuery) && (
            <div className="active-filters-row">
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>
                Active Filters:
              </span>

              {activeCategory !== "All" && (
                <span className="filter-active-chip">
                  Category: {activeCategory}
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={() => setActiveCategory("All")}
                    title="Clear category filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {activeTopic && (
                <span className="filter-active-chip">
                  Topic: #{activeTopic}
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={() => handleTopicSelect("")}
                    title="Clear topic filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="filter-active-chip">
                  Query: &quot;{searchQuery}&quot;
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={handleClearSearch}
                    title="Clear search query"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                className="btn-brand-ghost"
                style={{ fontSize: "0.76rem", padding: "0.2rem 0.5rem" }}
                onClick={() => {
                  setActiveCategory("All");
                  handleTopicSelect("");
                  handleClearSearch();
                }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Notes Grid */}
          {loading ? (
            <Loader message="Loading your notes..." />
          ) : displayedNotes.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  viewMode === "grid"
                    ? "repeat(auto-fill, minmax(320px, 1fr))"
                    : "1fr",
                gap: "1.25rem",
              }}
            >
              {displayedNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onNoteUpdated={handleNoteUpdated}
                  onNoteDeleted={handleNoteDeleted}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                searchQuery || activeCategory !== "All" || activeTopic
                  ? "No matching notes found"
                  : "Your workspace is empty"
              }
              message={
                searchQuery || activeCategory !== "All" || activeTopic
                  ? "Try adjusting your search query or removing active category/topic filters."
                  : "Start by creating your first note or snippet to populate your dashboard."
              }
              actionText="Create New Note"
              actionLink="/createNote"
            />
          )}
        </section>

        {/* Browse Topics Modal */}
        <BrowseTopicsModal
          isOpen={isTopicModalOpen}
          onClose={() => setIsTopicModalOpen(false)}
          notes={allNotes}
          onSelectTopic={(topicName) => {
            handleTopicSelect(topicName);
            setIsTopicModalOpen(false);
          }}
        />
      </main>
    </>
  );
}
