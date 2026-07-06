"use client";


import { create } from "zustand";
import { persist } from "zustand/middleware";
const createId = () =>
    crypto.randomUUID();

const createReference = () =>
    "TX-" +
    Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

const now = () =>
    new Date().toISOString();

export type TransactionStatus =
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled";

export type TransactionType =
    | "deposit"
    | "withdraw";

export type PaymentMethod =
    | "M-Pesa"
    | "Bank"
    | "Airtel Money"
    | "USDT";

export interface WalletTransaction {

    id: string;

    reference: string;

    type: TransactionType;

    amount: number;

    fee: number;

    netAmount: number;

    method: PaymentMethod;

    phone?: string;

    accountName?: string;

    accountNumber?: string;

    bankName?: string;

    status: TransactionStatus;

    createdAt: string;

    updatedAt: string;

    notes?: string;

}
interface WalletStore {

    balance: number;

    lockedBalance: number;

    pendingBalance: number;

    totalDeposited: number;

    totalWithdrawn: number;

    totalFees: number;

    dailyDeposits: number;

    dailyWithdrawals: number;

    lastTransaction: WalletTransaction | null;

    transactions: WalletTransaction[];

    selectedMethod: PaymentMethod;

    savedPhone: string;

    savedBankName: string;

    savedAccountName: string;

    savedAccountNumber: string;

    depositLimitMin: number;

    depositLimitMax: number;

    withdrawLimitMin: number;

    withdrawLimitMax: number;

    setSelectedMethod: (
        method: PaymentMethod
    ) => void;

    savePhone: (
        phone: string
    ) => void;

    saveBank(
        bank: string,
        accountName: string,
        accountNumber: string
    ): void;

    createDeposit(
        amount: number,
        method: PaymentMethod,
        phone?: string
    ): string;

    approveDeposit(
        id: string
    ): void;

    rejectDeposit(
        id: string
    ): void;

    createWithdrawal(
        amount: number,
        method: PaymentMethod
    ): string;

    approveWithdrawal(
        id: string
    ): void;

    rejectWithdrawal(
        id: string
    ): void;

    clearTransactions(): void;

