import pandas as pd


class SteamAnalysis:

    def __init__(self, df: pd.DataFrame):
        self.df = df

    def dashboard_metrics(self) -> dict:
        df = self.df

        positive = df["Positive"].sum()
        negative = df["Negative"].sum()
        total_reviews = positive + negative
        approval = round(positive / total_reviews * 100, 2) if total_reviews > 0 else 0.0

        # --- Preço médio (só jogos pagos) ---
        paid = df[df["Price"] > 0]["Price"]
        avg_price = round(float(paid.mean()), 2) if len(paid) > 0 else 0.0

        playtime_col = df["Average playtime forever"]
        played = playtime_col[playtime_col > 0]
        avg_playtime_h = round(float(played.mean()) / 60, 1) if len(played) > 0 else 0.0

        # --- Pico de jogadores ---
        peak_players = int(df["Peak CCU"].sum())

        # --- Jogos mais populares (por Peak CCU) ---
        popular_cols = [c for c in ["Name", "Peak CCU", "Price", "Genres"] if c in df.columns]
        popular = (
            df[df["Peak CCU"] > 0][popular_cols]
            .sort_values("Peak CCU", ascending=False)
            .head(10)
            .to_dict(orient="records")
        )

        return {
            "total_games":            len(df),
            "average_price":          avg_price,
            "average_playtime_hours": avg_playtime_h,
            "approval_rate":          approval,
            "peak_players":           peak_players,
            "popular_games":          popular,
        }
