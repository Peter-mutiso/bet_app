export const API_ENDPOINTS = {

    AUTH: {

        LOGIN: "/auth/login",

        REGISTER: "/auth/register",

        LOGOUT: "/auth/logout",

        REFRESH: "/auth/refresh",

        VERIFY_EMAIL: "/auth/verify-email",

        FORGOT_PASSWORD: "/auth/forgot-password",

        RESET_PASSWORD: "/auth/reset-password"

    },

    USER: {

        PROFILE: "/users/profile"

    },

    WALLET: {

        SUMMARY: "/wallet",

        BALANCE: "/wallet/balance",

        DEPOSIT: "/wallet/deposit",

        WITHDRAW: "/wallet/withdraw",

        TRANSACTIONS: "/wallet/transactions"

    },

    MARKETS: {

        LIST: "/markets",

        DETAILS: "/markets/:id"

    },

    WATCHLIST: {

        LIST: "/watchlist",

        ITEM: "/watchlist/:marketId"

    },

    TRADING: {

        PLACE: "/trades",

        CLOSE: "/trades/:id/close",

        ACTIVE: "/trades/active",

        HISTORY: "/trades/history",

        DETAILS: "/trades/:id",

        CANCEL: "/trades/:id/cancel"

    }

};