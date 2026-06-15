import { useEffect, useState } from "react";
import { api } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const MONTHS = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function KPICard({ label, value, color = "var(--accent)" }) {
  return (
    <div style={{
      background: "var(--bg-card)", padding: "20px 24px",
      borderRadius: 12, border: "1px solid var(--border)",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

const SELECT_STYLE = {
  padding: "9px 12px", borderRadius: 8, fontSize: 13,
  border: "1px solid var(--border)", background: "var(--bg-input)",
  color: "var(--text-1)", cursor: "pointer", outline: "none",
};

export default function Reports() {
  const [year,    setYear]    = useState(2024);
  const [month,   setMonth]   = useState("");
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      // ✅ Fix: passa year e month corretamente
      const res = await api.getMonthlyReport(year, month);
      setData(res);
    } catch (e) {
      setError(e.message ?? "Erro ao carregar relatório");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [year, month]);

  const topGames = data?.top_games ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>📊 Relatórios Inteligentes</h1>
        <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>Análise mensal do catálogo Steam</p>
      </div>

      {/* Filtros */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
        background: "var(--bg-card)", padding: "16px", borderRadius: 12, border: "1px solid var(--border)",
      }}>
        <label style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 600 }}>Ano</label>
        <select style={SELECT_STYLE} value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2019, 2020, 2021, 2022, 2023, 2024].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <label style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 600 }}>Mês</label>
        <select style={SELECT_STYLE} value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Todos os meses</option>
          {MONTHS.slice(1).map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>

        <button
          onClick={load}
          style={{
            padding: "9px 20px", borderRadius: 8, border: "none",
            backgroundColor: "var(--accent)", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          Atualizar
        </button>
      </div>

      {/* Estado */}
      {loading && <Loading text="Carregando relatório..." />}
      {error   && <ErrorMessage message={error} />}

      {!loading && !error && data && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            <KPICard label="Total de Jogos"  value={data.total_games?.toLocaleString() ?? "—"} color="var(--text-1)" />
            <KPICard label="Preço Médio"     value={`$${Number(data.average_price ?? 0).toFixed(2)}`} color="#34d399" />
            <KPICard label="Taxa de Aprovação" value={`${Number(data.approval_rate ?? 0).toFixed(1)}%`} color="#fbbf24" />
          </div>

          {/* Texto do relatório */}
          {data.report_text && (
            <div style={{
              background: "var(--bg-card)", padding: "14px 18px",
              borderRadius: 10, border: "1px solid var(--border)",
              fontSize: 13, color: "var(--text-2)", lineHeight: 1.6,
            }}>
              {data.report_text}
            </div>
          )}

          {/* Gráfico Top 5 */}
          <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 16 }}>
              Top 5 Jogos por Proprietários
            </div>
            {topGames.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topGames} margin={{ left: 0, right: 20, top: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--text-3)", fontSize: 10 }} tickLine={false}
                    axisLine={{ stroke: "var(--border)" }} angle={-20} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: "var(--text-3)", fontSize: 10 }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [v.toLocaleString(), "Proprietários"]}
                  />
                  <Bar dataKey="owners" radius={[4, 4, 0, 0]} barSize={40}>
                    {topGames.map((_, i) => (
                      <Cell key={i} fill={["#3b82f6","#2563eb","#1d4ed8","#1e40af","#1e3a8a"][i] ?? "#1e3a8a"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-3)", fontSize: 13 }}>
                Nenhum dado para este filtro.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
