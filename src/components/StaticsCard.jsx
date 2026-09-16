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
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "165px",
        position: "relative",
      }}
    >
      {/* Top row: Icon Capsule + Metric Value */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-md)",
            background: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            boxShadow: `0 4px 12px color-mix(in srgb, ${accentColor} 18%, transparent)`,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            color: "var(--text-main)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </div>
      </div>

      {/* Middle row: Title */}
      <div>
        <div
          style={{
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: "0.85rem",
          }}
        >
          {title}
        </div>
      </div>

      {/* Bottom row: Action button */}
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: "100%",
          padding: "0.45rem 0.85rem",
          borderRadius: "var(--radius-md)",
          background: "var(--surface-subtle)",
          border: "1px solid var(--surface-border)",
          color: "var(--text-main)",
          fontSize: "0.82rem",
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-hover)";
          e.currentTarget.style.borderColor = "var(--primary-border)";
          e.currentTarget.style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface-subtle)";
          e.currentTarget.style.borderColor = "var(--surface-border)";
          e.currentTarget.style.color = "var(--text-main)";
        }}
      >
        <span>{buttonText}</span>
        <ArrowRight size={13} color="currentColor" />
      </button>
    </div>
  );
}
