import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { api } from "../services/api";
import GameCard from "../components/GameCard";
import GamesTable from "../components/GamesTable";
import GenreFilter from "../components/GenreFilter";
import Loading from "../components/Loading";

export default function Games() {
  const [games,   setGames]   = useState([]);
  const [genres,  setGenres]  = useState([]);
  const [search,  setSearch]  = useState("");
  const [genre,   setGenre]   = useState("");
  const [loading, setLoading] = useState(true);
  const [view,    setView]    = useState("grid"); // "grid" | "table"

  const genreRef = useRef(genre);
  useEffect(() => { genreRef.current = genre; }, [genre]);

  const loadGames = useCallback(async (overrideGenre) => {
    try {
      setLoading(true);
      const data = await api.listGames({
        page: 1, per_page: 50,
        genre: overrideGenre ?? genreRef.current,
      });
      setGames(data.games ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGenres = useCallback(async () => {
    try {
      const data = await api.getGenresList();
      setGenres(data ?? []);
    } catch (err) { console.error(err); }
  }, []);

  const handleSearch = useCallback(async () => {
    const q = search.trim();
    if (!q) { loadGames(); return; }
    try {
      setLoading(true);
      const data = await api.listGames({ page: 1, per_page: 50, search: q });
      setGames(data.games ?? []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, loadGames]);

  useEffect(() => { loadGames(genre); }, [genre, loadGames]);
  useEffect(() => { loadGenres(); }, [loadGenres]);

  function clearSearch() { setSearch(""); loadGames(); }

  const iconBtn = (active, onClick, Icon) => (
    <button onClick={onClick} style={{
      width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer",
      backgroundColor: active ? "var(--accent)" : "var(--bg-input)",
      color: active ? "#fff" : "var(--text-2)", transition: "all 0.15s",
    }}>
      <Icon size={15} />
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>🎮 Biblioteca Steam</h1>
        <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>
          Explore os jogos mais populares da Steam
        </p>
      </div>

      {/* Search bar */}
      <div style={{
        display: "flex", gap: 10, alignItems: "center",
        background: "var(--bg-card)", padding: "14px 16px",
        borderRadius: 12, border: "1px solid var(--border)",
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Pesquisar jogo..."
            style={{
              width: "100%", padding: "9px 34px 9px 32px",
              borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--bg-base)", color: "var(--text-1)",
              fontSize: 13, outline: "none",
            }}
          />
          {search && (
            <button onClick={clearSearch} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "var(--text-3)",
              display: "flex", alignItems: "center",
            }}>
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          style={{
            padding: "9px 20px", borderRadius: 8, border: "none",
            backgroundColor: "var(--accent)", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0,
          }}
        >
          Buscar
        </button>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {iconBtn(view === "grid",  () => setView("grid"),  LayoutGrid)}
          {iconBtn(view === "table", () => setView("table"), List)}
        </div>
      </div>

      {/* Genre filter pills */}
      {genres.length > 0 && (
        <GenreFilter genres={genres} selected={genre} onChange={setGenre} />
      )}

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {[
          { label: "Jogos exibidos", value: games.length },
          { label: "Gêneros disponíveis", value: genres.length },
          { label: "Filtro ativo", value: genre || "Todos" },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: "var(--bg-card)", padding: "10px 16px",
            borderRadius: 10, border: "1px solid var(--border)",
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <span style={{ fontSize: 11, color: "var(--text-3)" }}>{label}:</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-1)" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Loading text="Carregando jogos..." />
      ) : games.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)", fontSize: 14 }}>
          Nenhum jogo encontrado para este filtro.
        </div>
      ) : view === "table" ? (
        <GamesTable games={games} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {games.map((game) => (
            <GameCard key={game["AppID"] ?? `${game.Name}-${game["Peak CCU"]}`} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
