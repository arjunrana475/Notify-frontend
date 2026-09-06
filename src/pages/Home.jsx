import { useEffect, useState, useMemo, useCallback } from "react";
import API from "../services/api.js";
import Navigation from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StaticsCard from "../components/StaticsCard.jsx";
import BrowseTopicsModal from "../components/BrowseTopicsModal.jsx";
import { Plus, Sparkles, SlidersHorizontal, LayoutGrid, List, Search, X, Tag } from "lucide-react";
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
  const totalTopics = new Set(
    allNotes
      .flatMap((note) => note.topics || [])
      .map((t) => (typeof t === "string" ? t.trim().replace(/^#/, "").toLowerCase() : ""))
      .filter(Boolean)
  ).size;

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

  const handleSearch = useCallback(async (search) => {
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

    if (!trimmed.trim()) {
      fetchNotes();
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(
        `/api/notes/search?search=${encodeURIComponent(trimmed)}`
      );
      setAllNotes(response.data || []);
    } catch (error) {
      console.error("Error searching notes:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchNotes, setSearchParams]);

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

  useEffect(() => {
    document.title = "Notify — Smart Notes & Knowledge Hub";
    const query = searchParams.get("search");
    const topicParam = searchParams.get("topic");

    if (topicParam !== null) {
      setActiveTopic(topicParam ? topicParam.trim().replace(/^#/, "") : "");
    }

    if (query) {
      handleSearch(query);
    } else {
      fetchNotes();
    }
  }, [fetchNotes, handleSearch, searchParams]);

  // Memoized filter and sort
  const displayedNotes = useMemo(() => {
    let result = [...allNotes];

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
  }, [activeCategory, activeTopic, sortBy, allNotes]);

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
        <Loader message="Loading your notes workspace..." />
      </>
    );
  }

  return (
    <>
      <Navigation onSearch={handleSearch} initialSearch={searchQuery} />

      <main className="container-fluid" style={{ maxWidth: "1280px", padding: "1.5rem 1.25rem 4rem" }}>
        {/* Welcome Hero Banner */}
        <section
          className="glass-panel animate-fade-in"
          style={{
            padding: "2.2rem 2.2rem",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient Orbs */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "40%",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", position: "relative", zIndex: 2 }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.75rem",
                  background: "var(--primary-subtle)",
                  border: "1px solid var(--primary-border)",
                  borderRadius: "var(--radius-pill)",
                  color: "var(--primary-light)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                <Sparkles size={14} />
                <span>{currentUser ? "Personal Workspace" : "Smart Note Taking"}</span>
              </div>

              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.4rem" }}>
                {currentUser
                  ? `${getGreeting()}, ${currentUser.name.split(" ")[0]} ✨`
                  : "Welcome to Notify ✨"}
              </h1>

              <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", margin: 0, maxWidth: "560px" }}>
                {currentUser
                  ? "Organize thoughts, pin key resources, and capture knowledge seamlessly."
                  : "Capture ideas, organize thoughts, and build your personal knowledge hub."}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {currentUser ? (
                <Link to="/createNote" className="btn-brand-primary" style={{ padding: "0.75rem 1.4rem" }}>
                  <Plus size={18} />
                  <span>Create New Note</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-brand-secondary" style={{ padding: "0.75rem 1.4rem" }}>
                    <span>Sign In</span>
                  </Link>
                  <Link to="/register" className="btn-brand-primary" style={{ padding: "0.75rem 1.4rem" }}>
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Bento Statistics Grid */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div className="row g-3 g-md-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon="📝"
                title="Total Notes"
                value={totalNotes}
                accentColor="#6366f1"
                buttonText="Add New Note"
                buttonLink="/createNote"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon="📌"
                title="Pinned Notes"
                value={pinnedNotes}
                accentColor="#ec4899"
                buttonText="View Pinned"
                buttonLink="/get_all_pinned_notes"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon="📦"
                title="Archived Notes"
                value={archivedNotes}
                accentColor="#f59e0b"
                buttonText="View Archive"
                buttonLink="/get_all_archived_notes"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StaticsCard
                icon="🏷️"
                title="Topics & Tags"
                value={totalTopics}
                accentColor="#10b981"
                buttonText="Browse Notes"
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
            gap: "1rem",
            marginBottom: "1.8rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {/* Category Filter Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                overflowX: "auto",
                paddingBottom: "4px",
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
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.85rem",
                  boxShadow: activeCategory === "All" ? "var(--shadow-primary)" : "var(--shadow-xs)",
                  whiteSpace: "nowrap",
                }}
              >
                <span>✨ All Notes</span>
                <span
                  style={{
                    background: activeCategory === "All" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
                    padding: "1px 6px",
                    borderRadius: "8px",
                    fontSize: "0.72rem",
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
                      padding: "0.45rem 0.95rem",
                      fontSize: "0.85rem",
                      boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>{catName}</span>
                    {count > 0 && (
                      <span
                        style={{
                          background: isSelected ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
                          padding: "1px 6px",
                          borderRadius: "8px",
                          fontSize: "0.72rem",
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
                  background: activeTopic ? "var(--accent-emerald, #10b981)" : "var(--surface)",
                  color: activeTopic ? "#ffffff" : "var(--text-main)",
                  border: `1px solid ${activeTopic ? "var(--accent-emerald, #10b981)" : "var(--surface-border)"}`,
                  cursor: "pointer",
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  boxShadow: activeTopic ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
                }}
                title="Browse by Topics & Tags"
              >
                <span>🏷️</span>
                <span>{activeTopic ? `#${activeTopic}` : "Topics"}</span>
                {totalTopics > 0 && (
                  <span
                    style={{
                      background: activeTopic ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
                      padding: "1px 6px",
                      borderRadius: "8px",
                      fontSize: "0.72rem",
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
                  borderColor: "var(--primary-light)",
                  color: "var(--primary-light)",
                  background: "var(--primary-subtle)",
                  cursor: "pointer",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontWeight: 700,
                }}
                title="Create custom category"
              >
                <Plus size={14} />
                <span>+ New Category</span>
              </button>
            </div>

            {/* Sort & View Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <SlidersHorizontal size={15} color="var(--text-muted)" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--surface-border)",
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
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
                  background: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "2px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  style={{
                    background: viewMode === "grid" ? "var(--primary-subtle)" : "transparent",
                    color: viewMode === "grid" ? "var(--primary-light)" : "var(--text-muted)",
                    border: "none",
                    borderRadius: "var(--radius-xs)",
                    padding: "4px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  style={{
                    background: viewMode === "list" ? "var(--primary-subtle)" : "transparent",
                    color: viewMode === "list" ? "var(--primary-light)" : "var(--text-muted)",
                    border: "none",
                    borderRadius: "var(--radius-xs)",
                    padding: "4px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="List View"
                >
                  <List size={16} />
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
              padding: "0.85rem 1.3rem",
              marginBottom: "1.4rem",
              background: "var(--primary-subtle)",
              borderColor: "var(--primary-border)",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Search size={17} color="var(--primary-light)" />
              <span style={{ fontSize: "0.92rem", color: "var(--text-main)", fontWeight: 600 }}>
                Found <strong style={{ color: "var(--primary-light)" }}>{displayedNotes.length}</strong>{" "}
                {displayedNotes.length === 1 ? "note" : "notes"} matching{" "}
                <span
                  style={{
                    background: "rgba(99, 102, 241, 0.2)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    color: "var(--primary-light)",
                    fontWeight: 700,
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
                fontSize: "0.82rem",
                padding: "0.35rem 0.85rem",
                background: "var(--surface)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <X size={14} />
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
              padding: "0.85rem 1.3rem",
              marginBottom: "1.6rem",
              background: "rgba(16, 185, 129, 0.12)",
              borderColor: "rgba(16, 185, 129, 0.3)",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Tag size={17} color="#10b981" />
              <span style={{ fontSize: "0.92rem", color: "var(--text-main)", fontWeight: 600 }}>
                Filtering by Topic:{" "}
                <span
                  style={{
                    background: "rgba(16, 185, 129, 0.22)",
                    padding: "2px 9px",
                    borderRadius: "6px",
                    color: "#10b981",
                    fontWeight: 700,
                  }}
                >
                  #{activeTopic}
                </span>
                {" — "}
                <strong style={{ color: "#10b981" }}>{displayedNotes.length}</strong>{" "}
                {displayedNotes.length === 1 ? "note" : "notes"} found
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                className="btn-brand-ghost"
                onClick={() => setIsTopicModalOpen(true)}
                style={{
                  fontSize: "0.82rem",
                  padding: "0.35rem 0.8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <span>Change Topic</span>
              </button>
              <button
                type="button"
                className="btn-brand-secondary"
                onClick={() => handleTopicSelect("")}
                style={{
                  fontSize: "0.82rem",
                  padding: "0.35rem 0.85rem",
                  background: "var(--surface)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <X size={14} />
                <span>Clear Filter</span>
              </button>
            </div>
          </div>
        )}

        {/* Notes Display */}
        {displayedNotes.length === 0 ? (
          !isLoggedIn ? (
            <EmptyState
              emoji="🔐"
              title="Sign in to access your workspace"
              subtitle="Keep your notes synced and organized. Sign in to your account or create a new one to get started."
              actionText="Sign In"
              actionLink="/login"
            />
          ) : searchQuery ? (
            <EmptyState
              emoji="🔍"
              title="No results found"
              subtitle={`No notes matched your search "${searchQuery}". Try a different keyword.`}
              actionText="Clear Search"
              actionLink="#"
              onAction={() => handleSearch("")}
            />
          ) : activeTopic ? (
            <EmptyState
              emoji="🏷️"
              title={`No notes tagged #${activeTopic}`}
              subtitle={`You don't have any notes matching #${activeTopic}. Try selecting another topic or clear the filter.`}
              actionText="Clear Topic Filter"
              actionLink="#"
              onAction={() => handleTopicSelect("")}
            />
          ) : (
            <EmptyState
              emoji={activeCategory !== "All" ? getCategoryMeta(activeCategory).icon : "📝"}
              title={activeCategory !== "All" ? `No notes in "${activeCategory}"` : "No notes yet"}
              subtitle={
                activeCategory !== "All"
                  ? `You don't have any notes filed under ${activeCategory}. Create one now!`
                  : "Your knowledge base is empty. Capture your first thought, snippet, or bookmark!"
              }
              actionText="Create Note"
              actionLink="/createNote"
            />
          )
        ) : (
          <div className={viewMode === "grid" ? "row g-3 g-md-4" : "d-flex flex-column gap-3"}>
            {displayedNotes.map((note) => (
              <div className={viewMode === "grid" ? "col-12 col-md-6 col-lg-4" : "w-100"} key={note._id}>
                <NoteCard note={note} />
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
