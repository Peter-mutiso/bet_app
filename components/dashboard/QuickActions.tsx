"use client";

import { useRouter } from "next/navigation";

import {
    Wallet,
    ArrowDownCircle,
    ArrowUpCircle,
    CandlestickChart,
    History,
    Settings,
    Gift,
    TrendingUp
} from "lucide-react";

import { ROUTES } from "../../router";

interface Action {

    title: string;

    subtitle: string;

    icon: React.ElementType;

    route: string;

    color: string;

}

export default function QuickActions() {

    const router = useRouter();

    const actions: Action[] = [

        {
            title: "Deposit",
            subtitle: "Add funds instantly",
            icon: ArrowDownCircle,
            route: ROUTES.DEPOSIT,
            color: "green"
        },

        {
            title: "Withdraw",
            subtitle: "Transfer your money",
            icon: ArrowUpCircle,
            route: ROUTES.WITHDRAW,
            color: "red"
        },

        {
            title: "Markets",
            subtitle: "Live market watch",
            icon: CandlestickChart,
            route: ROUTES.MARKETS,
            color: "blue"
        },

        {
            title: "Trade",
            subtitle: "Start trading",
            icon: TrendingUp,
            route: ROUTES.TRADING,
            color: "purple"
        },

        {
            title: "Wallet",
            subtitle: "View balances",
            icon: Wallet,
            route: "/wallet",
            color: "orange"
        },

        {
            title: "History",
            subtitle: "Transactions",
            icon: History,
            route: "/history",
            color: "cyan"
        },

        {
            title: "Settings",
            subtitle: "Preferences",
            icon: Settings,
            route: "/settings",
            color: "gray"
        },

        {
            title: "Bonuses",
            subtitle: "Rewards & Offers",
            icon: Gift,
            route: "/bonus",
            color: "gold"
        }

    ];

    return (

        <section className="dashboard-card">

            <div className="section-header">

                <h2>

                    Quick Actions

                </h2>

            </div>

            <div className="quick-actions-grid">

                {

                    actions.map(action => {

                        const Icon = action.icon;

                        return (

                            <button

                                key={action.title}

                                className={`action-card ${action.color}`}

                                onClick={() => router.push(action.route)}

                            >

                                <div className="action-icon">

                                    <Icon size={34} strokeWidth={2} />

                                </div>

                                <h3>

                                    {action.title}

                                </h3>

                                <p>

                                    {action.subtitle}

                                </p>

                            </button>

                        );

                    })

                }

            </div>

        </section>

    );

}