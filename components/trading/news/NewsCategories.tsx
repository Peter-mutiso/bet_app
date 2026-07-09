"use client";

const categories = [

    "All",

    "Forex",

    "Crypto",

    "Stocks",

    "Commodities",

    "Economy"

];

export default function NewsCategories() {

    return (

        <section className="news-categories">

            {

                categories.map(category => (

                    <button

                        key={category}

                        className="news-category"

                    >

                        {category}

                    </button>

                ))

            }

        </section>

    );

}