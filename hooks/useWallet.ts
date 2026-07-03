/**
 * ============================================================================
 * WALLET HOOK
 * ============================================================================
 * React hook for wallet operations.
 * ============================================================================
 */

"use client";

import {
    useMemo,
    useState,
    useCallback
} from "react";

import {
    DepositRequest,
    WithdrawRequest,
    Wallet,
    WalletTransaction
} from "../services/api/wallet";

import {
    useApp
} from "../contexts/AppContext";

/* -------------------------------------------------------------------------- */
/* STATE                                                                      */
/* -------------------------------------------------------------------------- */

export interface UseWalletState {
    readonly wallet?: Wallet;
    readonly loading: boolean;
    readonly error?: Error;
}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useWallet() {

    const { wallet } = useApp();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const state = useMemo<UseWalletState>(
        () => ({
            wallet: wallet.current(),
            loading,
            error
        }),
        [wallet, loading, error]
    );

    /* ---------------------------------------------------------------------- */
    /* LOAD                                                                   */
    /* ---------------------------------------------------------------------- */

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(undefined);
            return await wallet.load();
        } catch (exception) {
            const err =
                exception instanceof Error
                    ? exception
                    : new Error("Failed to load wallet.");

            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [wallet]);

    /* ---------------------------------------------------------------------- */
    /* REFRESH                                                                */
    /* ---------------------------------------------------------------------- */

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(undefined);
            return await wallet.refresh();
        } catch (exception) {
            const err =
                exception instanceof Error
                    ? exception
                    : new Error("Failed to refresh wallet.");

            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [wallet]);

    /* ---------------------------------------------------------------------- */
    /* DEPOSIT                                                                */
    /* ---------------------------------------------------------------------- */

    const deposit = useCallback(
        async (request: DepositRequest) => {
            try {
                setLoading(true);
                setError(undefined);
                return await wallet.deposit(request);
            } catch (exception) {
                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Deposit failed.");

                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [wallet]
    );

    /* ---------------------------------------------------------------------- */
    /* WITHDRAW                                                               */
    /* ---------------------------------------------------------------------- */

    const withdraw = useCallback(
        async (request: WithdrawRequest) => {
            try {
                setLoading(true);
                setError(undefined);
                return await wallet.withdraw(request);
            } catch (exception) {
                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Withdrawal failed.");

                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [wallet]
    );

    /* ---------------------------------------------------------------------- */
    /* TRANSACTIONS                                                           */
    /* ---------------------------------------------------------------------- */

    const transactions = useCallback(async (): Promise<readonly WalletTransaction[]> => {
        try {
            setLoading(true);
            setError(undefined);
            return await wallet.transactions();
        } catch (exception) {
            const err =
                exception instanceof Error
                    ? exception
                    : new Error("Failed to load transactions.");

            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [wallet]);

    /* ---------------------------------------------------------------------- */
    /* CLEAR ERROR                                                            */
    /* ---------------------------------------------------------------------- */

    const clearError = useCallback(() => {
        setError(undefined);
    }, []);

    /* ---------------------------------------------------------------------- */
    /* BALANCES                                                               */
    /* ---------------------------------------------------------------------- */

    const balance = useMemo(
        () => state.wallet?.balance ?? 0,
        [state.wallet]
    );

    const availableBalance = useMemo(
        () => state.wallet?.availableBalance ?? 0,
        [state.wallet]
    );

    const lockedBalance = useMemo(
        () => state.wallet?.lockedBalance ?? 0,
        [state.wallet]
    );

    /* ---------------------------------------------------------------------- */
    /* DERIVED                                                                */
    /* ---------------------------------------------------------------------- */

    const hasWallet = useMemo(
        () => state.wallet !== undefined,
        [state.wallet]
    );

    const isEmpty = useMemo(
        () => availableBalance <= 0,
        [availableBalance]
    );

    /* ---------------------------------------------------------------------- */
    /* HEALTH                                                                 */
    /* ---------------------------------------------------------------------- */

    const healthy = useMemo(
        () => wallet.healthy(),
        [wallet]
    );

    const ready = useMemo(
        () => !loading,
        [loading]
    );

    /* ---------------------------------------------------------------------- */
    /* INFO                                                                   */
    /* ---------------------------------------------------------------------- */

    const information = useMemo(
        () => wallet.information(),
        [wallet]
    );

    const diagnostics = useMemo(
        () => wallet.diagnostics(),
        [wallet]
    );

    /* ---------------------------------------------------------------------- */
    /* HELPERS                                                                */
    /* ---------------------------------------------------------------------- */

    const current = useCallback(
        () => wallet.current(),
        [wallet]
    );

    const exists = useCallback(
        () => wallet.hasWallet(),
        [wallet]
    );

    const reset = useCallback(() => {
        clearError();
    }, [clearError]);

    /* ---------------------------------------------------------------------- */
    /* PUBLIC API                                                             */
    /* ---------------------------------------------------------------------- */

    return useMemo(
        () => ({
            state,

            // expose the wallet object
            wallet: state.wallet,

            current,
            exists,

            hasWallet,
            isEmpty,

            balance,
            availableBalance,
            lockedBalance,

            load,
            refresh,
            deposit,
            withdraw,
            transactions,

            reset,
            clearError,

            healthy,
            ready,

            information,
            diagnostics
        }),
        [
            state,

            current,
            exists,

            hasWallet,
            isEmpty,

            balance,
            availableBalance,
            lockedBalance,

            load,
            refresh,
            deposit,
            withdraw,
            transactions,

            reset,
            clearError,

            healthy,
            ready,

            information,
            diagnostics
        ]
    );
}