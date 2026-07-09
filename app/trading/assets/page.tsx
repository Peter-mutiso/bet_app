"use client";

import {

    AssetQuickActions,

    AssetSummaryCards,

    AssetAllocation,

    CurrencyBalances,
    HoldingsTable

} from "@/components/trading/assets";

export default function AssetsPage() {

    return (

        <div className="assets-page">

            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="assets-header">

                <div>

                    <h1>

                        My Assets

                    </h1>

                    <p>

                        Monitor your balances, holdings, investments and capital allocation across all supported currencies.

                    </p>

                </div>

            </div>

            {/* ==========================================
                QUICK ACTIONS
            ========================================== */}

            <AssetQuickActions />

            {/* ==========================================
                SUMMARY CARDS
            ========================================== */}

            <AssetSummaryCards />

            {/* ==========================================
                PORTFOLIO ALLOCATION
            ========================================== */}

            <AssetAllocation />

            {/* ==========================================
                CURRENCY BALANCES
            ========================================== */}

            <CurrencyBalances />

            {/* ==========================================
                HOLDINGS TABLE
            ========================================== */}

            <HoldingsTable />   

        </div>

    );

}