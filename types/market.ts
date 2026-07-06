import {
    Timestamped,
    UUID
} from "./common";

/* =========================================================
   MARKET
========================================================= */

export interface Market extends Timestamped {

    /* Identity */

    id: UUID;

    name: string;

    symbol: string;

    category: string;

    /* State */

    favorite: boolean;

    isOpen: boolean;

    /* Live Pricing */

    price: number;

    change: number;

    previousPrice?: number;

    tickDirection?: "up" | "down" | "flat";

    /* Order Book */

    bid?: number;

    ask?: number;

    spread?: number;

    /* Session Statistics */

    high?: number;

    low?: number;

    volume?: number;
}