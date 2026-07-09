"use client";

const topics = [
    {
        id: 1,
        title: "Federal Reserve",
        sentiment: "Bullish",
        mentions: "18.4K",
        description: "Markets are pricing in expectations of future interest rate decisions.",
    },
    {
        id: 2,
        title: "Bitcoin ETF",
        sentiment: "Bullish",
        mentions: "15.9K",
        description: "Institutional demand continues to support cryptocurrency markets.",
    },
    {
        id: 3,
        title: "Artificial Intelligence",
        sentiment: "Neutral",
        mentions: "12.8K",
        description: "Technology stocks remain active following new AI product announcements.",
    },
    {
        id: 4,
        title: "Gold",
        sentiment: "Bearish",
        mentions: "9.7K",
        description: "Precious metals soften as investors rotate into risk assets.",
    },
    {
        id: 5,
        title: "US Dollar",
        sentiment: "Neutral",
        mentions: "8.3K",
        description: "Currency traders await upcoming inflation and employment data.",
    },
    {
        id: 6,
        title: "Oil Prices",
        sentiment: "Bullish",
        mentions: "7.5K",
        description: "Supply concerns continue to influence global energy markets.",
    },
];

export default function TrendingTopics() {
    return (
        <section className="trending-topics">

            <div className="section-header">
                <div>
                    <h2>Trending Topics</h2>
                    <p>Most discussed financial topics today</p>
                </div>
            </div>

            <div className="topics-list">

                {topics.map((topic) => (

                    <div
                        key={topic.id}
                        className="topic-card"
                    >

                        <div className="topic-number">
                            #{topic.id}
                        </div>

                        <div className="topic-content">

                            <div className="topic-top">

                                <h3>{topic.title}</h3>

                                <span
                                    className={`topic-sentiment ${topic.sentiment.toLowerCase()}`}
                                >
                                    {topic.sentiment}
                                </span>

                            </div>

                            <p>
                                {topic.description}
                            </p>

                            <div className="topic-footer">

                                <span>
                                    🔥 {topic.mentions} mentions
                                </span>

                                <button className="topic-button">
                                    View Details
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}