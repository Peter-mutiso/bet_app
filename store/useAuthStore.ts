"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* =========================================================
   TYPES
========================================================= */

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    accountType: "Demo" | "Real";
    avatar?: string;
}

/* =========================================================
   STORE
========================================================= */

interface AuthStore {
    isAuthenticated: boolean;

    isLoading: boolean;

    user: AuthUser | null;

    login: (user: AuthUser) => void;

    loginDemo: () => void;

    logout: () => void;

    updateUser: (user: Partial<AuthUser>) => void;

    finishLoading: () => void;
}

/* =========================================================
   DEFAULT DEMO USER
========================================================= */

const demoUser: AuthUser = {
    id: "demo-user",
    name: "Demo Account",
    email: "demo@betpro.com",
    accountType: "Demo",
};

/* =========================================================
   STORE
========================================================= */

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,

            isLoading: true,

            user: null,

            login(user) {
                set({
                    isAuthenticated: true,
                    user,
                });
            },

            loginDemo() {
                set({
                    isAuthenticated: true,
                    user: demoUser,
                });
            },

            logout() {
                set({
                    isAuthenticated: false,
                    user: null,
                });
            },

            updateUser(user) {
                set((state) => ({
                    user: state.user
                        ? {
                              ...state.user,
                              ...user,
                          }
                        : null,
                }));
            },

            finishLoading() {
                set({
                    isLoading: false,
                });
            },
        }),
        {
            name: "betpro-auth",

            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),

            onRehydrateStorage: () => (state) => {
                state?.finishLoading();
            },
        }
    )
);