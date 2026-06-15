from pydantic import BaseModel

class DashboardResponse(BaseModel):
    total_games: int
    average_price: float
    average_playtime: float
    approval_rate: float

    class Config:
        from_attributes = True