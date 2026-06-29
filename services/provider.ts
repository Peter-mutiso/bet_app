/**
 * ============================================================================
 * SERVICE PROVIDER
 * ============================================================================
 * Central dependency container for the application.
 * ============================================================================
 */

import {

    ApiClient,

    createApiClient

} from "./api/client";

import {

    AuthService,

    createAuthService

} from "./api/auth";

import {

    WalletService,

    createWalletService

} from "./api/wallet";

import {

    BetService,

    createBetService

} from "./api/bet";

import {

    DerivWebSocketClient,

    createDerivWebSocketClient

} from "./websocket/client";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface ServiceProviderConfiguration {

    readonly apiBaseUrl: string;

    readonly websocketUrl: string;

}

/* -------------------------------------------------------------------------- */
/* PROVIDER                                                                   */
/* -------------------------------------------------------------------------- */

export class ServiceProvider {

    public readonly api:

    ApiClient;

    public readonly websocket:

    DerivWebSocketClient;

    public readonly auth:

    AuthService;

    public readonly wallet:

    WalletService;

    public readonly bets:

    BetService;

    constructor(

        configuration:

        ServiceProviderConfiguration

    ) {

        this.api =

            createApiClient({

                baseUrl:

                    configuration.apiBaseUrl,

                timeout:

                    30000,

                withCredentials:

                    true

            });

        this.websocket =

            createDerivWebSocketClient({

                endpoint:

                    configuration.websocketUrl,

                reconnect:

                    true,

                reconnectInterval:

                    5000,

                heartbeatInterval:

                    30000

            });

        this.auth =

            createAuthService(

                this.api,

                {

                    rememberSession:

                        true

                }

            );

        this.wallet =

            createWalletService(

                this.api,

                {

                    autoRefresh:

                        true,

                    refreshInterval:

                        30000

                }

            );

        this.bets =

            createBetService(

                this.api,

                this.wallet,

                {

                    validateStake:

                        true,

                    minimumStake:

                        1,

                    maximumStake:

                        100000

                }

            );

    }

}
/* -------------------------------------------------------------------------- */
/*                           STATE                                            */
/* -------------------------------------------------------------------------- */

    private initialized = false;

    private running = false;

/* -------------------------------------------------------------------------- */
/*                        INITIALIZATION                                      */
/* -------------------------------------------------------------------------- */

    public async initialize():

    Promise<void> {

        if (

            this.initialized

        ) {

            return;

        }

        this.initialized = true;

    }

/* -------------------------------------------------------------------------- */
/*                             START                                          */
/* -------------------------------------------------------------------------- */

    public async start():

    Promise<void> {

        if (

            this.running

        ) {

            return;

        }

        await this.initialize();

        await this.websocket.connect();

        if (

            this.auth.authenticated()

        ) {

            await this.wallet.load();

            await this.bets.loadActive();

        }

        this.running = true;

    }

/* -------------------------------------------------------------------------- */
/*                              STOP                                          */
/* -------------------------------------------------------------------------- */

    public async stop():

    Promise<void> {

        if (

            !this.running

        ) {

            return;

        }

        this.wallet.stopAutoRefresh();

        this.websocket.disconnect();

        this.running = false;

    }

/* -------------------------------------------------------------------------- */
/*                            RESTART                                         */
/* -------------------------------------------------------------------------- */

    public async restart():

    Promise<void> {

        await this.stop();

        await this.start();

    }

/* -------------------------------------------------------------------------- */
/*                         INITIALIZED                                        */
/* -------------------------------------------------------------------------- */

    public initializedState():

    boolean {

        return this.initialized;

    }

/* -------------------------------------------------------------------------- */
/*                           RUNNING                                          */
/* -------------------------------------------------------------------------- */

    public runningState():

    boolean {

        return this.running;

    }

    /* -------------------------------------------------------------------------- */
/*                              HEALTH                                        */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.initialized &&

            this.running &&

            this.websocket.healthy()

        );

    }

