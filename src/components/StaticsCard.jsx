import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function StaticsCard({
  icon,
  title,
  value,
  accentColor = "var(--primary)",
  buttonText = "View Details",
  buttonLink = "/",
  onClick,
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick && typeof onClick === "function") {
      onClick();
    } else if (buttonLink) {
      navigate(buttonLink);
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.15rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "155px",
        position: "relative",
      }}
    >
      {/* Top row: Icon Capsule + Metric Value */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
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
            color: accentColor,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: "1.85rem",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color: "var(--text-main)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </div>
      </div>

      {/* Middle row: Title */}
      <div>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--text-muted)",
            marginBottom: "0.75rem",
          }}
        >
          {title}
        </div>
      </div>

      {/* Bottom row: Clean action button */}
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: "100%",
          padding: "0.4rem 0.75rem",
          borderRadius: "var(--radius-md)",
          background: "var(--surface-subtle)",
          border: "1px solid var(--surface-border)",
          color: "var(--text-main)",
          fontSize: "0.8rem",
          fontWeight: 500,
          fontFamily: "var(--font-display)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-hover)";
          e.currentTarget.style.borderColor = "var(--surface-border-strong)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface-subtle)";
          e.currentTarget.style.borderColor = "var(--surface-border)";
        }}
      >
        <span>{buttonText}</span>
        <ArrowRight size={13} color="var(--text-muted)" />
      </button>
    </div>
  );
}
