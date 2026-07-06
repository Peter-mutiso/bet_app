"use client";

import { useMemo } from "react";
import { useTrading } from "../../contexts/TradingContext";

import type { Trade } from "../../types/trade";

function format(n: number) {
    return Number(n || 0).toFixed(2);
}

/* =========================================================
   P&L CALC (CONTRACT-BASED)
   ========================================================= */

function calculatePnL(trade: Trade) {
    if (trade.status !== "OPEN") return 0;

    // Contract-style simplified valuation:
    // We simulate direction based on entry vs current price

    const diff = trade.currentPrice - trade.entryPrice;

    const direction =
        trade.contract.includes("RISE") ||
        trade.contract.includes("HIGHER") ||
        trade.contract.includes("TOUCH");

    const isWinningMove = direction ? diff > 0 : diff < 0;

    const payoutFactor = trade.payout / 100;

    return isWinningMove
        ? trade.stake * payoutFactor
        : -trade.stake;
}

/* =========================================================
   PAGE
   ========================================================= */

export default function PortfolioPage() {
    const { trades } = useTrading();

    const enriched = useMemo(() => {
        return trades.map(t => {
            const pnl = calculatePnL(t);

            const pnlPercent =
                t.stake > 0 ? (pnl / t.stake) * 100 : 0;

            return {
                ...t,
                pnl,
                pnlPercent
            };
        });
    }, [trades]);

    const totalPnL = enriched.reduce((sum, t) => sum + t.pnl, 0);

    const openTrades = enriched.filter(t => t.status === "OPEN");
    const closedTrades = enriched.filter(t => t.status !== "OPEN");

    return (
        <div className="portfolio-page">

            {/* HEADER */}
            <div className="portfolio-header">
                <h1>Portfolio</h1>

                <div className={`total-pnl ${totalPnL >= 0 ? "up" : "down"}`}>
                    {totalPnL >= 0 ? "+" : ""}
                    {format(totalPnL)}
                </div>
            </div>

            {/* SUMMARY */}
            <div className="portfolio-summary">
                <div>Open Trades: {openTrades.length}</div>
                <div>Closed Trades: {closedTrades.length}</div>
            </div>

            {/* TABLE */}
            <div className="portfolio-table">
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Contract</th>
                            <th>Stake</th>
                            <th>Entry</th>
                            <th>Current</th>
                            <th>Status</th>
                            <th>P&L</th>
                            <th>%</th>
                        </tr>
                    </thead>

                    <tbody>
                        {enriched.map(t => (
                            <tr key={t.id}>

                                <td>{t.marketId}</td>

                                <td>{t.contract}</td>

                                <td>{format(t.stake)}</td>

                                <td>{format(t.entryPrice)}</td>

                                <td>{format(t.currentPrice)}</td>

                                <td className={
                                    t.status === "OPEN"
                                        ? "up"
                                        : t.status === "WON"
                                            ? "up"
                                            : "down"
                                }>
                                    {t.status}
                                </td>

                                <td className={t.pnl >= 0 ? "up" : "down"}>
                                    {t.pnl >= 0 ? "+" : ""}
                                    {format(t.pnl)}
                                </td>

                                <td className={t.pnlPercent >= 0 ? "up" : "down"}>
                                    {t.pnlPercent.toFixed(2)}%
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}