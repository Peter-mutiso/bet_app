import { marketEngines } from "@/components/chart/engine/multiMarketEngine";

export interface ScanResult {

    symbol: string;

    direction: "BUY" | "SELL";

    confidence: number;

}

export function scanBestMarket(): ScanResult {

    let bestSymbol = "R_100";

    let bestConfidence = 0;

    let bestDirection: "BUY" | "SELL" = "BUY";

    for (const symbol in marketEngines) {

        const engine = marketEngines[symbol];

        const volatility =
            engine.volatility;

        // Higher volatility gives a better opportunity.
        // Small randomness prevents picking the same market forever.

        const confidence =
            volatility * 8 +
            Math.random() * 20;

        if (confidence > bestConfidence) {

            bestConfidence = confidence;

            bestSymbol = symbol;

            bestDirection =
                Math.random() > 0.5
                    ? "BUY"
                    : "SELL";
        }

    }

    return {

        symbol: bestSymbol,

        direction: bestDirection,

        confidence: Math.min(
            99,
            Math.round(bestConfidence)
        ),

    };

}