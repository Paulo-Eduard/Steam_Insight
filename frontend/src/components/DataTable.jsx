const LABEL_MAP = {
  Name:         "Nome",
  Price:        "Preço",
  Genres:       "Gêneros",
  "Peak CCU":   "Peak CCU",
  approval_pct: "Aprovação",
  playtime_hours: "Horas de Jogo",
  owners:       "Proprietários",
  success_score:"Score",
};

function formatValue(key, value) {
  if (value == null || value === "") return "—";
  if (key === "Price")        return value === 0 ? "Free" : `$${Number(value).toFixed(2)}`;
  if (key === "approval_pct") return `${value}%`;
  if (key === "Peak CCU" || key === "owners") return Number(value).toLocaleString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

const TH = {
  padding: "10px 14px", fontSize: 11, fontWeight: 700,
  color: "var(--text-3)", textTransform: "uppercase",
  letterSpacing: "0.05em", textAlign: "left",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
};

const TD = {
  padding: "10px 14px", fontSize: 12,
  color: "var(--text-2)", borderBottom: "1px solid var(--border)",
};

export default function DataTable({ data }) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--text-3)", fontSize: 13 }}>
        Nenhum dado encontrado.
      </div>
    );
  }

  // Suporta array de objetos ou objeto único
  const rows  = Array.isArray(data) ? data : [data];
  const keys  = Object.keys(rows[0]);

  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--bg-sidebar)" }}>
            {keys.map((k) => (
              <th key={k} style={TH}>{LABEL_MAP[k] ?? k.replaceAll("_", " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-bg)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              style={{ transition: "background 0.1s" }}
            >
              {keys.map((k) => (
                <td key={k} style={{ ...TD, color: k === "Name" ? "var(--text-1)" : "var(--text-2)", fontWeight: k === "Name" ? 500 : 400 }}>
                  {formatValue(k, row[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
