/**
 * ============================================================================
 * APPLICATION CONTEXT
 * ============================================================================
 * Provides application services throughout React.
 * ============================================================================
 */

import {

    createContext,

    ReactNode,

    useContext,

    useMemo

} from "react";

import {

    ServiceProvider,

    createServiceProvider

} from "../services/provider";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const configuration = {

    apiBaseUrl:

        import.meta.env

            .VITE_API_URL,

    websocketUrl:

        import.meta.env

            .VITE_WS_URL

};

/* -------------------------------------------------------------------------- */
/* CONTEXT                                                                    */
/* -------------------------------------------------------------------------- */

const AppContext =

    createContext<

        ServiceProvider |

        undefined

    >(

        undefined

    );

/* -------------------------------------------------------------------------- */
/* PROPERTIES                                                                 */
/* -------------------------------------------------------------------------- */

export interface AppProviderProps {

    readonly children:

    ReactNode;

}

/* -------------------------------------------------------------------------- */
/* PROVIDER                                                                   */
/* -------------------------------------------------------------------------- */

export function AppProvider(

    {

        children

    }:

    AppProviderProps

) {

    const services =

        useMemo(

            () =>

                createServiceProvider(

                    configuration

                ),

            []

        );

    return (

        <AppContext.Provider

            value={

                services

            }

        >

            {children}

        </AppContext.Provider>

    );

}
import {

    useEffect

} from "react";

/* -------------------------------------------------------------------------- */
/* APPLICATION STARTUP                                                        */
/* -------------------------------------------------------------------------- */

export function AppProvider(

    {

        children

    }:

    AppProviderProps

) {

    const services =

        useMemo(

            () =>

                createServiceProvider(

                    configuration

                ),

            []

        );

    useEffect(

        () => {

            let mounted = true;

            const start =

                async () => {

                    try {

                        await services.start();

                    }

                    catch (

                        error

                    ) {

                        console.error(

                            "Application startup failed.",

                            error

                        );

                    }

                };

            if (

                mounted

            ) {

                void start();

            }

            return () => {

                mounted = false;

                void services.stop();

            };

        },

        [

            services

        ]

    );

    return (

        <AppContext.Provider

            value={

                services

            }

        >

            {children}

        </AppContext.Provider>

    );

}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useApp():

ServiceProvider {

    const context =

        useContext(

            AppContext

        );

    if (

        !context

    ) {

        throw new Error(

            "useApp() must be used inside AppProvider."

        );

    }

    return context;

}