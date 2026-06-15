from dataclasses import dataclass

@dataclass
class Game:
    name: str
    peak_ccu: int
    price: float
    genre: str
    positive_reviews: int = 0
    negative_reviews: int = 0