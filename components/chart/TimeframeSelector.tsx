"use client";

import { useState } from "react";

const timeframes = [
    "1T",
    "5T",
    "10T",
    "15T",
    "30T",
    "1M",
    "5M",
    "15M"
];

export default function TimeframeSelector() {

    const [selected, setSelected] = useState("1T");

    return (

        <div className="timeframe-selector">

            {

                timeframes.map((frame) => (

                    <button
                        key={frame}
                        onClick={() => setSelected(frame)}
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