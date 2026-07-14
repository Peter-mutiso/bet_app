import type { SelectedMarket } from "@/store/useTradeStore";

export function mapMarket(raw: any): SelectedMarket {
    return {
        id: raw.id,
        symbol: raw.symbol,
        name: raw.name,
        category: raw.category ?? "Forex",
        price: raw.price,
        change: raw.change ?? 0,
    };
}