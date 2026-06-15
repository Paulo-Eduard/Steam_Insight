from fastapi import APIRouter

from app.utils.dataset_loader import load_dataset
from app.services.steam_analysis import SteamAnalysis

router = APIRouter()

@router.get("/")
def dashboard():
    df = load_dataset()
    service = SteamAnalysis(df)
    return service.dashboard_metrics()