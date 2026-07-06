"use client";

import ChartToolbar from "@/components/chart/ChartToolbar";
import TradingChart from "@/components/chart/TradingChart";
import PriceDisplay from "@/components/trading/PriceDisplay";

export default function TradingChartArea() {

    return (

        <main className="trading-chart-area">

            <div className="chart-toolbar-wrapper">

                <ChartToolbar />

            </div>

            <section className="chart-content">

                <TradingChart />

            </section>

            <div className="price-display-wrapper">

                <PriceDisplay />

            </div>

        </main>

    );

}