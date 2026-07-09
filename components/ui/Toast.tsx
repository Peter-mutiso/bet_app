"use client";

import { useEffect, useState } from "react";

import {

    CheckCircle2,

    XCircle,

    AlertTriangle,

    Info,

    X,

} from "lucide-react";

import {

    ToastItem,

    useUIStore,

} from "@/store/useUIStore";

interface Props {

    toast: ToastItem;

}

export default function Toast({

    toast,

}: Props) {

    const removeToast =
        useUIStore(

            state => state.removeToast

        );

    const [

        leaving,

        setLeaving,

    ] = useState(false);

    useEffect(() => {

        const lifeTimer = window.setTimeout(() => {

            setLeaving(true);

        }, toast.duration);

        return () => clearTimeout(lifeTimer);

    }, [toast.duration]);

    useEffect(() => {

        if (!leaving) return;

        const removeTimer = window.setTimeout(() => {

            removeToast(toast.id);

        }, 350);

        return () => clearTimeout(removeTimer);

    }, [

        leaving,

        toast.id,

        removeToast,

    ]);

    const close = () => {

        setLeaving(true);

    };

    const icon = () => {

        switch (toast.type) {

            case "success":

                return (

                    <CheckCircle2

                        size={22}

                        className="toast-icon success"

                    />

                );

            case "error":

                return (

                    <XCircle

                        size={22}

                        className="toast-icon error"

                    />

                );

            case "warning":

                return (

                    <AlertTriangle

                        size={22}

                        className="toast-icon warning"

                    />

                );

            default:

                return (

                    <Info

                        size={22}

                        className="toast-icon info"

                    />

                );

        }

    };

    const amountClass =

        toast.type === "success"

            ? "positive"

            : toast.type === "error"

            ? "negative"

            : "";

    return (

        <div

            className={`

                toast

                ${toast.type}

                ${leaving ? "toast-exit" : "toast-enter"}

            `}

        >

            <div className="toast-left">

                {icon()}

            </div>

            <div className="toast-center">

                <div className="toast-title">

                    {toast.title}

                </div>

                {

                    toast.message && (

                        <div className="toast-message">

                            {toast.message}

                        </div>

                    )

                }

                {

                    toast.amount !== undefined && (

                        <div

                            className={`toast-amount ${amountClass}`}

                        >

                            {

                                toast.amount >= 0

                                    ? `+KES ${toast.amount.toFixed(2)}`

                                    : `-KES ${Math.abs(toast.amount).toFixed(2)}`

                            }

                        </div>

                    )

                }

            </div>

            <button

                className="toast-close"

                onClick={close}

            >

                <X size={16} />

            </button>

            <div

                className="toast-progress"

                style={{

                    animationDuration:

                        `${toast.duration}ms`,

                }}

            />

        </div>

    );

}