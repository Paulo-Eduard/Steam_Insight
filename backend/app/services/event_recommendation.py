import pandas as pd


REQUIRED_COLS = ["Peak CCU", "Average playtime forever", "Recommendations", "Price"]


class EventRecommendation:

    def __init__(self, df: pd.DataFrame):
        self.df = df

    def _compute_score(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        # Garante que todas as colunas necessárias existem antes de normalizar
        for col in REQUIRED_COLS:
            if col not in df.columns:
                df[col] = 0.0
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
            mx = df[col].max()
            df[f"_{col}_norm"] = df[col] / mx if mx > 0 else 0.0

        df["success_score"] = (
            df["_Peak CCU_norm"]                 * 0.35
            + df["_Average playtime forever_norm"] * 0.25
            + df["_Recommendations_norm"]           * 0.25
            + df["_Price_norm"]                    * 0.15
        ) * 100

        return df

    def best_games_for_event(self, n: int = 20) -> list[dict]:
        needed = ["Name", "Genres", "Price", "Peak CCU", "Average playtime forever", "Recommendations"]
        cols = [c for c in needed if c in self.df.columns]
        df = self.df[cols].dropna(subset=["Name"]) if "Name" in cols else self.df[cols]
        df = self._compute_score(df)

        output_cols = [c for c in ["Name", "Genres", "Price", "success_score"] if c in df.columns]
        result = df.sort_values("success_score", ascending=False).head(n)[output_cols].copy()
        result["success_score"] = result["success_score"].round(1)
        return result.to_dict(orient="records")
