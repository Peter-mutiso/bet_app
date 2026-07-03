/**
 * ============================================================================
 * PROTECTED ROUTE
 * ============================================================================
 * Prevents unauthenticated users from accessing protected pages.
 * ============================================================================
 */

import {
    ReactNode,
    useEffect,
    useMemo
} from "react";

import { useRouter } from "next/router";

import {
    useAuth
} from "../hooks/useAuth";

/* -------------------------------------------------------------------------- */
/* PROPERTIES                                                                 */
/* -------------------------------------------------------------------------- */

export interface ProtectedRouteProps {

    readonly children: ReactNode;

    readonly redirectTo?: string;

    readonly requiredRole?: string;

    readonly requiredRoles?: readonly string[];

    readonly loadingComponent?: ReactNode;

    readonly unauthorizedComponent?: ReactNode;

    readonly onAuthorized?: () => void;

    readonly onUnauthorized?: () => void;

    readonly onRedirect?: () => void;

}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function ProtectedRoute({

    children,

    redirectTo = "/login",

    requiredRole,

    requiredRoles,

    loadingComponent,

    unauthorizedComponent,

    onAuthorized,

    onUnauthorized,

    onRedirect

}: ProtectedRouteProps) {

    const router = useRouter();

    const {

        isLoggedIn,

        ready,

        refresh,

        hasRole,

        hasAnyRole

    } = useAuth();

    /* ---------------------------------------------------------------------- */
    /* AUTHENTICATION                                                         */
    /* ---------------------------------------------------------------------- */

    const authenticated = useMemo(

        () => isLoggedIn,

        [isLoggedIn]

    );

    /* ---------------------------------------------------------------------- */
    /* AUTHORIZATION                                                          */
    /* ---------------------------------------------------------------------- */

    const authorized = useMemo(() => {

        if (!authenticated) {
            return false;
        }

        if (requiredRole) {
            return hasRole(requiredRole);
        }

        if (requiredRoles && requiredRoles.length > 0) {
            return hasAnyRole(...requiredRoles);
        }

        return true;

    }, [

        authenticated,

        requiredRole,

        requiredRoles,

        hasRole,

        hasAnyRole

    ]);

    /* ---------------------------------------------------------------------- */
    /* SESSION REFRESH                                                        */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        if (authenticated) {
            void refresh();
        }

    }, [

        authenticated,

        refresh

    ]);

    /* ---------------------------------------------------------------------- */
    /* REDIRECT IF NOT AUTHENTICATED                                          */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        if (!ready) {
            return;
        }

        if (!authenticated) {

            onRedirect?.();

            void router.replace(redirectTo);
        }

    }, [

        ready,

        authenticated,

        redirectTo,

        router,

        onRedirect

    ]);

    /* ---------------------------------------------------------------------- */
    /* CALLBACKS                                                              */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        if (!ready) {
            return;
        }

        if (!authenticated) {
            return;
        }

        if (!authorized) {

            onUnauthorized?.();

            return;
        }

        onAuthorized?.();

    }, [

        ready,

        authenticated,

        authorized,

        onAuthorized,

        onUnauthorized

    ]);

    /* ---------------------------------------------------------------------- */
    /* LOADING                                                                */
    /* ---------------------------------------------------------------------- */

    if (!ready) {

        return (

            <>

                {

                    loadingComponent ??

                    (

                        <div className="protected-route-loading">

                            Loading...

                        </div>

                    )

                }

            </>

        );

    }

    /* ---------------------------------------------------------------------- */
    /* WAIT DURING REDIRECT                                                   */
    /* ---------------------------------------------------------------------- */

    if (!authenticated) {

        return null;

    }

    /* ---------------------------------------------------------------------- */
    /* UNAUTHORIZED                                                           */
    /* ---------------------------------------------------------------------- */

    if (!authorized) {

        return (

            <>

                {

                    unauthorizedComponent ??

                    (

                        <div className="protected-route-unauthorized">

                            <h1>

                                403

                            </h1>

                            <p>

                                You do not have permission to access this page.

                            </p>

                        </div>

                    )

                }

            </>

        );

    }

    /* ---------------------------------------------------------------------- */
    /* AUTHORIZED                                                             */
    /* ---------------------------------------------------------------------- */

    return (

        <>

            {children}

        </>

    );

}