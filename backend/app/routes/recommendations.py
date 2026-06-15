from fastapi import APIRouter
from app.utils.dataset_loader import load_dataset
from app.services.event_recommendation import EventRecommendation

router = APIRouter()

@router.get("/events")
def events():
    df      = load_dataset()
    service = EventRecommendation(df)
    return service.best_games_for_event()
