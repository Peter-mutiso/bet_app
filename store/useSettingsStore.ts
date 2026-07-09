"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* =========================================================
   TYPES
========================================================= */

export type ThemeMode =
    | "light"
    | "dark"
    | "system";

export type Currency =
    | "KES"
    | "USD"
    | "EUR";

export type ContractPreference =
    | "RISE"
    | "FALL"
    | "HIGHER"
    | "LOWER";

/* =========================================================
   STORE
========================================================= */

interface SettingsStore {

    /* ---------------- PROFILE ---------------- */

    displayName: string;
    email: string;
    country: string;
    currency: Currency;

    /* ---------------- APPEARANCE ---------------- */

    theme: ThemeMode;
    compactMode: boolean;
    accentColor: string;
    fontScale: number;

    /* ---------------- TRADING ---------------- */

    defaultStake: number;
    defaultDuration: number;
    defaultContract: ContractPreference;

    confirmTrades: boolean;
    autoCloseTrades: boolean;
    soundEffects: boolean;

    /* ---------------- NOTIFICATIONS ---------------- */

    tradeNotifications: boolean;
    depositNotifications: boolean;
    withdrawalNotifications: boolean;
    systemNotifications: boolean;
    browserNotifications: boolean;

    /* ---------------- SECURITY ---------------- */

    twoFactorEnabled: boolean;
    autoLogoutMinutes: number;

    /* ---------------- WALLET ---------------- */

    preferredPaymentMethod: string;
    defaultPhone: string;
    defaultBank: string;

    /* ---------------- ACTIONS ---------------- */

    setDisplayName(name: string): void;
    setCountry(country: string): void;
    setCurrency(currency: Currency): void;

    setTheme(theme: ThemeMode): void;
    toggleCompactMode(): void;
    setAccentColor(color: string): void;
    setFontScale(scale: number): void;

    setDefaultStake(value: number): void;
    setDefaultDuration(value: number): void;
    setDefaultContract(contract: ContractPreference): void;

    toggleConfirmTrades(): void;
    toggleAutoCloseTrades(): void;
    toggleSoundEffects(): void;

    toggleTradeNotifications(): void;
    toggleDepositNotifications(): void;
    toggleWithdrawalNotifications(): void;
    toggleSystemNotifications(): void;
    toggleBrowserNotifications(): void;

    toggleTwoFactor(): void;
    setAutoLogout(minutes: number): void;

    setPreferredPaymentMethod(method: string): void;
    setDefaultPhone(phone: string): void;
    setDefaultBank(bank: string): void;

    resetSettings(): void;
}

/* =========================================================
   STORE
========================================================= */

export const useSettingsStore =
create<SettingsStore>()(
persist(
(set) => ({

    /* ---------------- PROFILE ---------------- */

    displayName: "Demo Trader",
    email: "demo@betpro.com",
    country: "Kenya",
    currency: "KES",

    /* ---------------- APPEARANCE ---------------- */

    theme: "dark",
    compactMode: false,
    accentColor: "#16a34a",
    fontScale: 100,

    /* ---------------- TRADING ---------------- */

    defaultStake: 10,
    defaultDuration: 5,
    defaultContract: "RISE",

    confirmTrades: true,
    autoCloseTrades: false,
    soundEffects: true,

    /* ---------------- NOTIFICATIONS ---------------- */

    tradeNotifications: true,
    depositNotifications: true,
    withdrawalNotifications: true,
    systemNotifications: true,
    browserNotifications: false,

    /* ---------------- SECURITY ---------------- */

    twoFactorEnabled: false,
    autoLogoutMinutes: 30,

    /* ---------------- WALLET ---------------- */

    preferredPaymentMethod: "M-Pesa",
    defaultPhone: "",
    defaultBank: "",

    /* ---------------- PROFILE ---------------- */

    setDisplayName: (displayName) => set({ displayName }),
    setCountry: (country) => set({ country }),
    setCurrency: (currency) => set({ currency }),

    /* ---------------- APPEARANCE ---------------- */

    setTheme: (theme) => set({ theme }),

    toggleCompactMode: () =>
        set(state => ({
            compactMode: !state.compactMode
        })),

    setAccentColor: (accentColor) =>
        set({ accentColor }),

    setFontScale: (fontScale) =>
        set({ fontScale }),

    /* ---------------- TRADING ---------------- */

    setDefaultStake: (defaultStake) =>
        set({ defaultStake }),

    setDefaultDuration: (defaultDuration) =>
        set({ defaultDuration }),

    setDefaultContract: (defaultContract) =>
        set({ defaultContract }),

    toggleConfirmTrades: () =>
        set(state => ({
            confirmTrades: !state.confirmTrades
        })),

    toggleAutoCloseTrades: () =>
        set(state => ({
            autoCloseTrades: !state.autoCloseTrades
        })),

    toggleSoundEffects: () =>
        set(state => ({
            soundEffects: !state.soundEffects
        })),

    /* ---------------- NOTIFICATIONS ---------------- */

    toggleTradeNotifications: () =>
        set(state => ({
            tradeNotifications: !state.tradeNotifications
        })),

    toggleDepositNotifications: () =>
        set(state => ({
            depositNotifications: !state.depositNotifications
        })),

    toggleWithdrawalNotifications: () =>
        set(state => ({
            withdrawalNotifications: !state.withdrawalNotifications
        })),

    toggleSystemNotifications: () =>
        set(state => ({
            systemNotifications: !state.systemNotifications
        })),

    toggleBrowserNotifications: () =>
        set(state => ({
            browserNotifications: !state.browserNotifications
        })),

    /* ---------------- SECURITY ---------------- */

    toggleTwoFactor: () =>
        set(state => ({
            twoFactorEnabled: !state.twoFactorEnabled
        })),

    setAutoLogout: (autoLogoutMinutes) =>
        set({ autoLogoutMinutes }),

    /* ---------------- WALLET ---------------- */

    setPreferredPaymentMethod: (preferredPaymentMethod) =>
        set({ preferredPaymentMethod }),

    setDefaultPhone: (defaultPhone) =>
        set({ defaultPhone }),

    setDefaultBank: (defaultBank) =>
        set({ defaultBank }),

    /* ---------------- RESET ---------------- */

    resetSettings: () =>
        set({

            displayName: "Demo Trader",
            email: "demo@betpro.com",
            country: "Kenya",
            currency: "KES",

            theme: "dark",
            compactMode: false,
            accentColor: "#16a34a",
            fontScale: 100,

            defaultStake: 10,
            defaultDuration: 5,
            defaultContract: "RISE",

            confirmTrades: true,
            autoCloseTrades: false,
            soundEffects: true,

            tradeNotifications: true,
            depositNotifications: true,
            withdrawalNotifications: true,
            systemNotifications: true,
            browserNotifications: false,

            twoFactorEnabled: false,
            autoLogoutMinutes: 30,

            preferredPaymentMethod: "M-Pesa",
            defaultPhone: "",
            defaultBank: ""

        })

}),
{
    name: "betpro-settings"
}
)
);