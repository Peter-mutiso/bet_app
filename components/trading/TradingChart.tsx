/**
 * ============================================================================
 * TRADING CHART
 * ============================================================================
 */

"use client";

import { TradingProvider } from "../../services/trading/provider";
import { useTradingChart } from "../../hooks/useTradingChart";
import { useTradeStore } from "../../store/trade-store";

import ChartToolbar from "./ChartToolbar";
import ChartCanvas from "./ChartCanvas";

interface Props {
    provider: TradingProvider;
    marketId: string;
}

export default function TradingChart({
    provider,
    marketId,
}: Props) {

    const {
        connected,
        latestPrice,
        points,
    } = useTradingChart(
        provider,
        marketId
    );

    const chartType = useTradeStore(
        (state) => state.chartType
    );

    const fullscreen = useTradeStore(
        (state) => state.fullscreen
    );

    return (
        <div
            className={`trading-chart flex flex-col ${
                fullscreen
                    ? "fixed inset-0 z-50 bg-slate-950"
                    : "h-full"
            }`}
        >
            <ChartToolbar />

            {!marketId ? (
                <div className="flex flex-1 items-center justify-center text-slate-400">
                    Select a market
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">

                        <div
                            className={`font-medium ${
                                connected
                                    ? "text-green-400"
                                    : "text-yellow-400"
                            }`}
                        >
                            {connected
                                ? "● Live"
                                : "● Connecting..."}
                        </div>

                        <div className="text-lg font-bold text-white">
                            {latestPrice !== null
                                ? latestPrice.toFixed(5)
                                : "--.--"}
                        </div>

                        <div className="text-sm text-slate-400">
                            Points: {points.length}
                        </div>

                    </div>

                    <div className="flex-1 min-h-0">
                        <ChartCanvas
                            points={points}
                            chartType={chartType}
                            fullscreen={fullscreen}
                        />
                    </div>
                </>
            )}
        </div>
    );
}