"use client";

const statistics = [

    {
        label: "Winning Trades",
        value: "942"
    },

    {
        label: "Losing Trades",
        value: "342"
    },

    {
        label: "Average Win",
        value: "$84.62"
    },

    {
        label: "Average Loss",
        value: "$31.15"
    },

    {
        label: "Risk / Reward",
        value: "2.72"
    },

    {
        label: "Profit Factor",
        value: "2.84"
    },

    {
        label: "Max Drawdown",
        value: "8.4%"
    },

    {
        label: "Average Trade Time",
        value: "14 min"
    }

];

export default function TradingStatistics() {

    return (

        <section className="trading-statistics">

            <div className="section-title">

                <h2>

                    Trading Statistics

                </h2>

            </div>

            <div className="statistics-grid">

                {

                    statistics.map(item=>(

                        <div

                            key={item.label}

                            className="stat-card"

                        >

                            <h3>

                                {item.value}

                            </h3>

                            <span>

                                {item.label}

                            </span>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}