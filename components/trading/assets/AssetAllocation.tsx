"use client";

const allocation = [

    {
        name: "Forex",
        value: 42
    },

    {
        name: "Cryptocurrency",
        value: 28
    },

    {
        name: "Stocks",
        value: 16
    },

    {
        name: "Indices",
        value: 8
    },

    {
        name: "Commodities",
        value: 6
    }

];

export default function AssetAllocation() {

    return (

        <section className="asset-allocation">

            <div className="allocation-card">

                <div className="section-title">

                    <h2>

                        Portfolio Allocation

                    </h2>

                    <span>

                        Diversification Overview

                    </span>

                </div>

                <div className="allocation-list">

                    {

                        allocation.map(asset => (

                            <div
                                key={asset.name}
                                className="allocation-item"
                            >

                                <div className="allocation-header">

                                    <span>

                                        {asset.name}

                                    </span>

                                    <strong>

                                        {asset.value}%

                                    </strong>

                                </div>

                                <div className="allocation-bar">

                                    <div
                                        className="allocation-fill"
                                        style={{
                                            width: `${asset.value}%`
                                        }}
                                    />

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

            <div className="portfolio-card">

                <div className="section-title">

                    <h2>

                        Portfolio Overview

                    </h2>

                </div>

                <div className="portfolio-stat">

                    <span>Risk Level</span>

                    <strong>Moderate</strong>

                </div>

                <div className="portfolio-stat">

                    <span>Diversification</span>

                    <strong>Excellent</strong>

                </div>

                <div className="portfolio-stat">

                    <span>Open Positions</span>

                    <strong>18</strong>

                </div>

                <div className="portfolio-stat">

                    <span>Winning Trades</span>

                    <strong>71%</strong>

                </div>

                <div className="portfolio-stat">

                    <span>Monthly Return</span>

                    <strong className="positive">

                        +12.84%

                    </strong>

                </div>

            </div>

        </section>

    );

}