"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import type {
    Transaction,
    TransactionStatus,
    TransactionType
} from "../types/transaction";

interface CreateTransaction {
    type: TransactionType;
    description: string;
    amount: number;
    balanceAfter: number;
    status?: TransactionStatus;
    tradeId?: string;
    marketId?: string;
    reference?: string;
    notes?: string;
}

interface TransactionContextValue {
    transactions: Transaction[];

    addTransaction: (
        transaction: CreateTransaction
    ) => void;

    clearTransactions: () => void;
}

const TransactionContext =
    createContext<TransactionContextValue | null>(null);

export function TransactionProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    function addTransaction(
        transaction: CreateTransaction
    ) {
        const now = new Date().toISOString();

        const newTransaction: Transaction = {
            id: crypto.randomUUID(),

            createdAt: now,
            updatedAt: now,

            status: transaction.status ?? "COMPLETED",

            ...transaction
        };

        setTransactions(prev => [
            newTransaction,
            ...prev
        ]);
    }

    function clearTransactions() {
        setTransactions([]);
    }

    const value = useMemo(
        () => ({
            transactions,
            addTransaction,
            clearTransactions
        }),
        [transactions]
    );

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {

    const context = useContext(TransactionContext);

    if (!context) {
        throw new Error(
            "useTransactions must be used inside TransactionProvider"
        );
    }

    return context;
}