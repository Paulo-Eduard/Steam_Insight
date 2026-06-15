import pandas as pd
from typing import Dict, Any


def generate_monthly_report(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Gera o relatório mensal a partir de um DataFrame já filtrado por período.
    Espera colunas no formato original do CSV (ex: 'Price', 'Positive', 'Name').
    """
    # 1. Trabalha numa cópia para não alterar o DataFrame original (que pode estar em cache)
    df = df.copy()

    # 2. Normaliza nomes de colunas para lowercase apenas internamente
    df.columns = [c.lower().strip() for c in df.columns]

    rename_map = {
        "estimated owners": "owners",
        "peak ccu": "peak_ccu",
    }
    df = df.rename(columns=rename_map)

    # 3. Verificação de segurança
    if df.empty or "price" not in df.columns:
        return {
            "total_games": 0,
            "average_price": 0,
            "approval_rate": 0,
            "top_games": [],
            "report_text": "Dados insuficientes para este período.",
        }

    # 4. Conversão numérica segura
    numeric_cols = ["price", "positive", "negative", "owners", "peak_ccu"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    # 5. Cálculos
    total_games = int(len(df))
    avg_price = float(df["price"].mean())

    if "positive" in df.columns and "negative" in df.columns:
        total_reviews = df["positive"] + df["negative"]
        approval = float(
            (df["positive"] / total_reviews.where(total_reviews > 0, 1) * 100).mean()
        )
    else:
        approval = 0.0

    # 6. Top 5 jogos por popularidade
    popular_col = next(
        (c for c in ["owners", "peak_ccu"] if c in df.columns), None
    )

    top_games: list = []
    if popular_col and "name" in df.columns:
        df_top = df.nlargest(5, popular_col)[["name", popular_col]].copy()
        df_top = df_top.rename(columns={popular_col: "owners"})
        # Converte para tipos Python nativos para serialização JSON
        top_games = df_top.to_dict(orient="records")

    return {
        "total_games": total_games,
        "average_price": round(avg_price, 2),
        "approval_rate": round(approval, 2),
        "top_games": top_games,
        "report_text": f"Análise de {total_games} jogos concluída.",
    }
