import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

export default function Top10ScoreList() {
  const { data: raw, loading, error } = useFetch(api.getTopEvents);

  // API retorna [{Name, Genres, Price, success_score}]
  const games = raw ? raw.slice(0, 10) : [];

  const maxScore = games.length ? games[0].success_score : 100;

  return (
    <div style={{ backgroundColor:"var(--bg-card)", borderRadius:12, border:"1px solid var(--border)", padding:"14px" }}>
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"var(--text-1)" }}>Top 10 – Score de Sucesso</div>
        <div style={{ fontSize:10, color:"var(--text-3)", marginTop:2 }}>Popularidade · Avaliação · Tempo de jogo</div>
      </div>

      {loading && <div style={{ color:"var(--text-3)", fontSize:11, textAlign:"center", padding:"40px 0" }}>Carregando...</div>}
      {error   && <div style={{ color:"#f87171", fontSize:11, textAlign:"center", padding:"40px 0" }}>Erro: {error}</div>}

      {!loading && !error && (
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {games.map((g, i) => {
            const color = i < 3 ? "#f59e0b" : "#60a5fa";
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:10, color:"var(--text-3)", width:14, textAlign:"right", flexShrink:0 }}>{i+1}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:"#cbd5e1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"75%" }}>{g.Name}</span>
                    <span style={{ fontSize:11, fontWeight:700, color, flexShrink:0 }}>{g.success_score}</span>
                  </div>
                  <div style={{ marginTop:3, height:4, backgroundColor:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(g.success_score/maxScore)*100}%`, backgroundColor:color, borderRadius:4 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
