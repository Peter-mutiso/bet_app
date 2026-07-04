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
    Activity
} from "lucide-react";

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
        label: "Bot"

    },

    {
        icon: Bell,
        label: "Alerts"

    }

];

export default function TradingSidebar() {

    return (

        <aside className="h-full flex flex-col items-center bg-[#0b1018] border-r border-[#202734] py-4">

            {/* Logo */}

            <div className="mb-8">

                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">

                    B

                </div>

            </div>

            {/* Icons */}

            <div className="flex flex-col gap-3 flex-1">

                {items.map((item) => {

                    const Icon = item.icon;

                    return (

                        <button

                            key={item.label}

                            title={item.label}

                            className="group w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#1d4ed8] hover:text-white transition-all duration-200"

                        >

                            <Icon size={20} />

                        </button>

                    );

                })}

            </div>

            {/* Bottom */}

            <div className="flex flex-col gap-3">

                <button

                    title="Settings"

                    className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#1d4ed8] hover:text-white transition"

                >

                    <Settings size={20} />

                </button>

            </div>

        </aside>

    );

}