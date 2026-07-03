/**
 * ============================================================================
 * GUEST ROUTE
 * ============================================================================
 * Prevents authenticated users from accessing guest-only pages.
 * ============================================================================
 */

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";

/* -------------------------------------------------------------------------- */
/* PROPERTIES                                                                 */
/* -------------------------------------------------------------------------- */

export interface GuestRouteProps {
    readonly children: ReactNode;
    readonly redirectTo?: string;
    readonly loadingComponent?: ReactNode;
    readonly onGuest?: () => void;
    readonly onRedirect?: () => void;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function GuestRoute({
    children,
    redirectTo = "/dashboard",
    loadingComponent,
    onGuest,
    onRedirect,
}: GuestRouteProps) {

    const router = useRouter();

    const {
        isLoggedIn,
        ready,
        refresh,
    } = useAuth();

    /* ---------------------------------------------------------------------- */
    /* REFRESH SESSION                                                        */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        void refresh();
    }, [refresh]);

    /* ---------------------------------------------------------------------- */
    /* REDIRECT AUTHENTICATED USERS                                           */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        if (!ready) {
            return;
        }

        if (isLoggedIn) {

            onRedirect?.();

            void router.replace(redirectTo);

            return;
        }

        onGuest?.();

    }, [
        ready,
        isLoggedIn,
        redirectTo,
        router,
        onGuest,
        onRedirect,
    ]);

    /* ---------------------------------------------------------------------- */
    /* LOADING                                                                */
    /* ---------------------------------------------------------------------- */

    if (!ready) {
        return (
            <>
                {loadingComponent ?? (
                    <div className="guest-route-loading">
                        Loading...
                    </div>
                )}
            </>
        );
    }

    /* ---------------------------------------------------------------------- */
    /* WAIT DURING REDIRECT                                                   */
    /* ---------------------------------------------------------------------- */

    if (isLoggedIn) {
        return null;
    }

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    return <>{children}</>;
}