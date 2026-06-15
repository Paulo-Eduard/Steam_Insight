import os
import csv
import pandas as pd
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

# Resolve o caminho absoluto independente de onde o servidor é iniciado
_BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_DEFAULT_PATH = os.path.join(_BASE_DIR, "data", "raw", "games.csv")
DATASET_PATH = os.getenv("DATASET_PATH", _DEFAULT_PATH)


def _build_corrected_header(path: str) -> list[str]:
    """
    O CSV tem 40 colunas nos dados mas o header original declara apenas 39.
    A coluna 'DLC count' (posição 8) está ausente do header.
    Esta função detecta e corrige isso automaticamente.
    """
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        first_row = next(reader)

    if len(first_row) == len(header) + 1:
        # Insere a coluna faltante na posição 8
        header = header[:8] + ["DLC count"] + header[8:]

    return header


@lru_cache(maxsize=1)
def load_dataset() -> pd.DataFrame:
    path = DATASET_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset não encontrado em: {path}")

    header = _build_corrected_header(path)

    df = pd.read_csv(
        path,
        skiprows=1,           # pula o header original (usaremos o corrigido)
        names=header,         # aplica o header com 40 colunas
        on_bad_lines="skip",
        low_memory=False,
    )

    # Padronização: remove espaços extras dos nomes das colunas
    df.columns = df.columns.str.strip()

    # Mapeamento: normaliza variações de nomes para o padrão esperado
    rename_map = {
        "genres": "Genres",
        "Genre": "Genres",
        "price": "Price",
        "peak ccu": "Peak CCU",
        "peak_ccu": "Peak CCU",
        "average playtime forever": "Average playtime forever",
        "median playtime forever": "Median playtime forever",
        "positive": "Positive",
        "negative": "Negative",
        "estimated owners": "Estimated owners",
    }
    df = df.rename(columns=rename_map)

    # Conversão numérica
    cols_to_numeric = [
        "Price", "Positive", "Negative", "Peak CCU",
        "Average playtime forever", "Median playtime forever",
        "Recommendations",
    ]
    for col in cols_to_numeric:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    # Preenche valores faltantes
    if "Name" in df.columns:
        df["Name"] = df["Name"].fillna("Desconhecido")
    if "Genres" in df.columns:
        df["Genres"] = df["Genres"].fillna("")

    return df
