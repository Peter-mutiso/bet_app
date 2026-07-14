"use client";

/**
 * ============================================================================
 * DASHBOARD PAGE
 * ============================================================================
 */

import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useWallet";
import type { SelectedMarket } from "@/store/useTradeStore";
import { useTradeStore } from "@/store/useTradeStore";
import { ALL_INSTRUMENTS } from "@/lib/instruments";
import {
    Sidebar,
    DashboardHeader,
    WalletSummary,
    LiveMarkets,
    TradingPanel,
    ActiveBets,
    RecentActivity,
    TransactionList
} from "../../components/dashboard";


export default function DashboardPage() {

    const { user } = useAuth();

    const { wallet } = useWallet();

    const trades = useTradeStore(
        state => state.trades
    );

    

    const [mounted, setMounted] = useState(false);
    const marketPrices = useTradeStore(
    state => state.marketPrices
);
    const marketOpenPrices = useTradeStore(
    state => state.marketOpenPrices
);

const markets: SelectedMarket[] = ALL_INSTRUMENTS.map(
    (m): SelectedMarket => {

        const livePrice =
            marketPrices[m.symbol] ?? m.price;

        const openPrice =
            marketOpenPrices[m.symbol] ?? m.price;

        const change =
            Number(
                (
                    ((livePrice - openPrice) / openPrice) *
                    100
                ).toFixed(2)
            );

        return {

            id: m.symbol,

            symbol: m.symbol,

            name: m.name,

            category: m.category,

            price: livePrice,

            change,

            tickDirection:
                livePrice > openPrice
                    ? "up"
                    : livePrice < openPrice
                    ? "down"
                    : "flat",

        };

    }
);
    const [selectedMarket, setSelectedMarket] =
    useState<SelectedMarket | null>(null);

    useEffect(() => {

        setMounted(true);

    }, []);

    useEffect(() => {

        if (!selectedMarket && markets.length > 0) {

            setSelectedMarket(markets[0]);

        }

    }, [markets, selectedMarket]);

    if (!mounted) {

        return (

            <div className="dashboard-loading">

                <h2>Loading Dashboard...</h2>

            </div>

        );

    }

    const activeBets = trades
        .filter(trade => trade.status !== "CLOSED")
        .map(trade => ({

            id: trade.id,

            market: trade.marketId,

            stake: trade.stake,

            potentialPayout:
                trade.stake * 1.86,

            status: trade.status

        }));

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">

                <DashboardHeader
                    firstName={
    user?.firstName ?? "Trader"
}
                />

                <section className="dashboard-top">

                    <WalletSummary

                        balance={
                            wallet?.balance ??
                            0
                        }

                        bonus={0}

                        openBets={
                            activeBets.length
                        }

                        dailyProfit={0}

                    />

                </section>

                <section className="market-terminal">

                    <div className="dashboard-card market-card">

                        <LiveMarkets

                            markets={markets}

                            selectedMarket={
                                selectedMarket
                            }

                            onSelectMarket={
                                setSelectedMarket
                            }

                        />

                    </div>

                    <div className="dashboard-card trading-card">

                        <TradingPanel

                            market={
                                selectedMarket
                            }

                        />

                    </div>

                </section>

                <section className="dashboard-grid">

                    <div className="dashboard-card">

                        <ActiveBets

                            bets={activeBets}

                        />

                    </div>

                    <div className="dashboard-card">

                        <TransactionList

                            transactions={[]}

                        />

                    </div>

                    <div className="dashboard-card">

                        <RecentActivity

                            activities={[]}

                        />

                    </div>

                </section>

            </main>

        </div>

    );

}