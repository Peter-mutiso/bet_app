"use client";

import { useState } from "react";
import {
    SlidersHorizontal,
    Check
} from "lucide-react";

interface Indicator {

    name: string;

    enabled: boolean;

}

export default function IndicatorPanel() {

    const [open, setOpen] = useState(false);

    const [indicators, setIndicators] = useState<Indicator[]>([
        {
            name: "EMA (9)",
            enabled: true
        },
        {
            name: "EMA (21)",
            enabled: true
        },
        {
            name: "SMA (50)",
            enabled: false
        },
        {
            name: "SMA (200)",
            enabled: false
        },
        {
            name: "Bollinger Bands",
            enabled: true
        },
        {
            name: "RSI",
            enabled: false
        },
        {
            name: "MACD",
            enabled: false
        },
        {
            name: "ATR",
            enabled: false
        },
        {
            name: "Stochastic",
            enabled: false
        },
        {
            name: "Ichimoku Cloud",
            enabled: false
        }
    ]);

    function toggle(index: number) {

        setIndicators(previous =>

            previous.map((indicator, i) =>

                i === index

                    ? {
                        ...indicator,
                        enabled: !indicator.enabled
                    }

                    : indicator

            )

        );

    }

    return (

        <div className="indicator-panel">

            <button

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

                            indicators.map(

                                (indicator, index) => (

                                    <button

                                        key={indicator.name}

                                        className="indicator-item"

                                        onClick={() =>

                                            toggle(index)

                                        }

                                    >

                                        <span>

                                            {indicator.name}

                                        </span>

                                        {

                                            indicator.enabled && (

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