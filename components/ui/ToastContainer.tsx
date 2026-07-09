"use client";

import { memo } from "react";

import Toast from "./Toast";

import { useUIStore } from "@/store/useUIStore";

function ToastContainer() {

    const toasts = useUIStore(

        (state) => state.toasts

    );

    if (toasts.length === 0) {

        return null;

    }

    return (

        <div
            className="toast-container"
            aria-live="polite"
            aria-atomic="false"
        >

            {toasts.map((toast) => (

                <Toast
                    key={toast.id}
                    toast={toast}
                />

            ))}

        </div>

    );

}

export default memo(ToastContainer);