"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";

export default function WithdrawPage() {

    const {

    balance,

    lockedBalance,

    totalWithdrawn,

    transactions,

    lastTransaction,

    selectedMethod,

    setSelectedMethod,

    savedPhone,

    savePhone,

    createWithdrawal

} = useWalletStore();

    const [amount, setAmount] = useState("");

    const [phone, setPhone] = useState(savedPhone);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const handleWithdraw = () => {

        setMessage("");

        const value = Number(amount);

        if (isNaN(value) || value <= 0) {

            setMessage("Enter a valid withdrawal amount.");

            return;

        }

        try {

            setLoading(true);

            savePhone(phone);

            const id = createWithdrawal(

                value,

                selectedMethod

            );

            setMessage(
                "Withdrawal request submitted."
            );

            setAmount("");

            setTimeout(() => {

                useWalletStore
                    .getState()
                    .approveWithdrawal(id);

                setLoading(false);

                setMessage(
                    "Withdrawal completed successfully."
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

<div className="space-y-6 p-6">

    {/* ======================================
        WALLET SUMMARY
    ======================================= */}

    <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl bg-slate-900 p-5">

            <p className="text-xs text-slate-400">

                Available Balance

            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">

                KES {balance.toLocaleString()}

            </h2>

        </div>

        <div className="rounded-xl bg-slate-900 p-5">

            <p className="text-xs text-slate-400">

                Locked Balance

            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">

                KES {lockedBalance.toLocaleString()}

            </h2>

        </div>

        <div className="rounded-xl bg-slate-900 p-5">

            <p className="text-xs text-slate-400">

                Total Withdrawn

            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-400">

                KES {totalWithdrawn.toLocaleString()}

            </h2>

        </div>

    </div>

    {/* ======================================
        WITHDRAW FORM
    ======================================= */}

    <div className="rounded-xl bg-slate-900 p-6 space-y-5">

        <h2 className="text-xl font-semibold">

            Withdraw Funds

        </h2>

        <div>

            <label className="mb-2 block text-sm">

                Withdrawal Method

            </label>

            <select

                value={selectedMethod}

                onChange={(e)=>

                    setSelectedMethod(

                        e.target.value as any

                    )

                }

                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"

            >

                <option>M-Pesa</option>

                <option>Airtel Money</option>

                <option>Bank</option>

                <option>USDT</option>

            </select>

        </div>

        <div>

            <label className="mb-2 block text-sm">

                Amount

            </label>

            <input

                type="number"

                value={amount}

                onChange={(e)=>

                    setAmount(e.target.value)

                }

                placeholder="Enter amount"

                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"

            />

        </div>

        <div>

            <label className="mb-2 block text-sm">

                Phone Number

            </label>

            <input

                value={phone}

                onChange={(e)=>

                    setPhone(e.target.value)

                }

                placeholder="2547XXXXXXXX"

                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"

            />

        </div>

        <button

            onClick={handleWithdraw}

            disabled={loading}

            className="w-full rounded-lg bg-red-600 py-3 font-semibold transition hover:bg-red-500 disabled:opacity-50"

        >

            {loading

                ? "Processing..."

                : "Withdraw"}

        </button>

        {message && (

            <div

                className={`rounded-lg p-3 text-sm ${
                    message.includes("success")
                        ? "bg-green-900 text-green-300"
                        : message.includes("submitted")
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                }`}

            >

                {message}

            </div>

        )}

    </div>
    {/* ======================================
    WITHDRAWAL SUMMARY
====================================== */}

<div className="grid gap-4 md:grid-cols-3">

    <div className="rounded-xl bg-slate-900 p-5">

        <p className="text-xs text-slate-400">

            Last Withdrawal

        </p>

        <h3 className="mt-2 text-lg font-semibold">

            {lastTransaction?.type === "withdraw"

                ? `KES ${lastTransaction.amount.toLocaleString()}`

                : "--"}

        </h3>

    </div>

    <div className="rounded-xl bg-slate-900 p-5">

        <p className="text-xs text-slate-400">

            Withdrawal Fee

        </p>

        <h3 className="mt-2 text-lg font-semibold text-orange-400">

            {lastTransaction?.type === "withdraw"

                ? `KES ${lastTransaction.fee.toLocaleString()}`

                : "--"}

        </h3>

    </div>

    <div className="rounded-xl bg-slate-900 p-5">

        <p className="text-xs text-slate-400">

            Net Amount

        </p>

        <h3 className="mt-2 text-lg font-semibold text-green-400">

            {lastTransaction?.type === "withdraw"

                ? `KES ${lastTransaction.netAmount.toLocaleString()}`

                : "--"}

        </h3>

    </div>

</div>

<div className="rounded-xl bg-slate-900 p-6">

    <h2 className="mb-4 text-xl font-semibold">

        Recent Withdrawals

    </h2>

    <div className="space-y-3">

        {transactions
            .filter(t => t.type === "withdraw")
            .slice(0, 10)
            .map(tx => (

                <div

                    key={tx.id}

                    className="flex items-center justify-between rounded-lg bg-slate-800 p-4"

                >

                    <div>

                        <div className="font-medium">

                            {tx.reference}

                        </div>

                        <div className="text-xs text-slate-400">

                            {new Date(

                                tx.createdAt

                            ).toLocaleString()}

                        </div>

                    </div>

                    <div className="text-right">

                        <div>

                            KES {tx.amount.toLocaleString()}

                        </div>

                        <div

                            className={`text-xs font-semibold ${
                                tx.status === "completed"
                                    ? "text-green-400"
                                    : tx.status === "pending"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                            }`}

                        >

                            {tx.status.toUpperCase()}

                        </div>

                    </div>

                </div>

            ))}

        {transactions.filter(

            t => t.type === "withdraw"

        ).length === 0 && (

            <div className="py-10 text-center text-slate-500">

                No withdrawals yet.

            </div>

        )}

    </div>

</div>

</div>

);

}