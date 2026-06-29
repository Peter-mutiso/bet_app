/**
 * ============================================================================
 * BETS HOOK
 * ============================================================================
 * React hook for bet management.
 * ============================================================================
 */

import {

    useState,

    useMemo,

    useCallback

} from "react";

import {

    Bet,

    BetStatus,

    PlaceBetRequest,

    CashOutResponse

} from "../services/api/bet";

import {

    useApp

} from "../contexts/AppContext";

/* -------------------------------------------------------------------------- */
/* STATE                                                                      */
/* -------------------------------------------------------------------------- */

export interface UseBetsState {

    readonly active:

    readonly Bet[];

    readonly loading:

    boolean;

    readonly error?:

    Error;

}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useBets() {

    const {

        bets

    } =

        useApp();

    const [

        loading,

        setLoading

    ] =

        useState(

            false

        );

    const [

        error,

        setError

    ] =

        useState<

            Error |

            undefined

        >();

    const state =

        useMemo<

            UseBetsState

        >(

            () => ({

                active:

                    bets.activeBets(),

                loading,

                error

            }),

            [

                bets,

                loading,

                error

            ]

        );

    return {

        bets,

        state,

        setLoading,

        setError

    };

}
/* -------------------------------------------------------------------------- */
/*                             PLACE BET                                      */
/* -------------------------------------------------------------------------- */

    const place =

        useCallback(

            async (

                request:

                PlaceBetRequest

            ): Promise<Bet> => {

                try {

                    setLoading(

                        true

                    );

                    setError(

                        undefined

                    );

                    return await bets.place(

                        request

                    );

                }

                catch (

                    exception

                ) {

                    const error =

                        exception instanceof Error

                            ? exception

                            : new Error(

                                "Failed to place bet."

                            );

                    setError(

                        error

                    );

                    throw error;

                }

                finally {

                    setLoading(

                        false

                    );

                }

            },

            [

                bets

            ]

        );

/* -------------------------------------------------------------------------- */
/*                         LOAD ACTIVE BETS                                   */
/* -------------------------------------------------------------------------- */

    const loadActive =

        useCallback(

            async ():

            Promise<readonly Bet[]> => {

                try {

                    setLoading(

                        true

                    );

                    setError(

                        undefined

                    );

                    return await bets.loadActive();

                }

                catch (

                    exception

                ) {

                    const error =

                        exception instanceof Error

                            ? exception

                            : new Error(

                                "Failed to load active bets."

                            );

                    setError(

                        error

                    );

                    throw error;

                }

                finally {

                    setLoading(

                        false

                    );

                }

            },

            [

                bets

            ]

        );

/* -------------------------------------------------------------------------- */
/*                          BET HISTORY                                       */
/* -------------------------------------------------------------------------- */

    const history =

        useCallback(

            async ():

            Promise<readonly Bet[]> => {

                try {

                    setLoading(

                        true

                    );

                    setError(

                        undefined

                    );

                    return await bets.history();

                }

                catch (

                    exception

                ) {

                    const error =

                        exception instanceof Error

                            ? exception

                            : new Error(

                                "Failed to load bet history."

                            );

                    setError(

                        error

                    );

                    throw error;

                }

                finally {

                    setLoading(

                        false

                    );

                }

            },

            [

                bets

            ]

        );

/* -------------------------------------------------------------------------- */
/*                           CANCEL BET                                       */
/* -------------------------------------------------------------------------- */

    const cancel =

        useCallback(

            async (

                betId: string

            ): Promise<Bet> => {

                try {

                    setLoading(

                        true

                    );

                    setError(

                        undefined

                    );

                    return await bets.cancel(

                        betId

                    );

                }

                catch (

                    exception

                ) {

                    const error =

                        exception instanceof Error

                            ? exception

                            : new Error(

                                "Failed to cancel bet."

                            );

                    setError(

                        error

                    );

                    throw error;

                }

                finally {

                    setLoading(

                        false

                    );

                }

            },

            [

                bets

            ]

        );

