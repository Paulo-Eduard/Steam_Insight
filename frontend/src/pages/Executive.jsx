import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import KPIGrid from "../components/KPIGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import {
  ResponsiveContainer, RadialBarChart, RadialBar, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#34d399", "#fbbf24", "#a78bfa"];

function InsightCard({ text, index }) {
  const icons = ["💡", "📊", "🎯", "🔍"];
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      background: "var(--bg-card)", padding: "14px 16px",
      borderRadius: 10, border: "1px solid var(--border)",
    }}>
      <span style={{
        fontSize: 18, width: 32, height: 32, display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "var(--accent-bg)", borderRadius: 8, flexShrink: 0,
      }}>
        {icons[index % icons.length]}
      </span>
      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}

export default function Executive() {
  const { data, loading, error } = useFetch(api.getExecutiveDashboard);
  const { data: genres } = useFetch(api.getGenres);

  const pieData = genres ? genres.slice(0, 4).map((g) => ({ name: g.genre, value: g.percent })) : [];

  const approvalRate = data?.approval_rate ?? 0;
  const radialData = [{ name: "Aprovação", value: approvalRate, fill: approvalRate >= 80 ? "#34d399" : approvalRate >= 60 ? "#fbbf24" : "#f87171" }];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>💼 Painel Executivo</h1>
        <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>Visão consolidada dos principais indicadores</p>
      </div>

      {loading && <Loading text="Carregando indicadores..." />}
      {error   && <ErrorMessage message="Erro ao carregar indicadores executivos." />}

      {!loading && !error && data && (
        <>
          {/* KPIs */}
          <KPIGrid data={data} />

          {/* Gauges + Pie */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Gauge de aprovação */}
            <div style={{
              background: "var(--bg-card)", borderRadius: 12,
              border: "1px solid var(--border)", padding: "16px",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 4, alignSelf: "flex-start" }}>
                Taxa de Aprovação Global
              </div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 8, alignSelf: "flex-start" }}>
                Avaliações positivas / total de reviews
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart
                  cx="50%" cy="80%" innerRadius="60%" outerRadius="90%"
                  startAngle={180} endAngle={0}
                  data={[{ ...radialData[0], fullMark: 100 }]}
                >
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "var(--border)" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`${v}%`, "Aprovação"]}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 32, fontWeight: 800, color: radialData[0].fill, marginTop: -24 }}>
                {approvalRate.toFixed(1)}%
              </div>
            </div>

            {/* Pie de gêneros */}
            <div style={{
              background: "var(--bg-card)", borderRadius: 12,
              border: "1px solid var(--border)", padding: "16px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>Top Gêneros</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 8 }}>Distribuição por volume de jogos</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}
                    label={({ name, value }) => `${name.split(",")[0]} ${value}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                    formatter={(v) => [`${v}%`, "Participação"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights */}
          {data.insights?.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 12 }}>
                🧠 Insights Automáticos
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.insights.map((text, i) => (
                  <InsightCard key={i} text={text} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
