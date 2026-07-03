"use client";

import ChartToolbar from "./chart/ChartToolbar";
import TradingChart from "./chart/TradingChart";

export default function Chart() {
    return (
        <div className="chart-container">

            <ChartToolbar />

            <div className="chart-body">
                <TradingChart />
            </div>

        </div>
    );
}