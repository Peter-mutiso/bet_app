"use client";

import {
    DollarSign,
    Euro,
    Bitcoin,
    Coins
} from "lucide-react";

const balances = [

    {
        currency: "USD",
        icon: DollarSign,
        available: "$5,420.80",
        invested: "$3,120.50",
        locked: "$410.00",
        total: "$8,951.30"
    },

    {
        currency: "EUR",
        icon: Euro,
        available: "€1,250.00",
        invested: "€640.25",
        locked: "€100.00",
        total: "€1,990.25"
    },

    {
        currency: "KES",
        icon: Coins,
        available: "KSh 86,500",
        invested: "KSh 21,300",
        locked: "KSh 5,000",
        total: "KSh 112,800"
    },

    {
        currency: "BTC",
        icon: Bitcoin,
        available: "0.154 BTC",
        invested: "0.213 BTC",
        locked: "0.010 BTC",
        total: "0.377 BTC"
    }

];

export default function CurrencyBalances() {

    return (

        <section className="currency-balances">

            <div className="section-title">

                <h2>

                    Currency Balances

                </h2>

                <span>

                    Funds across supported currencies

                </span>

            </div>

            <div className="balances-table">

                <div className="balances-head">

                    <span>Currency</span>

                    <span>Available</span>

                    <span>Invested</span>

                    <span>Locked</span>

                    <span>Total</span>

                </div>

                {

                    balances.map(item => {

                        const Icon = item.icon;

                        return (

                            <div

                                key={item.currency}

                                className="balances-row"

                            >

                                <div className="currency-name">

                                    <Icon size={18}/>

                                    <strong>

                                        {item.currency}

                                    </strong>

                                </div>

                                <span>{item.available}</span>

                                <span>{item.invested}</span>

                                <span>{item.locked}</span>

                                <strong>{item.total}</strong>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}