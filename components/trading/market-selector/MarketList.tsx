"use client";

import MarketListItem from "./MarketListItem";

interface Market {
    symbol: string;
    name: string;
    category: string;
    price: number;
    change: number;
    favorite?: boolean;
}

interface Props {
    markets: Market[];
    selectedSymbol?: string;
    onSelect: (market: Market) => void;
}

export default function MarketList({
    markets,
    selectedSymbol,
    onSelect,
}: Props) {
    if (markets.length === 0) {
        return (
            <div className="market-selector-empty">
                <h3>No markets found</h3>
                <p>Try another search or category.</p>
            </div>
        );
    }

    return (
        <div className="market-selector-list">
            {markets.map((market) => (
                <MarketListItem
                    key={market.symbol}
                    market={market}
                    selected={market.symbol === selectedSymbol}
                    onSelect={() => onSelect(market)}
                />
            ))}
        </div>
    );
}