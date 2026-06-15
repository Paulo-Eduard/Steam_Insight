from pydantic import BaseModel


class ExecutiveSummary(BaseModel):
    total_games: int
    average_price: float
    insights_count: int
    approval_rate: float

    class Config:
        from_attributes = True