/* -------------------------------------------------------------------------- */
/*                           CASH OUT                                         */
/* -------------------------------------------------------------------------- */

    const cashOut =

        useCallback(

            async (

                betId: string

            ): Promise<CashOutResponse> => {

                try {

                    setLoading(

                        true

                    );

                    setError(

                        undefined

                    );

                    return await bets.cashOut(

                        betId

                    );

                }

                catch (

                    exception

                ) {

                    const error =

                        exception instanceof Error

                            ? exception

                            : new Error(

                                "Cash out failed."

                            );

                    setError(

                        error

                    );

                    throw error;

                }

                finally {

                    setLoading(

                        false

                    );

                }

            },

            [

                bets

            ]

        );

/* -------------------------------------------------------------------------- */
/*                          CLEAR ERROR                                       */
/* -------------------------------------------------------------------------- */

    const clearError =

        useCallback(

            () => {

                setError(

                    undefined

                );

            },

            []

        );
        /* -------------------------------------------------------------------------- */
/*                            FIND BET                                        */
/* -------------------------------------------------------------------------- */

    const find =

        useCallback(

            (

                betId: string

            ): Bet | undefined =>

                bets.find(

                    betId

                ),

            [

                bets

            ]

        );

/* -------------------------------------------------------------------------- */
/*                        STATUS FILTERS                                      */
/* -------------------------------------------------------------------------- */

    const byStatus =

        useCallback(

            (

                status:

                BetStatus

            ): readonly Bet[] =>

                bets.byStatus(

                    status

                ),

            [

                bets

            ]

        );

    const openBets =

        useMemo(

            () =>

                bets.openBets(),

            [

                bets,

                state

            ]

        );

    const pendingBets =

        useMemo(

            () =>

                bets.pendingBets(),

            [

                bets,

                state

            ]

        );

/* -------------------------------------------------------------------------- */
/*                         DERIVED STATE                                      */
/* -------------------------------------------------------------------------- */

    const hasActiveBets =

        useMemo(

            () =>

                state.active.length >

                0,

            [

                state.active

            ]

        );

    const activeCount =

        useMemo(

            () =>

                state.active.length,

            [

                state.active

            ]

        );

/* -------------------------------------------------------------------------- */
/*                           HEALTH                                           */
/* -------------------------------------------------------------------------- */

    const healthy =

        useMemo(

            () =>

                bets.healthy(),

            [

                bets,

                state

            ]

        );

    const ready =

        useMemo(

            () =>

                !state.loading,

            [

                state.loading

            ]

        );

/* -------------------------------------------------------------------------- */
/*                        INFORMATION                                         */
/* -------------------------------------------------------------------------- */

    const information =

        useMemo(

            () =>

                bets.information(),

            [

                bets,

                state

            ]

        );

/* -------------------------------------------------------------------------- */
/*                        DIAGNOSTICS                                         */
/* -------------------------------------------------------------------------- */

    const diagnostics =

        useMemo(

            () =>

                bets.diagnostics(),

            [

                bets,

                state

            ]

        );
        /* -------------------------------------------------------------------------- */
/*                           CURRENT BETS                                     */
/* -------------------------------------------------------------------------- */

    const current =

        useCallback(

            () =>

                bets.activeBets(),

            [

                bets

            ]

        );

/* -------------------------------------------------------------------------- */
/*                         RESET                                              */
/* -------------------------------------------------------------------------- */

    const reset =

        useCallback(

            () => {

                clearError();

            },

            [

                clearError

            ]

        );

/* -------------------------------------------------------------------------- */
/*                         PUBLIC API                                         */
/* -------------------------------------------------------------------------- */

    return useMemo(

        () => ({

            /* State */

            state,

            current,

            hasActiveBets,

            activeCount,

            openBets,

            pendingBets,

            /* Queries */

            find,

            byStatus,

            /* Operations */

            place,

            loadActive,

            history,

            cancel,

            cashOut,

            /* Utilities */

            reset,

            clearError,

            /* Monitoring */

            healthy,

            ready,

            information,

            diagnostics

        }),

        [

            state,

            current,

            hasActiveBets,

            activeCount,

            openBets,

            pendingBets,

            find,

            byStatus,

            place,

            loadActive,

            history,

            cancel,

            cashOut,

            reset,

            clearError,

            healthy,

            ready,

            information,

            diagnostics

        ]

    );

}