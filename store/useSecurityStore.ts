"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
    LoginHistoryItem,
    LoginSession,
    SecurityLevel,
    SecuritySettings,
    TrustedDevice
} from "@/types/security";

interface SecurityStore {
    settings: SecuritySettings;

    sessions: LoginSession[];

    history: LoginHistoryItem[];

    trustedDevices: TrustedDevice[];

    securityScore: number;

    securityLevel: SecurityLevel;

    toggleTwoFactor(): void;

    toggleLoginAlerts(): void;

    toggleBrowserNotifications(): void;

    toggleEmailAlerts(): void;

    toggleSmsAlerts(): void;

    toggleWithdrawalConfirmation(): void;

    toggleTradingPin(): void;

    toggleAutoLogout(): void;

    setAutoLogoutMinutes(minutes: number): void;

    logoutSession(id: string): void;

    logoutAllSessions(): void;

    removeTrustedDevice(id: string): void;
}

function calculateScore(settings: SecuritySettings): {
    score: number;
    level: SecurityLevel;
} {
    let score = 0;

    if (settings.emailVerified) score += 20;
    if (settings.phoneVerified) score += 20;
    if (settings.twoFactorEnabled) score += 30;
    if (settings.withdrawalConfirmation) score += 15;
    if (settings.tradingPinEnabled) score += 15;

    let level: SecurityLevel = "LOW";

    if (score >= 80) {
        level = "HIGH";
    } else if (score >= 50) {
        level = "MEDIUM";
    }

    return {
        score,
        level
    };
}

const defaultSettings: SecuritySettings = {
    passwordUpdatedAt: new Date().toISOString(),

    emailVerified: true,
    phoneVerified: true,

    twoFactorEnabled: false,

    loginAlerts: true,
    browserNotifications: true,
    emailAlerts: true,
    smsAlerts: false,

    withdrawalConfirmation: true,
    tradingPinEnabled: false,

    autoLogout: true,
    autoLogoutMinutes: 15
};

const initialSecurity = calculateScore(defaultSettings);

export const useSecurityStore = create<SecurityStore>()(
    persist(
        (set) => ({

            settings: defaultSettings,

            securityScore: initialSecurity.score,

            securityLevel: initialSecurity.level,

            sessions: [
                {
                    id: crypto.randomUUID(),
                    device: "Windows Desktop",
                    browser: "Chrome",
                    os: "Windows 11",
                    ip: "102.xxx.xxx.xxx",
                    location: "Nairobi",
                    status: "CURRENT",
                    lastActive: "Just now"
                },
                {
                    id: crypto.randomUUID(),
                    device: "Samsung Galaxy S24",
                    browser: "Chrome",
                    os: "Android",
                    ip: "105.xxx.xxx.xxx",
                    location: "Mombasa",
                    status: "ACTIVE",
                    lastActive: "15 minutes ago"
                }
            ],

            history: [
                {
                    id: crypto.randomUUID(),
                    browser: "Chrome",
                    device: "Windows Desktop",
                    ip: "102.xxx.xxx.xxx",
                    location: "Nairobi",
                    success: true,
                    timestamp: "2026-07-07 09:21"
                },
                {
                    id: crypto.randomUUID(),
                    browser: "Firefox",
                    device: "MacBook",
                    ip: "196.xxx.xxx.xxx",
                    location: "Kisumu",
                    success: false,
                    timestamp: "2026-07-06 18:10"
                }
            ],

            trustedDevices: [
                {
                    id: crypto.randomUUID(),
                    name: "Office Desktop",
                    browser: "Chrome",
                    os: "Windows 11",
                    addedAt: "2026-05-01"
                },
                {
                    id: crypto.randomUUID(),
                    name: "Galaxy S24",
                    browser: "Chrome",
                    os: "Android",
                    addedAt: "2026-06-15"
                }
            ],

            toggleTwoFactor() {
                set((state) => {
                    const settings = {
                        ...state.settings,
                        twoFactorEnabled:
                            !state.settings.twoFactorEnabled
                    };

                    const security = calculateScore(settings);

                    return {
                        settings,
                        securityScore: security.score,
                        securityLevel: security.level
                    };
                });
            },

            toggleLoginAlerts() {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        loginAlerts:
                            !state.settings.loginAlerts
                    }
                }));
            },

            toggleBrowserNotifications() {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        browserNotifications:
                            !state.settings.browserNotifications
                    }
                }));
            },

            toggleEmailAlerts() {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        emailAlerts:
                            !state.settings.emailAlerts
                    }
                }));
            },

            toggleSmsAlerts() {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        smsAlerts:
                            !state.settings.smsAlerts
                    }
                }));
            },

            toggleWithdrawalConfirmation() {
                set((state) => {
                    const settings = {
                        ...state.settings,
                        withdrawalConfirmation:
                            !state.settings.withdrawalConfirmation
                    };

                    const security = calculateScore(settings);

                    return {
                        settings,
                        securityScore: security.score,
                        securityLevel: security.level
                    };
                });
            },

            toggleTradingPin() {
                set((state) => {
                    const settings = {
                        ...state.settings,
                        tradingPinEnabled:
                            !state.settings.tradingPinEnabled
                    };

                    const security = calculateScore(settings);

                    return {
                        settings,
                        securityScore: security.score,
                        securityLevel: security.level
                    };
                });
            },

            toggleAutoLogout() {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        autoLogout:
                            !state.settings.autoLogout
                    }
                }));
            },

            setAutoLogoutMinutes(minutes) {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        autoLogoutMinutes: minutes
                    }
                }));
            },

            logoutSession(id) {
                set((state) => ({
                    sessions: state.sessions.filter(
                        (session) =>
                            session.id !== id &&
                            session.status !== "CURRENT"
                    )
                }));
            },

            logoutAllSessions() {
                set((state) => ({
                    sessions: state.sessions.filter(
                        (session) =>
                            session.status === "CURRENT"
                    )
                }));
            },

            removeTrustedDevice(id) {
                set((state) => ({
                    trustedDevices:
                        state.trustedDevices.filter(
                            (device) =>
                                device.id !== id
                        )
                }));
            }

        }),
        {
            name: "security-storage"
        }
    )
);