"use client";

import { CircleDollarSign, TrendingUp } from "lucide-react";

interface ActiveBet {

    readonly id: string;

    readonly market: string;

    readonly stake: number;

    readonly potentialPayout: number;

    readonly status: string;

}

interface ActiveBetsProps {

    readonly bets: readonly ActiveBet[];

}

export default function ActiveBets({

    bets

}: ActiveBetsProps) {

    const badgeClass = (status: string) => {

        switch (status.toLowerCase()) {

            case "running":
            case "active":
                return "status running";

            case "won":
                return "status won";

            case "lost":
                return "status lost";

            case "pending":
                return "status pending";

            default:
                return "status";
        }
    };

    return (

        <section className="dashboard-active-bets">

            <div className="section-header">

                <h2>Active Positions</h2>

                <span>{bets.length} Open</span>

            </div>

            {bets.length === 0 ? (

                <div className="empty-state">

                    No active trades.

                </div>

            ) : (

                <div className="bets-table">

                    <div className="bets-header">

                        <span>Market</span>

                        <span>Stake</span>

                        <span>Payout</span>

                        <span>Status</span>

                        <span></span>

                    </div>

                    {bets.map((bet) => (

                        <div

                            key={bet.id}

                            className="bet-row"

                        >

                            <div className="bet-market">

                                <TrendingUp size={18} />

                                <div>

                                    <strong>{bet.market}</strong>

                                    <small>ID: {bet.id}</small>

                                </div>

                            </div>

                            <div>

                                <CircleDollarSign size={16} />

                                ${bet.stake.toFixed(2)}

                            </div>

                            <div className="bet-profit">

                                ${bet.potentialPayout.toFixed(2)}

                            </div>

                            <div>

                                <span className={badgeClass(bet.status)}>

                                    {bet.status}

                                </span>

                            </div>

                            <div>

                                <button

                                    className="cashout-btn"

                                    disabled

                                >

                                    Cash Out

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>

    );

}