import {
    createEngine,
    applyVolatility,
    nextTick,
} from "./marketEngine";

import type {
    TickResult,
} from "../types";
export const marketEngines: Record<string, any> = {};

const MARKET_CONFIG = [
    { symbol: "R_10", price: 1200, volatility: 0 },
    { symbol: "R_25", price: 2400, volatility: 1 },
    { symbol: "R_50", price: 3600, volatility: 2 },
    { symbol: "R_75", price: 4800, volatility: 3 },
    { symbol: "R_100", price: 6000, volatility: 4 },
    { symbol: "XAGUSD", price: 7200, volatility: 5 },
    { symbol: "XAUUSD", price: 8400, volatility: 6 },
    { symbol: "BOOM500", price: 9600, volatility: 7 },
    { symbol: "BOOM1000", price: 10800, volatility: 8 },
    { symbol: "CRASH500", price: 12000, volatility: 9 },
    { symbol: "CRASH1000", price: 13200, volatility: 10 },
    { symbol: "frxEURUSD", price: 14400, volatility: 11},
    { symbol: "frxGBPUSD", price: 15600, volatility: 12},
    { symbol: "frxUSDJPY", price: 16800, volatility: 13},
    { symbol: "frxAUDUSD", price: 18000, volatility: 14},
    { symbol: "frxUSDCAD", price: 19200, volatility: 15},
    { symbol: "WTI", price: 20400, volatility: 16},

];

for (const market of MARKET_CONFIG) {

    const engine = createEngine(market.price);

    applyVolatility(
        engine,
        market.volatility
    );

    marketEngines[market.symbol] = engine;
}

export function tickAllMarkets(
    marketPrices: Record<string, number>
) {

    const ticks: Record<
        string,
        TickResult
    > = {};

    for (const symbol in marketEngines) {

        const engine =
            marketEngines[symbol];

        const currentPrice =
            marketPrices[symbol] ??
            engine.price;

        ticks[symbol] =
            nextTick(
                engine,
                currentPrice
            );
    }

    return ticks;
}