/**
 * ============================================================================
 * API CLIENT
 * ============================================================================
 * Central HTTP client for communicating with the backend.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/* HTTP METHOD                                                                */
/* -------------------------------------------------------------------------- */

export enum HttpMethod {

    GET = "GET",

    POST = "POST",

    PUT = "PUT",

    PATCH = "PATCH",

    DELETE = "DELETE"

}

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface ApiClientConfiguration {

    readonly baseUrl: string;

    readonly timeout: number;

    readonly withCredentials: boolean;

}

/* -------------------------------------------------------------------------- */
/* REQUEST                                                                    */
/* -------------------------------------------------------------------------- */

export interface ApiRequest<T = unknown> {

    readonly method: HttpMethod;

    readonly path: string;

    readonly body?: T;

    readonly headers?: Record<string, string>;

}

/* -------------------------------------------------------------------------- */
/* RESPONSE                                                                   */
/* -------------------------------------------------------------------------- */

export interface ApiResponse<T = unknown> {

    readonly status: number;

    readonly success: boolean;

    readonly data: T;

}

/* -------------------------------------------------------------------------- */
/* METRICS                                                                    */
/* -------------------------------------------------------------------------- */

export interface ApiMetrics {

    requests: number;

    successes: number;

    failures: number;

    lastRequest?: Date;

}

/* -------------------------------------------------------------------------- */
/* CLIENT                                                                     */
/* -------------------------------------------------------------------------- */

export class ApiClient {

    private readonly metrics: ApiMetrics = {

        requests: 0,

        successes: 0,

        failures: 0

    };

    constructor(

        private readonly configuration:

        ApiClientConfiguration

    ) {

    }

    public statistics():

    Readonly<ApiMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                           REQUEST                                          */
/* -------------------------------------------------------------------------- */

    public async request<TResponse = unknown>(

        request: ApiRequest

    ): Promise<ApiResponse<TResponse>> {

        this.metrics.requests++;

        this.metrics.lastRequest =

            new Date();

        try {

            const controller =

                new AbortController();

            const timeout =

                setTimeout(

                    () => controller.abort(),

                    this.configuration.timeout

                );

            const response =

                await fetch(

                    `${this.configuration.baseUrl}${request.path}`,

                    {

                        method:

                            request.method,

                        headers: {

                            "Content-Type":

                                "application/json",

                            ...(request.headers ?? {})

                        },

                        body:

                            request.body

                                ? JSON.stringify(

                                      request.body

                                  )

                                : undefined,

                        credentials:

                            this.configuration.withCredentials

                                ? "include"

                                : "same-origin",

                        signal:

                            controller.signal

                    }

                );

            clearTimeout(

                timeout

            );

            const data =

                await response.json();

            if (

                response.ok

            ) {

                this.metrics.successes++;

            }

            else {

                this.metrics.failures++;

            }

            return {

                status:

                    response.status,

                success:

                    response.ok,

                data

            };

        }

        catch (

            error

        ) {

            this.metrics.failures++;

            throw error;

        }

    }

/* -------------------------------------------------------------------------- */
/*                               GET                                          */
/* -------------------------------------------------------------------------- */

    public get<T = unknown>(

        path: string,

        headers?: Record<string, string>

    ) {

        return this.request<T>({

            method:

                HttpMethod.GET,

            path,

            headers

        });

    }

/* -------------------------------------------------------------------------- */
/*                               POST                                         */
/* -------------------------------------------------------------------------- */

    public post<TResponse = unknown, TBody = unknown>(

        path: string,

        body: TBody,

        headers?: Record<string, string>

    ) {

        return this.request<TResponse>({

            method:

                HttpMethod.POST,

            path,

            body,

            headers

        });

    }

/* -------------------------------------------------------------------------- */
/*                                PUT                                         */
/* -------------------------------------------------------------------------- */

