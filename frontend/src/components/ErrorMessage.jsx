import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      backgroundColor: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: 10, padding: "12px 16px",
    }}>
      <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "#fca5a5" }}>{message}</span>
    </div>
  );
}
