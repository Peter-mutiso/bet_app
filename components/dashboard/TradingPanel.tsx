"use client";

import { useState } from "react";

import {

    TrendingUp,
    TrendingDown,
    Activity,
    Clock3,
    DollarSign

} from "lucide-react";

import { useLivePrice } from "../../hooks/useLivePrice";

interface Market {

    id: string;

    name: string;

    price: number;

    change: number;

}

interface Props {

    market: Market | null;

}

export default function TradingPanel({

    market

}: Props) {

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

    const livePrice =

        useLivePrice(market.id);

    const [stake, setStake] =

        useState(10);

    const [duration, setDuration] =

        useState("5 Ticks");

    const [contract, setContract] =

        useState("Rise/Fall");

    const payout =

        (stake * 1.92).toFixed(2);

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

                        ? <TrendingUp size={18}/>

                        : <TrendingDown size={18}/>

                }

                {market.change.toFixed(2)}%

            </div>

            <div className="chart-placeholder">

                Live Chart

            </div>

            <div className="trade-controls">

                <label>

                    <DollarSign size={16}/>

                    Stake

                </label>

                <input

                    type="number"

                    value={stake}

                    onChange={(e)=>

                        setStake(Number(e.target.value))

                    }

                />

                <label>

                    <Clock3 size={16}/>

                    Duration

                </label>

                <select

                    value={duration}

                    onChange={(e)=>

                        setDuration(e.target.value)

                    }

                >

                    <option>

                        5 Ticks

                    </option>

                    <option>

                        10 Ticks

                    </option>

                    <option>

                        1 Minute

                    </option>

                    <option>

                        5 Minutes

                    </option>

                </select>

                <label>

                    Contract

                </label>

                <select

                    value={contract}

                    onChange={(e)=>

                        setContract(e.target.value)

                    }

                >

                    <option>

                        Rise/Fall

                    </option>

                    <option>

                        Higher/Lower

                    </option>

                    <option>

                        Touch/No Touch

                    </option>

                </select>

            </div>

            <div className="estimated-payout">

                Estimated Payout

                <strong>

                    ${payout}

                </strong>

            </div>

            <div className="trade-buttons">

                <button className="buy-btn">

                    BUY

                </button>

                <button className="sell-btn">

                    SELL

                </button>

            </div>

        </section>

    );

}