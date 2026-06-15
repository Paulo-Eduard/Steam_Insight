import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  Cell, Legend, ScatterChart, Scatter, ZAxis
} from "recharts";

const COLORS = ["#60a5fa","#34d399","#fbbf24","#f87171","#a78bfa","#fb923c","#38bdf8","#e879f9","#4ade80","#f97316"];

const MAX_CHARS = 18;
function CustomTick({ x, y, payload }) {
  const full  = payload?.value ?? "";
  const label = full.length > MAX_CHARS ? full.slice(0, MAX_CHARS - 1) + "…" : full;
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{full}</title>
      <text x={-6} y={0} dy={4} textAnchor="end" fill="var(--text-2)" fontSize={11} style={{ userSelect:"none" }}>
        {label}
      </text>
    </g>
  );
}

function Card({ title, subtitle, children, loading }) {
  return (
    <div style={{ backgroundColor:"var(--bg-card)", borderRadius:12, border:"1px solid var(--border)", padding:"16px" }}>
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"var(--text-1)" }}>{title}</div>
        {subtitle && <div style={{ fontSize:10, color:"var(--text-3)", marginTop:2 }}>{subtitle}</div>}
      </div>
      {loading
        ? <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-3)", fontSize:11 }}>Carregando...</div>
        : children}
    </div>
  );
}

