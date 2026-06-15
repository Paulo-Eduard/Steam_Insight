from pydantic import BaseModel
from typing import Optional, List


class TopGame(BaseModel):
    name: str
    owners: float


class MonthlyReportResponse(BaseModel):
    total_games: int
    average_price: float
    approval_rate: float
    top_games: List[TopGame]
    report_text: str

    class Config:
        from_attributes = True
