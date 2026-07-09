"use client";

import { useTradeStore } from "@/store/useTradeStore";

export default function ChartToolbar() {
    const timeframe = useTradeStore((state) => state.timeframe);
    const chartType = useTradeStore((state) => state.chartType);
    const fullscreen = useTradeStore((state) => state.fullscreen);
    const indicators = useTradeStore((state) => state.enabledIndicators);

    const setTimeframe = useTradeStore(
        (state) => state.setTimeframe
    );

    const setChartType = useTradeStore(
        (state) => state.setChartType
    );

    const toggleIndicator = useTradeStore(
        (state) => state.toggleIndicator
    );

    const toggleFullscreen = useTradeStore(
        (state) => state.toggleFullscreen
    );

    const timeframes = [
        "1T",
        "5T",
        "15T",
        "1H",
        "4H",
        "1D",
    ] as const;

    const chartTypes = [
        {
            value: "candles",
            label: "Candles",
        },
        {
            value: "line",
            label: "Line",
        },
        {
            value: "area",
            label: "Area",
        },
    ] as const;

    const availableIndicators = [
        "EMA (9)",
        "EMA (21)",
        "EMA (50)",
        "SMA (20)",
        "RSI",
        "MACD",
        "Bollinger Bands",
        "Stochastic",
        "ATR",
        "VWAP",
    ] as const;

        return (
        <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-slate-700 bg-slate-900">

            {/* Left Section */}
            <div className="flex items-center gap-2">

                {/* Timeframes */}
                <div className="flex rounded-md overflow-hidden border border-slate-700">

                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 text-sm transition-colors ${
                                timeframe === tf
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            }`}
                        >
                            {tf}
                        </button>
                    ))}

                </div>

                {/* Chart Type */}
                <select
                    value={chartType}
                    onChange={(e) =>
                        setChartType(
                            e.target.value as
                                "candles" |
                                "line" |
                                "area"| 
                                "ohlc"
                        )
                    }
                    className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm"
                >
                    {chartTypes.map((type) => (
                        <option
                            key={type.value}
                            value={type.value}
                        >
                            {type.label}
                        </option>
                    ))}
                </select>

            </div>
                        {/* Right Section */}
            <div className="flex items-center gap-3">

                {/* Indicators */}
                <details className="relative">

                    <summary className="cursor-pointer select-none rounded border border-slate-700 bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700">
                        Indicators
                    </summary>

                    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-700 bg-slate-900 shadow-xl z-50">

                        {availableIndicators.map((indicator) => (

                            <label
                                key={indicator}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 cursor-pointer"
                            >

                                <input
                                    type="checkbox"
                                    checked={indicators.includes(indicator)}
                                    onChange={() =>
                                        toggleIndicator(indicator)
                                    }
                                />

                                <span className="text-sm">
                                    {indicator}
                                </span>

                            </label>

                        ))}

                    </div>

                </details>

                {/* Fullscreen */}
                <button
                    onClick={toggleFullscreen}
                    className="rounded border border-slate-700 bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
                >
                    {fullscreen
                        ? "Exit Fullscreen"
                        : "Fullscreen"}
                </button>

            </div>
                    </div>
    );
}