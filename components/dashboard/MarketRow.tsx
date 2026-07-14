"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
    TrendingUp,
    TrendingDown,
    Activity,
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";
import type { SelectedMarket } from "@/store/useTradeStore";


interface Props {
    market: SelectedMarket;
    selected?: boolean;
    onClick?: () => void;
}

export default function MarketRow({
    market,
    selected = false,
    onClick,
}: Props) {

    const router = useRouter();

    const setSelectedMarket = useTradeStore(
        state => state.setSelectedMarket
    );

    const setSelectedSide = useTradeStore(
        state => state.setSelectedSide
    );

    const displayPrice = useTradeStore(
        state => state.marketPrices[market.symbol]
    ) ?? market.price;

    const previousPrice = useRef(displayPrice);

    const direction =
        displayPrice > previousPrice.current
            ? "up"
            : displayPrice < previousPrice.current
            ? "down"
            : "";

    previousPrice.current = displayPrice;

    function openTrade(side: "BUY" | "SELL") {

        setSelectedMarket({
    id: market.id,
    symbol: market.symbol,
    name: market.name,
    category: market.category ?? "Synthetic",
    price: displayPrice,
    change: market.change,
});

        setSelectedSide(side);

        router.push("/trading");
    }

    return (

        <div
            className={`market-row ${direction} ${
                selected ? "selected" : ""
            }`}
            onClick={onClick}
        >

            {/* MARKET */}

            <div className="market-column market-info">

                <div className="market-icon">

                    <Activity size={18} />

                </div>

                <div>

                    <h4>{market.name}</h4>

                    <span>{market.symbol}</span>

                </div>

            </div>

            {/* PRICE */}

            <div
                className={`market-column market-price ${direction}`}
            >

                {displayPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}

            </div>

            {/* CHANGE */}

            <div
                className={`market-column market-change ${
                    market.change >= 0
                        ? "positive"
                        : "negative"
                }`}
            >

                {market.change >= 0 ? (
                    <TrendingUp size={16} />
                ) : (
                    <TrendingDown size={16} />
                )}

                <span>

                    {Math.abs(market.change).toFixed(2)}%

                </span>

            </div>

            {/* STATUS */}

            <div className="market-column">

                <span className="market-status">

                    OPEN

                </span>

            </div>

            {/* ACTIONS */}

            <div className="market-column trade-actions">

                <button
                    className="buy-btn"
                    onClick={(e) => {

                        e.stopPropagation();

                        openTrade("BUY");

                    }}
                >

                    Buy

                </button>

                <button
                    className="sell-btn"
                    onClick={(e) => {

                        e.stopPropagation();

                        openTrade("SELL");

                    }}
                >

                    Sell

                </button>

            </div>

        </div>

    );

}