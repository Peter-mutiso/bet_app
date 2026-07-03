"use client";

/**
 * ============================================================================
 * DASHBOARD PAGE
 * ============================================================================
 */

import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useWallet";
import { useMarkets } from "../../hooks/useMarkets";
import { useBets } from "../../hooks/useBets";

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

interface SelectedMarket {
    id: string;
    name: string;
    price: number;
    change: number;
    category?: string;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {

    const { user } = useAuth();

    const { wallet } = useWallet();

    const { markets } = useMarkets();

    const { current } = useBets();

    const [mounted, setMounted] = useState(false);

    const [selectedMarket, setSelectedMarket] =
        useState<SelectedMarket | null>(null);

    useEffect(() => {

        setMounted(true);

    }, []);

    /*
     * Automatically select the first market
     * after markets load.
     */

    useEffect(() => {

        if (
            !selectedMarket &&
            markets.length > 0
        ) {

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

    const activeBets = current().map(

        bet => ({

            id: bet.id,

            market:

                markets.find(

                    m => m.id === bet.marketId

                )?.name ?? bet.marketId,

            stake: bet.stake,

            potentialPayout: bet.potentialPayout,

            status: bet.status

        })

    );

    return (

        <div className="dashboard-layout">

            {/* SIDEBAR */}

            <Sidebar />

            {/* MAIN */}

            <main className="dashboard-main">

                <DashboardHeader
                    firstName={user?.firstName ?? "Trader"}
                />

                {/* SUMMARY */}

                <section className="dashboard-top">

                    <WalletSummary

                        balance={wallet?.balance ?? 0}

                        bonus={0}

                        openBets={activeBets.length}

                        dailyProfit={0}

                    />

                </section>

                {/* MARKET TERMINAL */}

                <section className="market-terminal">

                    <div className="dashboard-card market-card">

                        <LiveMarkets

                            markets={markets}

                            selectedMarket={selectedMarket}

                            onSelectMarket={setSelectedMarket}

                        />

                    </div>

                    <div className="dashboard-card trading-card">

                        <TradingPanel

                            market={selectedMarket}

                        />

                    </div>

                </section>

                {/* LOWER GRID */}

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