"use client";

import {
    Bitcoin,
    TrendingUp,
    Landmark,
    Gem
} from "lucide-react";

const holdings = [

    {
        asset: "Bitcoin",
        symbol: "BTC",
        type: "Crypto",
        quantity: "0.154 BTC",
        average: "$104,250",
        current: "$108,420",
        value: "$16,696.68",
        profit: "+4.00%",
        positive: true,
        icon: Bitcoin
    },

    {
        asset: "EUR/USD",
        symbol: "EURUSD",
        type: "Forex",
        quantity: "2 Lots",
        average: "1.1738",
        current: "1.1761",
        value: "$2,450.00",
        profit: "+1.82%",
        positive: true,
        icon: TrendingUp
    },

    {
        asset: "Apple Inc.",
        symbol: "AAPL",
        type: "Stock",
        quantity: "25 Shares",
        average: "$212.40",
        current: "$218.10",
        value: "$5,452.50",
        profit: "+2.68%",
        positive: true,
        icon: Landmark
    },

    {
        asset: "Gold",
        symbol: "XAU/USD",
        type: "Commodity",
        quantity: "5 oz",
        average: "$3,310",
        current: "$3,285",
        value: "$16,425",
        profit: "-0.75%",
        positive: false,
        icon: Gem
    }

];

export default function HoldingsTable() {

    return (

        <section className="holdings-section">

            <div className="section-title">

                <h2>

                    My Holdings

                </h2>

                <span>

                    Current Investments

                </span>

            </div>

            <div className="holdings-table">

                <div className="holdings-head">

                    <span>Asset</span>

                    <span>Quantity</span>

                    <span>Average Price</span>

                    <span>Current Price</span>

                    <span>Market Value</span>

                    <span>P/L</span>

                </div>

                {

                    holdings.map(item => {

                        const Icon = item.icon;

                        return (

                            <div

                                key={item.symbol}

                                className="holdings-row"

                            >

                                <div className="holding-name">

                                    <Icon size={20}/>

                                    <div>

                                        <strong>

                                            {item.asset}

                                        </strong>

                                        <small>

                                            {item.type}

                                        </small>

                                    </div>

                                </div>

                                <span>

                                    {item.quantity}

                                </span>

                                <span>

                                    {item.average}

                                </span>

                                <span>

                                    {item.current}

                                </span>

                                <strong>

                                    {item.value}

                                </strong>

                                <strong

                                    className={
                                        item.positive
                                            ? "profit"
                                            : "loss"
                                    }

                                >

                                    {item.profit}

                                </strong>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}