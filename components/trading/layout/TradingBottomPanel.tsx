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

                            {trades.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="empty-row"
                                    >

                                        No open trades

                                    </td>

                                </tr>

                            ) : (

                                trades.map(trade => (

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

                                            --

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

                    <div className="panel-placeholder">

                        <History size={34} />

                        <p>

                            Closed trades will appear here.

                        </p>

                    </div>

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