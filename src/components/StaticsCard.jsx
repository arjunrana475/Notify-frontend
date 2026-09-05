import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function StaticsCard({
  icon,
  title,
  value,
  accentColor = "#6366f1",
  buttonText = "View Details",
  buttonLink = "/",
}) {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "185px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.15,
          filter: "blur(25px)",
          pointerEvents: "none",
        }}
      />

      {/* Top row: Icon Capsule + Metric Value */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "var(--radius-md)",
            background: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accentColor} 28%, transparent)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            boxShadow: `0 4px 12px color-mix(in srgb, ${accentColor} 15%, transparent)`,
          }}
        >
          {icon}
        </div>
        <h2
          style={{
            fontSize: "2.3rem",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            color: "var(--text-main)",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {value}
        </h2>
      </div>

      {/* Middle row: Title */}
      <div>
        <h4
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: "0.9rem",
          }}
        >
          {title}
        </h4>
      </div>

      {/* Bottom row: Interactive link / button */}
      <button
        onClick={() => navigate(buttonLink)}
        style={{
          width: "100%",
          padding: "0.55rem 0.9rem",
          borderRadius: "var(--radius-md)",
          background: "var(--surface-hover)",
          border: "1px solid var(--surface-border)",
          color: "var(--text-main)",
          fontSize: "0.85rem",
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `color-mix(in srgb, ${accentColor} 15%, transparent)`;
          e.currentTarget.style.borderColor = `color-mix(in srgb, ${accentColor} 40%, transparent)`;
          e.currentTarget.style.color = accentColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface-hover)";
          e.currentTarget.style.borderColor = "var(--surface-border)";
          e.currentTarget.style.color = "var(--text-main)";
        }}
      >
        <span>{buttonText}</span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
