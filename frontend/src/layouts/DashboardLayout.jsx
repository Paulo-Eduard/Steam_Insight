import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display:"flex", height:"100vh", backgroundColor:"var(--bg-base)", overflow:"hidden", transition:"background 0.2s" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar />
        <main style={{ flex:1, padding:"16px 20px", overflowY:"auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
