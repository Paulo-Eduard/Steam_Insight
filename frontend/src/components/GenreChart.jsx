import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

const COLORS = ["#60a5fa","#34d399","#fbbf24","#f87171","#a78bfa","#fb923c","#38bdf8","#e879f9","#4ade80","#f97316"];

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text x={cx + r * Math.cos(-midAngle * R)} y={cy + r * Math.sin(-midAngle * R)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function GenreChart() {
  const { data: raw, loading, error } = useFetch(api.getGenres);

  // API retorna [{genre, count, percent}]
  const data = raw
    ? raw.map((g) => ({ name: g.genre, value: g.percent }))
    : [];

  return (
    <div style={{ backgroundColor:"var(--bg-card)", borderRadius:12, border:"1px solid var(--border)", padding:"14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:600, color:"var(--text-1)" }}>Distribuição de Gêneros</span>
        <span style={{ fontSize:10, color:"var(--text-3)" }}>Por número de jogos</span>
      </div>

      {loading && <div style={{ color:"var(--text-3)", fontSize:11, textAlign:"center", padding:"40px 0" }}>Carregando...</div>}
      {error   && <div style={{ color:"#f87171", fontSize:11, textAlign:"center", padding:"40px 0" }}>Erro: {error}</div>}

      {!loading && !error && (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={68}
                dataKey="value" paddingAngle={3} labelLine={false} label={renderLabel}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor:"var(--bg-card)", border:"none", borderRadius:8, fontSize:12 }}
                formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 8px", marginTop:6 }}>
            {data.map((d, i) => (
              <div key={d.name} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", backgroundColor:COLORS[i % COLORS.length], flexShrink:0 }} />
                <span style={{ fontSize:10, color:"var(--text-2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</span>
                <span style={{ fontSize:10, color:"var(--text-3)", marginLeft:"auto" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
