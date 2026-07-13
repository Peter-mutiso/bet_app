"use client";

import {
    Bell,
    Settings,
    Wallet,
    ChevronDown,
    Activity,
} from "lucide-react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTradeStore } from "@/store/useTradeStore";

export default function TradingHeader() {

    const router = useRouter();

    const balance = useTradeStore(
        (state) => state.balance
    );

    const market = useTradeStore(
        (state) => state.selectedMarket
    );

    const price = useTradeStore(
        (state) => state.price
    );

    const setShowInstrumentPicker = useTradeStore(
        (state) => state.setShowInstrumentPicker
    );
    const show = useTradeStore(
    state => state.showInstrumentPicker
);


    const currentPrice = Number(price ?? 0);

    return (

        <header className="trading-header">

            {/* LEFT */}

            <div className="header-left">

                <div className="market-logo">
                    B
                </div>

                <button
                    type="button"
                    className="instrument-row"
                    onClick={() =>
                        setShowInstrumentPicker(true)
                    }
                >

                    <div className="instrument-info">

                        <h2>
                            {market?.name ??
                                "Volatility 100 Index"}
                        </h2>

                        <span>
                            {market?.symbol ??
                                "R_100"}
                        </span>

                    </div>

                    <ChevronDown size={18} />

                </button>

            </div>

            {/* CENTER */}

            <div className="header-center">

                <div className="live-status">

                    <span className="live-dot" />

                    <Activity size={14} />

                    LIVE

                </div>

                <div className="header-price">

                    {currentPrice.toFixed(2)}

                </div>

            </div>

            {/* RIGHT */}

            <div className="header-right">

                <div className="balance-card">

                    <small>
                        Demo Balance
                    </small>

                    <strong>

                        $

                        {balance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}

                    </strong>

                </div>

                <button
                    className="icon-btn"
                    title="Notifications"
                    onClick={() =>
                        router.push("/notifications")
                    }
                >

                    <Bell size={18} />

                </button>

                <button
                    className="icon-btn"
                    title="Settings"
                    onClick={() =>
                        router.push("/settings")
                    }
                >

                    <Settings size={18} />

                </button>

                <button
                    className="deposit-btn"
                    onClick={() =>
                        router.push("/deposit")
                    }
                >

                    <Wallet size={17} />

                    Deposit

                </button>

            </div>

        </header>

    );

}