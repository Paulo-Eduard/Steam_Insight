from typing import Annotated
from fastapi import APIRouter, Query
from app.utils.dataset_loader import load_dataset
from app.services.game_analysis import GameAnalysis

router = APIRouter()

def _analysis() -> GameAnalysis:
    return GameAnalysis(load_dataset())

@router.get("/list")
def list_games(
    page: Annotated[int, Query(ge=1)] = 1,
    per_page: Annotated[int, Query(ge=5, le=100)] = 25,
    sort: Annotated[str, Query(pattern=r"^(Peak CCU|price|playtime|reviews|name)$")] = "Peak CCU",
    order: Annotated[str, Query(pattern=r"^(asc|desc)$")] = "desc",
    genre: str = "",
):
    return _analysis().paginated(page=page, per_page=per_page, sort=sort, order=order, genre=genre)

@router.get("/genres-list")
def genres_list():
    return _analysis().available_genres()

@router.get("/played")
def get_most_played(n: int = 10):
    return _analysis().top_played_games(n=n)

@router.get("/popular")
def get_most_popular(n: int = 10):
    return _analysis().top_popular_games(n=n)