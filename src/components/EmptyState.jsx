import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function EmptyState({
  emoji = "📝",
  title = "No notes found",
  subtitle = "Get started by creating your first note or trying a different filter.",
  actionText = "Create Note",
  actionLink = "/createNote",
  onAction,
}) {
  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: "3.5rem 2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "580px",
        margin: "2rem auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow halo */}
      <div
        style={{
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          animation: "pulseGlow 3s ease-in-out infinite",
        }}
      >
        <span style={{ fontSize: "3.2rem", filter: "drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3))" }}>
          {emoji}
        </span>
      </div>

      <h3
        style={{
          fontSize: "1.45rem",
          fontWeight: 700,
          color: "var(--text-main)",
          marginBottom: "0.5rem",
          fontFamily: "var(--font-display)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.92rem",
          maxWidth: "400px",
          marginBottom: "1.75rem",
          lineHeight: 1.55,
        }}
      >
        {subtitle}
      </p>

      {actionText && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-brand-primary"
          style={{ cursor: "pointer" }}
        >
          <Plus size={17} />
          <span>{actionText}</span>
        </button>
      ) : actionText && actionLink ? (
        <Link to={actionLink} className="btn-brand-primary">
          <Plus size={17} />
          <span>{actionText}</span>
        </Link>
      ) : null}
    </div>
  );
}
