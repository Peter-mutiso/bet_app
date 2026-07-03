import type { AuthUser } from "../api/auth";

export const mockUser: AuthUser = {
    id: "user-001",
    username: "peter",
    email: "demo@deriv.com",
    firstName: "Peter",
    lastName: "Mutiso",
    roles: ["USER"]
};

export const mockWallet = {
    id: "wallet-001",
    balance: 12500,
    bonus: 500,
    currency: "USD",
    equity: 13000,
    margin: 0,
    freeMargin: 13000
};

export const mockMarkets = [
    {
        id: "frxEURUSD",
        name: "EUR/USD",
        symbol: "EURUSD",
        price: 1.17421,
        change: 0.42
    },
    {
        id: "frxGBPUSD",
        name: "GBP/USD",
        symbol: "GBPUSD",
        price: 1.36250,
        change: -0.16
    },
    {
        id: "frxUSDJPY",
        name: "USD/JPY",
        symbol: "USDJPY",
        price: 145.73,
        change: 0.09
    },
    {
        id: "cryBTCUSD",
        name: "BTC/USD",
        symbol: "BTCUSD",
        price: 108500,
        change: 2.84
    },
    {
        id: "cryETHUSD",
        name: "ETH/USD",
        symbol: "ETHUSD",
        price: 2648,
        change: 1.57
    }
];

export const mockBets = [];