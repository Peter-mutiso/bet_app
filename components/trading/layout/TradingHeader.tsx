"use client";

import {
    Bell,
    Settings,
    Wallet,
    ChevronDown,
    Activity,
    Clock3
} from "lucide-react";

import { useEffect, useState } from "react";
import { useTradeStore } from "@/store/useTradeStore";

export default function TradingHeader() {

    const price = useTradeStore(state => state.price);
    const balance = useTradeStore(state => state.balance);
    const instrument = useTradeStore(state => state.selectedInstrument);

    const [time, setTime] = useState("");

    useEffect(() => {

        const update = () => {

            setTime(

                new Date().toLocaleTimeString()

            );

        };

        update();

        const id = setInterval(update,1000);

        return () => clearInterval(id);

    },[]);

    const high = (price + 4.25).toFixed(2);

const low = (price - 3.80).toFixed(2);

const spread = (high && low)
    ? (Number(high) - Number(low)).toFixed(2)
    : "0.00";
    return (

        <header className="trading-header">

            {/* LEFT */}

            <div className="header-left">

                <div className="market-logo">

                    B

                </div>

                <div>

                    <div className="instrument-row">

                        <h2>

                            {instrument}

                        </h2>

                        <ChevronDown size={16}/>

                    </div>

                    <div className="market-status">

                        <Activity size={13}/>

                        LIVE MARKET

                    </div>

                </div>

            </div>

            {/* CENTER */}

            <div className="header-center">

                <div className="market-card">

                    <span>Last</span>

                    <strong className="red">

                        {price.toFixed(2)}

                    </strong>

                </div>

                <div className="market-card">

                    <span>High</span>

                    <strong className="green">

                        {high}

                    </strong>

                </div>

                <div className="market-card">

                    <span>Low</span>

                    <strong>

                        {low}

                    </strong>

                </div>

                <div className="market-card">

                    <span>Spread</span>

                    <strong>

                        {spread}

                    </strong>

                </div>

            </div>

            {/* RIGHT */}

            <div className="header-right">

                <div className="account-card">

                    <small>DEMO ACCOUNT</small>

                    <h3>

                        ${balance.toFixed(2)}

                    </h3>

                </div>

                <div className="clock-box">

                    <Clock3 size={16}/>

                    {time}

                </div>

                <button className="icon-btn">

                    <Bell size={18}/>

                </button>

                <button className="icon-btn">

                    <Settings size={18}/>

                </button>

                <button className="deposit-btn">

                    <Wallet size={17}/>

                    Deposit

                </button>

            </div>

        </header>

    );

}