from dataclasses import dataclass

@dataclass
class Report:
    month: str
    total_games: int
    average_price: float
    top_game: str
    top_genre: str
    best_rated: str