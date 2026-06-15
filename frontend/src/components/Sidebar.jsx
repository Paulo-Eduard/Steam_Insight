import { useRouter } from "../context/RouterContext";
import {
LayoutDashboard,
Gamepad2,
BarChart3,
Tag,
TrendingUp,
Database,
FileText,
Briefcase,
ChevronRight
} from "lucide-react";

const NAV = [
{
label: "ANÁLISES",
items: [
{
id: "dashboard",
name: "Dashboard",
icon: <LayoutDashboard size={14} />
},
{
id: "games",
name: "Jogos",
icon: <Gamepad2 size={14} />
},
{
id: "analytics",
name: "Analytics",
icon: <BarChart3 size={14} />
}
]
},
{
  label:"MERCADO",
  items:[
    {
      id:"genres",
      name:"Gêneros",
      icon:<Tag size={14}/>
    },
    {
      id:"trends",
      name:"Tendências",
      icon:<TrendingUp size={14}/>
    }
  ]
},
{
label: "GESTÃO",
items: [
{
id: "reports",
name: "Relatórios",
icon: <FileText size={14} />
},
{
id: "executive",
name: "Executivo",
icon: <Briefcase size={14} />
}
]
}
];

export default function Sidebar() {
const { page, navigate } = useRouter();

return (
<aside
style={{
width: 220,
minWidth: 220,
height: "100vh",
backgroundColor: "var(--bg-sidebar)",
borderRight: "1px solid var(--border)",
display: "flex",
flexDirection: "column",
overflowY: "auto"
}}
>
<div
style={{
padding: "16px",
borderBottom: "1px solid var(--border)"
}}
>
<div
style={{
display: "flex",
alignItems: "center",
gap: 8
}}
>
<div
style={{
width: 28,
height: 28,
borderRadius: 8,
backgroundColor: "var(--accent)",
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
> <Gamepad2 size={14} color="#fff" /> </div>

      <span
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: "var(--text-1)"
        }}
      >
        STEAM INSIGHT
      </span>
    </div>
  </div>

  <nav
    style={{
      flex: 1,
      padding: "12px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }}
  >
    {NAV.map((section) => (
      <div key={section.label}>
        <p
          style={{
            fontSize: 10,
            color: "var(--text-4)",
            marginBottom: 6,
            paddingLeft: 6,
            fontWeight: 700
          }}
        >
          {section.label}
        </p>

        {section.items.map((item) => {
          const active = page === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                backgroundColor: active
                  ? "var(--accent-bg)"
                  : "transparent",
                color: active
                  ? "var(--accent)"
                  : "var(--text-2)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center"
                }}
              >
                {item.icon}
                {item.name}
              </div>

              {active && (
                <ChevronRight size={12} />
              )}
            </button>
          );
        })}
      </div>
    ))}
  </nav>

  <div
    style={{
      padding: "12px",
      borderTop: "1px solid var(--border)"
    }}
  >
    <div
      style={{
        backgroundColor: "var(--hover-bg)",
        borderRadius: 8,
        padding: "10px",
        display: "flex",
        gap: 8,
        alignItems: "center"
      }}
    >
      <Database size={12} />

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-3)"
          }}
        >
          Kaggle Steam Dataset
        </div>

        <div
          style={{
            fontSize: 10,
            color: "var(--text-4)"
          }}
        >
          ~122.611 Jogos
        </div>
      </div>

      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#22c55e"
        }}
      />
    </div>
  </div>
</aside>

);
}
