from models.schemas import StockSignal, MarketMood


def categorize_stocks(stocks: list[StockSignal]) -> MarketMood:
    """Categorize stocks into market mood sections."""
    strongest_bullish = []
    reversal_candidates = []
    weakest_stocks = []
    high_volume_movers = []

    for stock in stocks:
        # Strongest bullish: BUY with high confidence
        if stock.signal == "BUY" and stock.confidence >= 60:
            strongest_bullish.append(stock.ticker)

        # Reversal candidates: oversold RSI or near support with volume
        if stock.rsi < 35 or (stock.near_support and stock.volume_ratio > 1.5):
            reversal_candidates.append(stock.ticker)

        # Weakest stocks: SELL with decent confidence
        if stock.signal == "SELL" and stock.confidence >= 50:
            weakest_stocks.append(stock.ticker)

        # High volume movers
        if stock.volume_ratio > 1.5:
            high_volume_movers.append(stock.ticker)

    return MarketMood(
        strongest_bullish=strongest_bullish,
        reversal_candidates=reversal_candidates,
        weakest_stocks=weakest_stocks,
        high_volume_movers=high_volume_movers,
    )
