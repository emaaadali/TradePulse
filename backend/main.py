import os
from datetime import datetime

import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from config import DEFAULT_WATCHLIST, SECTOR_MAP
from models.schemas import DashboardResponse, ChartResponse, ChartDataPoint
from services.stock_data import fetch_stock_data, fetch_single_stock
from services.indicators import compute_indicators
from services.signals import generate_signal
from services.market_mood import categorize_stocks

app = FastAPI(title="TradePulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(tickers: str = Query(default=None)):
    ticker_list = tickers.split(",") if tickers else DEFAULT_WATCHLIST

    # Fetch data for all tickers
    stock_data = fetch_stock_data(ticker_list)

    # Compute indicators and generate signals
    signals = []
    for ticker in ticker_list:
        if ticker not in stock_data:
            continue
        df = stock_data[ticker]
        indicators = compute_indicators(df)
        signal = generate_signal(ticker, indicators)
        signals.append(signal)

    # Sort by confidence descending
    signals.sort(key=lambda s: s.confidence, reverse=True)

    # Categorize mood
    mood = categorize_stocks(signals)

    return DashboardResponse(
        stocks=signals,
        mood=mood,
        last_updated=datetime.now().isoformat(),
    )


@app.get("/api/chart/{ticker}", response_model=ChartResponse)
def get_chart(ticker: str):
    df = fetch_single_stock(ticker, period="3mo")

    data = []
    ma_short_data = []
    ma_long_data = []

    if df is not None and not df.empty:
        close = df["Close"].squeeze()
        ma_short = close.rolling(window=20).mean()
        ma_long = close.rolling(window=50).mean()

        for i, (idx, row) in enumerate(df.iterrows()):
            date_str = idx.strftime("%Y-%m-%d")
            data.append(ChartDataPoint(
                time=date_str,
                open=round(float(row["Open"]), 2),
                high=round(float(row["High"]), 2),
                low=round(float(row["Low"]), 2),
                close=round(float(row["Close"]), 2),
                volume=int(row["Volume"]),
            ))
            if not pd.isna(ma_short.iloc[i]):
                ma_short_data.append({"time": date_str, "value": round(float(ma_short.iloc[i]), 2)})
            if not pd.isna(ma_long.iloc[i]):
                ma_long_data.append({"time": date_str, "value": round(float(ma_long.iloc[i]), 2)})

    return ChartResponse(
        ticker=ticker,
        data=data,
        ma_short=ma_short_data,
        ma_long=ma_long_data,
    )


@app.get("/api/search")
def search_tickers(q: str = Query(default="")):
    if not q or len(q) < 1:
        return {"results": []}

    q_upper = q.upper()
    # Search within known tickers and sector map
    all_tickers = list(SECTOR_MAP.keys())
    matches = [t for t in all_tickers if q_upper in t]

    return {"results": [{"ticker": t, "sector": SECTOR_MAP.get(t, "Other")} for t in matches[:10]]}
