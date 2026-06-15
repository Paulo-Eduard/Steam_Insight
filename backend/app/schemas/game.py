from pydantic import BaseModel


class GameResponse(BaseModel):
    Name: str
    Peak_CCU: int | None = None
    Price: float | None = None
    Genres: str | None = None