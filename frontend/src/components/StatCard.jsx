import { TrendingUp } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

const colorMap = {
  blue:   { icon:"#60a5fa", bg:"rgba(59,130,246,0.1)",   border:"rgba(59,130,246,0.2)",  spark:"#60a5fa" },
  green:  { icon:"#34d399", bg:"rgba(52,211,153,0.1)",   border:"rgba(52,211,153,0.2)",  spark:"#34d399" },
  purple: { icon:"#a78bfa", bg:"rgba(167,139,250,0.1)",  border:"rgba(167,139,250,0.2)", spark:"#a78bfa" },
  yellow: { icon:"#fbbf24", bg:"rgba(251,191,36,0.1)",   border:"rgba(251,191,36,0.2)",  spark:"#fbbf24" },
  cyan:   { icon:"#22d3ee", bg:"rgba(34,211,238,0.1)",   border:"rgba(34,211,238,0.2)",  spark:"#22d3ee" },
};

function Sparkline({ color }) {
  const pts = [30,20,35,15,40,25,38,22,42,18,45];
  const W=80, H=36, mx=Math.max(...pts), mn=Math.min(...pts);
  const coords = pts.map((p,i)=>`${(i/(pts.length-1))*W},${H-((p-mn)/(mx-mn))*(H-4)-2}`).join(" ");
  return (
    <svg width={W} height={H}>
      <polyline points={coords} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function OneCard({ title, value, subtitle, icon, color="blue", loading }) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div style={{ backgroundColor:"var(--bg-card)", borderRadius:12, border:"1px solid var(--border)", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, transition:"background 0.2s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--text-3)" }}>{title}</span>
        <div style={{ width:28, height:28, borderRadius:8, backgroundColor:c.bg, border:`1px solid ${c.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:c.icon }}>
          {icon}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:"var(--text-1)", lineHeight:1 }}>
            {loading ? <span style={{ color:"var(--text-4)" }}>—</span> : value}
          </div>
          {subtitle && (
            <div style={{ display:"flex", alignItems:"center", gap:3, marginTop:6, fontSize:10, color:"var(--text-3)" }}>
              <TrendingUp size={10} color="#34d399" />
              {subtitle}
            </div>
          )}
        </div>
        <Sparkline color={c.spark} />
      </div>
    </div>
  );
}

export default function StatCards() {
  const { data, loading } = useFetch(api.getDashboard);
  const fmt = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : String(n);
  return (
    <>
      <OneCard title="Total de Jogos"      value={data ? fmt(data.total_games) : "—"}              subtitle="Kaggle dataset"      icon="🎮" color="blue"   loading={loading} />
      <OneCard title="Preço Médio"         value={data ? `$${data.average_price}` : "—"}           subtitle="Jogos pagos"         icon="💲" color="green"  loading={loading} />
      <OneCard title="Tempo Médio de Jogo" value={data ? `${data.average_playtime_hours}h` : "—"}  subtitle="Quem realmente jogou" icon="⏱" color="purple" loading={loading} />
      <OneCard title="Taxa de Aprovação"   value={data ? `${data.approval_rate}%` : "—"}           subtitle="Positivos / total"   icon="👍" color="yellow" loading={loading} />
      <OneCard title="Pico de Jogadores"   value={data ? fmt(data.peak_players) : "—"}             subtitle="Soma Peak CCU"       icon="👥" color="cyan"   loading={loading} />
    </>
  );
}
