import { Sparkles } from "lucide-react";

export default function Loader({ message = "Loading your workspace..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "65vh",
        gap: "1.2rem",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid var(--primary-subtle)",
            borderTopColor: "var(--primary)",
            animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
        <Sparkles size={22} color="var(--primary-light)" />
      </div>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.92rem",
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.01em",
        }}
      >
        {message}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
