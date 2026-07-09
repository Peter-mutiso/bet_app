"use client";

import AnimatedTradeCard from "@/components/trading/AnimatedTradeCard";
import { Trade, TRADE_TYPE_LABELS } from "@/store/useTradeStore";

interface Props {
    positions: Trade[];
}

export default function OpenPositions({
    positions,
}: Props) {
    return (
        <section className="open-positions space-y-4">

            <h2 className="text-xl font-semibold">
                Open Positions
            </h2>

            {positions.length === 0 ? (

                <p className="text-slate-500">
                    No open positions.
                </p>

            ) : (

                positions.map((trade) => {

                    const isClosed =
                        trade.status === "CLOSED";

                    const price =
                        isClosed
                            ? trade.exit
                            : trade.currentPrice;

                    const pnl =
                        isClosed
                            ? trade.profit
                            : trade.floatingProfit;

                    const pnlPositive =
                        (pnl ?? 0) >= 0;

                    return (

                        <AnimatedTradeCard
                            key={trade.id}
                            trade={trade}
                        >

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h3 className="text-lg font-semibold text-white">

                                            {TRADE_TYPE_LABELS[trade.tradeType]}

                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">

                                            Duration: {trade.duration}s

                                        </p>

                                    </div>

                                    <span
                                        className={`rounded-md px-3 py-1 text-xs font-semibold ${
                                            trade.direction === "BUY"
                                                ? "bg-green-500/10 text-green-400"
                                                : "bg-red-500/10 text-red-400"
                                        }`}
                                    >
                                        {trade.direction}
                                    </span>

                                </div>

                                <div className="mt-5 space-y-3 text-sm">

                                    <div className="flex justify-between">

                                        <span className="text-slate-400">

                                            Stake

                                        </span>

                                        <strong>

                                            KES {trade.stake.toLocaleString()}

                                        </strong>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-slate-400">

                                            Entry Price

                                        </span>

                                        <strong>

                                            {trade.entry.toFixed(2)}

                                        </strong>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-slate-400">

                                            {isClosed
                                                ? "Exit Price"
                                                : "Current Price"}

                                        </span>

                                        <strong>

                                            {price !== undefined
                                                ? price.toFixed(2)
                                                : "--"}

                                        </strong>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-slate-400">

                                            {isClosed
                                                ? "Final P/L"
                                                : "Floating P/L"}

                                        </span>

                                        <strong
                                            className={
                                                pnlPositive
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }
                                        >

                                            KES {(pnl ?? 0).toFixed(2)}

                                        </strong>

                                    </div>

                                    {!isClosed && (

                                        <div className="flex justify-between">

                                            <span className="text-slate-400">

                                                Remaining

                                            </span>

                                            <strong className="text-yellow-400">

                                                {trade.remainingSeconds}s

                                            </strong>

                                        </div>

                                    )}

                                    <div className="flex justify-between">

                                        <span className="text-slate-400">

                                            Status

                                        </span>

                                        <span
                                            className={`rounded px-2 py-1 text-xs font-semibold ${
                                                trade.status === "OPEN"
                                                    ? "bg-blue-500/10 text-blue-400"
                                                    : trade.status === "PENDING"
                                                    ? "bg-yellow-500/10 text-yellow-400"
                                                    : "bg-green-500/10 text-green-400"
                                            }`}
                                        >

                                            {trade.status}

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </AnimatedTradeCard>

                    );

                })

            )}

        </section>
    );
}