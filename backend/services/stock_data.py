from typing import Dict, List, Optional

import yfinance as yf
import pandas as pd


def fetch_stock_data(tickers: List[str], period: str = "3mo") -> Dict[str, pd.DataFrame]:
    """Fetch OHLCV data for multiple tickers using yfinance batch download."""
    data = yf.download(tickers, period=period, group_by="ticker", threads=True)

    result = {}
    for ticker in tickers:
        try:
            if len(tickers) == 1:
                df = data.copy()
            else:
                df = data[ticker].copy()

            df = df.dropna()
            if not df.empty:
                result[ticker] = df
        except (KeyError, Exception):
            continue

    return result


def fetch_single_stock(ticker: str, period: str = "3mo") -> Optional[pd.DataFrame]:
    """Fetch OHLCV data for a single ticker."""
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period)
        if not df.empty:
            return df
    except Exception:
        pass
    return None
