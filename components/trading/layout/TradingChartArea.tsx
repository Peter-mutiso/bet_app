"use client";

import ChartToolbar from "@/components/chart/ChartToolbar";
import TradingChart from "@/components/chart/TradingChart";
import PriceDisplay from "@/components/trading/PriceDisplay";

export default function TradingChartArea() {
    return (
        <section className="trading-chart-area">

            {/* Top Toolbar */}
            <header className="chart-header">
                <ChartToolbar />
            </header>

            {/* Main Chart */}
            <main className="chart-body">
                <TradingChart />
            </main>

            {/* Bottom Market Information */}
            <footer className="chart-footer">
                <PriceDisplay />
            </footer>

        </section>
    );
}