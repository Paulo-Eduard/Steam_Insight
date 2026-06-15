import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

const COLORS = ["#60a5fa","#3b82f6","#2563eb","#1d4ed8","#1e40af","#1e3a8a"];

export default function PriceVsPopularityChart() {
  const { data: raw, loading, error } = useFetch(api.getPriceVsScore);

  const data = raw
    ? raw.map((d) => ({ name: d.price_range, value: d.avg_approval }))
    : [];

  return (
    <div style={{ backgroundColor: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)", padding: "14px" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Preço vs. Aprovação</div>
        <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>Aprovação média por faixa de preço</div>
      </div>

      {loading && <div style={{ color: "var(--text-3)", fontSize: 11, textAlign: "center", padding: "40px 0" }}>Carregando...</div>}
      {error   && <div style={{ color: "#f87171", fontSize: 11, textAlign: "center", padding: "40px 0" }}>Erro ao carregar</div>}

      {!loading && !error && (
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={data} margin={{ top: 5, right: 10, bottom: 30, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "var(--text-3)", fontSize: 9 }} tickLine={false}
              axisLine={{ stroke: "var(--border)" }} angle={-30} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: "var(--text-3)", fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${v}%`, "Aprovação média"]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
