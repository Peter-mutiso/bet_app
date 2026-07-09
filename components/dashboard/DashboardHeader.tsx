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

            {/* LEFT */}

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

            {/* CENTER */}

            <div className="dashboard-search">

                <input

                    type="text"

                    placeholder="Search markets..."

                    onFocus={() => router.push("/trading/markets")}

                    onClick={() => router.push("/trading/markets")}

                    readOnly

                />

            </div>

            {/* RIGHT */}

            <div className="dashboard-header-right">

                {/* Notifications */}

                <button

                    className="notification-btn"

                    onClick={() => router.push("/notifications")}

                    title="Notifications"

                >

                    🔔

                    <span className="notification-badge">

                        3

                    </span>

                </button>

                {/* Deposit */}

                <button

                    className="deposit-btn"

                    onClick={() => router.push("/deposit")}

                >

                    + Deposit

                </button>

                {/* Profile */}

                <button

                    className="profile-box"

                    onClick={() => router.push("/account")}

                    type="button"

                >

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

                </button>

            </div>

        </header>

    );

}