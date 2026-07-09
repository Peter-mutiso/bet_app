"use client";

import { create } from "zustand";

export type ToastType =
    | "success"
    | "error"
    | "info"
    | "warning";

export interface ToastItem {

    id: string;

    type: ToastType;

    title: string;

    message?: string;

    amount?: number;

    duration: number;

    createdAt: number;

}

export interface FloatingAmount {

    id: string;

    amount: number;

    type: "profit" | "loss";

    createdAt: number;

}

export interface FlashState {

    active: boolean;

    color: "green" | "red" | "blue" | "gold";

    opacity: number;

}

interface UIState {

    /* ---------------------------------- */
    /* TOASTS                             */
    /* ---------------------------------- */

    toasts: ToastItem[];

    addToast: (

        toast: Omit<
            ToastItem,
            "id" | "createdAt"
        >

    ) => string;

    removeToast: (

        id: string

    ) => void;

    clearToasts: () => void;

    /* ---------------------------------- */
    /* SCREEN FLASH                       */
    /* ---------------------------------- */

    flash: FlashState;

    triggerFlash: (

        color: FlashState["color"],

        opacity?: number

    ) => void;

    clearFlash: () => void;

    /* ---------------------------------- */
    /* FLOATING PROFIT                    */
    /* ---------------------------------- */

    floatingAmounts: FloatingAmount[];

    addFloatingAmount: (

        amount: number,

        type: "profit" | "loss"

    ) => string;

    removeFloatingAmount: (

        id: string

    ) => void;

    clearFloatingAmounts: () => void;

    /* ---------------------------------- */
    /* WALLET ANIMATION                   */
    /* ---------------------------------- */

    animatedBalance: number;

    setAnimatedBalance: (

        balance: number

    ) => void;

}

export const useUIStore =
create<UIState>((set) => ({

    /* =======================================================
       TOASTS
    ======================================================= */

    toasts: [],

    addToast: (toast) => {

        const id = crypto.randomUUID();

        set((state) => ({

            toasts: [

                ...state.toasts,

                {

                    ...toast,

                    id,

                    createdAt: Date.now(),

                },

            ],

        }));

        return id;

    },

    removeToast: (id) =>

        set((state) => ({

            toasts:

                state.toasts.filter(

                    toast => toast.id !== id

                ),

        })),

    clearToasts: () =>

        set({

            toasts: [],

        }),

    /* =======================================================
       FLASH EFFECT
    ======================================================= */

    flash: {

        active: false,

        color: "green",

        opacity: 0,

    },

    triggerFlash: (

        color,

        opacity = 0.16

    ) =>

        set({

            flash: {

                active: true,

                color,

                opacity,

            },

        }),

    clearFlash: () =>

        set({

            flash: {

                active: false,

                color: "green",

                opacity: 0,

            },

        }),

    /* =======================================================
       FLOATING MONEY
    ======================================================= */

    floatingAmounts: [],

    addFloatingAmount: (

        amount,

        type

    ) => {

        const id = crypto.randomUUID();

        set((state) => ({

            floatingAmounts: [

                ...state.floatingAmounts,

                {

                    id,

                    amount,

                    type,

                    createdAt: Date.now(),

                },

            ],

        }));

        return id;

    },

    removeFloatingAmount: (id) =>

        set((state) => ({

            floatingAmounts:

                state.floatingAmounts.filter(

                    item => item.id !== id

                ),

        })),

    clearFloatingAmounts: () =>

        set({

            floatingAmounts: [],

        }),

    /* =======================================================
       BALANCE ANIMATION
    ======================================================= */

    animatedBalance: 0,

    setAnimatedBalance: (

        animatedBalance

    ) =>

        set({

            animatedBalance,

        }),

}));