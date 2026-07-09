"use client";

const monthlyData = [

    { month: "Jan", value: 35 },
    { month: "Feb", value: 48 },
    { month: "Mar", value: 42 },
    { month: "Apr", value: 65 },
    { month: "May", value: 72 },
    { month: "Jun", value: 84 },
    { month: "Jul", value: 91 }

];

export default function PortfolioGrowth() {

    const max = Math.max(...monthlyData.map(d => d.value));

    return (

        <section className="portfolio-growth">

            <div className="section-title">

                <h2>

                    Portfolio Growth

                </h2>

                <span>

                    Last 7 Months

                </span>

            </div>

            <div className="growth-chart">

                {

                    monthlyData.map(item => (

                        <div
                            key={item.month}
                            className="growth-bar-wrapper"
                        >

                            <div
                                className="growth-bar"
                                style={{
                                    height: `${(item.value / max) * 220}px`
                                }}
                            />

                            <span>

                                {item.month}

                            </span>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}