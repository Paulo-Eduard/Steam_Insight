from pydantic import BaseModel


class PlaytimeResponse(BaseModel):
    Name: str
    playtime_hours: float