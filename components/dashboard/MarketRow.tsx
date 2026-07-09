"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    TrendingUp,
    TrendingDown,
    Activity,
} from "lucide-react";

import { useTradeStore } from "@/store/useTradeStore";
import { useLivePrice } from "../../hooks/useLivePrice";

interface Market {
    id: string;
    name: string;
    price: number;
    change: number;
    category?: string;
}

interface Props {
    market: Market;
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
        (state) => state.setSelectedMarket
    );

    const setSelectedSide = useTradeStore(
        (state) => state.setSelectedSide
    );

    const livePrice = useLivePrice(market.id);

    const previousPrice = useRef(market.price);

    const direction = useMemo(() => {

        if (!livePrice) return "";

        if (livePrice > previousPrice.current) return "up";

        if (livePrice < previousPrice.current) return "down";

        return "";

    }, [livePrice]);

    previousPrice.current = livePrice || previousPrice.current;

    const displayPrice = livePrice || market.price;

    function openTrade(side: "BUY" | "SELL") {

        setSelectedMarket({

            symbol: market.id,

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

                    <span>{market.id}</span>

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