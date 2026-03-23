from models.schemas import StockSignal
from config import SECTOR_MAP


def generate_signal(ticker: str, indicators: dict) -> StockSignal:
    """Generate a trading signal with confidence score and reasons."""
    score = 0.0
    reasons = []

    # --- MA Crossover (weight: 30) ---
    if indicators["ma_bullish_cross"]:
        score += 30
        reasons.append("20DMA crossed above 50DMA (bullish crossover)")
    elif indicators["ma_bearish_cross"]:
        score -= 30
        reasons.append("20DMA crossed below 50DMA (bearish crossover)")
    elif indicators["ma_approaching"]:
        if indicators.get("ma_above"):
            score += 10
            reasons.append("MAs converging, currently bullish")
        else:
            score -= 10
            reasons.append("MAs converging, currently bearish")
    elif indicators.get("ma_above") is True:
        score += 15
        reasons.append("Price trending above 50DMA")
    elif indicators.get("ma_above") is False:
        score -= 15
        reasons.append("Price trending below 50DMA")

    # --- RSI (weight: 25) ---
    rsi = indicators["rsi"]
    if rsi < 30:
        score += 25
        reasons.append(f"RSI at {rsi:.0f} — oversold, possible rebound")
    elif rsi < 40:
        score += 12
        reasons.append(f"RSI at {rsi:.0f} — approaching oversold")
    elif rsi > 70:
        score -= 25
        reasons.append(f"RSI at {rsi:.0f} — overbought, possible pullback")
    elif rsi > 60:
        score -= 12
        reasons.append(f"RSI at {rsi:.0f} — approaching overbought")

    # --- Volume (weight: 20) ---
    if indicators["volume_spike"]:
        if indicators["price_up_today"]:
            score += 20
            reasons.append(f"Volume spike ({indicators['volume_ratio']:.1f}x avg) on up day")
        else:
            score -= 20
            reasons.append(f"Volume spike ({indicators['volume_ratio']:.1f}x avg) on down day")

    # --- Support/Resistance (weight: 25) ---
    if indicators["broke_support"]:
        score -= 25
        reasons.append("Price broke below support level")
    elif indicators["near_support"]:
        score += 20
        reasons.append("Price near support — potential bounce zone")
    elif indicators["broke_resistance"]:
        score += 25
        reasons.append("Price broke above resistance — breakout")
    elif indicators["near_resistance"]:
        score -= 15
        reasons.append("Price near resistance — potential rejection")

    # Determine signal direction
    if score > 15:
        signal = "BUY"
    elif score < -15:
        signal = "SELL"
    else:
        signal = "HOLD"

    confidence = min(abs(score), 100)

    if not reasons:
        reasons.append("No strong signals detected")

    return StockSignal(
        ticker=ticker,
        price=indicators["current_price"],
        change_percent=round(indicators["change_percent"], 2),
        signal=signal,
        confidence=round(confidence, 1),
        reasons=reasons,
        sector=SECTOR_MAP.get(ticker, "Other"),
        rsi=round(rsi, 1),
        ma_short=round(indicators["ma_short_current"], 2) if indicators["ma_short_current"] else 0,
        ma_long=round(indicators["ma_long_current"], 2) if indicators["ma_long_current"] else 0,
        volume_ratio=round(indicators["volume_ratio"], 2),
        near_support=indicators["near_support"],
        near_resistance=indicators["near_resistance"],
    )
