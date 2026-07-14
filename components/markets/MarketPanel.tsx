"use client";

import type { SelectedMarket } from "@/store/useTradeStore";
type Props = {
     market: SelectedMarket | null;
};

function format(n?: number) {
    if (n === undefined || n === null) return "-";
    return n.toFixed(2);
}

export default function MarketPanel({ market }: Props) {
    if (!market) {
        return (
            <div className="market-panel empty">
                Select a market to view analytics
            </div>
        );
    }

    const isUp = (market.change ?? 0) >= 0;

    return (
        <div className="market-panel">
            
            {/* HEADER */}
            <div className="panel-header">
                <div className="symbol">{market.symbol}</div>
                <div className={`change ${isUp ? "up" : "down"}`}>
                    {isUp ? "+" : ""}
                    {market.change?.toFixed(2)}%
                </div>
            </div>

            {/* PRICE BLOCK */}
            <div className="price-block">
                <div className="price">
                    {format(market.price)}
                </div>

                <div className={`trend ${isUp ? "up" : "down"}`}>
                    {market.tickDirection === "up" ? "▲ Rising" :
                     market.tickDirection === "down" ? "▼ Falling" :
                     "● Stable"}
                </div>
            </div>

            {/* STATS GRID */}
            <div className="stats-grid">
                <div>
                    <span>Bid</span>
                    <strong>{format(market.bid)}</strong>
                </div>

                <div>
                    <span>Ask</span>
                    <strong>{format(market.ask)}</strong>
                </div>

                <div>
                    <span>Spread</span>
                    <strong>{format(market.spread)}</strong>
                </div>

                <div>
                    <span>Volume</span>
                    <strong>{market.volume}</strong>
                </div>

                <div>
                    <span>High</span>
                    <strong>{format(market.high)}</strong>
                </div>

                <div>
                    <span>Low</span>
                    <strong>{format(market.low)}</strong>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="actions">
                <button className="primary">
                    Open Chart
                </button>

                <button className="secondary">
                    Trade
                </button>
            </div>
        </div>
    );
}