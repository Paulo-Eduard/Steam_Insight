import pandas as pd


def generate_insights(df: pd.DataFrame) -> list[str]:
    """
    Gera insights textuais a partir do DataFrame.
    Compatível com colunas em maiúsculo (padrão do dataset) e minúsculo.
    """
    insights = []

    # Normaliza nomes de colunas para busca case-insensitive
    col_map = {c.lower(): c for c in df.columns}

    price_col = col_map.get("price")
    if price_col:
        avg_price = pd.to_numeric(df[price_col], errors="coerce").mean()
        if not pd.isna(avg_price):
            insights.append(f"Preço médio dos jogos: R$ {avg_price:.2f}")

    genres_col = col_map.get("genres")
    if genres_col:
        top_genre = (
            df[genres_col]
            .str.split(",")
            .explode()
            .str.strip()
            .replace("", pd.NA)
            .dropna()
            .value_counts()
            .idxmax()
        )
        insights.append(f"Gênero dominante: {top_genre}")

    return insights
