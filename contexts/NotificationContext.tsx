"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import type {
    Notification,
    NotificationLevel,
    NotificationType
} from "../types/notification";

interface NotificationContextType {

    notifications: Notification[];

    unreadCount: number;

    addNotification(input: {
        title: string;
        message: string;
        type: NotificationType;
        level: NotificationLevel;
        actionUrl?: string;
    }): void;

    markRead(id: string): void;

    markAllRead(): void;

    removeNotification(id: string): void;

    clearNotifications(): void;
}

const NotificationContext =
    createContext<NotificationContextType | null>(null);

export function NotificationProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    function addNotification(input: {
        title: string;
        message: string;
        type: NotificationType;
        level: NotificationLevel;
        actionUrl?: string;
    }) {

        const notification: Notification = {

            id: crypto.randomUUID(),

            title: input.title,

            message: input.message,

            type: input.type,

            level: input.level,

            read: false,

            actionUrl: input.actionUrl,

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString()
        };

        setNotifications(prev => [
            notification,
            ...prev
        ]);
    }

    function markRead(id: string) {

        setNotifications(prev =>
            prev.map(n =>
                n.id === id
                    ? {
                          ...n,
                          read: true,
                          updatedAt:
                              new Date().toISOString()
                      }
                    : n
            )
        );
    }

    function markAllRead() {

        setNotifications(prev =>
            prev.map(n => ({
                ...n,
                read: true,
                updatedAt:
                    new Date().toISOString()
            }))
        );
    }

    function removeNotification(id: string) {

        setNotifications(prev =>
            prev.filter(n => n.id !== id)
        );
    }

    function clearNotifications() {

        setNotifications([]);
    }

    const value = useMemo(
        () => ({
            notifications,

            unreadCount:
                notifications.filter(
                    n => !n.read
                ).length,

            addNotification,

            markRead,

            markAllRead,

            removeNotification,

            clearNotifications
        }),
        [notifications]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {

    const ctx =
        useContext(NotificationContext);

    if (!ctx) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider"
        );
    }

    return ctx;
}