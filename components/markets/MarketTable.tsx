"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { SelectedMarket } from "@/store/useTradeStore";
import { useTradeStore } from "@/store/useTradeStore";

type Props = {
    markets: SelectedMarket[];
    loading: boolean;
};

function format(n?: number) {
    if (n === undefined || n === null) return "-";
    return n.toFixed(2);
}

/* =========================================================
   PRICE HISTORY
========================================================= */

const historyMap = new Map<string, number[]>();

function pushHistory(id: string, price: number) {

    const existing = historyMap.get(id) ?? [];

    const next = [...existing, price].slice(-20);

    historyMap.set(id, next);

    return next;

}

/* =========================================================
   SPARKLINE
========================================================= */

function Sparkline({
    data,
}: {
    data: number[];
}) {

    if (data.length < 2) return null;

    const width = 80;
    const height = 20;

    const min = Math.min(...data);
    const max = Math.max(...data);

    const points = data.map((value, index) => {

        const x =
            (index / (data.length - 1)) * width;

        const y =
            height -
            ((value - min) /
                (max - min || 1)) *
                height;

        return `${x},${y}`;

    });

    return (

        <svg
            width={width}
            height={height}
            className="sparkline"
        >

            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                points={points.join(" ")}
            />

        </svg>

    );

}

/* =========================================================
   COMPONENT
========================================================= */

export default function MarketTable({

    markets,

    loading,

}: Props) {

    const router = useRouter();

    const [activeRow, setActiveRow] =
        useState<string | null>(null);

    const watchlist = useTradeStore(
        state => state.watchlist
    );

    const addToWatchlist = useTradeStore(
        state => state.addToWatchlist
    );

    const removeFromWatchlist =
        useTradeStore(
            state => state.removeFromWatchlist
        );

    const setSelectedMarket =
        useTradeStore(
            state => state.setSelectedMarket
        );

    const marketPrices = useTradeStore(
        state => state.marketPrices
    );

    const enriched = useMemo(() => {

        return markets.map(m => ({

            ...m,

            price:
                marketPrices[m.symbol] ??
                m.price,

            history: pushHistory(
                m.symbol,
                marketPrices[m.symbol] ??
                    m.price
            ),

        }));

    }, [markets, marketPrices]);

    if (loading) {

        return (

            <div className="market-table-loading">

                Loading...

            </div>

        );

    }

    return (

        <div className="market-table-wrapper">

            <table className="market-table">

                <thead>

                    <tr>

                        <th>★</th>

                        <th>Symbol</th>

                        <th>Price</th>

                        <th>Trend</th>

                        <th>Change</th>

                        <th>Bid</th>

                        <th>Ask</th>

                        <th>Spread</th>

                        <th>High</th>

                        <th>Low</th>

                        <th>Volume</th>

                        <th>Trade</th>

                    </tr>

                </thead>

                <tbody>

                    {enriched.map(m => {

                        const favorite =
                            watchlist.includes(
                                m.symbol
                            );

                        return (

                            <tr
                                key={m.id}
                                className={[
                                    "market-row",

                                    activeRow ===
                                    m.id
                                        ? "active"
                                        : "",

                                    m.tickDirection ===
                                    "up"
                                        ? "tick-up"
                                        : "",

                                    m.tickDirection ===
                                    "down"
                                        ? "tick-down"
                                        : "",

                                ].join(" ")}
                                onClick={() =>
                                    setActiveRow(m.symbol)
                                }
                            >

                                <td>

                                    <button
                                        className={`star ${
                                            favorite
                                                ? "on"
                                                : ""
                                        }`}
                                        onClick={e => {

                                            e.stopPropagation();

                                            favorite
                                                ? removeFromWatchlist(
                                                      m.symbol
                                                  )
                                                : addToWatchlist(
                                                      m.symbol
                                                  );

                                        }}
                                    >

                                        ★

                                    </button>

                                </td>

                                <td className="symbol">

                                    {m.symbol}

                                </td>

                                <td className="price">

                                    {format(m.price)}

                                </td>

                                <td className="spark-cell">

                                    <Sparkline
                                        data={
                                            m.history
                                        }
                                    />

                                </td>

                                <td
                                    className={
                                        m.change >= 0
                                            ? "up"
                                            : "down"
                                    }
                                >

                                    {m.change.toFixed(
                                        2
                                    )}
                                    %

                                </td>

                                <td>

                                    {format(m.bid)}

                                </td>

                                <td>

                                    {format(m.ask)}

                                </td>

                                <td>

                                    {format(
                                        m.spread
                                    )}

                                </td>

                                <td>

                                    {format(m.high)}

                                </td>

                                <td>

                                    {format(m.low)}

                                </td>

                                <td>

                                    {m.volume}

                                </td>

                                <td>

                                    <button
                                        className="trade-btn"
                                        onClick={e => {

                                            e.stopPropagation();

                                            setSelectedMarket({

    id: m.id,

    symbol: m.symbol,

    name: m.name,

    category: m.category,

    price: m.price,
    change: m.change,

});

                                            router.push(
                                                "/trading"
                                            );

                                        }}
                                    >

                                        Trade

                                    </button>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

}