"use client";

const categories = [

    {
        label: "Favorites",
        count: 0
    },

    {
        label: "Synthetic",
        count: 5
    },

    {
        label: "Forex",
        count: 2
    },

    {
        label: "Crypto",
        count: 1
    },

    {
        label: "Stocks",
        count: 0
    },

    {
        label: "Indices",
        count: 0
    }

];

interface Props {

    value: string;

    onChange: (category: string) => void;

}

export default function MarketCategoryTabs({

    value,

    onChange

}: Props) {

    return (

        <div className="market-category-tabs">

            {

                categories.map(({ label, count }) => (

                    <button

                        key={label}

                        className={

                            value === label

                                ? "active"

                                : ""

                        }

                        onClick={() =>

                            onChange(label)

                        }

                    >

                        <span>

                            {label}

                        </span>

                        <span className="category-count">

                            {count}

                        </span>

                    </button>

                ))

            }

        </div>

    );

}