import { useRouter } from "../context/RouterContext";

export default function NotFound() {
  const { navigate } = useRouter();
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "60vh", gap: 16, textAlign: "center",
    }}>
      <div style={{ fontSize: 72 }}>🎮</div>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: "var(--text-1)" }}>404</h1>
      <p style={{ fontSize: 14, color: "var(--text-3)" }}>Essa página não existe no catálogo Steam.</p>
      <button
        onClick={() => navigate("dashboard")}
        style={{
          marginTop: 8, padding: "10px 24px", borderRadius: 10, border: "none",
          backgroundColor: "var(--accent)", color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}
      >
        Voltar ao Dashboard
      </button>
    </div>
  );
}
