"use client";

import { useMemo, useState } from "react";
import { Bell, Wallet, TrendingUp, Shield, Settings } from "lucide-react";

import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationsPage() {
    const {
        notifications,
        unread,
        markRead,
        markAllRead,
        clear
    } = useNotificationStore();

    const [filter, setFilter] = useState<
        "all" | "trade" | "wallet" | "market" | "security" | "system"
    >("all");

    const filtered = useMemo(() => {
        if (filter === "all") return notifications;

        return notifications.filter(n => n.type === filter);
    }, [notifications, filter]);

    const stats = {
        total: notifications.length,
        unread,
        high: notifications.filter(n => n.priority === "high").length,
        today: notifications.filter(n =>
            new Date(n.createdAt).toDateString() ===
            new Date().toDateString()
        ).length
    };

    function icon(type: string) {
        switch (type) {
            case "trade":
                return <TrendingUp size={18} />;
            case "wallet":
                return <Wallet size={18} />;
            case "security":
                return <Shield size={18} />;
            case "system":
                return <Settings size={18} />;
            default:
                return <Bell size={18} />;
        }
    }

    return (
        <div className="notifications-page">

            <div className="page-header">

                <div>
                    <h1>Notifications</h1>
                    <p>Trading activity, wallet updates and system events</p>
                </div>

                <div className="header-actions">

                    <button
                        className="secondary-btn"
                        onClick={markAllRead}
                    >
                        Mark all read
                    </button>

                    <button
                        className="danger-btn"
                        onClick={clear}
                    >
                        Clear
                    </button>

                </div>

            </div>

            <div className="notification-stats">

                <div className="stat-card">
                    <span>Total</span>
                    <h2>{stats.total}</h2>
                </div>

                <div className="stat-card">
                    <span>Unread</span>
                    <h2>{stats.unread}</h2>
                </div>

                <div className="stat-card">
                    <span>High Priority</span>
                    <h2>{stats.high}</h2>
                </div>

                <div className="stat-card">
                    <span>Today</span>
                    <h2>{stats.today}</h2>
                </div>

            </div>

            <div className="notification-filters">

                {[
                    "all",
                    "trade",
                    "wallet",
                    "market",
                    "security",
                    "system"
                ].map(item => (

                    <button
                        key={item}
                        onClick={() => setFilter(item as any)}
                        className={
                            filter === item
                                ? "filter active"
                                : "filter"
                        }
                    >
                        {item.toUpperCase()}
                    </button>

                ))}

            </div>

            <div className="notification-list">

                {filtered.length === 0 && (

                    <div className="empty">

                        <Bell size={40} />

                        <h3>No Notifications</h3>

                        <p>
                            You're all caught up.
                        </p>

                    </div>

                )}

                {filtered.map(notification => (

                    <div
                        key={notification.id}
                        className={`notification-card ${
                            notification.read
                                ? ""
                                : "unread"
                        }`}
                    >

                        <div className="notification-icon">
                            {icon(notification.type)}
                        </div>

                        <div className="notification-body">

                            <div className="notification-title">

                                <h3>
                                    {notification.title}
                                </h3>

                                <span className={notification.priority}>
                                    {notification.priority}
                                </span>

                            </div>

                            <p>
                                {notification.message}
                            </p>

                            <small>
                                {new Date(
                                    notification.createdAt
                                ).toLocaleString()}
                            </small>

                        </div>

                        {!notification.read && (

                            <button
                                className="read-btn"
                                onClick={() =>
                                    markRead(notification.id)
                                }
                            >
                                Mark Read
                            </button>

                        )}

                    </div>

                ))}

            </div>

        </div>
    );
}