/**
 * ============================================================================
 * ROUTES
 * ============================================================================
 */

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",

    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",

    DASHBOARD: "/dashboard",
    MARKETS: "/markets",
    TRADING: "/trading",
    WALLET: "/wallet",

    BETS: "/bets",
    HISTORY: "/history",
    PROFILE: "/profile",
    SETTINGS: "/settings",

    DEPOSIT: "/wallet/deposit",
    WITHDRAW: "/wallet/withdraw"
} as const;