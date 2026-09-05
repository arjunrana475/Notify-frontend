import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch, placeholder = "Search notes by title, topic, or content..." }) {
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(search);
  };

  const handleClear = () => {
    setSearch("");
    if (onSearch) onSearch("");
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Search
        size={16}
        style={{
          position: "absolute",
          left: "14px",
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "0.55rem 2.4rem 0.55rem 2.4rem",
          background: "var(--surface)",
          border: "1px solid var(--surface-border)",
          borderRadius: "var(--radius-pill)",
          fontSize: "0.88rem",
          fontFamily: "var(--font-body)",
          color: "var(--text-main)",
          outline: "none",
          transition: "all var(--transition-fast)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--primary-light)";
          e.target.style.boxShadow = "0 0 0 3px var(--primary-subtle)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--surface-border)";
          e.target.style.boxShadow = "none";
        }}
      />
      {search && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: "absolute",
            right: "12px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "2px",
          }}
          title="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </form>
  );
}
