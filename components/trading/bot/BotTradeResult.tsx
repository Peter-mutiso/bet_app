"use client";

import {
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

interface Props {

    show: boolean;

    market: string;

    direction: "BUY" | "SELL";

    stake: number;

    profit: number;

    won: boolean;

    onClose?: () => void;

}

export default function BotTradeResult({

    show,

    market,

    direction,

    stake,

    profit,

    won,

}: Props) {

    if (!show) return null;

    return (

        <div
            className={`bot-result-card ${
                won ? "win" : "loss"
            }`}
        >

            <div className="bot-result-icon">

                {won ? (

                    <CheckCircle2 size={42} />

                ) : (

                    <XCircle size={42} />

                )}

            </div>

            <h2>

                {won

                    ? "Trade Won"

                    : "Trade Lost"}

            </h2>

            <div className="bot-result-grid">

                <div>

                    <span>Market</span>

                    <strong>{market}</strong>

                </div>

                <div>

                    <span>Direction</span>

                    <strong>

                        {direction === "BUY"

                            ? (

                                <>

                                    <TrendingUp size={16}/>

                                    BUY

                                </>

                            )

                            : (

                                <>

                                    <TrendingDown size={16}/>

                                    SELL

                                </>

                            )}

                    </strong>

                </div>

                <div>

                    <span>Stake</span>

                    <strong>

                        ${stake.toFixed(2)}

                    </strong>

                </div>

                <div>

                    <span>Profit</span>

                    <strong
                        className={
                            won
                                ? "profit"
                                : "loss"
                        }
                    >

                        {won ? "+" : "-"}

                        $

                        {Math.abs(profit).toFixed(2)}

                    </strong>

                </div>

            </div>

        </div>

    );

}