    resetWallet(): void;

}
export const useWalletStore =
    create<WalletStore>()(

        persist(

(set, get) => ({

    balance: 0,

    lockedBalance: 0,

    pendingBalance: 0,

    totalDeposited: 0,

    totalWithdrawn: 0,

    totalFees: 0,

    dailyDeposits: 0,

    dailyWithdrawals: 0,

    lastTransaction: null,

    transactions: [],

    selectedMethod: "M-Pesa",

    savedPhone: "",

    savedBankName: "",

    savedAccountName: "",

    savedAccountNumber: "",

    depositLimitMin: 100,

    depositLimitMax: 500000,

    withdrawLimitMin: 100,

    withdrawLimitMax: 500000,

    setSelectedMethod(method) {

        set({

            selectedMethod: method

        });

    },

    savePhone(phone) {

        set({

            savedPhone: phone

        });

    },

    saveBank(

        bank,

        accountName,

        accountNumber

    ) {

        set({

            savedBankName: bank,

            savedAccountName: accountName,

            savedAccountNumber: accountNumber

        });

    },
    createDeposit(

    amount,

    method,

    phone

) {

    const transaction: WalletTransaction = {

        id: createId(),

        reference: createReference(),

        type: "deposit",

        amount,

        fee: 0,

        netAmount: amount,

        method,

        phone,

        status: "pending",

        createdAt: now(),

        updatedAt: now()

    };

    set(state => ({

        pendingBalance:

            state.pendingBalance +

            amount,

        lastTransaction:

            transaction,

        transactions: [

            transaction,

            ...state.transactions

        ]

    }));

    return transaction.id;

},
approveDeposit(id) {

    set(state => {

        let deposit =

            state.transactions.find(

                t =>

                    t.id === id

            );

        if (

            !deposit ||

            deposit.status !== "pending" as TransactionStatus

        ) {

            return state;

        }

        const updated =

            state.transactions.map(

                tx =>

                    tx.id === id

                        ? {

                              ...tx,

                              status: "completed" as TransactionStatus,

                              updatedAt:

                                  now()

                          }

                        : tx

            );

        return {

            transactions:

                updated,

            pendingBalance:

                state.pendingBalance -

                deposit.amount,

            balance:

                state.balance +

                deposit.amount,

            totalDeposited:

                state.totalDeposited +

                deposit.amount,

            dailyDeposits:

                state.dailyDeposits +

                deposit.amount,

            lastTransaction: {

                ...deposit,

                status: "completed" as TransactionStatus,
                updatedAt:

                    now()

            }

        };

    });

},
rejectDeposit(id) {

    set(state => {

        let deposit =

            state.transactions.find(

                t =>

                    t.id === id

            );

        if (

            !deposit ||

            deposit.status !== "pending"

        ) {

            return state;

        }

        return {

            pendingBalance:

                state.pendingBalance -

                deposit.amount,

            transactions:

                state.transactions.map(

                    tx =>

                        tx.id === id

                            ? {

                                  ...tx,

                                  status:

                                      "failed" as TransactionStatus,

                                  updatedAt:

                                      now()

                              }

                            : tx

                )

        };

    });

},
createWithdrawal(

    amount,

    method

) {

    const state = get();

    if (amount < state.withdrawLimitMin) {

        throw new Error("Below minimum withdrawal.");

    }

    if (amount > state.withdrawLimitMax) {

        throw new Error("Above maximum withdrawal.");

    }

    if (state.balance < amount) {

        throw new Error("Insufficient balance.");

    }

    const fee = Math.round(amount * 0.01);

    const netAmount = amount - fee;

    const transaction: WalletTransaction = {

        id: createId(),

        reference: createReference(),

        type: "withdraw",

        amount,

        fee,

        netAmount,

        method,

        status: "pending",

        createdAt: now(),

        updatedAt: now()

    };

    set(state => ({

        balance:

            state.balance - amount,

        lockedBalance:

            state.lockedBalance + amount,

        lastTransaction:

            transaction,

        transactions: [

            transaction,

            ...state.transactions

        ]

    }));

    return transaction.id;

},
approveWithdrawal(id) {

    set(state => {

        const tx = state.transactions.find(

            t => t.id === id

        );

        if (

            !tx ||

            tx.status !== "pending"

        ) {

            return state;

        }

        return {

            lockedBalance:

                state.lockedBalance -

                tx.amount,

            totalWithdrawn:

                state.totalWithdrawn +

                tx.amount,

            totalFees:

                state.totalFees +

                tx.fee,

            dailyWithdrawals:

                state.dailyWithdrawals +

                tx.amount,

            lastTransaction: {

                ...tx,

                status: "completed" as TransactionStatus,

                updatedAt: now()

            },

            transactions:

                state.transactions.map(

                    t =>

                        t.id === id

                            ? {

                                  ...t,

                                  status: "completed" as TransactionStatus,

                                  updatedAt: now()

                              }

                            : t

                )

        };

    });

},
rejectWithdrawal(id) {

    set(state => {

        const tx = state.transactions.find(

            t => t.id === id

        );

        if (

            !tx ||

            tx.status !== "pending" as TransactionStatus

        ) {

            return state;

        }

        return {

            balance:

                state.balance +

                tx.amount,

            lockedBalance:

                state.lockedBalance -

                tx.amount,

            transactions:

                state.transactions.map(

                    t =>

                        t.id === id

                            ? {

                                  ...t,

                                  status: "failed"as TransactionStatus,

                                  updatedAt: now()

                              }

                            : t

                ),

            lastTransaction: {

                ...tx,

                status: "failed"as TransactionStatus,

                updatedAt: now()

            }

        };

    });

},
clearTransactions() {

    set({

        transactions: [],

        lastTransaction: null

    });

},

resetWallet() {

    set({

        balance: 0,

        lockedBalance: 0,

        pendingBalance: 0,

        totalDeposited: 0,

        totalWithdrawn: 0,

        totalFees: 0,

        dailyDeposits: 0,

        dailyWithdrawals: 0,

        lastTransaction: null,

        transactions: []

    });

},
        }

        ),

        {

            name: "wallet-storage"

        }

    )

);