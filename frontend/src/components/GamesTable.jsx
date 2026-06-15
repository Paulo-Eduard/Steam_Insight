import { useState } from "react";

const TH = { padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };

const TD = { padding: "10px 14px", fontSize: 12, color: "var(--text-2)",
  borderBottom: "1px solid var(--border)", verticalAlign: "middle" };

export default function GamesTable({ games }) {
  const [hovered, setHovered] = useState(null);

  if (!games || games.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-3)", fontSize: 13 }}>
        Nenhum jogo encontrado.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--bg-sidebar)" }}>
            <th style={TH}>#</th>
            <th style={TH}>Nome</th>
            <th style={TH}>Gênero</th>
            <th style={{ ...TH, textAlign: "right" }}>Preço</th>
            <th style={{ ...TH, textAlign: "right" }}>Peak CCU</th>
            <th style={{ ...TH, textAlign: "right" }}>Aprovação</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => {
            const approval = game.approval_pct ?? null;
            const approvalColor = approval >= 80 ? "#34d399" : approval >= 60 ? "#fbbf24" : approval != null ? "#f87171" : "var(--text-4)";
            const isHovered = hovered === index;
            return (
              <tr
                key={game["AppID"] ?? `${game.Name}-${index}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                style={{ backgroundColor: isHovered ? "var(--hover-bg)" : "transparent", transition: "background 0.1s" }}
              >
                <td style={{ ...TD, color: "var(--text-4)", width: 40 }}>{index + 1}</td>
                <td style={{ ...TD, color: "var(--text-1)", fontWeight: 500, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {game.Name}
                </td>
                <td style={{ ...TD, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent)", fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>
                    {game.Genres?.split(",")[0] ?? "—"}
                  </span>
                </td>
                <td style={{ ...TD, textAlign: "right", color: game.Price === 0 ? "#34d399" : "var(--text-1)", fontWeight: 600 }}>
                  {game.Price === 0 ? "Free" : `$${game.Price?.toFixed(2)}`}
                </td>
                <td style={{ ...TD, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {game["Peak CCU"]?.toLocaleString() ?? "—"}
                </td>
                <td style={{ ...TD, textAlign: "right", color: approvalColor, fontWeight: 600 }}>
                  {approval != null ? `${approval}%` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
