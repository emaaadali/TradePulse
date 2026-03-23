DEFAULT_WATCHLIST = [
    "AAPL", "MSFT", "NVDA", "GOOGL", "META",
    "JPM", "GS", "V",
    "JNJ", "UNH", "PFE",
    "AMZN", "TSLA", "NKE", "MCD",
    "XOM", "CVX",
    "CAT", "BA",
    "DIS",
]

SECTOR_MAP = {
    "AAPL": "Technology", "MSFT": "Technology", "NVDA": "Technology",
    "GOOGL": "Technology", "META": "Technology",
    "JPM": "Finance", "GS": "Finance", "V": "Finance",
    "JNJ": "Healthcare", "UNH": "Healthcare", "PFE": "Healthcare",
    "AMZN": "Consumer", "TSLA": "Consumer", "NKE": "Consumer", "MCD": "Consumer",
    "XOM": "Energy", "CVX": "Energy",
    "CAT": "Industrial", "BA": "Industrial",
    "DIS": "Communication",
}

# Indicator settings
MA_SHORT = 20
MA_LONG = 50
RSI_PERIOD = 14
VOLUME_SPIKE_THRESHOLD = 1.5
SUPPORT_RESISTANCE_WINDOW = 20
PROXIMITY_THRESHOLD = 0.02  # 2%
