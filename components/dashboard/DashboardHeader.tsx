"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface DashboardHeaderProps {
    firstName: string;
}

export default function DashboardHeader({
    firstName
}: DashboardHeaderProps) {

    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);

    const today = useMemo(() => {
        return new Date().toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }, []);

    return (

        <header className="dashboard-header">

            {/* ------------------------------------------------ */}
            {/* LEFT */}
            {/* ------------------------------------------------ */}

            <div className="dashboard-header-left">

                <div className="dashboard-greeting">

                    <h1>

                        Welcome back,

                        <span>

                            {firstName}

                        </span>

                    </h1>

                    <p>

                        {today}

                    </p>

                </div>

            </div>

            {/* ------------------------------------------------ */}
            {/* CENTER */}
            {/* ------------------------------------------------ */}

            <div className="dashboard-search">

                <input

                    type="text"

                    placeholder="Search markets..."

                />

            </div>

            {/* ------------------------------------------------ */}
            {/* RIGHT */}
            {/* ------------------------------------------------ */}

            <div className="dashboard-header-right">

                <button className="notification-btn">

                    🔔

                    <span className="notification-badge">

                        3

                    </span>

                </button>

                <button

                    className="deposit-btn"

                    onClick={() => router.push("/deposit")}

                >

                    + Deposit

                </button>

                <div className="profile-box">

                    <div className="avatar">

                        {firstName.charAt(0).toUpperCase()}

                    </div>

                    <div>

                        <strong>

                            {firstName}

                        </strong>

                        <small>

                            Verified Trader

                        </small>

                    </div>

                </div>

                <div className="menu-wrapper">

                    <button

                        className="menu-button"

                        onClick={() => setMenuOpen(!menuOpen)}

                    >

                        ☰

                    </button>

                    {menuOpen && (

                        <div className="dashboard-menu">

                            <button onClick={() => router.push("/wallet")}>
                                Wallet
                            </button>

                            <button onClick={() => router.push("/deposit")}>
                                Deposit
                            </button>

                            <button onClick={() => router.push("/withdraw")}>
                                Withdraw
                            </button>

                            <button onClick={() => router.push("/history")}>
                                History
                            </button>

                            <button onClick={() => router.push("/settings")}>
                                Settings
                            </button>

                            <hr />

                            <button
                                className="logout-btn"
                                onClick={() => router.push("/login")}
                            >
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );

}