/**
 * ============================================================================
 * AUTH HOOK
 * ============================================================================
 */

import {
    useCallback,
    useMemo,
    useState
} from "react";

import {
    LoginRequest,
    RegisterRequest,
    AuthUser
} from "../services/api/auth";

import {
    useApp
} from "../contexts/AppContext";

export interface UseAuth {

    readonly user?: AuthUser;

    readonly loading: boolean;

    readonly error?: Error;

    readonly isLoggedIn: boolean;

    readonly isGuest: boolean;

    login(
        request: LoginRequest
    ): Promise<AuthUser>;

    register(
        request: RegisterRequest
    ): Promise<AuthUser>;

    logout(): Promise<void>;

    refresh(): Promise<void>;

    forgotPassword(
        email: string
    ): Promise<void>;

    resetPassword(
        token: string,
        password: string
    ): Promise<void>;

    verifyEmail(
        token: string
    ): Promise<void>;

    clearError(): void;

    reset(): void;

    hasRole(
        role: string
    ): boolean;

    hasAnyRole(
        ...roles: string[]
    ): boolean;

    authenticated(): boolean;

    currentUser(): AuthUser | undefined;

    readonly ready: boolean;

    readonly healthy: boolean;

    readonly diagnostics: Readonly<Record<string, unknown>>;

    readonly information: Readonly<Record<string, unknown>>;
}

export function useAuth(): UseAuth {

    const {
        auth
    } = useApp();

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState<Error>();

    /* ---------------------------------------------------------------------- */
    /* LOGIN                                                                   */
    /* ---------------------------------------------------------------------- */

    const login = useCallback(

        async (
            request: LoginRequest
        ) => {

            setLoading(true);
            setError(undefined);

            try {

                return await auth.login(request);

            }

            catch (exception) {

                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Login failed.");

                setError(err);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [auth]

    );

    /* ---------------------------------------------------------------------- */
    /* REGISTER                                                                */
    /* ---------------------------------------------------------------------- */

    const register = useCallback(

        async (
            request: RegisterRequest
        ) => {

            setLoading(true);
            setError(undefined);

            try {

                return await auth.register(request);

            }

            catch (exception) {

                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Registration failed.");

                setError(err);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [auth]

    );

    /* ---------------------------------------------------------------------- */
    /* LOGOUT                                                                  */
    /* ---------------------------------------------------------------------- */

    const logout = useCallback(

        async () => {

            setLoading(true);
            setError(undefined);

            try {

                await auth.logout();

            }

            catch (exception) {

                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Logout failed.");

                setError(err);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [auth]

    );

    /* ---------------------------------------------------------------------- */
    /* REFRESH                                                                 */
    /* ---------------------------------------------------------------------- */

    const refresh = useCallback(

        async () => {

            setLoading(true);
            setError(undefined);

            try {

                await auth.refresh();

            }

            catch (exception) {

                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Session refresh failed.");

                setError(err);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [auth]

    );

    /* ---------------------------------------------------------------------- */
    /* FORGOT PASSWORD                                                         */
    /* ---------------------------------------------------------------------- */

    const forgotPassword = useCallback(

        async (
            email: string
        ) => {

            setLoading(true);
            setError(undefined);

            try {

                await auth.forgotPassword(email);

            }

            catch (exception) {

                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Password reset request failed.");

                setError(err);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [auth]

    );

    /* ---------------------------------------------------------------------- */
    /* RESET PASSWORD                                                          */
    /* ---------------------------------------------------------------------- */

    const resetPassword = useCallback(

        async (
            token: string,
            password: string
        ) => {

            setLoading(true);
            setError(undefined);

            try {

                await auth.resetPassword(
                    token,
                    password
                );

            }

            catch (exception) {

                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Password reset failed.");

                setError(err);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [auth]

    );

    /* ---------------------------------------------------------------------- */
    /* VERIFY EMAIL                                                            */
    /* ---------------------------------------------------------------------- */

    const verifyEmail = useCallback(

        async (
            token: string
        ) => {

            setLoading(true);
            setError(undefined);

            try {

                await auth.verifyEmail(token);

            }

            catch (exception) {

                const err =
                    exception instanceof Error
                        ? exception
                        : new Error("Email verification failed.");

                setError(err);

                throw err;

            }

            finally {

                setLoading(false);

            }

        },

        [auth]

    );

    /* ---------------------------------------------------------------------- */
    /* HELPERS                                                                 */
    /* ---------------------------------------------------------------------- */

    const clearError = useCallback(

        () => {

            setError(undefined);

        },

        []

    );

    const reset = useCallback(

        () => {

            clearError();

        },

        [clearError]

    );

    const hasRole = useCallback(

        (role: string) => auth.hasRole(role),

        [auth]

    );

    const hasAnyRole = useCallback(

        (...roles: string[]) => auth.hasAnyRole(...roles),

        [auth]

    );

    const authenticated = useCallback(

        () => auth.authenticated(),

        [auth]

    );

    const currentUser = useCallback(

        () => auth.user(),

        [auth]

    );

    const user = useMemo(

        () => auth.user(),

        [auth, loading]

    );

    const isLoggedIn = useMemo(

        () => auth.authenticated(),

        [auth, loading]

    );

    const ready = useMemo(

        () => !loading,

        [loading]

    );

    const healthy = useMemo(

        () => auth.healthy(),

        [auth, loading]

    );

    const diagnostics = useMemo(

        () => auth.diagnostics(),

        [auth, loading]

    );

    const information = useMemo(

        () => auth.information(),

        [auth, loading]

    );

    /* ---------------------------------------------------------------------- */
    /* RETURN                                                                  */
    /* ---------------------------------------------------------------------- */

    return {

        user,

        loading,

        error,

        isLoggedIn,

        isGuest: !isLoggedIn,

        login,

        register,

        logout,

        refresh,

        forgotPassword,

        resetPassword,

        verifyEmail,

        clearError,

        reset,

        hasRole,

        hasAnyRole,

        authenticated,

        currentUser,

        ready,

        healthy,

        diagnostics,

        information

    };

}