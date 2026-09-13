import { useEffect, useState, useMemo, useCallback } from "react";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StaticsCard from "../components/StaticsCard.jsx";
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
  Lock,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCategory } from "../context/CategoryContext";

const Home = () => {
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
  const totalTopics = useMemo(() => {
    return new Set(
      allNotes
        .flatMap((note) => note.topics || [])
        .map((t) => (typeof t === "string" ? t.trim().replace(/^#/, "").toLowerCase() : ""))
        .filter(Boolean)
    ).size;
  }, [allNotes]);

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

  const handleSearch = useCallback((search) => {
    const trimmed = search || "";
    setSearchQuery(trimmed);

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (trimmed) {
        newParams.set("search", trimmed);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  }, [setSearchParams]);

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

  // In-place note update handler for instant UI responsiveness
  const handleNoteUpdated = useCallback((updatedNote) => {
    setAllNotes((prevNotes) =>
      prevNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  }, []);

  // Memoized filter and sort
  const displayedNotes = useMemo(() => {
    let result = [...allNotes];

    // Search query filter (instant client-side filtering over notes)
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
      result = result.filter((n) => n.category === activeCategory);
    }

    // Topic filter
    if (activeTopic) {
      const targetTopic = activeTopic.toLowerCase();
      result = result.filter((n) =>
        Array.isArray(n.topics) &&
        n.topics.some(
          (t) =>
            typeof t === "string" &&
            t.trim().replace(/^#/, "").toLowerCase() === targetTopic
        )
      );
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    // Always keep pinned items at the top
    result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return result;
  }, [activeCategory, activeTopic, sortBy, allNotes, searchQuery]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading && allNotes.length === 0) {
    return (
      <>
        <Navigation onSearch={handleSearch} initialSearch={searchQuery} />
        <Loader message="Loading workspace..." />
      </>
    );
  }

  return (
    <>
      <Navigation onSearch={handleSearch} initialSearch={searchQuery} />

      <main className="container-fluid" style={{ maxWidth: "1240px", padding: "1.25rem 1.25rem 3.5rem" }}>
        {/* Welcome Header */}
        <section
          className="glass-panel animate-fade-in"
          style={{
            padding: "1.75rem 2rem",
            marginBottom: "1.5rem",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.25rem" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.2rem 0.6rem",
                  background: "var(--primary-subtle)",
                  border: "1px solid var(--primary-border)",
                  borderRadius: "var(--radius-xs)",
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                }}
              >
                <span>{currentUser ? "Personal Workspace" : "Notes Workspace"}</span>
              </div>

              <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.3rem" }}>
                {currentUser
                  ? `${getGreeting()}, ${(currentUser?.name || "there").split(" ")[0]}`
                  : "Welcome to Notify"}
              </h1>

              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0, maxWidth: "520px" }}>
                {currentUser
                  ? "Organize thoughts, pin key resources, and capture knowledge seamlessly."
                  : "Capture ideas, organize thoughts, and build your personal knowledge base."}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {currentUser ? (
                <Link to="/createNote" className="btn-brand-primary" style={{ padding: "0.55rem 1.15rem" }}>
                  <Plus size={16} />
                  <span>Create Note</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-brand-secondary" style={{ padding: "0.55rem 1.15rem" }}>
                    <span>Sign In</span>
                  </Link>
                  <Link to="/register" className="btn-brand-primary" style={{ padding: "0.55rem 1.15rem" }}>
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section style={{ marginBottom: "1.75rem" }}>
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon={<FileText size={18} />}
                title="Total Notes"
                value={totalNotes}
                accentColor="var(--primary)"
                buttonText="Add Note"
                buttonLink="/createNote"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon={<Pin size={18} />}
                title="Pinned Notes"
                value={pinnedNotes}
                accentColor="var(--primary)"
                buttonText="View Pinned"
                buttonLink="/get_all_pinned_notes"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon={<Archive size={18} />}
                title="Archived Notes"
                value={archivedNotes}
                accentColor="var(--accent-amber)"
                buttonText="View Archive"
                buttonLink="/get_all_archived_notes"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon={<Tag size={18} />}
                title="Topics & Tags"
                value={totalTopics}
                accentColor="var(--accent-emerald)"
                buttonText="Browse Topics"
                onClick={() => setIsTopicModalOpen(true)}
              />
            </div>
          </div>
        </section>

        {/* Filter Controls & Category Chips Row */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.85rem",
            }}
          >
            {/* Category Filter Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                overflowX: "auto",
                paddingBottom: "2px",
                scrollbarWidth: "none",
                maxWidth: "100%",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="badge-pill"
                style={{
                  background: activeCategory === "All" ? "var(--primary)" : "var(--surface)",
                  color: activeCategory === "All" ? "#ffffff" : "var(--text-main)",
                  border: `1px solid ${activeCategory === "All" ? "var(--primary)" : "var(--surface-border)"}`,
                  cursor: "pointer",
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                }}
              >
                <span>All Notes</span>
                <span
                  style={{
                    background: activeCategory === "All" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                  }}
                >
                  {allNotes.length}
                </span>
              </button>

              {categories.map((catName) => {
                const meta = getMeta(catName);
                const count = allNotes.filter((n) => n.category === catName).length;
                const isSelected = activeCategory === catName;
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setActiveCategory(catName)}
                    className={`badge-pill ${!isSelected ? meta.colorClass : ""}`}
                    style={{
                      background: isSelected ? meta.color : undefined,
                      color: isSelected ? "#ffffff" : undefined,
                      borderColor: isSelected ? meta.color : undefined,
                      cursor: "pointer",
                      padding: "0.35rem 0.8rem",
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>{catName}</span>
                    {count > 0 && (
                      <span
                        style={{
                          background: isSelected ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                          padding: "1px 5px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Browse Topics Quick Pill */}
              <button
                type="button"
                onClick={() => setIsTopicModalOpen(true)}
                className="badge-pill"
                style={{
                  background: activeTopic ? "var(--accent-emerald)" : "var(--surface)",
                  color: activeTopic ? "#ffffff" : "var(--text-main)",
                  border: `1px solid ${activeTopic ? "var(--accent-emerald)" : "var(--surface-border)"}`,
                  cursor: "pointer",
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
                title="Browse by Topics & Tags"
              >
                <Tag size={13} />
                <span>{activeTopic ? `#${activeTopic}` : "Topics"}</span>
                {totalTopics > 0 && (
                  <span
                    style={{
                      background: activeTopic ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                      padding: "1px 5px",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                    }}
                  >
                    {totalTopics}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => openCreateModal((newCatName) => setActiveCategory(newCatName))}
                className="badge-pill"
                style={{
                  borderStyle: "dashed",
                  borderColor: "var(--surface-border-strong)",
                  color: "var(--text-muted)",
                  background: "var(--surface)",
                  cursor: "pointer",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontWeight: 500,
                }}
                title="Create custom category"
              >
                <Plus size={13} />
                <span>New Category</span>
              </button>
            </div>

            {/* Sort & View Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <SlidersHorizontal size={14} color="var(--text-muted)" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "0.35rem 0.65rem",
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
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                  <option value="title">Sort: Title (A-Z)</option>
                </select>
              </div>

              {/* View toggle button */}
              <div
                style={{
                  display: "flex",
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "2px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  style={{
                    background: viewMode === "grid" ? "var(--surface)" : "transparent",
                    color: viewMode === "grid" ? "var(--primary)" : "var(--text-muted)",
                    border: "none",
                    borderRadius: "var(--radius-xs)",
                    padding: "3px 6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: viewMode === "grid" ? "var(--shadow-xs)" : "none",
                  }}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  style={{
                    background: viewMode === "list" ? "var(--surface)" : "transparent",
                    color: viewMode === "list" ? "var(--primary)" : "var(--text-muted)",
                    border: "none",
                    borderRadius: "var(--radius-xs)",
                    padding: "3px 6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: viewMode === "list" ? "var(--shadow-xs)" : "none",
                  }}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Active Search Result Banner */}
        {searchQuery && (
          <div
            className="glass-panel animate-fade-in"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.65rem 1rem",
              marginBottom: "1.2rem",
              background: "var(--surface-subtle)",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Search size={15} color="var(--primary)" />
              <span style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 500 }}>
                Found <strong>{displayedNotes.length}</strong>{" "}
                {displayedNotes.length === 1 ? "note" : "notes"} matching{" "}
                <span
                  style={{
                    background: "var(--primary-subtle)",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    color: "var(--primary)",
                    fontWeight: 600,
                  }}
                >
                  "{searchQuery}"
                </span>
              </span>
            </div>

            <button
              type="button"
              className="btn-brand-secondary"
              onClick={() => handleSearch("")}
              style={{
                fontSize: "0.78rem",
                padding: "0.25rem 0.65rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <X size={13} />
              <span>Clear Search</span>
            </button>
          </div>
        )}

        {/* Active Topic Filter Banner */}
        {activeTopic && (
          <div
            className="glass-panel animate-fade-in"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.65rem 1rem",
              marginBottom: "1.2rem",
              background: "rgba(16, 185, 129, 0.08)",
              borderColor: "rgba(16, 185, 129, 0.25)",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Tag size={15} color="var(--accent-emerald)" />
              <span style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 500 }}>
                Filtering by Topic:{" "}
                <span
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    color: "var(--accent-emerald)",
                    fontWeight: 600,
                  }}
                >
                  #{activeTopic}
                </span>
                {" — "}
                <strong>{displayedNotes.length}</strong>{" "}
                {displayedNotes.length === 1 ? "note" : "notes"} found
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <button
                type="button"
                className="btn-brand-ghost"
                onClick={() => setIsTopicModalOpen(true)}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.25rem 0.6rem",
                }}
              >
                <span>Change Topic</span>
              </button>
              <button
                type="button"
                className="btn-brand-secondary"
                onClick={() => handleTopicSelect("")}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.25rem 0.65rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <X size={13} />
                <span>Clear Filter</span>
              </button>
            </div>
          </div>
        )}

        {/* Notes Display */}
        {displayedNotes.length === 0 ? (
          !isLoggedIn ? (
            <EmptyState
              icon={<Lock size={22} />}
              title="Sign in to access your workspace"
              subtitle="Keep your notes synced and organized. Sign in to your account or create a new one to get started."
              actionText="Sign In"
              actionLink="/login"
            />
          ) : searchQuery ? (
            <EmptyState
              icon={<Search size={22} />}
              title="No results found"
              subtitle={`No notes matched your search "${searchQuery}". Try a different keyword.`}
              actionText="Clear Search"
              actionLink="#"
              onAction={() => handleSearch("")}
            />
          ) : activeTopic ? (
            <EmptyState
              icon={<Tag size={22} />}
              title={`No notes tagged #${activeTopic}`}
              subtitle={`You don't have any notes matching #${activeTopic}. Try selecting another topic or clear the filter.`}
              actionText="Clear Topic Filter"
              actionLink="#"
              onAction={() => handleTopicSelect("")}
            />
          ) : (
            <EmptyState
              icon={<FileText size={22} />}
              emoji={activeCategory !== "All" ? getMeta(activeCategory).icon : null}
              title={activeCategory !== "All" ? `No notes in "${activeCategory}"` : "No notes yet"}
              subtitle={
                activeCategory !== "All"
                  ? `You don't have any notes filed under ${activeCategory}. Create one now!`
                  : "Your knowledge base is empty. Capture your first thought, snippet, or resource."
              }
              actionText="Create Note"
              actionLink="/createNote"
            />
          )
        ) : (
          <div className={viewMode === "grid" ? "row g-3" : "d-flex flex-column gap-3"}>
            {displayedNotes.map((note) => (
              <div className={viewMode === "grid" ? "col-12 col-md-6 col-lg-4" : "w-100"} key={note._id}>
                <NoteCard note={note} onNoteUpdated={handleNoteUpdated} />
              </div>
            ))}
          </div>
        )}

        {/* Browse Topics & Tags Explorer Modal */}
        <BrowseTopicsModal
          isOpen={isTopicModalOpen}
          onClose={() => setIsTopicModalOpen(false)}
          notes={allNotes}
          onSelectTopic={handleTopicSelect}
        />
      </main>
    </>
  );
};

export default Home;
