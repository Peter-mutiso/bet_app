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

        state => state.enabledIndicators

    );

    const toggleIndicator = useTradeStore(

        state => state.toggleIndicator

    );

    return (

        <div className="indicator-panel">

            <button

                type="button"

                className="toolbar-btn"

                onClick={() =>

                    setOpen(!open)

                }

            >

                <SlidersHorizontal size={16} />

                Indicators

            </button>

            {

                open && (

                    <div className="indicator-dropdown">

                        {

                            ALL_INDICATORS.map(

                                indicator => (

                                    <button

                                        key={indicator}

                                        type="button"

                                        className="indicator-item"

                                        onClick={() =>

                                            toggleIndicator(

                                                indicator

                                            )

                                        }

                                    >

                                        <span>

                                            {indicator}

                                        </span>

                                        {

                                            enabledIndicators.includes(

                                                indicator

                                            ) && (

                                                <Check

                                                    size={16}

                                                />

                                            )

                                        }

                                    </button>

                                )

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}