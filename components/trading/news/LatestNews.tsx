"use client";

const news = [

    {

        title: "Gold extends gains amid weaker dollar.",

        source: "Bloomberg",

        time: "24 min ago"

    },

    {

        title: "EUR/USD rises ahead of ECB statement.",

        source: "Reuters",

        time: "41 min ago"

    },

    {

        title: "Tesla shares climb after earnings.",

        source: "CNBC",

        time: "1 hour ago"

    },

    {

        title: "Oil prices retreat on supply expectations.",

        source: "Financial Times",

        time: "2 hours ago"

    }

];

export default function LatestNews() {

    return (

        <section className="latest-news">

            <div className="section-title">

                <h2>

                    Latest News

                </h2>

            </div>

            {

                news.map(item => (

                    <article

                        key={item.title}

                        className="news-card"

                    >

                        <div className="news-thumbnail">

                            NEWS

                        </div>

                        <div>

                            <h3>

                                {item.title}

                            </h3>

                            <small>

                                {item.source} • {item.time}

                            </small>

                        </div>

                    </article>

                ))

            }

        </section>

    );

}