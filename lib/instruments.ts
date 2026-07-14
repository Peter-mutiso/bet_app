export interface Instrument {
    symbol: string;
    name: string;
    category: string;
    price: number;
    change: number;
     volume?: number;
}

export const ALL_INSTRUMENTS: Instrument[] = [
    // ===========================
    // Synthetic Indices
    // ===========================
    {
        symbol: "R_10",
        name: "Volatility 10 Index",
        category: "Synthetic Indices",
        price: 320,
        change: 0,
    },
    {
        symbol: "R_25",
        name: "Volatility 25 Index",
        category: "Synthetic Indices",
        price: 450,
        change: 0,
    },
    {
        symbol: "R_50",
        name: "Volatility 50 Index",
        category: "Synthetic Indices",
        price: 580,
        change: 0,
    },
    {
        symbol: "R_75",
        name: "Volatility 75 Index",
        category: "Synthetic Indices",
        price: 650,
        change: 0,
    },
    {
        symbol: "R_100",
        name: "Volatility 100 Index",
        category: "Synthetic Indices",
        price: 702,
        change: 0,
    },
    {
        symbol: "BOOM500",
        name: "Boom 500 Index",
        category: "Synthetic Indices",
        price: 1000,
        change: 0,
    },
    {
        symbol: "BOOM1000",
        name: "Boom 1000 Index",
        category: "Synthetic Indices",
        price: 1000,
        change: 0,
    },
    {
        symbol: "CRASH500",
        name: "Crash 500 Index",
        category: "Synthetic Indices",
        price: 1000,
        change: 0,
    },
    {
        symbol: "CRASH1000",
        name: "Crash 1000 Index",
        category: "Synthetic Indices",
        price: 1000,
        change: 0,
    },

    // ===========================
    // Forex
    // ===========================
    {
        symbol: "frxEURUSD",
        name: "Forex EUR/USD",
        category: "Forex",
        price: 1.1700,
        change: 0,
    },
    {
        symbol: "frxGBPUSD",
        name: "Forex GBP/USD",
        category: "Forex",
        price: 1.3400,
        change: 0,
    },
    {
        symbol: "frxUSDJPY",
        name: "Forex USD/JPY",
        category: "Forex",
        price: 147.20,
        change: 0,
    },
    {
        symbol: "frxAUDUSD",
        name: "Forex AUD/USD",
        category: "Forex",
        price: 0.6580,
        change: 0,
    },
    {
        symbol: "frxUSDCAD",
        name: "Forex USD/CAD",
        category: "Forex",
        price: 1.3700,
        change: 0,
    },

    // ===========================
    // Commodities
    // ===========================
    {
        symbol: "XAUUSD",
        name: "Gold",
        category: "Commodities",
        price: 3350,
        change: 0,
    },
    {
        symbol: "XAGUSD",
        name: "Silver",
        category: "Commodities",
        price: 38,
        change: 0,
    },
    {
        symbol: "WTI",
        name: "Oil",
        category: "Commodities",
        price: 69,
        change: 0,
    },
];

export const INSTRUMENT_GROUPS = ALL_INSTRUMENTS.reduce(
    (groups, instrument) => {
        if (!groups[instrument.category]) {
            groups[instrument.category] = [];
        }

        groups[instrument.category].push(instrument);

        return groups;
    },
    {} as Record<string, Instrument[]>
);