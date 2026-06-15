from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import logging
from typing import Optional

from app.utils.dataset_loader import load_dataset
from app.services.report_analysis import generate_monthly_report

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Reports"])


@router.get("/monthly")
def monthly_report(
    year: int = Query(2024),
    month: Optional[str] = Query(None),
):
    try:
        m = int(month) if month and month.isdigit() else None

        # Usa o dataset centralizado (com cache) em vez de ler o CSV diretamente
        df = load_dataset().copy()

        col = "Release date"
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")
            df = df.dropna(subset=[col])
            df = df[df[col].dt.year == year]
            if m:
                df = df[df[col].dt.month == m]

        result = generate_monthly_report(df)
        return JSONResponse(status_code=200, content=result)

    except Exception as e:
        logger.error(f"Erro no processamento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
