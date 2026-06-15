import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const data = [
  { month:"Jan", promocoes:45,  desconto:38  },
  { month:"Fev", promocoes:62,  desconto:52  },
  { month:"Mar", promocoes:78,  desconto:65  },
  { month:"Abr", promocoes:55,  desconto:48  },
  { month:"Mai", promocoes:91,  desconto:79  },
  { month:"Jun", promocoes:83,  desconto:70  },
  { month:"Jul", promocoes:110, desconto:95  },
  { month:"Ago", promocoes:95,  desconto:82  },
  { month:"Set", promocoes:73,  desconto:61  },
  { month:"Out", promocoes:88,  desconto:74  },
  { month:"Nov", promocoes:130, desconto:118 },
  { month:"Dez", promocoes:145, desconto:132 },
];

const legendFmt = (v) => (
  <span style={{ color:"#94a3b8", fontSize:11 }}>
    {v === "promocoes" ? "Jogos em Promoção" : "Desconto Médio (%)"}
  </span>
);

export default function PromotionActivityChart() {
  return (
    <div style={{ backgroundColor:"var(--bg-card)", borderRadius:12, border:"1px solid var(--border)", padding:"14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Atividade de Promoções</span>
        <span style={{ fontSize:10, color:"#64748b" }}>Promoções por mês</span>
      </div>
      <ResponsiveContainer width="100%" height={215}>
        <ComposedChart data={data} margin={{ top:5, right:10, left:-15, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" tick={{ fill:"#64748b", fontSize:10 }} tickLine={false} axisLine={{ stroke:"#1e293b" }} />
          <YAxis tick={{ fill:"#64748b", fontSize:10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor:"var(--bg-card)", border:"none", borderRadius:8, fontSize:12 }}
            cursor={{ fill:"rgba(255,255,255,0.03)" }} />
          <Legend wrapperStyle={{ paddingTop:8 }} formatter={legendFmt} />
          <Bar dataKey="promocoes" fill="#7c3aed" fillOpacity={0.85} radius={[3,3,0,0]} barSize={14} />
          <Line type="monotone" dataKey="desconto" stroke="#34d399" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
