import pandas as pd

SORT_MAP = {
    "Peak CCU": "Peak CCU",
    "price":    "Price",
    "playtime": "Average playtime forever",
    "reviews":  "Positive",
    "name":     "Name",
}

_BASE_COLS = ["Name", "Peak CCU", "Price", "Genres", "Positive", "Negative", "Average playtime forever"]

# Filtros dinâmicos: exige pelo menos 1 jogador simultâneo e playtime entre 1min e 300h
MIN_CCU      = 1        # era 500 — impossível neste dataset (max = 21)
MIN_PLAYTIME = 1        # era 60 minutos — muito restritivo
MAX_PLAYTIME = 18_000   # mantém 300h como teto


class GameAnalysis:
    def __init__(self, df: pd.DataFrame) -> None:
        self.df = df

    def _enrich(self, df: pd.DataFrame) -> pd.DataFrame:
        if "Average playtime forever" in df.columns:
            df = df.assign(
                playtime_hours=(
                    pd.to_numeric(df["Average playtime forever"], errors="coerce")
                    .fillna(0)
                    .div(60)
                    .round(1)
                )
            ).drop(columns=["Average playtime forever"])

        if "Positive" in df.columns and "Negative" in df.columns:
            total = df["Positive"] + df["Negative"]
            df = df.assign(
                approval_pct=(df["Positive"] / total.where(total > 0, 1) * 100).round(1)
            )
        return df

    def _select_cols(self, df: pd.DataFrame) -> pd.DataFrame:
        cols = [c for c in _BASE_COLS if c in df.columns]
        return df[cols]

    def top_popular_games(self, n: int = 10) -> list:
        cols = [c for c in ["Name", "Peak CCU", "Price", "Genres"] if c in self.df.columns]
        mask = self.df["Peak CCU"] >= MIN_CCU
        result = self.df.loc[mask, cols].sort_values("Peak CCU", ascending=False).head(n)
        # Se filtro ainda retornar vazio, pega top N sem filtro
        if result.empty:
            result = self.df[cols].sort_values("Peak CCU", ascending=False).head(n)
        # Renomeia para snake_case que o frontend espera
        records = result.to_dict(orient="records")
        return [
            {
                "name":     r.get("Name", "—"),
                "peak_ccu": int(r.get("Peak CCU", 0)),
                "price":    r.get("Price", 0),
                "genres":   r.get("Genres", ""),
            }
            for r in records
        ]

    def top_played_games(self, n: int = 10) -> list:
        pt = pd.to_numeric(self.df["Average playtime forever"], errors="coerce").fillna(0)
        mask = (pt >= MIN_PLAYTIME) & (pt <= MAX_PLAYTIME)
        result = (
            self.df.loc[mask, ["Name", "Average playtime forever"]]
            .assign(playtime_hours=(pt[mask] / 60).round(1))
            .drop(columns=["Average playtime forever"])
            .sort_values("playtime_hours", ascending=False)
            .head(n)
        )
        # Fallback se filtro retornar vazio
        if result.empty:
            result = (
                self.df[["Name", "Average playtime forever"]]
                .assign(playtime_hours=(pt / 60).round(1))
                .drop(columns=["Average playtime forever"])
                .sort_values("playtime_hours", ascending=False)
                .head(n)
            )
        return result.to_dict(orient="records")

    def search(self, q: str, limit: int = 20) -> list:
        mask = self.df["Name"].str.contains(q, case=False, na=False, regex=False)
        result = self._enrich(self._select_cols(self.df.loc[mask]).head(limit))
        return result.to_dict(orient="records")

    def paginated(self, page: int, per_page: int, sort: str, order: str, genre: str) -> dict:
        df = self.df
        if genre:
            df = df.loc[df["Genres"].str.contains(genre, case=False, na=False, regex=False)]

        col = SORT_MAP.get(sort, "Peak CCU")
        if col in df.columns:
            df = df.sort_values(col, ascending=(order == "asc"))

        total = len(df)
        start = (page - 1) * per_page
        result = self._enrich(self._select_cols(df.iloc[start: start + per_page]))
        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "games": result.to_dict(orient="records"),
        }

    def available_genres(self) -> list:
        return sorted(
            self.df["Genres"]
            .str.split(",")
            .explode()
            .str.strip()
            .replace("", pd.NA)
            .dropna()
            .unique()
            .tolist()
        )
