"use client";

import {
    LayoutDashboard,
    CandlestickChart,
    Star,
    Newspaper,
    BarChart3,
    Bell,
    Settings,
    Globe,
    Wallet,
    Bot,
    Activity,
    UserCircle,
    LogOut
} from "lucide-react";

import { useState } from "react";

const items = [

    {
        icon: LayoutDashboard,
        label: "Dashboard"
    },

    {
        icon: CandlestickChart,
        label: "Markets"
    },

    {
        icon: Activity,
        label: "Trading"
    },

    {
        icon: Star,
        label: "Watchlist"
    },

    {
        icon: Globe,
        label: "Assets"
    },

    {
        icon: Wallet,
        label: "Portfolio"
    },

    {
        icon: Newspaper,
        label: "News"
    },

    {
        icon: BarChart3,
        label: "Analytics"
    },

    {
        icon: Bot,
        label: "Trading Bot"
    },

    {
        icon: Bell,
        label: "Alerts"
    }

];

export default function TradingSidebar() {

    const [active, setActive] = useState("Trading");

    return (

        <aside className="trading-sidebar">

            {/* LOGO */}

            <div className="sidebar-logo">

                <div className="logo-circle">

                    B

                </div>

            </div>

            {/* NAVIGATION */}

            <div className="sidebar-nav">

                {

                    items.map(item => {

                        const Icon = item.icon;

                        const selected =
                            active === item.label;

                        return (

                            <button

                                key={item.label}

                                onClick={() =>
                                    setActive(item.label)
                                }

                                className={
                                    selected
                                        ? "sidebar-btn active"
                                        : "sidebar-btn"
                                }

                            >

                                <Icon size={21}/>

                                <span>

                                    {item.label}

                                </span>

                            </button>

                        );

                    })

                }

            </div>

            {/* USER */}

            <div className="sidebar-footer">

                <button className="sidebar-btn">

                    <UserCircle size={20}/>

                    <span>

                        Account

                    </span>

                </button>

                <button className="sidebar-btn">

                    <Settings size={20}/>

                    <span>

                        Settings

                    </span>

                </button>

                <button className="sidebar-btn logout">

                    <LogOut size={20}/>

                    <span>

                        Logout

                    </span>

                </button>

            </div>

        </aside>

    );

}