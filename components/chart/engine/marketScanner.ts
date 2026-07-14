import { marketEngines } from "./multiMarketEngine";

export interface ScanResult {

    symbol: string;

    direction: "BUY" | "SELL";

    confidence: number;

    score: number;

}

export function scanBestMarket(): ScanResult {

    let best: ScanResult = {

        symbol: "R_100",

        direction: "BUY",

        confidence: 0,

        score: -Infinity,

    };

    for (const symbol in marketEngines) {

        const engine = marketEngines[symbol];

        if (!engine) continue;

        //------------------------------------------------
        // Momentum
        //------------------------------------------------

        const momentum =

            engine.price -

            engine.lastPrice;

        //------------------------------------------------
        // Volatility bonus
        //------------------------------------------------

        const volatility =

            engine.volatility;

        //------------------------------------------------
        // Trend strength
        //------------------------------------------------

        const trendStrength =

            Math.abs(momentum) *

            (volatility + 1);

        //------------------------------------------------
        // Small random factor
        //------------------------------------------------

        const score =

            trendStrength +

            Math.random();

        if (score > best.score) {

            best = {

                symbol,

                direction:
                    momentum >= 0
                        ? "BUY"
                        : "SELL",

                score,

                confidence:

                    Math.min(
                        99,
                        Math.round(
                            70 +
                            trendStrength * 6
                        )
                    ),

            };

        }

    }

    return best;

}