/**
 * ============================================================================
 * AUTHENTICATION SERVICE
 * ============================================================================
 * Handles user authentication and session management.
 * ============================================================================
 */

import {

    ApiClient

} from "./client";

/* -------------------------------------------------------------------------- */
/* USER                                                                       */
/* -------------------------------------------------------------------------- */

export interface AuthUser {

    readonly id: string;

    readonly username: string;

    readonly email: string;

    readonly firstName: string;

    readonly lastName: string;

    readonly roles: readonly string[];

}

/* -------------------------------------------------------------------------- */
/* LOGIN                                                                      */
/* -------------------------------------------------------------------------- */

export interface LoginRequest {

    readonly email: string;

    readonly password: string;

}

/* -------------------------------------------------------------------------- */
/* REGISTER                                                                   */
/* -------------------------------------------------------------------------- */

export interface RegisterRequest {

    readonly username: string;

    readonly email: string;

    readonly password: string;

    readonly firstName: string;

    readonly lastName: string;

}

/* -------------------------------------------------------------------------- */
/* AUTH RESPONSE                                                              */
/* -------------------------------------------------------------------------- */

export interface AuthResponse {

    readonly accessToken: string;

    readonly refreshToken: string;

    readonly user: AuthUser;

}

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface AuthConfiguration {

    readonly rememberSession: boolean;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface AuthMetrics {

    logins: number;

    logouts: number;

    registrations: number;

    refreshes: number;

}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export class AuthService {

    private currentUser?:

    AuthUser;

    private accessToken?:

    string;

    private refreshToken?:

    string;

    private readonly metrics:

    AuthMetrics = {

        logins: 0,

        logouts: 0,

        registrations: 0,

        refreshes: 0

    };

    constructor(

        private readonly api:

        ApiClient,

        private readonly configuration:

        AuthConfiguration

    ) {

    }

    public statistics():

    Readonly<AuthMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                              LOGIN                                         */
/* -------------------------------------------------------------------------- */

    public async login(

        request: LoginRequest

    ): Promise<AuthUser> {

        const response =

            await this.api.post<

                AuthResponse,

                LoginRequest

            >(

                "/auth/login",

                request

            );

        this.accessToken =

            response.data.accessToken;

        this.refreshToken =

            response.data.refreshToken;

        this.currentUser =

            response.data.user;

        this.api.setAuthorization(

            this.accessToken

        );

        this.metrics.logins++;

        return this.currentUser;

    }

/* -------------------------------------------------------------------------- */
/*                             REGISTER                                       */
/* -------------------------------------------------------------------------- */

    public async register(

        request: RegisterRequest

    ): Promise<AuthUser> {

        const response =

            await this.api.post<

                AuthResponse,

                RegisterRequest

            >(

                "/auth/register",

                request

            );

        this.accessToken =

            response.data.accessToken;

        this.refreshToken =

            response.data.refreshToken;

        this.currentUser =

            response.data.user;

        this.api.setAuthorization(

            this.accessToken

        );

        this.metrics.registrations++;

        return this.currentUser;

    }

/* -------------------------------------------------------------------------- */
/*                              LOGOUT                                        */
/* -------------------------------------------------------------------------- */

    public async logout():

    Promise<void> {

        try {

            await this.api.post(

                "/auth/logout",

                {}

            );

        }

        finally {

            this.currentUser =

                undefined;

            this.accessToken =

                undefined;

            this.refreshToken =

                undefined;

            this.api.clearAuthorization();

            this.metrics.logouts++;

        }

    }

/* -------------------------------------------------------------------------- */
/*                         CURRENT USER                                       */
/* -------------------------------------------------------------------------- */

    public user():

    AuthUser | undefined {

        return this.currentUser;

    }

/* -------------------------------------------------------------------------- */
/*                         AUTHENTICATED                                      */
/* -------------------------------------------------------------------------- */

    public authenticated():

    boolean {

        return (

            this.currentUser !==

            undefined &&

            this.accessToken !==

            undefined

        );

    }

/* -------------------------------------------------------------------------- */
/*                         ACCESS TOKEN                                       */
/* -------------------------------------------------------------------------- */

    public token():

    string | undefined {

        return this.accessToken;

    }

/* -------------------------------------------------------------------------- */
/*                       SESSION RESTORE                                      */
/* -------------------------------------------------------------------------- */

    public restore(

        response: AuthResponse

    ): void {

        this.accessToken =

            response.accessToken;

        this.refreshToken =

            response.refreshToken;

        this.currentUser =

            response.user;

        this.api.setAuthorization(

            response.accessToken

        );

    }

/* -------------------------------------------------------------------------- */
/*                         REFRESH TOKEN                                      */
/* -------------------------------------------------------------------------- */

    public async refresh():

    Promise<void> {

        if (

            !this.refreshToken

        ) {

            throw new Error(

                "No refresh token available."

            );

        }

        const response =

            await this.api.post<

                AuthResponse,

                { refreshToken: string }

            >(

                "/auth/refresh",

                {

                    refreshToken:

                        this.refreshToken

                }

            );

        this.accessToken =

            response.data.accessToken;

        this.refreshToken =

            response.data.refreshToken;

        this.currentUser =

            response.data.user;

        this.api.setAuthorization(

            this.accessToken

        );

        this.metrics.refreshes++;

    }

/* -------------------------------------------------------------------------- */
/*                              ROLES                                         */
/* -------------------------------------------------------------------------- */

    public hasRole(

        role: string

    ): boolean {

        return (

            this.currentUser?.roles.includes(

                role

            ) ?? false

        );

    }

/* -------------------------------------------------------------------------- */
/*                           PERMISSIONS                                      */
/* -------------------------------------------------------------------------- */

    public hasAnyRole(

        ...roles: string[]

    ): boolean {

        if (

            !this.currentUser

        ) {

            return false;

        }

        return roles.some(

            role =>

                this.currentUser!.roles.includes(

                    role

                )

        );

    }

/* -------------------------------------------------------------------------- */
/*                              HEALTH                                        */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.authenticated()

        );

    }

