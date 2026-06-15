import StatCards from "../components/StatCard";
import GenreChart from "../components/GenreChart";
import PopularGamesChart from "../components/PopularGamesChart";
import MostPlayedChart from "../components/MostPlayedChart";
import PriceVsPopularityChart from "../components/PriceVsPopularityChart";
import Top10ScoreList from "../components/Top10ScoreList";
import PromotionActivityChart from "../components/PromotionActivityChart";

export default function Dashboard() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

      {/* ROW 1: 5 KPI Cards (dados reais da API) */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(5, 1fr)",
        gap:"14px",
      }}>
        <StatCards />
      </div>

      {/* ROW 2: Genre | Popular | Most Played */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"25fr 42fr 33fr",
        gap:"14px",
        alignItems:"stretch",
      }}>
        <GenreChart />
        <PopularGamesChart />
        <MostPlayedChart />
      </div>

      {/* ROW 3: Price vs Pop | Top10 | Promotions */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"33fr 25fr 42fr",
        gap:"14px",
        alignItems:"stretch",
      }}>
        <PriceVsPopularityChart />
        <Top10ScoreList />
        <PromotionActivityChart />
      </div>

    </div>
  );
}
