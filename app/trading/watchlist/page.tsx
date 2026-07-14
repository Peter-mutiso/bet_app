"use client";

import Link from "next/link";
import { useTradeStore } from "@/store/useTradeStore";

export default function WatchlistPage() {

    const watchlist = useTradeStore(
        state => state.watchlist
    );

    const marketPrices = useTradeStore(
        state => state.marketPrices
    );

    const removeFromWatchlist = useTradeStore(
        state => state.removeFromWatchlist
    );

    const favorites = watchlist.map(symbol => ({
        id: symbol,
        symbol,
        name: symbol,
        price: marketPrices[symbol] ?? 0,
        change: 0,
        bid: (marketPrices[symbol] ?? 0) - 0.25,
        ask: (marketPrices[symbol] ?? 0) + 0.25,
        high: (marketPrices[symbol] ?? 0) + 2,
        low: (marketPrices[symbol] ?? 0) - 2,
    }));

    return (
        <div className="watchlist-page">

            <div className="page-header">

                <div>
                    <h1>Watchlist</h1>
                    <p>Your favorite trading instruments.</p>
                </div>

                <div className="watchlist-count">
                    {favorites.length} Market
                    {favorites.length !== 1 ? "s" : ""}
                </div>

            </div>

            {favorites.length === 0 ? (

                <div className="watchlist-empty">

                    <div className="empty-icon">
                        ★
                    </div>

                    <h2>No markets in your watchlist</h2>

                    <p>
                        Visit the Markets page and add your favourite instruments.
                    </p>

                    <Link
                        href="/markets"
                        className="watchlist-button"
                    >
                        Browse Markets
                    </Link>

                </div>

            ) : (

                <div className="watchlist-grid">

                    {favorites.map((m) => (

                        <div
                            key={m.id}
                            className="watch-card"
                        >

                            <div className="watch-card-header">

                                <div>

                                    <h3>{m.symbol}</h3>

                                    <span>{m.name}</span>

                                </div>

                                <button
                                    className="favorite-btn active"
                                    onClick={() =>
                                        removeFromWatchlist(m.id)
                                    }
                                >
                                    ★
                                </button>

                            </div>

                            <div className="watch-price">
                                {m.price.toFixed(2)}
                            </div>

                            <div
                                className={`watch-change ${
                                    m.change >= 0
                                        ? "up"
                                        : "down"
                                }`}
                            >
                                {m.change >= 0 ? "+" : ""}
                                {m.change.toFixed(2)}%
                            </div>

                            <div className="watch-stats">

                                <div>
                                    <span>Bid</span>
                                    <strong>{m.bid.toFixed(2)}</strong>
                                </div>

                                <div>
                                    <span>Ask</span>
                                    <strong>{m.ask.toFixed(2)}</strong>
                                </div>

                                <div>
                                    <span>High</span>
                                    <strong>{m.high.toFixed(2)}</strong>
                                </div>

                                <div>
                                    <span>Low</span>
                                    <strong>{m.low.toFixed(2)}</strong>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}