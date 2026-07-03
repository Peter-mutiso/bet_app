export const INSTRUMENT_GROUPS = {
  "Synthetic Indices": [
    "Volatility 10 Index",
    "Volatility 25 Index",
    "Volatility 50 Index",
    "Volatility 75 Index",
    "Volatility 100 Index",
    "Boom 500 Index",
    "Boom 1000 Index",
    "Crash 500 Index",
    "Crash 1000 Index",
  ],
  Forex: [
    "Forex EUR/USD",
    "Forex GBP/USD",
    "Forex USD/JPY",
    "Forex AUD/USD",
    "Forex USD/CAD",
  ],
  Commodities: ["Gold", "Silver", "Oil"],
};

export const ALL_INSTRUMENTS = Object.values(INSTRUMENT_GROUPS).flat();
