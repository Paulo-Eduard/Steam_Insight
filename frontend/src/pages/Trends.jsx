import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import Loading from "../components/Loading";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

function RankRow({ rank, game }) {
  const ccu = game.peak_ccu ?? game["Peak CCU"] ?? 0;
  const maxCCU = 1_013_936; // referência Counter-Strike 2
  const pct = Math.min((ccu / maxCCU) * 100, 100);
  const rankColor = rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : rank === 3 ? "#f97316" : "var(--text-4)";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      background: "var(--bg-card)", padding: "12px 16px",
      borderRadius: 10, border: "1px solid var(--border)",
      transition: "border-color 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: rankColor, width: 24, textAlign: "center", flexShrink: 0 }}>
        {rank <= 3 ? ["🥇","🥈","🥉"][rank - 1] : rank}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {game.name ?? game.Name}
        </div>
        <div style={{ marginTop: 5, height: 4, backgroundColor: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, backgroundColor: rank <= 3 ? "#fbbf24" : "var(--accent)", borderRadius: 4, transition: "width 0.4s ease" }} />
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>
          {ccu >= 1e6 ? `${(ccu / 1e6).toFixed(2)}M` : ccu >= 1e3 ? `${(ccu / 1e3).toFixed(1)}K` : ccu}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-3)" }}>Peak CCU</div>
      </div>
      {(game.genres ?? game.Genres) && (
        <span style={{
          fontSize: 10, fontWeight: 600, padding: "3px 9px",
          borderRadius: 20, flexShrink: 0,
          backgroundColor: "var(--accent-bg)", color: "var(--accent)",
        }}>
          {((game.genres ?? game.Genres) ?? "").split(",")[0]}
        </span>
      )}
    </div>
  );
}

export default function Trends() {
  const { data, loading, error } = useFetch(() => api.getPopular(20));
  const { data: played } = useFetch(() => api.getPlayed(10));

  const areaData = played
    ? played.map((g) => ({ name: ((g.name ?? g.Name) ?? "").slice(0, 14), horas: g.playtime_hours })).reverse()
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>📈 Tendências Steam</h1>
        <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>
          Jogos em alta por pico de jogadores simultâneos
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

        {/* Ranking */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
            🏆 Top 20 — Mais Populares
          </div>
          {loading && <Loading />}
          {error   && <div style={{ color: "#f87171", fontSize: 12 }}>Erro ao carregar dados</div>}
          {!loading && !error && data?.map((game, i) => (
            <RankRow key={game.name ?? game.Name} rank={i + 1} game={game} />
          ))}
        </div>

        {/* Área chart de tempo médio */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 12 }}>
            ⏱ Tempo Médio de Jogo (Top 10)
          </div>
          <div style={{
            background: "var(--bg-card)", borderRadius: 12,
            border: "1px solid var(--border)", padding: "16px",
          }}>
            {areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -10, bottom: 50 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--text-3)", fontSize: 9 }}
                    tickLine={false} axisLine={{ stroke: "var(--border)" }}
                    angle={-40} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: "var(--text-3)", fontSize: 10 }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `${v}h`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`${v}h`, "Horas médias"]}
                  />
                  <Area type="monotone" dataKey="horas" stroke="#3b82f6" strokeWidth={2}
                    fill="url(#areaGrad)" dot={{ fill: "#3b82f6", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
