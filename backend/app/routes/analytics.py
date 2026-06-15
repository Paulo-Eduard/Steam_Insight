from fastapi import APIRouter
from app.utils.dataset_loader import load_dataset
from app.services.genre_analysis import GenreAnalysis
from app.services.review_analysis import ReviewAnalysis

router = APIRouter()

@router.get("/genres")
def genres():
    df      = load_dataset()
    service = GenreAnalysis(df)
    return service.top_genres()

@router.get("/genres/stats")
def genre_stats():
    df      = load_dataset()
    service = GenreAnalysis(df)
    return service.genre_stats()

@router.get("/reviews/best")
def best_reviews():
    df      = load_dataset()
    service = ReviewAnalysis(df)
    return service.best_rated_games()

@router.get("/reviews/price-vs-score")
def price_vs_score():
    df      = load_dataset()
    service = ReviewAnalysis(df)
    return service.price_vs_score()
