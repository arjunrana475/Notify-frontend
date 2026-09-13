import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";

export default function EmptyState({
  icon,
  emoji,
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
        padding: "3rem 1.5rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "520px",
        margin: "1.5rem auto",
        position: "relative",
      }}
    >
      {/* Clean Icon Capsule */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-subtle)",
          border: "1px solid var(--surface-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          color: "var(--text-muted)",
        }}
      >
        {icon ? (
          icon
        ) : emoji ? (
          <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
        ) : (
          <FileText size={22} color="var(--text-muted)" />
        )}
      </div>

      <h3
        style={{
          fontSize: "1.15rem",
          fontWeight: 600,
          color: "var(--text-main)",
          marginBottom: "0.35rem",
          fontFamily: "var(--font-display)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          maxWidth: "380px",
          marginBottom: "1.4rem",
          lineHeight: 1.5,
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
          <Plus size={15} />
          <span>{actionText}</span>
        </button>
      ) : actionText && actionLink ? (
        <Link to={actionLink} className="btn-brand-primary">
          <Plus size={15} />
          <span>{actionText}</span>
        </Link>
      ) : null}
    </div>
  );
}
