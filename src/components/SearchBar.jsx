import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, Pin, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api.js";
import { getCategoryMeta } from "../constants/category.js";

export default function SearchBar({
  onSearch,
  placeholder = "Search notes by title, topic, category...",
  initialValue = "",
}) {
  const [search, setSearch] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  // Sync with initialValue if passed or changed
  useEffect(() => {
    if (initialValue !== undefined) {
      setSearch(initialValue);
    }
  }, [initialValue]);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K / Slash key to focus
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't intercept if user is typing in another input or textarea
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea" || e.target.isContentEditable) {
        if (e.target === inputRef.current && e.key === "Escape") {
          setIsOpen(false);
          inputRef.current.blur();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(Boolean(search.trim()));
      } else if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(Boolean(search.trim()));
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Live search fetcher with debouncing
  const fetchLiveResults = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await API.get(`/api/notes/search?search=${encodeURIComponent(query.trim())}`);
      setResults(res.data || []);
      setIsOpen(true);
    } catch (e) {
      console.error("Live search error:", e);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setSelectedIndex(-1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!val.trim()) {
      setResults([]);
      setIsOpen(false);
      if (onSearch) onSearch("");
      return;
    }

    // Fast live search debounce
    debounceTimer.current = setTimeout(() => {
      fetchLiveResults(val);
      if (onSearch && location.pathname === "/") {
        onSearch(val);
      }
    }, 240);
  };

  const handleClear = () => {
    setSearch("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  const handleSelectNote = (noteId) => {
    setIsOpen(false);
    navigate(`/note/${noteId}`);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleSelectNote(results[selectedIndex]._id);
      return;
    }

    setIsOpen(false);

    if (onSearch && location.pathname === "/") {
      onSearch(search);
    } else {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < Math.min(results.length - 1, 5) ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.min(results.length - 1, 5)));
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Helper to highlight matching text query
  const highlightMatch = (text, query) => {
    if (!text || !query.trim()) return text;
    const regex = new RegExp(`(${query.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="search-highlight-mark">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="search-bar-root" style={{ position: "relative", width: "100%" }}>
      <form onSubmit={handleSubmit} style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
        {/* Search / Spinner Icon */}
        <div className="search-bar-lead-icon">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-primary" style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Search size={16} color="var(--text-muted)" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          className="search-bar-input"
          placeholder={placeholder}
          value={search}
          onChange={handleChange}
          onFocus={() => {
            if (search.trim() && results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search notes"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />

        {/* Right action group: Clear button + Keyboard shortcut badge */}
        <div className="search-bar-tail-group">
          {search ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              title="Clear search (Esc)"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : (
            <div className="search-shortcut-badge" title="Press Ctrl+K or / to search">
              <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd>K</kbd>
            </div>
          )}
        </div>
      </form>

      {/* Live Search Results Dropdown Overlay */}
      {isOpen && search.trim() && (
        <div className="search-dropdown-glass glass-panel" ref={dropdownRef} role="listbox">
          {/* Header */}
          <div className="search-dropdown-header">
            <span className="search-dropdown-heading">
              <Sparkles size={13} color="var(--primary-light)" />
              <span>{results.length > 0 ? `Found ${results.length} notes` : "Search Results"}</span>
            </span>
            <span className="search-dropdown-shortcut-hint">
              <span>Navigate</span> <kbd>↑</kbd> <kbd>↓</kbd> <span>Select</span> <kbd>↵</kbd>
            </span>
          </div>

          {/* Results List */}
          {results.length === 0 ? (
            <div className="search-empty-dropdown">
              <span style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>🔍</span>
              <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem" }}>
                No notes found
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                No matches for "{search}". Try searching another topic or title.
              </span>
            </div>
          ) : (
            <div className="search-results-list">
              {results.slice(0, 6).map((note, index) => {
                const meta = getCategoryMeta(note.category);
                const isSelected = selectedIndex === index;

                return (
                  <div
                    key={note._id}
                    className={`search-result-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectNote(note._id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="search-result-top">
                      <div className="search-result-title-group">
                        <span className="search-result-cat-icon">{meta.icon}</span>
                        <span className="search-result-title">{highlightMatch(note.title, search)}</span>
                      </div>
                      {note.isPinned && (
                        <span className="search-result-pin" title="Pinned Note">
                          <Pin size={12} />
                        </span>
                      )}
                    </div>

                    {note.content && (
                      <p className="search-result-snippet">
                        {highlightMatch(
                          note.content.length > 95 ? `${note.content.slice(0, 95)}...` : note.content,
                          search
                        )}
                      </p>
                    )}

                    <div className="search-result-meta">
                      <span className={`badge-pill ${meta.colorClass}`} style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                        {note.category}
                      </span>

                      {Array.isArray(note.topics) && note.topics.length > 0 && (
                        <span className="search-result-topics">
                          {note.topics.slice(0, 2).map((t) => (
                            <span key={t} className="search-mini-topic">
                              #{t}
                            </span>
                          ))}
                        </span>
                      )}

                      <span className="search-result-open-hint">
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer View All CTA */}
          {results.length > 0 && (
            <div className="search-dropdown-footer" onClick={() => handleSubmit()}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <CornerDownLeft size={13} color="var(--primary-light)" />
                <span>View all results for "{search}" on workspace</span>
              </div>
              <span className="search-count-pill">{results.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
