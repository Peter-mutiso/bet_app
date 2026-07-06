"use client";

import type { Market } from "../../types/market";

type Props = {
    markets: Market[];
};

function format(n?: number) {
    if (n === undefined || n === null) return "-";
    return n.toFixed(2);
}

export default function Watchlist({ markets }: Props) {
    const favorites = markets.filter(m => m.favorite);

    return (
        <div className="watchlist">
            <div className="watchlist-header">
                Watchlist
            </div>

            <div className="watchlist-body">
                {favorites.length === 0 ? (
                    <div className="empty">
                        No favorites yet
                    </div>
                ) : (
                    favorites.map(m => {
                        const isUp = (m.change ?? 0) >= 0;

                        return (
                            <div key={m.id} className="watch-item">
                                <div className="left">
                                    <div className="symbol">
                                        {m.symbol}
                                    </div>

                                    <div className="price">
                                        {format(m.price)}
                                    </div>
                                </div>

                                <div className={`right ${isUp ? "up" : "down"}`}>
                                    {isUp ? "+" : ""}
                                    {m.change?.toFixed(2)}%
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}