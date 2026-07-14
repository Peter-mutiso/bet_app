"use client";
import { SelectedMarket, useTradeStore } from "@/store/useTradeStore";
import {
    useEffect,
    useState,
} from "react";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Clock3,
    DollarSign
} from "lucide-react";
import TradingChart from "@/components/chart/TradingChart";


interface TradingPanelProps {
    market: SelectedMarket | null;
}

export default function TradingPanel({
    market,
}: TradingPanelProps) {
    // ----------------------------------------------------
    // ALL HOOKS MUST BE CALLED FIRST
    // ----------------------------------------------------

    const marketId = market?.id ?? "";

    const stake = useTradeStore(state => state.stake);
const setStake = useTradeStore(state => state.setStake);

const duration = useTradeStore(state => state.duration);
const setDuration = useTradeStore(state => state.setDuration);

const currentTradeType = useTradeStore(
    state => state.currentTradeType
);

const setCurrentTradeType = useTradeStore(
    state => state.setCurrentTradeType
);

const buy = useTradeStore(
    state => state.buy
);

const setSelectedMarket = useTradeStore(
    state => state.setSelectedMarket
);

const setSelectedSide = useTradeStore(
    state => state.setSelectedSide
);
const livePrice = useTradeStore(state => state.price);
useEffect(() => {

    if (market) {

        setSelectedMarket({

            symbol: market.symbol,

            name: market.name,

            category: market.category ?? "Synthetic",

            price: livePrice,

            change: market.change

        });

    }

}, [

    market,

    livePrice,

    setSelectedMarket

]);
    // ----------------------------------------------------
    // SAFE EARLY RETURN
    // ----------------------------------------------------

    if (!market) {

        return (

            <section className="trading-panel empty">

                <Activity size={60} />

                <h2>

                    Select a Market

                </h2>

                <p>

                    Choose an instrument from Market Watch.

                </p>

            </section>

        );

    }

    const payout = (stake * 1.86).toFixed(2);

    return (

        <section className="trading-panel">

            <div className="panel-header">

                <div>

                    <h2>

                        {market.name}

                    </h2>

                    <small>

                        {market.id}

                    </small>

                </div>

                <span className="live-dot">

                    LIVE

                </span>

            </div>

            <div className="current-price">

                {livePrice.toFixed(2)}

            </div>

            <div
                className={
                    market.change >= 0
                        ? "price-change positive"
                        : "price-change negative"
                }
            >

                {

                    market.change >= 0
                        ? <TrendingUp size={18} />
                        : <TrendingDown size={18} />

                }

                {market.change.toFixed(2)}%

            </div>

            <div className="dashboard-live-chart">

    <TradingChart
        
    />

</div>

            <div className="trade-controls">

                <label>

                    <DollarSign size={16} />

                    Stake

                </label>

                <input

                    type="number"

                    value={stake}

                    onChange={(e)=>

setStake(

Number(e.target.value)

)
}

                />

                <label>

                    <Clock3 size={16} />

                    Duration

                </label>

                <select

                    value={duration}

                    onChange={(e) =>
    setDuration(Number(e.target.value))
}

                >

                    <option value={5}>5 Seconds</option>
<option value={10}>10 Seconds</option>
<option value={30}>30 Seconds</option>
<option value={60}>1 Minute</option>
<option value={300}>5 Minutes</option>
                </select>

                <label>

                    Contract

                </label>

                <select

                    value={currentTradeType}

onChange={(e) =>
    setCurrentTradeType(e.target.value as any)
}

                >

                    <option value="CALL">Rise</option>

<option value="PUT">Fall</option>

<option value="ACCUMULATOR">Accumulator</option>

<option value="DIGIT_OVER">Digit Over</option>

<option value="DIGIT_UNDER">Digit Under</option>
                </select>

            </div>

            <div className="estimated-payout">

                Estimated Payout

                <strong>

                    ${payout}

                </strong>

            </div>

            <div className="trade-buttons">

                <button
    className="buy-btn"
    onClick={() => {

        setSelectedSide("BUY");

        setCurrentTradeType("CALL");

        buy();

    }}
>

    BUY

</button>

                <button
    className="sell-btn"
    onClick={() => {

        setSelectedSide("SELL");

        setCurrentTradeType("PUT");

        buy();

    }}
>

    SELL

</button>

            </div>

        </section>

    );

}


