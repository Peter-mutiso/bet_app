"use client";

import {

    BotSummary,
    BotQuickActions,
    ActiveBots,
    BotPerformance,
    BotActivity

} from "@/components/trading/bot";

export default function TradingBotPage() {

    return (

        <div className="bot-page">

            <div className="bot-header">

                <div>

                    <h1>

                        Trading Bot

                    </h1>

                    <p>

                        Create, monitor and automate your trading strategies.

                    </p>

                </div>

            </div>

            <BotSummary />

            <BotQuickActions />

            <ActiveBots />

            <BotPerformance />

            <BotActivity />

        </div>

    );

}