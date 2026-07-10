"use client";

import { useMemo } from "react";

import { useTrading } from "../../contexts/TradingContext";
import type { Trade } from "../../types/trade";

function format(value: number | undefined) {
    return Number(value ?? 0).toFixed(2);
}

function calculateLivePnL(trade: Trade): number {
    if (trade.status !== "OPEN") {
        return trade.profitLoss?.realizedPnL ?? trade.profit ?? 0;
    }

    const entry = trade.pricing?.entryPrice ?? trade.entry;
    const current =
    trade.currentPrice ?? trade.entry;

    const volume = trade.size?.volume ?? trade.stake;

    const diff = current - entry;

    return trade.direction === "BUY"
        ? diff * volume
        : -diff * volume;
}

export default function PortfolioPage() {

    const { trades } = useTrading();

    const portfolio = useMemo(() => {

        return trades.map((trade: Trade) => {

            const pnl = calculateLivePnL(trade);

            const investment =
    (trade.pricing?.entryPrice ?? trade.entry) *
    (trade.size?.volume ?? 1);

            const pnlPercent =
                investment > 0
                    ? (pnl / investment) * 100
                    : 0;

            return {

                ...trade,

                pnl,

                pnlPercent,

            };

        });

    }, [trades]);

    const totalPnL = portfolio.reduce(

        (sum, trade) => sum + trade.pnl,

        0

    );

    const openTrades = portfolio.filter(

        trade => trade.status === "OPEN"

    );

    const closedTrades = portfolio.filter(

        trade => trade.status !== "OPEN"

    );

    return (

        <div className="portfolio-page">

            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}

            <div className="portfolio-header">

                <div>

                    <h1>

                        Portfolio

                    </h1>

                    <p>

                        Monitor your open positions, profits and overall portfolio performance.

                    </p>

                </div>

                <div
                    className={`portfolio-total ${
                        totalPnL >= 0
                            ? "up"
                            : "down"
                    }`}
                >

                    {totalPnL >= 0 ? "+" : ""}

                    {format(totalPnL)}

                </div>

            </div>

            {/* ========================================================= */}
            {/* SUMMARY */}
            {/* ========================================================= */}

            <div className="portfolio-summary">

                <div className="summary-card">

                    <span>

                        Open Positions

                    </span>

                    <strong>

                        {openTrades.length}

                    </strong>

                </div>

                <div className="summary-card">

                    <span>

                        Closed Positions

                    </span>

                    <strong>

                        {closedTrades.length}

                    </strong>

                </div>

                <div className="summary-card">

                    <span>

                        Total Trades

                    </span>

                    <strong>

                        {portfolio.length}

                    </strong>

                </div>

                <div className="summary-card">

                    <span>

                        Portfolio P/L

                    </span>

                    <strong
                        className={
                            totalPnL >= 0
                                ? "up"
                                : "down"
                        }
                    >

                        {totalPnL >= 0 ? "+" : ""}

                        {format(totalPnL)}

                    </strong>

                </div>

            </div>

            {/* ========================================================= */}
            {/* TABLE */}
            {/* ========================================================= */}

            <div className="portfolio-table">

                <table>

                    <thead>

                        <tr>

                            <th>

                                Instrument

                            </th>

                            <th>

                                Direction

                            </th>

                            <th>

                                Timeframe

                            </th>

                            <th>

                                Volume

                            </th>

                            <th>

                                Entry

                            </th>

                            <th>

                                Current

                            </th>

                            <th>

                                Status

                            </th>

                            <th>

                                Profit / Loss

                            </th>

                            <th>

                                Return %

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {portfolio.map((trade) => (

                            <tr key={trade.id}>

                                <td>

                                    {trade.instrument?.symbol ??
                                        trade.instrument?.name ??
                                        "--"}

                                </td>

                                <td
                                    className={
                                        trade.direction ===
                                        "BUY"
                                            ? "up"
                                            : "down"
                                    }
                                >

                                    {trade.direction}

                                </td>

                                <td>

                                    {trade.timeframe}

                                </td>

                                <td>

                                    {format(
                                        trade.size?.volume ?? trade.stake
                                    )}

                                </td>

                                <td>

                                    {format(
                                        trade.pricing?.entryPrice ?? trade.entry
                                    )}

                                </td>

                                <td>

                                    {format(
                                        trade.pricing?.currentPrice ?? trade.currentPrice
                                    )}

                                </td>

                                <td>

                                    {trade.status}

                                </td>

                                <td
                                    className={
                                        trade.pnl >= 0
                                            ? "up"
                                            : "down"
                                    }
                                >

                                    {trade.pnl >= 0
                                        ? "+"
                                        : ""}

                                    {format(
                                        trade.pnl
                                    )}

                                </td>

                                <td
                                    className={
                                        trade.pnlPercent >= 0
                                            ? "up"
                                            : "down"
                                    }
                                >

                                    {trade.pnlPercent.toFixed(
                                        2
                                    )}

                                    %

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}