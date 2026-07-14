import {
    ISeriesApi,
    SeriesMarker,
    Time,
} from "lightweight-charts";

import type { Trade } from "@/types/trade";

export function updateTradeMarkers(
    series: ISeriesApi<any>,
    trades: Trade[]
) {
    const markers: SeriesMarker<Time>[] = [];

    for (const trade of trades) {
        if (!trade.entryTime) continue;

        // ==========================
        // ENTRY MARKER
        // ==========================
        markers.push({
            time: trade.entryTime as Time,

            position:
                trade.direction === "BUY"
                    ? "belowBar"
                    : "aboveBar",

            color:
                trade.direction === "BUY"
                    ? "#22c55e"
                    : "#ef4444",

            shape:
                trade.direction === "BUY"
                    ? "arrowUp"
                    : "arrowDown",

            text: `${trade.tradeType} • $${trade.stake.toFixed(2)}`,
        });

        // ==========================
        // EXIT MARKER
        // ==========================
        if (
            trade.status === "CLOSED" &&
            trade.exitTime
        ) {
            const won = (trade.profit ?? 0) >= 0;

            markers.push({
                time: trade.exitTime as Time,

                position: won
                    ? "aboveBar"
                    : "belowBar",

                color: won
                    ? "#22c55e"
                    : "#ef4444",

                // Valid Lightweight Charts shape
                shape: won
                    ? "arrowUp"
                    : "arrowDown",

                text: won
                    ? `WIN +$${(trade.profit ?? 0).toFixed(2)}`
                    : `LOSS $${Math.abs(trade.profit ?? 0).toFixed(2)}`,
            });
        }
    }

    // Sort markers by time
    markers.sort((a, b) => Number(a.time) - Number(b.time));

    series.setMarkers(markers);
}