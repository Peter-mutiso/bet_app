"use client";

import { useMemo, useState } from "react";
import { Radio } from "lucide-react";

import MarketToolbar from "./MarketToolbar";
import MarketRow from "./MarketRow";

interface Market {
    id: string;
    name: string;
    price: number;
    change: number;
    category?: string;
}

interface LiveMarketsProps {
    markets: Market[];

    selectedMarket: Market | null;

    onSelectMarket: (market: Market) => void;
}

export default function LiveMarkets({
    markets,
    selectedMarket,
    onSelectMarket
}: LiveMarketsProps) {

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const filteredMarkets = useMemo(() => {

        return markets.filter((market) => {

            const searchMatch =
                market.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                market.id
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const categoryMatch =
                category === "All" ||
                market.category === category;

            return searchMatch && categoryMatch;

        });

    }, [markets, search, category]);

    return (

        <section className="market-watch">

            {/* HEADER */}

            <div className="market-watch-header">

                <div>

                    <h2>Market Watch</h2>

                    <small>

                        {filteredMarkets.length} Markets

                    </small>

                </div>

                <div className="live-badge">

                    <Radio size={14} />

                    LIVE

                </div>

            </div>

            {/* SEARCH + FILTERS */}

            <MarketToolbar
                search={search}
                onSearch={setSearch}
                category={category}
                onCategory={setCategory}
            />

            {/* TABLE */}

            <div className="terminal-table-header">

                <div>Asset</div>

                <div>Price</div>

                <div>24H</div>

                <div>Status</div>

                <div>Trade</div>

            </div>

            {/* BODY */}

            <div className="terminal-body">

                {filteredMarkets.length === 0 ? (

                    <div className="empty-state">

                        No matching markets

                    </div>

                ) : (

                    filteredMarkets.map((market) => (

                        <MarketRow
                            key={market.id}
                            market={market}
                            selected={
    selectedMarket?.id === market.id
}

onClick={() =>
    onSelectMarket(market)
}
                        />

                    ))

                )}

            </div>

        </section>

    );

}