from typing import List

from pydantic import BaseModel


class StockSignal(BaseModel):
    ticker: str
    price: float
    change_percent: float
    signal: str  # BUY, SELL, HOLD
    confidence: float  # 0-100
    reasons: List[str]
    sector: str
    rsi: float
    ma_short: float
    ma_long: float
    volume_ratio: float
    near_support: bool
    near_resistance: bool


class MarketMood(BaseModel):
    strongest_bullish: List[str]
    reversal_candidates: List[str]
    weakest_stocks: List[str]
    high_volume_movers: List[str]


class DashboardResponse(BaseModel):
    stocks: List[StockSignal]
    mood: MarketMood
    last_updated: str


class ChartDataPoint(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class ChartResponse(BaseModel):
    ticker: str
    data: List[ChartDataPoint]
    ma_short: List[dict]
    ma_long: List[dict]
