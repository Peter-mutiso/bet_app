"use client";

import TradingHeader from "./TradingHeader";
import TradingSidebar from "./TradingSidebar";
import TradingChartArea from "./TradingChartArea";
import TradingOrderPanel from "./TradingOrderPanel";
import TradingBottomPanel from "./TradingBottomPanel";

export default function TradingLayout() {

    return (

        <div className="trading-layout">

            {/* TOP HEADER */}

            <TradingHeader />

            {/* MAIN CONTENT */}

            <div className="trading-main">

                {/* LEFT SIDEBAR */}

                <TradingSidebar />

                {/* CHART + BOTTOM */}

                <main className="trading-center">

                    <section className="chart-wrapper">

                        <TradingChartArea />

                    </section>

                    <section className="bottom-wrapper">

                        <TradingBottomPanel />

                    </section>

                </main>

                {/* ORDER PANEL */}

                <aside className="order-wrapper">

                    <TradingOrderPanel />

                </aside>

            </div>

        </div>

    );

}