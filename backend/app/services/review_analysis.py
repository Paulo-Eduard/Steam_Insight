"""
review_analysis.py
------------------
Avaliação de jogos com taxa de aprovação calculada dos dados reais.
"""

import pandas as pd


class ReviewAnalysis:

    def __init__(self, df: pd.DataFrame):
        self.df = df

    def best_rated_games(self, n: int = 20, min_reviews: int = 500) -> list[dict]:
        """
        Retorna os N jogos com maior taxa de aprovação,
        exigindo pelo menos `min_reviews` avaliações para evitar outliers.
        """
        df = self.df.copy()
        df["total_reviews"] = df["Positive"] + df["Negative"]
        df = df[df["total_reviews"] >= min_reviews].copy()

        df["approval_pct"] = (df["Positive"] / df["total_reviews"] * 100).round(1)

        result = (
            df.sort_values("approval_pct", ascending=False)
            .head(n)[["Name", "approval_pct", "total_reviews"]]
        )
        return result.to_dict(orient="records")

    def price_vs_score(self, bins: int = 6) -> list[dict]:
        """Agrupa jogos em faixas de preço e retorna aprovação média por faixa."""
        df = self.df.copy()
        df = df[(df["Price"] > 0) & ((df["Positive"] + df["Negative"]) >= 100)]
        df["total"] = df["Positive"] + df["Negative"]
        df["approval"] = df["Positive"] / df["total"] * 100

        df["price_range"] = pd.cut(df["Price"], bins=bins)
        grouped = df.groupby("price_range", observed=True)["approval"].mean().round(1)

        return [
            {"price_range": str(rng), "avg_approval": val}
            for rng, val in grouped.items()
        ]
