import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

const MAX_CHARS = 20;

function CustomTick({ x, y, payload }) {
  const full  = payload?.value ?? "";
  const label = full.length > MAX_CHARS ? full.slice(0, MAX_CHARS - 1) + "…" : full;
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{full}</title>
      <text
        x={-8} y={0} dy={4}
        textAnchor="end"
        fill="var(--text-2)"
        fontSize={11}
        style={{ userSelect: "none" }}
      >
        {label}
      </text>
    </g>
  );
}

const BAR_H    = 28;
const CHART_PAD = 8;

export default function MostPlayedChart() {
  const { data: raw, loading, error } = useFetch(api.getPlayed);

  const data = raw
    ? raw.map((g) => ({ name: g["Name"] ?? "—", value: g["playtime_hours"] ?? 0 }))
    : [];

  const chartHeight = data.length > 0 ? data.length * BAR_H + CHART_PAD : 220;

  return (
    <div style={{ backgroundColor:"var(--bg-card)", borderRadius:12, border:"1px solid var(--border)", padding:"14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:13, fontWeight:600, color:"var(--text-1)" }}>Jogos Mais Jogados</span>
        <span style={{ fontSize:10, color:"var(--text-3)" }}>Média em horas</span>
      </div>

      {loading && <div style={{ color:"var(--text-3)", fontSize:11, textAlign:"center", padding:"40px 0" }}>Carregando...</div>}
      {error   && <div style={{ color:"#f87171", fontSize:11, textAlign:"center", padding:"40px 0" }}>Erro: {error}</div>}

      {!loading && !error && (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            layout="vertical"
            barCategoryGap="30%"
            margin={{ left: 8, right: 56, top: 4, bottom: 4 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={148}
              tick={<CustomTick />}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{ backgroundColor:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:8, fontSize:12 }}
              formatter={(v) => [`${v}h`, "Horas jogadas"]}
              labelFormatter={(l) => l}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}
              label={{ position:"right", fill:"var(--text-3)", fontSize:10, formatter:(v)=>`${v}h` }}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#10b981" : i < 3 ? "#059669" : "#047857"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
