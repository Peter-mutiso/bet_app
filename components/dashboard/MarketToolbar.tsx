"use client";

import {
    Search,
    SlidersHorizontal
} from "lucide-react";

interface Props {

    search: string;

    onSearch(value: string): void;

    category: string;

    onCategory(value: string): void;

}

const categories = [

    "All",

    "Volatility",

    "Forex",

    "Crypto",

    "Commodities",

    "Indices"

];

export default function MarketToolbar({

    search,

    onSearch,

    category,

    onCategory

}: Props) {

    return (

        <div className="market-toolbar">

            {/* SEARCH */}

            <div className="market-search">

                <Search size={18} />

                <input

                    type="text"

                    placeholder="Search markets..."

                    value={search}

                    onChange={e => onSearch(e.target.value)}

                />

            </div>

            {/* FILTERS */}

            <div className="market-filters">

                <SlidersHorizontal size={18} />

                {

                    categories.map(cat => (

                        <button

                            key={cat}

                            className={

                                category === cat

                                    ? "active"

                                    : ""

                            }

                            onClick={() =>

                                onCategory(cat)

                            }

                        >

                            {cat}

                        </button>

                    ))

                }

            </div>

        </div>

    );

}