    public put<TResponse = unknown, TBody = unknown>(

        path: string,

        body: TBody,

        headers?: Record<string, string>

    ) {

        return this.request<TResponse>({

            method:

                HttpMethod.PUT,

            path,

            body,

            headers

        });

    }

/* -------------------------------------------------------------------------- */
/*                               PATCH                                        */
/* -------------------------------------------------------------------------- */

    public patch<TResponse = unknown, TBody = unknown>(

        path: string,

        body: TBody,

        headers?: Record<string, string>

    ) {

        return this.request<TResponse>({

            method:

                HttpMethod.PATCH,

            path,

            body,

            headers

        });

    }

/* -------------------------------------------------------------------------- */
/*                              DELETE                                        */
/* -------------------------------------------------------------------------- */

    public delete<T = unknown>(

        path: string,

        headers?: Record<string, string>

    ) {

        return this.request<T>({

            method:

                HttpMethod.DELETE,

            path,

            headers

        });

    }
    /* -------------------------------------------------------------------------- */
/*                          DEFAULT HEADERS                                  */
/* -------------------------------------------------------------------------- */

    private readonly defaultHeaders:

    Record<string, string> = {

        "Content-Type":

            "application/json"

    };

    private authorization?:

    string;

/* -------------------------------------------------------------------------- */
/*                          INTERCEPTORS                                     */
/* -------------------------------------------------------------------------- */

    private readonly requestInterceptors:

    Array<

        (request: ApiRequest) => ApiRequest

    > = [];

    private readonly responseInterceptors:

    Array<

        <T>(response: ApiResponse<T>) => ApiResponse<T>

    > = [];

/* -------------------------------------------------------------------------- */
/*                     AUTHORIZATION TOKEN                                   */
/* -------------------------------------------------------------------------- */

    public setAuthorization(

        token: string

    ): void {

        this.authorization = token;

    }

    public clearAuthorization():

    void {

        this.authorization = undefined;

    }

/* -------------------------------------------------------------------------- */
/*                       REQUEST INTERCEPTOR                                 */
/* -------------------------------------------------------------------------- */

    public addRequestInterceptor(

        interceptor:

        (request: ApiRequest) => ApiRequest

    ): void {

        this.requestInterceptors.push(

            interceptor

        );

    }

/* -------------------------------------------------------------------------- */
/*                      RESPONSE INTERCEPTOR                                */
/* -------------------------------------------------------------------------- */

    public addResponseInterceptor(

        interceptor:

        <T>(response: ApiResponse<T>) => ApiResponse<T>

    ): void {

        this.responseInterceptors.push(

            interceptor

        );

    }

/* -------------------------------------------------------------------------- */
/*                          HEALTH                                           */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return true;

    }

/* -------------------------------------------------------------------------- */
/*                        INFORMATION                                        */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            baseUrl:

                this.configuration.baseUrl,

            timeout:

                this.configuration.timeout,

            withCredentials:

                this.configuration.withCredentials,

            authorized:

                this.authorization !==

                undefined,

            metrics:

                this.statistics()

        });

    }

/* -------------------------------------------------------------------------- */
/*                        DIAGNOSTICS                                        */
/* -------------------------------------------------------------------------- */

    public diagnostics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            healthy:

                this.healthy(),

            requestInterceptors:

                this.requestInterceptors.length,

            responseInterceptors:

                this.responseInterceptors.length,

            information:

                this.information()

        });

    }
    /* -------------------------------------------------------------------------- */
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset():

    void {

        this.metrics.requests = 0;

        this.metrics.successes = 0;

        this.metrics.failures = 0;

        this.metrics.lastRequest =

            undefined;

        this.authorization =

            undefined;

        this.requestInterceptors.length = 0;

        this.responseInterceptors.length = 0;

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

        "API Client";

}

/* -------------------------------------------------------------------------- */
/*                             FACTORY                                        */
/* -------------------------------------------------------------------------- */

export function createApiClient(

    configuration:

    ApiClientConfiguration

): ApiClient {

    return new ApiClient(

        configuration

    );

}