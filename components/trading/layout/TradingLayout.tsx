"use client";

import TradingHeader from "./TradingHeader";
import TradingSidebar from "./TradingSidebar";
import TradingChartArea from "./TradingChartArea";
import TradingOrderPanel from "./TradingOrderPanel";
import TradingBottomPanel from "./TradingBottomPanel";

export default function TradingLayout() {
    return (
        <div className="trading-layout">

            <TradingHeader />

            <div className="trading-main">

                {/* LEFT NAVIGATION */}

                <TradingSidebar />

                {/* CENTER */}

                <div className="trading-center">

                    <TradingChartArea />

                    <TradingBottomPanel />

                </div>

                {/* RIGHT ORDER PANEL */}

                <TradingOrderPanel />

            </div>

        </div>
    );
}