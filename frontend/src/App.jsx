import { useRouter } from "./context/RouterContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Executive from "./pages/Executive";
import Trends from "./pages/Trends";
import NotFound from "./pages/NotFound";

export default function App() {
  const { page } = useRouter();

  const pages = {
    dashboard: <Dashboard />,
    games:     <Games />,
    analytics: <Analytics />,
    reports:   <Reports />,
    executive: <Executive />,
    trends:    <Trends />,
    // "genres" section in sidebar goes to Analytics with genres tab
    genres:    <Analytics />,
  };

  return (
    <DashboardLayout>
      {pages[page] ?? <NotFound />}
    </DashboardLayout>
  );
}
