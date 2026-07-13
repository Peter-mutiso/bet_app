"use client";

import { useState } from "react";
import {
    History,
    Wallet,
    Activity,
    Clock,
    BarChart3,
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";

const tabs = [
    {
        id: "positions",
        label: "Open Positions",
        icon: Activity,
    },
    {
        id: "history",
        label: "Trade History",
        icon: History,
    },
    {
        id: "orders",
        label: "Orders",
        icon: Clock,
    },
    {
        id: "portfolio",
        label: "Portfolio",
        icon: Wallet,
    },
];

export default function TradingBottomPanel() {

    const [activeTab, setActiveTab] =
        useState("positions");

    const trades =
        useTradeStore(state => state.trades);

    const openTrades = trades.filter(
    (trade) => trade.status !== "CLOSED"
);

const closedTrades = trades.filter(
    (trade) => trade.status === "CLOSED"
);
    return (

        <section className="bottom-panel">

            <div className="bottom-tabs">

                {tabs.map(tab => {

                    const Icon = tab.icon;

                    return (

                        <button

                            key={tab.id}

                            className={
                                activeTab === tab.id
                                    ? "bottom-tab active"
                                    : "bottom-tab"
                            }

                            onClick={() =>
                                setActiveTab(tab.id)
                            }

                        >

                            <Icon size={16} />

                            {tab.label}

                        </button>

                    );

                })}

            </div>

            <div className="bottom-content">

                {activeTab === "positions" && (

                    <table className="trade-table">

                        <thead>

                            <tr>

                                <th>Instrument</th>

                                <th>Type</th>

                                <th>Entry</th>

                                <th>Current</th>

                                <th>Stake</th>

                                <th>P/L</th>

                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {openTrades.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="empty-row"
                                    >

                                        No open trades

                                    </td>

                                </tr>

                            ) : (

                                openTrades.map(trade => (

                                    <tr key={trade.id}>

                                        <td>

                                            Volatility 100

                                        </td>

                                        <td>

                                            {trade.tradeType}

                                        </td>

                                        <td>

                                            {trade.entry.toFixed(2)}

                                        </td>

                                        <td>
    {trade.currentPrice?.toFixed(2) ?? "--"}
</td>

                                        <td>

                                            ${trade.stake}

                                        </td>

                                        <td
                                            className={
                                                trade.profit &&
                                                trade.profit > 0
                                                    ? "profit"
                                                    : "loss"
                                            }
                                        >

                                            {trade.profit
                                                ? trade.profit.toFixed(2)
                                                : "--"}

                                        </td>

                                        <td>

                                            {trade.status}

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                )}

                {activeTab === "history" && (

<table className="trade-table">

    <thead>

        <tr>

            <th>Instrument</th>
            <th>Type</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Stake</th>
            <th>P/L</th>
            <th>Result</th>

        </tr>

    </thead>

    <tbody>

        {closedTrades.length === 0 ? (

            <tr>

                <td colSpan={7} className="empty-row">

                    No completed trades

                </td>

            </tr>

        ) : (

            closedTrades.map((trade) => (

                <tr key={trade.id}>

                    <td>Volatility 100</td>

                    <td>{trade.tradeType}</td>

                    <td>{trade.entry.toFixed(2)}</td>

                    <td>{trade.exit?.toFixed(2) ?? "--"}</td>

                    <td>${trade.stake}</td>

                    <td
                        className={
                            (trade.profit ?? 0) >= 0
                                ? "profit"
                                : "loss"
                        }
                    >
                        {(trade.profit ?? 0).toFixed(2)}
                    </td>

                    <td>
                        {(trade.profit ?? 0) >= 0
                            ? "WIN"
                            : "LOSS"}
                    </td>

                </tr>

            ))

        )}

    </tbody>

</table>

)}

                {activeTab === "orders" && (

                    <div className="panel-placeholder">

                        <Clock size={34} />

                        <p>

                            Pending orders will appear here.

                        </p>

                    </div>

                )}

                {activeTab === "portfolio" && (

                    <div className="panel-placeholder">

                        <BarChart3 size={34} />

                        <p>

                            Portfolio analytics coming soon.

                        </p>

                    </div>

                )}

            </div>

        </section>

    );

}