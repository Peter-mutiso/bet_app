export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface ApiClientConfiguration {
  readonly baseUrl: string;
  readonly timeout: number;
  readonly withCredentials: boolean;
}

export interface ApiRequest<T = unknown> {
  readonly method: HttpMethod;
  readonly path: string;
  readonly body?: T;
  readonly headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  readonly status: number;
  readonly success: boolean;
  readonly data: T;
}

export interface ApiMetrics {
  requests: number;
  successes: number;
  failures: number;
  lastRequest?: Date;
}

export class ApiClient {
  private readonly metrics: ApiMetrics = {
    requests: 0,
    successes: 0,
    failures: 0,
  };

  private authorization?: string;
  private readonly requestInterceptors: Array<(request: ApiRequest) => ApiRequest> = [];
  private readonly responseInterceptors: Array<<T>(response: ApiResponse<T>) => ApiResponse<T>> = [];

  constructor(private readonly configuration: ApiClientConfiguration) {}

  public async request<TResponse = unknown>(request: ApiRequest): Promise<ApiResponse<TResponse>> {
    this.metrics.requests++;
    this.metrics.lastRequest = new Date();

    const intercepted = this.requestInterceptors.reduce(
      (current, interceptor) => interceptor(current),
      request
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.configuration.timeout);

    try {
      const response = await fetch(`${this.configuration.baseUrl}${intercepted.path}`, {
        method: intercepted.method,
        headers: {
          "Content-Type": "application/json",
          ...(this.authorization ? { Authorization: `Bearer ${this.authorization}` } : {}),
          ...(intercepted.headers ?? {}),
        },
        body: intercepted.body ? JSON.stringify(intercepted.body) : undefined,
        credentials: this.configuration.withCredentials ? "include" : "same-origin",
        signal: controller.signal,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      const apiResponse: ApiResponse<TResponse> = {
        status: response.status,
        success: response.ok,
        data,
      };

      if (response.ok) {
        this.metrics.successes++;
      } else {
        this.metrics.failures++;
      }

      return this.responseInterceptors.reduce(
        (current, interceptor) => interceptor(current),
        apiResponse
      );
    } catch (error) {
      this.metrics.failures++;
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  public get<T = unknown>(path: string, headers?: Record<string, string>) {
    return this.request<T>({ method: HttpMethod.GET, path, headers });
  }

  public post<TResponse = unknown, TBody = unknown>(
    path: string,
    body: TBody,
    headers?: Record<string, string>
  ) {
    return this.request<TResponse>({ method: HttpMethod.POST, path, body, headers });
  }

  public put<TResponse = unknown, TBody = unknown>(
    path: string,
    body: TBody,
    headers?: Record<string, string>
  ) {
    return this.request<TResponse>({ method: HttpMethod.PUT, path, body, headers });
  }

  public patch<TResponse = unknown, TBody = unknown>(
    path: string,
    body: TBody,
    headers?: Record<string, string>
  ) {
    return this.request<TResponse>({ method: HttpMethod.PATCH, path, body, headers });
  }

  public delete<T = unknown>(path: string, headers?: Record<string, string>) {
    return this.request<T>({ method: HttpMethod.DELETE, path, headers });
  }

  public setAuthorization(token: string) {
    this.authorization = token;
  }

  public clearAuthorization() {
    this.authorization = undefined;
  }

  public addRequestInterceptor(interceptor: (request: ApiRequest) => ApiRequest) {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: <T>(response: ApiResponse<T>) => ApiResponse<T>) {
    this.responseInterceptors.push(interceptor);
  }

  public statistics(): Readonly<ApiMetrics> {
    return Object.freeze({ ...this.metrics });
  }

  public healthy() {
    return true;
  }

  public information(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      baseUrl: this.configuration.baseUrl,
      timeout: this.configuration.timeout,
      withCredentials: this.configuration.withCredentials,
      authorized: this.authorization !== undefined,
      metrics: this.statistics(),
    });
  }

  public diagnostics(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      healthy: this.healthy(),
      requestInterceptors: this.requestInterceptors.length,
      responseInterceptors: this.responseInterceptors.length,
      information: this.information(),
    });
  }

  public reset() {
    this.metrics.requests = 0;
    this.metrics.successes = 0;
    this.metrics.failures = 0;
    this.metrics.lastRequest = undefined;
    this.authorization = undefined;
    this.requestInterceptors.length = 0;
    this.responseInterceptors.length = 0;
  }

  public destroy() {
    this.reset();
  }
}

export function createApiClient(configuration: ApiClientConfiguration) {
  return new ApiClient(configuration);
}
