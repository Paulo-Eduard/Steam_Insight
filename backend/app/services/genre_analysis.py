import pandas as pd


class GenreAnalysis:

    def __init__(self, df: pd.DataFrame):
        self.df = df

    def genre_stats(self, n: int = 10) -> list[dict]:
        """Retorna métricas por gênero: preço médio, CCU médio, score médio."""
        exploded = self.df.assign(Genre=self.df["Genres"].str.split(",")).explode("Genre")
        exploded["Genre"] = exploded["Genre"].str.strip().replace("", pd.NA)
        exploded = exploded.dropna(subset=["Genre"])

        top_genres = exploded["Genre"].value_counts().head(n).index.tolist()
        sub = exploded[exploded["Genre"].isin(top_genres)]

        result = sub.groupby("Genre").agg(
            count=("Name", "count"),
            avg_price=("Price", "mean"),
            avg_ccu=("Peak CCU", "mean"),
            avg_score=("Metacritic score", "mean"),
        ).round(2)

        return [
            {
                "genre": genre,
                "count": int(row["count"]),
                "avg_price": float(row["avg_price"]),
                "avg_ccu": round(float(row["avg_ccu"]), 3),
                "avg_score": float(row["avg_score"]),
            }
            for genre, row in result.iterrows()
        ]

    def top_genres(self, n: int = 10) -> list[dict]:
        """Retorna lista [{genre, count, percent}] dos N gêneros mais comuns."""
        genres = (
            self.df["Genres"]
            .str.split(",")
            .explode()
            .str.strip()
            .replace("", pd.NA)
            .dropna()
        )
        counts = genres.value_counts().head(n)
        total  = counts.sum()
        return [
            {"genre": name, "count": int(cnt), "percent": round(cnt / total * 100, 1)}
            for name, cnt in counts.items()
        ]
