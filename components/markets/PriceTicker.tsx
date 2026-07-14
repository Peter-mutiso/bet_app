"use client";

import { useMemo } from "react";
import type { SelectedMarket } from "@/store/useTradeStore";

type Props = {
    markets: SelectedMarket[];
};

function formatPrice(p?: number) {
    if (p === undefined || p === null) return "-";
    return p.toFixed(2);
}

export default function PriceTicker({ markets }: Props) {
    const tape = useMemo(() => {
        // Duplicate for seamless infinite scroll
        return [...markets, ...markets];
    }, [markets]);

    return (
        <div className="ticker-wrap">
            <div className="ticker-track">
                {tape.map((m, idx) => {
                    const isUp = (m.change ?? 0) >= 0;

                    return (
                        <div
                            key={`${m.id}-${idx}`}
                            className={`ticker-item ${isUp ? "up" : "down"}`}
                        >
                            <span className="symbol">{m.symbol}</span>

                            <span className="price">
                                {formatPrice(m.price)}
                            </span>

                            <span className="change">
                                {isUp ? "▲" : "▼"} {m.change?.toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}