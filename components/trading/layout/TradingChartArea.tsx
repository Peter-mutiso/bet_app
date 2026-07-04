"use client";

import ChartToolbar from "@/components/chart/ChartToolbar";
import TradingChart from "@/components/chart/TradingChart";
import PriceDisplay from "@/components/trading/PriceDisplay";

export default function TradingChartArea() {

    return (

        <main className="flex flex-col bg-[#111827] overflow-hidden">

            {/* Toolbar */}

            <ChartToolbar />

            {/* Chart */}

            <div className="flex-1 relative">

                <TradingChart />

            </div>

            {/* Live price */}

            <PriceDisplay />

        </main>

    );

}