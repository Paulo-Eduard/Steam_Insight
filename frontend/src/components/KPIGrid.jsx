const LABEL_MAP = {
  total_games:    { label: "Total de Jogos",   icon: "🎮", color: "#60a5fa" },
  average_price:  { label: "Preço Médio",      icon: "💲", color: "#34d399" },
  approval_rate:  { label: "Taxa de Aprovação",icon: "👍", color: "#fbbf24" },
  insights_count: { label: "Insights Gerados", icon: "💡", color: "#a78bfa" },
  peak_players:   { label: "Pico de Jogadores",icon: "👥", color: "#22d3ee" },
};

function fmt(key, value) {
  if (value == null) return "—";
  if (key === "average_price") return `$${Number(value).toFixed(2)}`;
  if (key === "approval_rate") return `${Number(value).toFixed(1)}%`;
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}

export default function KPIGrid({ data }) {
  if (!data) return null;

  // Suporta tanto { kpis: {...} } quanto objeto flat direto da API
  const kpis = data.kpis ?? data;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
      {Object.entries(kpis).map(([key, value]) => {
        const meta = LABEL_MAP[key] ?? { label: key.replaceAll("_", " "), icon: "📊", color: "var(--accent)" };
        return (
          <div key={key} style={{
            background: "var(--bg-card)", padding: "20px 22px",
            borderRadius: 12, border: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)" }}>
                {meta.label}
              </span>
              <span style={{
                width: 30, height: 30, borderRadius: 8, fontSize: 14,
                backgroundColor: `${meta.color}18`,
                border: `1px solid ${meta.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {meta.icon}
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)", lineHeight: 1 }}>
              {fmt(key, value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
