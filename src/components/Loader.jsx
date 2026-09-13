import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: "0.85rem",
      }}
    >
      <Loader2
        size={24}
        color="var(--primary)"
        style={{ animation: "spin 1s linear infinite" }}
      />

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.88rem",
          fontWeight: 500,
          fontFamily: "var(--font-display)",
          margin: 0,
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
