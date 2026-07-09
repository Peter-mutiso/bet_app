"use client";

import {

    NewsCategories,
    BreakingNews,
    LatestNews,
    MarketMovers,
    EconomicCalendar,
    TrendingTopics

} from "@/components/trading/news";

export default function NewsPage() {

    return (

        <div className="news-page">

            <div className="news-header">

                <h1>

                    Market News

                </h1>

                <p>

                    Stay informed with breaking news, market insights and economic events.

                </p>

            </div>

            <NewsCategories />

            <BreakingNews />

            <LatestNews />

            <MarketMovers />

            <EconomicCalendar />

            <TrendingTopics />

        </div>

    );

}