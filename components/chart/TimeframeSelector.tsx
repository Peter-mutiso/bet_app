"use client";

import { useTradeStore } from "@/store/useTradeStore";

const timeframes = [
    "1T",
    "5T",
    "15T",
    "1H",
    "4H",
    "1D"
] as const;

export default function TimeframeSelector() {

    const selected = useTradeStore(
        (state) => state.timeframe
    );

    const setTimeframe = useTradeStore(
        (state) => state.setTimeframe
    );

    return (

        <div className="timeframe-selector">

            {

                timeframes.map((frame) => (

                    <button

                        key={frame}

                        type="button"

                        onClick={() =>

                            setTimeframe(frame)

                        }

                        className={

                            selected === frame

                                ? "timeframe-btn active"

                                : "timeframe-btn"

                        }

                    >

                        {frame}

                    </button>

                ))

            }

        </div>

    );

}