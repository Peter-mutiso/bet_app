"use client";

import {
    SlidersHorizontal,
    Check
} from "lucide-react";

import { useState } from "react";

import {
    Indicator,
    useTradeStore
} from "@/store/useTradeStore";

const ALL_INDICATORS: Indicator[] = [
    "EMA (9)",
    "EMA (21)",
    "EMA (50)",
    "SMA (20)",
    "RSI",
    "MACD",
    "Bollinger Bands",
    "Stochastic",
    "ATR",
    "VWAP"
];

export default function IndicatorPanel() {

    const [open, setOpen] = useState(false);

    const enabledIndicators = useTradeStore(
        (state) => state.enabledIndicators
    );

    const toggleIndicator = useTradeStore(
        (state) => state.toggleIndicator
    );

    return (

        <div className="indicator-panel">

            <button
                type="button"
                className="toolbar-btn"
                onClick={() => setOpen((prev) => !prev)}
            >

                <SlidersHorizontal size={16} />

                <span>Indicators</span>

            </button>

            {open && (

                <div className="indicator-dropdown">

                    <div className="indicator-title">

                        Technical Indicators

                    </div>

                    {ALL_INDICATORS.map((indicator) => {

                        const active =
                            enabledIndicators.includes(indicator);

                        return (

                            <button
                                key={indicator}
                                type="button"
                                className={
                                    active
                                        ? "indicator-item active"
                                        : "indicator-item"
                                }
                                onClick={() =>
                                    toggleIndicator(indicator)
                                }
                            >

                                <span>{indicator}</span>

                                {active && (

                                    <Check size={16} />

                                )}

                            </button>

                        );

                    })}

                </div>

            )}

        </div>

    );

}