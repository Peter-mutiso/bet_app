import { create } from "zustand";

export interface TradingMarket {

    symbol:string;

    name:string;

    category:string;

    price:number;

    change:number;

}

interface TradingState{

    selectedMarket:TradingMarket | null;

    watchlist:string[];

    setSelectedMarket:(market:TradingMarket)=>void;

    toggleWatchlist:(symbol:string)=>void;

}

export const useTradingStore=create<TradingState>((set)=>({

    selectedMarket:null,

    watchlist:[],

    setSelectedMarket:(market)=>

        set({

            selectedMarket:market

        }),

    toggleWatchlist:(symbol)=>

        set(state=>({

            watchlist:state.watchlist.includes(symbol)

                ? state.watchlist.filter(s=>s!==symbol)

                : [...state.watchlist,symbol]

        }))

}));