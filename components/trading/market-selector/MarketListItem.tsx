"use client";

import {
    Activity,
    Star,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

interface Market {
    symbol: string;
    name: string;
    category: string;
    price: number;
    change: number;
    favorite?: boolean;
}

interface Props {
    market: Market;
    selected: boolean;
    onSelect: () => void;
    onToggleFavorite?: () => void;
}

export default function MarketListItem({
    market,
    selected,
    onSelect,
    onToggleFavorite,
}: Props) {
    return (
        <div
            className={`market-selector-item ${
                selected ? "selected" : ""
            }`}
            onClick={() => {
    console.log("CLICKED:", market.symbol);
    onSelect();
}}
        >
            {/* LEFT */}

            <div className="market-selector-left">
                <div className="market-icon">
                    <Activity size={18} />
                </div>

                <div>
                    <h4>{market.name}</h4>

                    <small>{market.symbol}</small>
                </div>
            </div>

            {/* PRICE */}

            <div className="market-selector-middle">
                <strong>
                    {market.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </strong>

                <span
                    className={
                        market.change >= 0
                            ? "positive"
                            : "negative"
                    }
                >
                    {market.change >= 0 ? (
                        <TrendingUp size={14} />
                    ) : (
                        <TrendingDown size={14} />
                    )}

                    {Math.abs(market.change).toFixed(2)}%
                </span>
            </div>

            {/* FAVORITE */}

            <button
                type="button"
                className={`favorite-btn ${
                    market.favorite ? "active" : ""
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.();
                }}
            >
                <Star
                    size={18}
                    fill={market.favorite ? "currentColor" : "none"}
                />
            </button>
        </div>
    );
}