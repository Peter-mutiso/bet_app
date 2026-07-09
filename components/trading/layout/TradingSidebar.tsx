"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    CandlestickChart,
    Star,
    Newspaper,
    BarChart3,
    Settings,
    Globe,
    Bot,
    UserCircle,
    LogOut,
} from "lucide-react";

const tradingItems = [
    {
        icon: LayoutDashboard,
        label: "Overview",
        href: "/trading",
    },
    {
        icon: CandlestickChart,
        label: "Markets",
        href: "/trading/markets",
    },
    {
        icon: Star,
        label: "Watchlist",
        href: "/trading/watchlist",
    },
    {
        icon: Globe,
        label: "Assets",
        href: "/trading/assets",
    },
];

const toolsItems = [
    {
        icon: Newspaper,
        label: "News",
        href: "/trading/news",
    },
    {
        icon: BarChart3,
        label: "Analytics",
        href: "/trading/analytics",
    },
    {
        icon: Bot,
        label: "Trading Bot",
        href: "/trading/bot",
    },
];

export default function TradingSidebar() {

    const pathname = usePathname();

    return (

        <aside className="trading-sidebar">

            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <div className="sidebar-logo">

                <div className="logo-circle">

                    B

                </div>

                <div className="logo-text">

                    <h2>

                        BetPro

                    </h2>

                    <span>

                        Trading Terminal

                    </span>

                </div>

            </div>

            {/* ================================================= */}
            {/* MAIN NAVIGATION */}
            {/* ================================================= */}

            <div className="sidebar-section">

                <span className="sidebar-heading">

                    TRADING

                </span>

                <nav className="sidebar-nav">

                    {tradingItems.map((item) => {

                        const Icon = item.icon;

                        const active = pathname === item.href;

                        return (

                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-btn ${
                                    active ? "active" : ""
                                }`}
                            >

                                <Icon size={20} />

                                <span>

                                    {item.label}

                                </span>

                            </Link>

                        );

                    })}

                </nav>

            </div>

            {/* ================================================= */}
            {/* TOOLS */}
            {/* ================================================= */}

            <div className="sidebar-section">

                <span className="sidebar-heading">

                    TOOLS

                </span>

                <nav className="sidebar-nav">

                    {toolsItems.map((item) => {

                        const Icon = item.icon;

                        const active = pathname === item.href;

                        return (

                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-btn ${
                                    active ? "active" : ""
                                }`}
                            >

                                <Icon size={20} />

                                <span>

                                    {item.label}

                                </span>

                            </Link>

                        );

                    })}

                </nav>

            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="sidebar-footer">

                <Link
                    href="/dashboard/account"
                    className={`sidebar-btn ${
                        pathname === "/dashboard/account"
                            ? "active"
                            : ""
                    }`}
                >

                    <UserCircle size={20} />

                    <span>

                        Account

                    </span>

                </Link>

                <Link
                    href="/settings"
                    className={`sidebar-btn ${
                        pathname === "/settings"
                            ? "active"
                            : ""
                    }`}
                >

                    <Settings size={20} />

                    <span>

                        Settings

                    </span>

                </Link>

                <button
                    type="button"
                    className="sidebar-btn logout"
                >

                    <LogOut size={20} />

                    <span>

                        Logout

                    </span>

                </button>

            </div>

        </aside>

    );

}