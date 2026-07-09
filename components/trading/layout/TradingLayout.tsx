"use client";

import TradingHeader from "./TradingHeader";
import TradingSidebar from "./TradingSidebar";
import TradingChartArea from "./TradingChartArea";
import TradingOrderPanel from "./TradingOrderPanel";
import TradingBottomPanel from "./TradingBottomPanel";
import { MarketSelector } from "../market-selector";

export default function TradingLayout() {
    return (
        <div className="trading-layout">

            {/* ================= HEADER ================= */}

            <header className="terminal-header">

                <TradingHeader />

            </header>

            {/* ================= TERMINAL ================= */}

            <div className="trading-main">

                {/* Left Sidebar */}

                <aside className="terminal-sidebar">

                    <TradingSidebar />

                </aside>

                {/* Center Column */}

                <main className="terminal-center">

                    {/* Trading Chart */}

                    <section className="terminal-chart">

                        <TradingChartArea />

                    </section>

                    {/* Positions / History */}

                    <section className="terminal-bottom">

                        <TradingBottomPanel />

                    </section>

                </main>

                {/* Order Panel */}

                <aside className="terminal-order">

                    <TradingOrderPanel />

                </aside>

            </div>

            <MarketSelector />

        </div>
    );
}