export default function Analytics() {
  const { data: genres,     loading: lg  } = useFetch(api.getGenres);
  const { data: genreStats, loading: lgs } = useFetch(api.getGenreStats);
  const { data: reviews,    loading: lr  } = useFetch(api.getBestReviews);
  const { data: popular,    loading: lp  } = useFetch(() => api.getPopular(20));
  const { data: played,     loading: lpl } = useFetch(() => api.getPlayed(15));

  const genreData = genres ? genres.map(g => ({ name: g.genre, value: g.count })) : [];
  const genreStatsData = genreStats
    ? genreStats.map(g => ({
        name:  g.genre,
        preco: g.avg_price,
        score: g.avg_score,
        ccu:   g.avg_ccu,
      })).sort((a, b) => b.score - a.score)
    : [];
  const reviewData = reviews ? reviews.slice(0,15) : [];
  const popularData = popular ? popular.map(g => ({ name: (g.name ?? g.Name)?.slice(0,18), value: g.peak_ccu ?? g["Peak CCU"] ?? 0 })) : [];
  const playedData  = played  ? played.map(g => ({ name: (g.name ?? g.Name)?.slice(0,18), value: g.playtime_hours ?? 0 })) : [];

  const scatterData = popular
    ? popular.filter(g => (g.peak_ccu ?? g["Peak CCU"] ?? 0) > 0).map(g => ({
        price:   g.price ?? g.Price ?? 0,
        players: Math.round((g.peak_ccu ?? g["Peak CCU"] ?? 0) / 1000),
        name:    g.name ?? g.Name,
      }))
    : [];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <h1 style={{ fontSize:18, fontWeight:700, color:"var(--text-1)" }}>Analytics</h1>
        <p style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>Análises detalhadas baseadas no dataset Kaggle Steam</p>
      </div>

      {/* Row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="Top Gêneros por Quantidade" subtitle="Número de jogos por gênero" loading={lg}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={genreData} layout="vertical" margin={{ left:0, right:30, top:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill:"var(--text-3)", fontSize:10 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" width={130} tick={<CustomTick />} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:8, fontSize:12 }} formatter={v => [v.toLocaleString(), "Jogos"]} />
              <Bar dataKey="value" radius={[0,4,4,0]} barSize={16}>
                {genreData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Score vs Preço por Gênero" subtitle="Score médio Metacritic e preço médio (top 10 gêneros)" loading={lgs}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={genreStatsData} margin={{ left:-10, right:10, top:4, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill:"var(--text-3)", fontSize:9 }} tickLine={false} axisLine={{ stroke:"var(--border)" }} interval={0} angle={-30} textAnchor="end" height={46} />
              <YAxis yAxisId="score" orientation="left"  tick={{ fill:"var(--text-3)", fontSize:10 }} tickLine={false} axisLine={false} label={{ value:"Score", angle:-90, position:"insideLeft", fill:"var(--text-4)", fontSize:9, dx:12 }} />
              <YAxis yAxisId="price" orientation="right" tick={{ fill:"var(--text-3)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`$${v}`} label={{ value:"Preço", angle:90, position:"insideRight", fill:"var(--text-4)", fontSize:9, dx:-6 }} />
              <Tooltip
                contentStyle={{ backgroundColor:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:8, fontSize:11 }}
                formatter={(v, name) => name === "score" ? [v.toFixed(1), "Score Metacritic"] : [`$${v.toFixed(2)}`, "Preço Médio"]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:10, color:"var(--text-2)", paddingTop:4 }}
                formatter={n => n === "score" ? "Score Metacritic" : "Preço Médio ($)"} />
              <Bar yAxisId="score" dataKey="score" fill="#60a5fa" radius={[4,4,0,0]} barSize={14} />
              <Bar yAxisId="price" dataKey="preco" fill="#fbbf24" radius={[4,4,0,0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="Top 20 Jogos Mais Populares" subtitle="Por pico de jogadores simultâneos" loading={lp}>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {popularData.map((g, i) => {
              const maxVal = popularData[0]?.value || 1;
              const pct    = Math.max((g.value / maxVal) * 100, 2);
              const color  = i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#fb923c" : i < 7 ? "#3b82f6" : "#1d4ed8";
              const label  = g.value >= 1e6 ? `${(g.value/1e6).toFixed(2)}M` : g.value >= 1e3 ? `${(g.value/1e3).toFixed(1)}K` : String(g.value);
              const medal  = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  {/* rank */}
                  <span style={{ fontSize:10, fontWeight:700, color:"var(--text-4)", width:18, textAlign:"right", flexShrink:0 }}>
                    {medal ?? i+1}
                  </span>
                  {/* bar track */}
                  <div style={{ flex:1, position:"relative", height:22, backgroundColor:"var(--border)", borderRadius:4, overflow:"hidden" }}>
                    {/* filled bar */}
                    <div style={{
                      position:"absolute", left:0, top:0, bottom:0,
                      width:`${pct}%`, borderRadius:4,
                      background: i < 3
                        ? `linear-gradient(90deg, ${color}cc, ${color})`
                        : `linear-gradient(90deg, ${color}99, ${color})`,
                    }} />
                    {/* name inside bar */}
                    <span style={{
                      position:"absolute", left:7, top:"50%", transform:"translateY(-50%)",
                      fontSize:10, fontWeight:600, color:"#fff",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                      maxWidth:"80%", textShadow:"0 1px 3px rgba(0,0,0,0.5)",
                      pointerEvents:"none",
                    }}>
                      {g.name}
                    </span>
                  </div>
                  {/* value */}
                  <span style={{ fontSize:10, fontWeight:700, color:"var(--text-2)", width:38, textAlign:"right", flexShrink:0 }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Top 15 Mais Jogados" subtitle="Tempo médio de jogo em horas" loading={lpl}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={playedData} layout="vertical" margin={{ left:0, right:45, top:0, bottom:0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={<CustomTick />} width={130} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:8, fontSize:11 }} formatter={v => [`${v}h`, "Horas"]} />
              <Bar dataKey="value" radius={[0,4,4,0]} barSize={11}
                label={{ position:"right", fill:"var(--text-3)", fontSize:9, formatter: v => `${v}h` }}>
                {playedData.map((_,i) => <Cell key={i} fill={i<3?"#10b981":i<7?"#059669":"#047857"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="Top 15 Melhor Avaliados" subtitle="Taxa de aprovação (mín. 500 reviews)" loading={lr}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {reviewData.map((g,i) => {
              const c = g.approval_pct >= 95 ? "#34d399" : g.approval_pct >= 80 ? "#60a5fa" : "#fbbf24";
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:10, color:"var(--text-4)", width:16, textAlign:"right" }}>{i+1}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:11, color:"var(--text-1)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"70%" }}>{g.Name}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:c }}>{g.approval_pct}%</span>
                    </div>
                    <div style={{ marginTop:3, height:3, backgroundColor:"var(--border)", borderRadius:4 }}>
                      <div style={{ height:"100%", width:`${g.approval_pct}%`, backgroundColor:c, borderRadius:4 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Preço vs Popularidade" subtitle="Relação entre preço e Peak CCU (top 20)" loading={lp}>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top:5, right:10, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="price" type="number" name="Preço" tick={{ fill:"var(--text-3)", fontSize:10 }} tickLine={false} axisLine={{ stroke:"var(--border)" }} tickFormatter={v=>`$${v}`} />
              <YAxis dataKey="players" type="number" name="Jogadores" tick={{ fill:"var(--text-3)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${v}K`} />
              <ZAxis range={[40,120]} />
              <Tooltip contentStyle={{ backgroundColor:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:8, fontSize:11 }}
                formatter={(v,name) => name==="Preço" ? [`$${v}`,"Preço"] : [`${v}K`,"Jogadores"]} />
              <Scatter data={scatterData} fill="#60a5fa" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
