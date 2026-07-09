"use client";

const gainers = [
    {
        symbol: "R_100",
        name: "Volatility 100",
        change: "+4.82%",
        price: "124.83",
    },
    {
        symbol: "R_75",
        name: "Volatility 75",
        change: "+3.41%",
        price: "98.12",
    },
    {
        symbol: "EUR/USD",
        name: "Euro / US Dollar",
        change: "+1.16%",
        price: "1.1845",
    },
];

const losers = [
    {
        symbol: "BTC/USD",
        name: "Bitcoin",
        change: "-2.84%",
        price: "106,482",
    },
    {
        symbol: "ETH/USD",
        name: "Ethereum",
        change: "-1.76%",
        price: "3,481",
    },
    {
        symbol: "XAU/USD",
        name: "Gold",
        change: "-0.62%",
        price: "3,327.14",
    },
];

const active = [
    {
        symbol: "Boom 1000",
        volume: "18.2M",
    },
    {
        symbol: "Crash 500",
        volume: "16.9M",
    },
    {
        symbol: "Volatility 50",
        volume: "15.4M",
    },
];

export default function MarketMovers() {
    return (
        <section className="market-movers">

            <div className="market-movers-header">
                <h2>Market Movers</h2>
                <span>Top performers across all markets</span>
            </div>

            <div className="market-movers-grid">

                {/* Gainers */}

                <div className="mover-card">

                    <div className="mover-title gain">
                        ▲ Top Gainers
                    </div>

                    {gainers.map((item) => (
                        <div
                            key={item.symbol}
                            className="mover-row"
                        >
                            <div>
                                <strong>{item.symbol}</strong>
                                <small>{item.name}</small>
                            </div>

                            <div className="mover-values">
                                <span>{item.price}</span>
                                <strong className="gain">
                                    {item.change}
                                </strong>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Losers */}

                <div className="mover-card">

                    <div className="mover-title loss">
                        ▼ Top Losers
                    </div>

                    {losers.map((item) => (
                        <div
                            key={item.symbol}
                            className="mover-row"
                        >
                            <div>
                                <strong>{item.symbol}</strong>
                                <small>{item.name}</small>
                            </div>

                            <div className="mover-values">
                                <span>{item.price}</span>
                                <strong className="loss">
                                    {item.change}
                                </strong>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Active */}

                <div className="mover-card">

                    <div className="mover-title active">
                        ● Most Active
                    </div>

                    {active.map((item) => (
                        <div
                            key={item.symbol}
                            className="mover-row"
                        >
                            <div>
                                <strong>{item.symbol}</strong>
                                <small>Trading Volume</small>
                            </div>

                            <div className="mover-values">
                                <strong>
                                    {item.volume}
                                </strong>
                            </div>
                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}