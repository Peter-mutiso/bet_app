"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import {
    Wallet,
    Clock3,
    TrendingUp,
    Smartphone,
    Landmark,
    CreditCard,
    Bitcoin,
    ShieldCheck,
    Info,
} from "lucide-react";

export default function DepositPage() {

    const {

        balance,

        pendingBalance,

        totalDeposited,

        selectedMethod,

        setSelectedMethod,

        savedPhone,

        savePhone,

        createDeposit,

    } = useWalletStore();

    const [amount, setAmount] = useState("");

    const [phone, setPhone] = useState(savedPhone);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const quickAmounts = [

        500,

        1000,

        2000,

        5000,

        10000,

        20000,

    ];

    const handleDeposit = () => {

        setMessage("");

        const value = Number(amount);

        if (isNaN(value) || value <= 0) {

            setMessage("Enter a valid deposit amount.");

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

        <div className="deposit-page deposit-fade">

            {/* ===========================================================
                HEADER
            ============================================================ */}

            <div className="deposit-header">

                <div className="deposit-title">

                    <h1>

                        Deposit Funds

                    </h1>

                    <p>

                        Securely fund your trading wallet using your preferred payment method.

                    </p>

                </div>

                <div className="deposit-badge deposit-badge-success">

                    Secure Payments

                </div>

            </div>

            {/* ===========================================================
                SUMMARY CARDS
            ============================================================ */}

            <div className="deposit-summary">

                <div className="deposit-card deposit-hover">

                    <div className="deposit-card-header">

                        <span>

                            Wallet Balance

                        </span>

                        <Wallet size={20} />

                    </div>

                    <div className="deposit-card-value">

                        KES {balance.toLocaleString()}

                    </div>

                    <div className="deposit-card-footer">

                        Available for trading

                    </div>

                </div>

                <div className="deposit-card deposit-hover">

                    <div className="deposit-card-header">

                        <span>

                            Pending Deposits

                        </span>

                        <Clock3 size={20} />

                    </div>

                    <div className="deposit-card-value">

                        KES {pendingBalance.toLocaleString()}

                    </div>

                    <div className="deposit-card-footer">

                        Awaiting confirmation

                    </div>

                </div>

                <div className="deposit-card deposit-hover">

                    <div className="deposit-card-header">

                        <span>

                            Total Deposited

                        </span>

                        <TrendingUp size={20} />

                    </div>

                    <div className="deposit-card-value">

                        KES {totalDeposited.toLocaleString()}

                    </div>

                    <div className="deposit-card-footer">

                        Lifetime deposits

                    </div>

                </div>

            </div>

            {/* ===========================================================
                MAIN LAYOUT
            ============================================================ */}

            <div className="deposit-layout">

                {/* =======================================================
                    LEFT PANEL
                ======================================================== */}

                <div className="deposit-panel">

                    <div className="deposit-panel-title">

                        Make a Deposit

                    </div>

                    <p className="deposit-panel-subtitle">

                        Select a payment method and enter the amount you wish to deposit.

                    </p>
                                        {/* =======================================================
                        PAYMENT METHOD
                    ======================================================== */}

                    <div className="deposit-field">

                        <label>

                            Payment Method

                        </label>

                        <div className="deposit-methods">

                            <button
                                type="button"
                                className={`deposit-method ${
                                    selectedMethod === "M-Pesa"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedMethod("M-Pesa" as any)
                                }
                            >

                                <Smartphone size={20} />

                                <span>M-Pesa</span>

                            </button>

                            <button
                                type="button"
                                className={`deposit-method ${
                                    selectedMethod === "Airtel Money"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedMethod("Airtel Money" as any)
                                }
                            >

                                <Smartphone size={20} />

                                <span>Airtel Money</span>

                            </button>

                            <button
                                type="button"
                                className={`deposit-method ${
                                    selectedMethod === "Bank"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedMethod("Bank" as any)
                                }
                            >

                                <Landmark size={20} />

                                <span>Bank</span>

                            </button>

                            <button
                                type="button"
                                className={`deposit-method ${
                                    selectedMethod === "USDT"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedMethod("USDT" as any)
                                }
                            >

                                <Bitcoin size={20} />

                                <span>USDT</span>

                            </button>

                        </div>

                    </div>

                    {/* =======================================================
                        AMOUNT
                    ======================================================== */}

                    <div className="deposit-field">

                        <label>

                            Deposit Amount

                        </label>

                        <div className="deposit-input-group">

                            <span className="deposit-prefix">

                                KES

                            </span>

                            <input

                                type="number"

                                className="deposit-input"

                                placeholder="Enter amount"

                                value={amount}

                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }

                            />

                        </div>

                    </div>

                    {/* =======================================================
                        QUICK AMOUNTS
                    ======================================================== */}

                    <div className="deposit-field">

                        <label>

                            Quick Amount

                        </label>

                        <div className="deposit-quick-grid">

                            {quickAmounts.map((value) => (

                                <button

                                    key={value}

                                    type="button"

                                    className="deposit-quick-btn"

                                    onClick={() =>
                                        setAmount(
                                            value.toString()
                                        )
                                    }

                                >

                                    KES {value.toLocaleString()}

                                </button>

                            ))}

                        </div>

                    </div>

                    {/* =======================================================
                        PHONE NUMBER
                    ======================================================== */}

                    <div className="deposit-field">

                        <label>

                            Mobile Number

                        </label>

                        <div className="deposit-input-group">

                            <span className="deposit-prefix">

                                +254

                            </span>

                            <input

                                type="text"

                                className="deposit-input"

                                placeholder="7XXXXXXXX"

                                value={phone}

                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }

                            />

                        </div>

                        <small className="deposit-helper">

                            Enter the phone number registered with your mobile money account.

                        </small>

                    </div>

                    {/* =======================================================
                        SUBMIT BUTTON
                    ======================================================== */}

                    <button

                        type="button"

                        className="deposit-button"

                        disabled={loading}

                        onClick={handleDeposit}

                    >

                        {loading
                            ? "Waiting for Payment..."
                            : "Deposit Now"}

                    </button>
                                        {/* =======================================================
                        STATUS MESSAGE
                    ======================================================== */}

                    {message && (

                        <div
                            className={`deposit-alert ${
                                message.includes("success")
                                    ? "success"
                                    : message.includes("Waiting")
                                    ? "warning"
                                    : "error"
                            }`}
                        >

                            {message}

                        </div>

                    )}

                </div>

                {/* =======================================================
                    RIGHT SIDEBAR
                ======================================================== */}

                <aside className="deposit-sidebar">

                    {/* ===================================================
                        SECURITY
                    ==================================================== */}

                    <div className="deposit-panel">

                        <div className="deposit-panel-title">

                            <ShieldCheck size={18} />

                            <span>Secure Deposits</span>

                        </div>

                        <ul className="deposit-info-list">

                            <li>

                                All transactions are encrypted.

                            </li>

                            <li>

                                Funds are credited automatically after approval.

                            </li>

                            <li>

                                Deposits normally complete within 1–3 minutes.

                            </li>

                            <li>

                                Never send money to personal numbers.

                            </li>

                        </ul>

                    </div>

                    {/* ===================================================
                        PAYMENT INFO
                    ==================================================== */}

                    <div className="deposit-panel">

                        <div className="deposit-panel-title">

                            <CreditCard size={18} />

                            <span>Accepted Methods</span>

                        </div>

                        <div className="deposit-payment-list">

                            <div className="deposit-payment-item">

                                <Smartphone size={18} />

                                <div>

                                    <strong>M-Pesa</strong>

                                    <p>

                                        Instant deposits.

                                    </p>

                                </div>

                            </div>

                            <div className="deposit-payment-item">

                                <Smartphone size={18} />

                                <div>

                                    <strong>Airtel Money</strong>

                                    <p>

                                        Fast mobile deposits.

                                    </p>

                                </div>

                            </div>

                            <div className="deposit-payment-item">

                                <Landmark size={18} />

                                <div>

                                    <strong>Bank Transfer</strong>

                                    <p>

                                        Processing may take longer.

                                    </p>

                                </div>

                            </div>

                            <div className="deposit-payment-item">

                                <Bitcoin size={18} />

                                <div>

                                    <strong>USDT</strong>

                                    <p>

                                        Crypto wallet funding.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ===================================================
                        IMPORTANT NOTICE
                    ==================================================== */}

                    <div className="deposit-panel">

                        <div className="deposit-panel-title">

                            <Info size={18} />

                            <span>Important</span>

                        </div>

                        <div className="deposit-note">

                            <p>

                                Ensure the payment details match your registered account.

                            </p>

                            <p>

                                Deposits from third-party accounts may be rejected.

                            </p>

                            <p>

                                Your wallet balance updates automatically after confirmation.

                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    );

}