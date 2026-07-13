import {
    ISeriesApi,
    SeriesMarker,
} from "lightweight-charts";

import { Trade } from "@/types/trade";

export function updateTradeMarkers(
    series: ISeriesApi<any>,
    trades: Trade[]
) {
    const markers: SeriesMarker<any>[] = [];

    trades.forEach((trade) => {
        if (!trade.entryTime) return;

        // Entry marker
        markers.push({
            time: trade.entryTime as any,
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
            text: `${trade.tradeType} $${trade.stake}`,
        });

        // Exit marker
        if (
            trade.status === "CLOSED" &&
            trade.exitTime
        ) {
            const won = (trade.profit ?? 0) >= 0;

            markers.push({
                time: trade.exitTime as any,
                position: won
                    ? "aboveBar"
                    : "belowBar",
                color: won
                    ? "#22c55e"
                    : "#ef4444",
                shape: "flag",
                text: won
                    ? `WIN +$${trade.profit!.toFixed(2)}`
                    : `LOSS $${trade.profit!.toFixed(2)}`,
            });
        }
    });

    series.setMarkers(markers);
}