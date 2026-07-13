"use client";

import { Clock3 } from "lucide-react";
import { useTradeStore, type Timeframe } from "@/store/useTradeStore";

const TIMEFRAMES: Timeframe[] = [
    "1T",
    "5T",
    "15T",
    "1H",
    "4H",
    "1D",
];

export default function TimeframeSelector() {
    const selected = useTradeStore(
        (state) => state.timeframe
    );

    const setTimeframe = useTradeStore(
        (state) => state.setTimeframe
    );

    return (
        <div className="timeframe-selector">

            <div className="timeframe-label">
                <Clock3 size={14} />
                <span>Interval</span>
            </div>

            <div className="timeframe-buttons">

                {TIMEFRAMES.map((frame) => (

                    <button
                        key={frame}
                        type="button"
                        className={
                            selected === frame
                                ? "timeframe-btn active"
                                : "timeframe-btn"
                        }
                        onClick={() => {
                            console.log("Clicked timeframe:", frame);
                            setTimeframe(frame);
                        }}
                    >
                        {frame}
                    </button>

                ))}

            </div>

        </div>
    );
}