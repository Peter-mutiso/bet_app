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

    user: AuthUser | null;

    login: (user: AuthUser) => void;

    logout: () => void;

    updateUser: (user: Partial<AuthUser>) => void;

}

/* =========================================================
   DEFAULT USER
========================================================= */

const demoUser: AuthUser = {

    id: "demo-user",

    name: "Demo Account",

    email: "demo@betpro.com",

    accountType: "Demo"

};

/* =========================================================
   STORE
========================================================= */

export const useAuthStore = create<AuthStore>()(

    persist(

        (set) => ({

            isAuthenticated: true,

            user: demoUser,

            login(user) {

                set({

                    isAuthenticated: true,

                    user

                });

            },

            logout() {

                set({

                    isAuthenticated: false,

                    user: null

                });

            },

            updateUser(user) {

                set(state => ({

                    user: state.user
                        ? {
                              ...state.user,
                              ...user
                          }
                        : null

                }));

            }

        }),

        {

            name: "betpro-auth"

        }

    )

);