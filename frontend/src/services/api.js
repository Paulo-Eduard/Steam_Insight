const BASE_URL = "/api";

async function get(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  getDashboard:        ()           => get("/dashboard/"),
  getGenres:           ()           => get("/analytics/genres"),
  getGenreStats:       ()           => get("/analytics/genres/stats"),
  getPopular:          (n = 10)     => get(`/games/popular?n=${n}`),
  getPlayed:           (n = 10)     => get(`/games/played?n=${n}`),
  getBestReviews:      ()           => get("/analytics/reviews/best"),
  getTopEvents:        ()           => get("/recommendations/events"),
  // /games/list suporta busca por nome via filtro de gênero não; usamos listGames com page
  listGames:           (params)     => get(`/games/list?${new URLSearchParams(params)}`),
  getGenresList:       ()           => get("/games/genres-list"),
  // ✅ Fix: aceita year e month como parâmetros
  getMonthlyReport:    (year = 2024, month = "") => {
    const params = new URLSearchParams({ year });
    if (month) params.set("month", month);
    return get(`/reports/monthly?${params}`);
  },
  getExecutiveDashboard: () => get("/executive/dashboard"),
  getPriceVsScore:       () => get("/analytics/reviews/price-vs-score"),
};
