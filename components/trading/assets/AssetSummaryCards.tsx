"use client";

import {

    Wallet,
    Landmark,
    Lock,
    TrendingUp

} from "lucide-react";

const cards = [

    {

        title: "Total Assets",

        value: "$24,560.85",

        change: "+3.84%",

        icon: Wallet

    },

    {

        title: "Available Funds",

        value: "$8,420.30",

        change: "Ready to Trade",

        icon: Landmark

    },

    {

        title: "Invested Funds",

        value: "$13,980.10",

        change: "Open Positions",

        icon: TrendingUp

    },

    {

        title: "Locked Funds",

        value: "$2,160.45",

        change: "Margin Reserved",

        icon: Lock

    }

];

export default function AssetSummaryCards() {

    return (

        <section className="asset-summary-grid">

            {

                cards.map(card => {

                    const Icon = card.icon;

                    return (

                        <div

                            key={card.title}

                            className="asset-summary-card"

                        >

                            <div className="asset-summary-top">

                                <div>

                                    <h4>

                                        {card.title}

                                    </h4>

                                    <h2>

                                        {card.value}

                                    </h2>

                                </div>

                                <Icon size={28} />

                            </div>

                            <p>

                                {card.change}

                            </p>

                        </div>

                    );

                })

            }

        </section>

    );

}