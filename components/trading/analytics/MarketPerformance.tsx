"use client";

const markets = [

    {

        market: "BTC/USD",

        profit: 86

    },

    {

        market: "EUR/USD",

        profit: 72

    },

    {

        market: "Gold",

        profit: 65

    },

    {

        market: "NASDAQ",

        profit: 54

    },

    {

        market: "ETH/USD",

        profit: 44

    }

];

export default function MarketPerformance() {

    return (

        <section className="market-performance">

            <div className="section-title">

                <h2>

                    Performance by Market

                </h2>

            </div>

            {

                markets.map(item => (

                    <div
                        key={item.market}
                        className="market-row"
                    >

                        <div className="market-header">

                            <span>

                                {item.market}

                            </span>

                            <strong>

                                {item.profit}%

                            </strong>

                        </div>

                        <div className="market-progress">

                            <div
                                className="market-fill"
                                style={{
                                    width: `${item.profit}%`
                                }}
                            />

                        </div>

                    </div>

                ))

            }

        </section>

    );

}