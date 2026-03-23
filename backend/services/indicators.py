import pandas as pd
import ta
from config import (
    MA_SHORT, MA_LONG, RSI_PERIOD,
    VOLUME_SPIKE_THRESHOLD, SUPPORT_RESISTANCE_WINDOW, PROXIMITY_THRESHOLD,
)


def compute_indicators(df: pd.DataFrame) -> dict:
    """Compute all technical indicators for a single stock's DataFrame."""
    close = df["Close"].squeeze()
    volume = df["Volume"].squeeze()
    high = df["High"].squeeze()
    low = df["Low"].squeeze()

    indicators = {}

    # Moving averages
    ma_short = close.rolling(window=MA_SHORT).mean()
    ma_long = close.rolling(window=MA_LONG).mean()
    indicators["ma_short"] = ma_short
    indicators["ma_long"] = ma_long
    indicators["ma_short_current"] = float(ma_short.iloc[-1]) if len(ma_short) >= MA_SHORT else None
    indicators["ma_long_current"] = float(ma_long.iloc[-1]) if len(ma_long) >= MA_LONG else None

    # MA crossover detection
    if len(ma_short) >= 2 and len(ma_long) >= MA_LONG:
        current_above = ma_short.iloc[-1] > ma_long.iloc[-1]
        prev_above = ma_short.iloc[-2] > ma_long.iloc[-2]
        indicators["ma_bullish_cross"] = current_above and not prev_above
        indicators["ma_bearish_cross"] = not current_above and prev_above
        indicators["ma_above"] = bool(current_above)

        # Approaching crossover
        if indicators["ma_short_current"] and indicators["ma_long_current"]:
            gap = abs(indicators["ma_short_current"] - indicators["ma_long_current"])
            indicators["ma_approaching"] = gap / indicators["ma_long_current"] < 0.01
        else:
            indicators["ma_approaching"] = False
    else:
        indicators["ma_bullish_cross"] = False
        indicators["ma_bearish_cross"] = False
        indicators["ma_above"] = None
        indicators["ma_approaching"] = False

    # RSI (14-period)
    rsi_series = ta.momentum.RSIIndicator(close, window=RSI_PERIOD).rsi()
    indicators["rsi"] = float(rsi_series.iloc[-1]) if not rsi_series.empty else 50.0

    # Volume spike
    avg_volume = volume.rolling(window=MA_SHORT).mean()
    if not avg_volume.empty and avg_volume.iloc[-1] > 0:
        indicators["volume_ratio"] = float(volume.iloc[-1] / avg_volume.iloc[-1])
    else:
        indicators["volume_ratio"] = 1.0
    indicators["volume_spike"] = indicators["volume_ratio"] > VOLUME_SPIKE_THRESHOLD

    # Support and resistance
    support = low.rolling(window=SUPPORT_RESISTANCE_WINDOW).min()
    resistance = high.rolling(window=SUPPORT_RESISTANCE_WINDOW).max()
    current_price = float(close.iloc[-1])

    if not support.empty and not resistance.empty:
        support_val = float(support.iloc[-1])
        resistance_val = float(resistance.iloc[-1])
        indicators["support"] = support_val
        indicators["resistance"] = resistance_val

        if support_val > 0:
            indicators["near_support"] = (current_price - support_val) / support_val < PROXIMITY_THRESHOLD
            indicators["broke_support"] = current_price < support_val
        else:
            indicators["near_support"] = False
            indicators["broke_support"] = False

        if resistance_val > 0:
            indicators["near_resistance"] = (resistance_val - current_price) / resistance_val < PROXIMITY_THRESHOLD
            indicators["broke_resistance"] = current_price > resistance_val
        else:
            indicators["near_resistance"] = False
            indicators["broke_resistance"] = False
    else:
        indicators["support"] = current_price
        indicators["resistance"] = current_price
        indicators["near_support"] = False
        indicators["near_resistance"] = False
        indicators["broke_support"] = False
        indicators["broke_resistance"] = False

    # Price info
    indicators["current_price"] = current_price
    if len(close) >= 2:
        prev_close = float(close.iloc[-2])
        indicators["change_percent"] = ((current_price - prev_close) / prev_close) * 100
        indicators["price_up_today"] = current_price > prev_close
    else:
        indicators["change_percent"] = 0.0
        indicators["price_up_today"] = True

    return indicators
