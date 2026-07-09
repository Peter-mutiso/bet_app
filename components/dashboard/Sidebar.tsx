"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
    LayoutDashboard,
    ChartCandlestick,
    Wallet,
    ArrowDownCircle,
    ArrowUpCircle,
    Receipt,
    Bell,
    Settings,
    Star,
    LogOut,
    UserCircle,
    LineChart,
    Shield
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

const mainMenu = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard"
    },
    
    {
        title: "Trade",
        icon: LineChart,
        href: "/trading"
    },
    {
        title: "Portfolio",
        icon: Wallet,
        href: "/portfolio"
    },
    {
        title: "Watchlist",
        icon: Star,
        href: "/watchlist"
    }
];

const financeMenu = [
    {
        title: "Deposit",
        icon: ArrowDownCircle,
        href: "/deposit"
    },
    {
        title: "Withdraw",
        icon: ArrowUpCircle,
        href: "/withdraw"
    },
    {
        title: "Transactions",
        icon: Receipt,
        href: "/transactions"
    }
];

const systemMenu = [
    
    {
        title: "Security",
        icon: Shield,
        href: "/security"
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/settings"
    }
];

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();

    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {

        logout();

        router.replace("/login");

    };

    return (

        <aside className="dashboard-sidebar">

            {/* LOGO */}

            <div className="sidebar-logo">

                <div className="logo-circle">
                    B
                </div>

                <div>

                    <h2>BetPro</h2>

                    <span>Professional Trading</span>

                </div>

            </div>

            {/* USER */}

            <div className="sidebar-user">

                <UserCircle size={46} />

                <div>

                    <h4>Demo Account</h4>

                    <span className="online-status">

                        <span className="status-dot"></span>

                        Online

                    </span>

                </div>

            </div>

            {/* MENU */}

            <div className="sidebar-scroll">

                <span className="sidebar-title">
                    MAIN
                </span>

                <nav className="sidebar-nav">

                    {mainMenu.map(item => {

                        const Icon = item.icon;

                        return (

                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-item ${
                                    pathname === item.href
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <Icon size={19} />

                                <span>{item.title}</span>

                            </Link>

                        );

                    })}

                </nav>

                <span className="sidebar-title">
                    WALLET
                </span>

                <nav className="sidebar-nav">

                    {financeMenu.map(item => {

                        const Icon = item.icon;

                        return (

                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-item ${
                                    pathname === item.href
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <Icon size={19} />

                                <span>{item.title}</span>

                            </Link>

                        );

                    })}

                </nav>

                <span className="sidebar-title">
                    SYSTEM
                </span>

                <nav className="sidebar-nav">

                    {systemMenu.map(item => {

                        const Icon = item.icon;

                        return (

                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-item ${
                                    pathname === item.href
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <Icon size={19} />

                                <span>{item.title}</span>

                            </Link>

                        );

                    })}

                </nav>

            </div>

            {/* FOOTER */}

            <div className="sidebar-footer">

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </aside>

    );

}