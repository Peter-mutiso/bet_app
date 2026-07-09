"use client";

import {

    AnalyticsSummary,
    PortfolioGrowth,
    MarketPerformance

} from "@/components/trading/analytics";

export default function AnalyticsPage() {

    return (

        <div className="analytics-page">

            <div className="analytics-header">

                <h1>

                    Analytics

                </h1>

                <p>

                    Analyze your trading performance and discover opportunities for improvement.

                </p>

            </div>

            <AnalyticsSummary />

            <PortfolioGrowth />

            <MarketPerformance />

        </div>

    );

}