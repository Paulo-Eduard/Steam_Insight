import { Clock, Users, Tag } from "lucide-react";

export default function GameCard({ game }) {
  const approval = game.approval_pct ?? 0;
  const approvalColor =
    approval >= 80 ? "#34d399" : approval >= 60 ? "#fbbf24" : "#ef4444";

  const approvalLabel =
    approval >= 80 ? "Muito Positivo" : approval >= 60 ? "Misto" : "Negativo";

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Title + price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{
          color: "var(--text-1)", fontSize: 13, fontWeight: 700,
          lineHeight: 1.4, flex: 1,
          overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {game.Name}
        </h3>
        <span style={{
          flexShrink: 0, fontSize: 12, fontWeight: 700, padding: "3px 9px",
          borderRadius: 20, backgroundColor: game.Price === 0 ? "rgba(52,211,153,0.12)" : "rgba(59,130,246,0.12)",
          color: game.Price === 0 ? "#34d399" : "#60a5fa",
          border: `1px solid ${game.Price === 0 ? "rgba(52,211,153,0.25)" : "rgba(59,130,246,0.25)"}`,
        }}>
          {game.Price === 0 ? "Free" : `$${Number(game.Price).toFixed(2)}`}
        </span>
      </div>

      {/* Genre */}
      {game.Genres && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {game.Genres.split(",").slice(0, 3).map((g) => (
            <span key={g} style={{
              fontSize: 10, fontWeight: 600, padding: "2px 8px",
              borderRadius: 20, backgroundColor: "var(--accent-bg)", color: "var(--accent)",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Tag size={9} /> {g.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
        {game["Peak CCU"] > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-3)" }}>
            <Users size={11} />
            <span>{Number(game["Peak CCU"]).toLocaleString()}</span>
          </div>
        )}
        {game.playtime_hours > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-3)" }}>
            <Clock size={11} />
            <span>{game.playtime_hours}h</span>
          </div>
        )}
      </div>

      {/* Approval bar */}
      {approval > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: "var(--text-3)" }}>Aprovação</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: approvalColor }}>
              {approval}% — {approvalLabel}
            </span>
          </div>
          <div style={{ height: 4, backgroundColor: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${approval}%`,
              backgroundColor: approvalColor, borderRadius: 4,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
