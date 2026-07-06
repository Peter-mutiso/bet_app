"use client";


import {
    TrendingUp,
    TrendingDown,
    Wallet,
    DollarSign,
    Clock,
    BarChart3
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";

export default function TradingOrderPanel() {

    const {

        stake,

        increaseStake,

        decreaseStake,

        setStake,

        balance,

        currentTradeType,

        setCurrentTradeType,

        buy

    } = useTradeStore();

    const payout = (stake * 1.86).toFixed(2);

    const profit = (stake * 0.86).toFixed(2);

    return (

        <aside className="order-panel">

            {/* HEADER */}

            <div className="order-header">

                <h2>

                    Trade Ticket

                </h2>

                <span>

                    Execute Order

                </span>

            </div>

            {/* BUY / SELL */}

            <div className="trade-direction">

                <button

                    className={
                        currentTradeType === "CALL"
                            ? "direction-btn active-buy"
                            : "direction-btn"
                    }

                    onClick={() =>
                        setCurrentTradeType("CALL")
                    }

                >

                    <TrendingUp size={20} />

                    Rise

                </button>

                <button

                    className={
                        currentTradeType === "PUT"
                            ? "direction-btn active-sell"
                            : "direction-btn"
                    }

                    onClick={() =>
                        setCurrentTradeType("PUT")
                    }

                >

                    <TrendingDown size={20} />

                    Fall

                </button>

            </div>

            {/* STAKE */}

            <div className="panel-section">

                <label>

                    Stake

                </label>

                <div className="stake-box">

                    <button onClick={decreaseStake}>

                        −

                    </button>

                    <input

                        type="number"

                        value={stake}

                        onChange={(e)=>

                            setStake(

                                Number(e.target.value)

                            )

                        }

                    />

                    <button onClick={increaseStake}>

                        +

                    </button>

                </div>

            </div>

            {/* DURATION */}

            <div className="panel-section">

                <label>

                    Duration

                </label>

                <div className="duration-box">

                    <Clock size={16}/>

                    <select>

                        <option>1 Tick</option>

                        <option>5 Ticks</option>

                        <option>10 Ticks</option>

                        <option>30 Seconds</option>

                        <option>1 Minute</option>

                    </select>

                </div>

            </div>

            {/* PAYOUT */}

            <div className="summary-card">

                <div>

                    <DollarSign size={18}/>

                    Potential Payout

                </div>

                <strong>

                    ${payout}

                </strong>

            </div>

            <div className="summary-card">

                <div>

                    <BarChart3 size={18}/>

                    Potential Profit

                </div>

                <strong className="green">

                    ${profit}

                </strong>

            </div>

            <div className="summary-card">

                <div>

                    <Wallet size={18}/>

                    Balance

                </div>

                <strong>

                    ${balance.toFixed(2)}

                </strong>

            </div>

            {/* EXECUTE */}

            <button

                className="trade-button"

                onClick={() => buy()}

            >

                Execute Trade

            </button>

        </aside>

    );

}