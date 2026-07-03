"use client";

import SummaryCard from "./SummaryCard";

import {

    Wallet,
    Gift,
    Activity,
    TrendingUp

} from "lucide-react";

interface WalletSummaryProps {

    balance: number;

    bonus: number;

    openBets: number;

    dailyProfit: number;

}

export default function WalletSummary({

    balance,

    bonus,

    openBets,

    dailyProfit

}: WalletSummaryProps) {

    return (

        <section className="wallet-summary">

            <SummaryCard

                title="Wallet Balance"

                value={`$${balance.toFixed(2)}`}

                subtitle="Available funds"

                icon={<Wallet size={28} />}

                color="blue"

            />

            <SummaryCard

                title="Bonus"

                value={`$${bonus.toFixed(2)}`}

                subtitle="Promotional balance"

                icon={<Gift size={28} />}

                color="orange"

            />

            <SummaryCard

                title="Open Bets"

                value={openBets}

                subtitle="Currently active"

                icon={<Activity size={28} />}

                color="green"

            />

            <SummaryCard

                title="Today's Profit"

                value={`$${dailyProfit.toFixed(2)}`}

                subtitle={

                    dailyProfit >= 0

                        ? "Profit"

                        : "Loss"

                }

                icon={<TrendingUp size={28} />}

                color={

                    dailyProfit >= 0

                        ? "green"

                        : "red"

                }

            />

        </section>

    );

}