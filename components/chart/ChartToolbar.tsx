"use client";

import { useState } from "react";

import {
    CandlestickChart,
    LineChart,
    AreaChart,
    Maximize2,
    BarChart3
} from "lucide-react";

import TimeframeSelector from "./TimeframeSelector";
import IndicatorPanel from "./IndicatorPanel";
import FullscreenButton from "./FullscreenButton";

const instruments = [
    "Volatility 10",
    "Volatility 25",
    "Volatility 50",
    "Volatility 75",
    "Volatility 100",
    "EUR/USD",
    "GBP/USD",
    "BTC/USD"
];

type ChartType =
    | "candles"
    | "line"
    | "area";

export default function ChartToolbar() {

    const [instrument, setInstrument] =
        useState("Volatility 100");

    const [chartType, setChartType] =
        useState<ChartType>("candles");

    return (

        <div className="chart-toolbar">

            {/* LEFT */}

            <div className="toolbar-left">

                <select
                    value={instrument}
                    onChange={(e) =>
                        setInstrument(e.target.value)
                    }
                    className="toolbar-select"
                >
                    {instruments.map(item => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}
                </select>

                <TimeframeSelector />

            </div>

            {/* CENTER */}

            <div className="toolbar-center">

                <button
                    className={
                        chartType === "candles"
                            ? "toolbar-btn active"
                            : "toolbar-btn"
                    }
                    onClick={() =>
                        setChartType("candles")
                    }
                >
                    <CandlestickChart size={16} />
                    Candles
                </button>

                <button
                    className={
                        chartType === "line"
                            ? "toolbar-btn active"
                            : "toolbar-btn"
                    }
                    onClick={() =>
                        setChartType("line")
                    }
                >
                    <LineChart size={16} />
                    Line
                </button>

                <button
                    className={
                        chartType === "area"
                            ? "toolbar-btn active"
                            : "toolbar-btn"
                    }
                    onClick={() =>
                        setChartType("area")
                    }
                >
                    <AreaChart size={16} />
                    Area
                </button>

            </div>

            {/* RIGHT */}

            <div className="toolbar-right">

                <IndicatorPanel />

                <FullscreenButton />

            </div>

        </div>

    );

}