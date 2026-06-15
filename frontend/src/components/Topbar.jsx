import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Bell, Search, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "../context/RouterContext";
import { api } from "../services/api";

export default function Topbar() {
  const { dark, toggle } = useTheme();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleInput(val) {
    setQuery(val);
    clearTimeout(timerRef.current);
    if (val.trim().length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await api.searchGames(val.trim());
        setResults(data);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
  }

  function clear() { setQuery(""); setResults([]); setOpen(false); }

  return (
    <header style={{
      height:56, borderBottom:"1px solid var(--border)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 20px", backgroundColor:"var(--bg-sidebar)",
      backdropFilter:"blur(12px)", flexShrink:0, transition:"background 0.2s",
    }}>
      {/* Left */}
      <div>
        <div style={{ fontSize:15, fontWeight:700, color:"var(--text-1)", lineHeight:1.2 }}>Olá! 👋</div>
        <div style={{ fontSize:10, color:"var(--text-3)", marginTop:2 }}>Resumo do mercado de jogos Steam — Kaggle dataset</div>
      </div>

      {/* Right */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>

        {/* Search */}
        <div ref={wrapRef} style={{ position:"relative" }}>
          <Search style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:"var(--text-3)", pointerEvents:"none" }} size={13} />
          <input
            value={query}
            onChange={e => handleInput(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Buscar jogo..."
            style={{
              backgroundColor:"var(--bg-input)", color:"var(--text-1)", fontSize:12,
              borderRadius:8, padding:"7px 32px 7px 30px",
              border:"1px solid var(--border)", outline:"none", width:200,
              transition:"border 0.15s",
            }}
          />
          {query && (
            <button onClick={clear} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", display:"flex" }}>
              <X size={12} />
            </button>
          )}

          {/* Dropdown */}
          {open && (
            <div style={{
              position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
              backgroundColor:"var(--bg-card)", border:"1px solid var(--border)",
              borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,0.25)",
              zIndex:1000, maxHeight:320, overflowY:"auto",
            }}>
              {loading && (
                <div style={{ padding:"12px 14px", fontSize:11, color:"var(--text-3)" }}>Buscando...</div>
              )}
              {!loading && results.length === 0 && (
                <div style={{ padding:"12px 14px", fontSize:11, color:"var(--text-3)" }}>Nenhum resultado</div>
              )}
              {!loading && results.map((g, i) => (
                <div key={i}
                  onClick={() => { navigate("games"); clear(); }}
                  style={{
                    padding:"9px 14px", cursor:"pointer", borderBottom:"1px solid var(--border)",
                    transition:"background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-bg)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div style={{ fontSize:12, fontWeight:500, color:"var(--text-1)" }}>{g.Name}</div>
                  <div style={{ display:"flex", gap:8, marginTop:3 }}>
                    {g.Genres && <span style={{ fontSize:10, color:"var(--text-3)" }}>{g.Genres.split(",")[0]}</span>}
                    {g["Peak CCU"] > 0 && <span style={{ fontSize:10, color:"#60a5fa" }}>{g["Peak CCU"].toLocaleString()} players</span>}
                    {g.Price > 0 && <span style={{ fontSize:10, color:"#34d399" }}>${g.Price}</span>}
                    {g.Price === 0 && <span style={{ fontSize:10, color:"#34d399" }}>Free</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button onClick={toggle} style={{
          width:32, height:32, borderRadius:8, border:"1px solid var(--border)",
          backgroundColor:"var(--bg-input)", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"var(--text-2)", transition:"all 0.2s",
        }}
        title={dark ? "Modo claro" : "Modo escuro"}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-bg)"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-input)"}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button style={{
          width:32, height:32, borderRadius:8, border:"1px solid var(--border)",
          backgroundColor:"var(--bg-input)", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"var(--text-2)",
        }}>
          <Bell size={15} />
        </button>

        {/* Avatar */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>
            ST
          </div>
          <div>
            <div style={{ fontSize:11, color:"var(--text-1)", fontWeight:600, lineHeight:1.2 }}>Steam Insight</div>
            <div style={{ fontSize:9, color:"var(--text-3)" }}>Projeto Faculdade</div>
          </div>
        </div>
      </div>
    </header>
  );
}