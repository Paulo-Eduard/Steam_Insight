from fastapi import APIRouter, HTTPException
import logging

from app.utils.dataset_loader import load_dataset
from app.services.report_analysis import generate_monthly_report

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Executive"]
)


@router.get("/dashboard")
def executive_dashboard():
    try:
        df = load_dataset()
        report = generate_monthly_report(df)

        return {
            "total_games": report.get("total_games", 0),
            "average_price": report.get("average_price", 0),
            "insights_count": len(report.get("insights", [])),
            "approval_rate": report.get("approval_rate", 0),
        }
    except Exception as e:
        logger.error(f"Erro no executive_dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