/* -------------------------------------------------------------------------- */
/*                           INFORMATION                                      */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            initialized:

                this.initialized,

            running:

                this.running,

            services: {

                api:

                    this.api.information(),

                websocket:

                    this.websocket.information(),

                auth:

                    this.auth.information(),

                wallet:

                    this.wallet.information(),

                bets:

                    this.bets.information()

            }

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

            services: {

                api:

                    this.api.diagnostics(),

                websocket:

                    this.websocket.diagnostics(),

                auth:

                    this.auth.diagnostics(),

                wallet:

                    this.wallet.diagnostics(),

                bets:

                    this.bets.diagnostics()

            }

        });

    }

/* -------------------------------------------------------------------------- */
/*                               RESET                                        */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.auth.reset();

        this.wallet.reset();

        this.bets.reset();

        this.api.reset();

        this.initialized = false;

        this.running = false;

    }

/* -------------------------------------------------------------------------- */
/*                              DESTROY                                       */
/* -------------------------------------------------------------------------- */

    public destroy():

    void {

        this.stop();

        this.websocket.destroy();

        this.auth.destroy();

        this.wallet.destroy();

        this.bets.destroy();

        this.api.destroy();

        this.initialized = false;

        this.running = false;

    }

/* -------------------------------------------------------------------------- */
/*                              VERSION                                       */
/* -------------------------------------------------------------------------- */

    public static readonly VERSION =

        "1.0.0";

/* -------------------------------------------------------------------------- */
/*                               MODULE                                       */
/* -------------------------------------------------------------------------- */

    public static readonly MODULE =

        "Application Service Provider";

}

/* -------------------------------------------------------------------------- */
/*                           SINGLETON                                        */
/* -------------------------------------------------------------------------- */

let provider:

ServiceProvider | undefined;

/* -------------------------------------------------------------------------- */
/*                              FACTORY                                       */
/* -------------------------------------------------------------------------- */

export function createServiceProvider(

    configuration:

    ServiceProviderConfiguration

): ServiceProvider {

    return new ServiceProvider(

        configuration

    );

}

/* -------------------------------------------------------------------------- */
/*                          SINGLETON FACTORY                                 */
/* -------------------------------------------------------------------------- */

export function serviceProvider(

    configuration:

    ServiceProviderConfiguration

): ServiceProvider {

    if (

        !provider

    ) {

        provider =

            createServiceProvider(

                configuration

            );

    }

    return provider;

}
/* -------------------------------------------------------------------------- */
/*                           CONFIGURATION                                    */
/* -------------------------------------------------------------------------- */

    public configuration():

    Readonly<ServiceProviderConfiguration> {

        return Object.freeze({

            apiBaseUrl:

                this.api.information()

                    .baseUrl as string,

            websocketUrl:

                this.websocket.information()

                    .endpoint as string

        });

    }

/* -------------------------------------------------------------------------- */
/*                         SERVICE ACCESSORS                                  */
/* -------------------------------------------------------------------------- */

    public services() {

        return Object.freeze({

            api:

                this.api,

            websocket:

                this.websocket,

            auth:

                this.auth,

            wallet:

                this.wallet,

            bets:

                this.bets

        });

    }

/* -------------------------------------------------------------------------- */
/*                          APPLICATION READY                                 */
/* -------------------------------------------------------------------------- */

    public ready():

    boolean {

        return (

            this.initializedState() &&

            this.runningState() &&

            this.healthy()

        );

    }

/* -------------------------------------------------------------------------- */
/*                        SERVICE COUNT                                       */
/* -------------------------------------------------------------------------- */

    public serviceCount():

    number {

        return 5;

    }

/* -------------------------------------------------------------------------- */
/*                          TO JSON                                           */
/* -------------------------------------------------------------------------- */

    public toJSON() {

        return {

            initialized:

                this.initializedState(),

            running:

                this.runningState(),

            healthy:

                this.healthy(),

            services:

                this.serviceCount(),

            version:

                ServiceProvider.VERSION,

            module:

                ServiceProvider.MODULE

        };

    }

/* -------------------------------------------------------------------------- */
/*                            END OF CLASS                                    */
/* -------------------------------------------------------------------------- */

}