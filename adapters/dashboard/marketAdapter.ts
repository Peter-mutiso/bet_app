import { Market } from "../../types";

export function mapMarket(raw: any): Market {

    return {

        id: raw.id,

        name: raw.name,

        symbol: raw.symbol,

        price: raw.price,

        change: raw.change,

        isOpen: raw.isOpen,

        category: raw.category ?? "Forex",

        favorite: raw.favorite ?? false,

        createdAt: raw.createdAt,

        updatedAt: raw.updatedAt

    };

}