"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";

export default function DepositPage() {
    const {
        balance,
        pendingBalance,
        totalDeposited,
        selectedMethod,
        setSelectedMethod,
        savedPhone,
        savePhone,
        createDeposit
    } = useWalletStore();

    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState(savedPhone);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDeposit = () => {
        setMessage("");

        const value = Number(amount);

        if (isNaN(value) || value <= 0) {
            setMessage("Enter a valid amount.");
            return;
        }

        setLoading(true);

        try {
            savePhone(phone);

            const id = createDeposit(
                value,
                selectedMethod,
                phone
            );

            setMessage(
                "Deposit request submitted. Waiting for confirmation..."
            );

            setAmount("");

            setTimeout(() => {
                useWalletStore
                    .getState()
                    .approveDeposit(id);

                setLoading(false);

                setMessage(
                    "Deposit completed successfully."
                );
            }, 3000);
        } catch (error) {
            setLoading(false);

            if (error instanceof Error) {
                setMessage(error.message);
            }
        }
    };

    return (
        <div className="p-6 space-y-6">

            <h1 className="text-3xl font-bold">
                Deposit Funds
            </h1>

            {/* Summary Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="rounded-lg bg-slate-900 p-4">
                    <p className="text-xs text-slate-400">
                        Wallet Balance
                    </p>

                    <h2 className="text-2xl font-bold">
                        KES {balance.toLocaleString()}
                    </h2>
                </div>

                <div className="rounded-lg bg-slate-900 p-4">
                    <p className="text-xs text-slate-400">
                        Pending Deposits
                    </p>

                    <h2 className="text-2xl font-bold text-yellow-400">
                        KES {pendingBalance.toLocaleString()}
                    </h2>
                </div>

                <div className="rounded-lg bg-slate-900 p-4">
                    <p className="text-xs text-slate-400">
                        Total Deposited
                    </p>

                    <h2 className="text-2xl font-bold text-green-400">
                        KES {totalDeposited.toLocaleString()}
                    </h2>
                </div>

            </div>

            {/* Deposit Form */}

            <div className="rounded-lg bg-slate-900 p-6 space-y-4">

                <select
                    value={selectedMethod}
                    onChange={(e) =>
                        setSelectedMethod(e.target.value as any)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                >
                    <option>M-Pesa</option>
                    <option>Airtel Money</option>
                    <option>Bank</option>
                    <option>USDT</option>
                </select>

                <input
                    type="number"
                    placeholder="Deposit Amount"
                    value={amount}
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />

                <input
                    type="text"
                    placeholder="2547XXXXXXXX"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />

                <button
                    onClick={handleDeposit}
                    disabled={loading}
                    className="w-full rounded-lg bg-green-600 py-3 font-semibold hover:bg-green-500 disabled:opacity-50"
                >
                    {loading
                        ? "Waiting for Payment..."
                        : "Deposit Now"}
                </button>

                {message && (
                    <div
                        className={`rounded-lg p-3 text-sm ${
                            message.includes("success")
                                ? "bg-green-900 text-green-300"
                                : message.includes("Waiting")
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-red-900 text-red-300"
                        }`}
                    >
                        {message}
                    </div>
                )}

            </div>

        </div>
    );
}