/* -------------------------------------------------------------------------- */
/*                           INFORMATION                                      */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            authenticated:

                this.authenticated(),

            user:

                this.currentUser,

            hasAccessToken:

                this.accessToken !==

                undefined,

            hasRefreshToken:

                this.refreshToken !==

                undefined,

            metrics:

                this.statistics()

        });

    }

/* -------------------------------------------------------------------------- */
/*                           DIAGNOSTICS                                      */
/* -------------------------------------------------------------------------- */

    public diagnostics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            healthy:

                this.healthy(),

            information:

                this.information()

        });

    }
    /* -------------------------------------------------------------------------- */
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.currentUser =

            undefined;

        this.accessToken =

            undefined;

        this.refreshToken =

            undefined;

        this.api.clearAuthorization();

        this.metrics.logins = 0;

        this.metrics.logouts = 0;

        this.metrics.registrations = 0;

        this.metrics.refreshes = 0;

    }

/* -------------------------------------------------------------------------- */
/*                         STATE HELPERS                                      */
/* -------------------------------------------------------------------------- */

    public isRunning():

    boolean {

        return this.healthy();

    }

    public isStopped():

    boolean {

        return !this.isRunning();

    }

/* -------------------------------------------------------------------------- */
/*                         CONFIGURATION                                      */
/* -------------------------------------------------------------------------- */

    public settings():

    Readonly<AuthConfiguration> {

        return Object.freeze({

            ...this.configuration

        });

    }

/* -------------------------------------------------------------------------- */
/*                            CLEANUP                                         */
/* -------------------------------------------------------------------------- */

    public destroy():

    void {

        this.reset();

    }

/* -------------------------------------------------------------------------- */
/*                             VERSION                                        */
/* -------------------------------------------------------------------------- */

    public static readonly VERSION =

        "1.0.0";

/* -------------------------------------------------------------------------- */
/*                             MODULE                                         */
/* -------------------------------------------------------------------------- */

    public static readonly MODULE =

        "Authentication Service";

}

/* -------------------------------------------------------------------------- */
/*                             FACTORY                                        */
/* -------------------------------------------------------------------------- */

export function createAuthService(

    api:

    ApiClient,

    configuration:

    AuthConfiguration

): AuthService {

    return new AuthService(

        api,

        configuration

    );

}