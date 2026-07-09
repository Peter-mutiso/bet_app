"use client";

import { useMemo, useState } from "react";

import MarketSearch from "./MarketSearch";
import MarketCategoryTabs from "./MarketCategoryTabs";
import MarketList from "./MarketList";

import { useTradeStore } from "@/store/useTradeStore";

interface Market {

    symbol: string;

    name: string;

    category: string;

    price: number;

    change: number;

}

const ALL_MARKETS: Market[] = [

    {
        symbol: "R_10",
        name: "Volatility 10 Index",
        category: "Synthetic",
        price: 124.36,
        change: 0.82
    },

    {
        symbol: "R_25",
        name: "Volatility 25 Index",
        category: "Synthetic",
        price: 238.51,
        change: -0.34
    },

    {
        symbol: "R_50",
        name: "Volatility 50 Index",
        category: "Synthetic",
        price: 481.20,
        change: 1.42
    },

    {
        symbol: "R_75",
        name: "Volatility 75 Index",
        category: "Synthetic",
        price: 632.74,
        change: 0.61
    },

    {
        symbol: "R_100",
        name: "Volatility 100 Index",
        category: "Synthetic",
        price: 702.00,
        change: 2.14
    },

    {
        symbol: "EURUSD",
        name: "EUR/USD",
        category: "Forex",
        price: 1.1724,
        change: 0.08
    },

    {
        symbol: "GBPUSD",
        name: "GBP/USD",
        category: "Forex",
        price: 1.3541,
        change: -0.13
    },

    {
        symbol: "BTCUSD",
        name: "Bitcoin",
        category: "Crypto",
        price: 118250,
        change: 3.27
    }

];

export default function MarketSelector() {

    const show = useTradeStore(

        state => state.showInstrumentPicker

    );

    const setShow = useTradeStore(

        state => state.setShowInstrumentPicker

    );

    const setSelectedMarket = useTradeStore(

        state => state.setSelectedMarket

    );

    const selected = useTradeStore(

        state => state.selectedMarket

    );

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("Synthetic");

    const filteredMarkets = useMemo(() => {

        return ALL_MARKETS.filter(market => {

            const categoryMatch =

                category === "Favorites"

                    ? true

                    : market.category === category;

            const searchMatch =

                market.name

                    .toLowerCase()

                    .includes(

                        search.toLowerCase()

                    ) ||

                market.symbol

                    .toLowerCase()

                    .includes(

                        search.toLowerCase()

                    );

            return categoryMatch && searchMatch;

        });

    }, [

        search,

        category

    ]);

    if (!show)

        return null;

    return (

        <div

            className="market-selector-overlay"

            onClick={() =>

                setShow(false)

            }

        >

            <div

                className="market-selector-modal"

                onClick={(e) =>

                    e.stopPropagation()

                }

            >

                <h2>

                    Select Market

                </h2>

                <MarketSearch

                    value={search}

                    onChange={setSearch}

                />

                <MarketCategoryTabs

                    value={category}

                    onChange={setCategory}

                />

                <MarketList

                    markets={filteredMarkets}

                    selectedSymbol={

                        selected?.symbol

                    }

                    onSelect={(market) => {

                        setSelectedMarket({

                            symbol: market.symbol,

                            name: market.name,

                            category: market.category,

                            price: market.price,

                            change: market.change

                        });

                        setShow(false);

                    }}

                />

            </div>

        </div>

    );

}