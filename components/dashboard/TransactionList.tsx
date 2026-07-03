"use client";

import {

    ArrowDownCircle,
    ArrowUpCircle,
    BadgeDollarSign,
    Trophy,
    RotateCcw,
    Wallet

} from "lucide-react";

interface Transaction {

    id: string;

    type: string;

    amount: number;

    date: string;

}

interface TransactionListProps {

    transactions: Transaction[];

}

export default function TransactionList({

    transactions

}: TransactionListProps) {

    const icon = (type: string) => {

        switch (type.toLowerCase()) {

            case "deposit":
                return <ArrowDownCircle size={22} />;

            case "withdraw":
                return <ArrowUpCircle size={22} />;

            case "bet":
                return <BadgeDollarSign size={22} />;

            case "win":
                return <Trophy size={22} />;

            case "refund":
                return <RotateCcw size={22} />;

            default:
                return <Wallet size={22} />;
        }

    };

    const positive = (type: string) => {

        return [

            "deposit",

            "win",

            "refund",

            "bonus"

        ].includes(type.toLowerCase());

    };

    return (

        <section className="dashboard-transactions">

            <div className="section-header">

                <h2>

                    Transaction History

                </h2>

                <span>

                    {transactions.length} Records

                </span>

            </div>

            {

                transactions.length === 0 ? (

                    <div className="empty-state">

                        No transactions yet.

                    </div>

                ) : (

                    <div className="transaction-list">

                        {

                            transactions.map(transaction => (

                                <div

                                    key={transaction.id}

                                    className="transaction-row"

                                >

                                    <div className="transaction-left">

                                        <div className="transaction-icon">

                                            {

                                                icon(transaction.type)

                                            }

                                        </div>

                                        <div>

                                            <strong>

                                                {transaction.type}

                                            </strong>

                                            <small>

                                                {new Date(transaction.date).toLocaleString()}

                                            </small>

                                        </div>

                                    </div>

                                    <div

                                        className={

                                            positive(transaction.type)

                                                ? "transaction-amount positive"

                                                : "transaction-amount negative"

                                        }

                                    >

                                        {

                                            positive(transaction.type)

                                                ? "+"

                                                : "-"

                                        }

                                        $

                                        {transaction.amount.toFixed(2)}

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </section>

    );

}