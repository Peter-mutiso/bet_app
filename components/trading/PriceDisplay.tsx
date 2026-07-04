"use client";

import { useTradeStore } from "@/store/useTradeStore";

export default function PriceDisplay() {

    const price = useTradeStore(
        (state) => state.price
    );

    // Simulated spread
    const spread = 0.20;

    const bid = price;
    const ask = price + spread;

    return (

        <div className="price-display">

            <div>

                <small>

                    Bid

                </small>

                <h2>

                    {bid.toFixed(2)}

                </h2>

            </div>

            <div>

                <small>

                    Ask

                </small>

                <h2>

                    {ask.toFixed(2)}

                </h2>

            </div>

        </div>

    );

}