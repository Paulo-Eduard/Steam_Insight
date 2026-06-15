export default function GenreFilter({ genres, selected, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button
        onClick={() => onChange("")}
        style={{
          padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          cursor: "pointer", border: "1px solid var(--border)", transition: "all 0.15s",
          backgroundColor: selected === "" ? "var(--accent)" : "var(--bg-input)",
          color: selected === "" ? "#fff" : "var(--text-2)",
        }}
      >
        Todos
      </button>
      {genres.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            cursor: "pointer", border: "1px solid var(--border)", transition: "all 0.15s",
            backgroundColor: selected === g ? "var(--accent)" : "var(--bg-input)",
            color: selected === g ? "#fff" : "var(--text-2)",
          }}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
