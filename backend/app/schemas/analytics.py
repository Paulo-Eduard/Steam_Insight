from pydantic import BaseModel


class GenreAnalyticsResponse(BaseModel):
    genre: str
    games_count: int
    average_price: float