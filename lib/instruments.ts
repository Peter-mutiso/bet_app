export const INSTRUMENT_GROUPS: Record<string, string[]> = {
  "Continuous Indices": [
    "Volatility 10 (1s) Index","Volatility 10 Index","Volatility 15 (1s) Index","Volatility 25 (1s) Index","Volatility 25 Index","Volatility 30 (1s) Index","Volatility 50 (1s) Index","Volatility 50 Index","Volatility 75 (1s) Index","Volatility 75 Index","Volatility 90 (1s) Index","Volatility 100 (1s) Index","Volatility 100 Index"
  ],
  "Crash/Boom Indices": [
    "Boom 50 Index","Boom 150 Index","Boom 300 Index","Boom 500 Index","Boom 600 Index","Boom 900 Index","Boom 1000 Index","Crash 50 Index","Crash 150 Index","Crash 300 Index","Crash 500 Index","Crash 600 Index","Crash 900 Index","Crash 1000 Index"
  ],
  "Daily Reset Indices": ["Bear Market Index","Bull Market Index"],
  "Jump Indices": ["Jump 10 Index","Jump 25 Index","Jump 50 Index","Jump 75 Index","Jump 100 Index"],
  "Range Break": ["Range Break 100 Index","Range Break 200 Index"],
  "Step Indices": ["Step Index 100","Step Index 200","Step Index 300","Step Index 400","Step Index 500"],
};

export const ALL_INSTRUMENTS = Object.values(INSTRUMENT_GROUPS).flat();
