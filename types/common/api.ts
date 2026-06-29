/**
 * ============================================================================
 * API TYPES
 * ============================================================================
 * Shared API contracts for the entire application.
 *
 * Every service should use these interfaces instead of defining its own.
 *
 * Used by:
 * - Authentication
 * - Trading
 * - Wallet
 * - Market
 * - Analytics
 * - Notifications
 * - Admin
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                               API STATUS                                   */
/* -------------------------------------------------------------------------- */

export enum ApiStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    FAILED = "FAILED",
    WARNING = "WARNING",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
    SERVER_ERROR = "SERVER_ERROR"
}

/* -------------------------------------------------------------------------- */
/*                             HTTP METHODS                                   */
/* -------------------------------------------------------------------------- */

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

/* -------------------------------------------------------------------------- */
/*                             API METADATA                                   */
/* -------------------------------------------------------------------------- */

export interface ApiMetadata {

    requestId: string;

    timestamp: Date;

    version: string;

    executionTime: number;

    path: string;

    method: HttpMethod;
}

/* -------------------------------------------------------------------------- */
/*                             VALIDATION ERROR                               */
/* -------------------------------------------------------------------------- */

export interface ValidationError {

    field: string;

    message: string;

    value?: unknown;
}

export interface ApiError {

    code: string;

    message: string;

    status: ApiStatus;

    validationErrors?: ValidationError[];

    stack?: string;
}

/* -------------------------------------------------------------------------- */
/*                            SUCCESS RESPONSE                                */
/* -------------------------------------------------------------------------- */

export interface ApiSuccess<T> {

    success: true;

    status: ApiStatus.SUCCESS;

    message: string;

    data: T;

    metadata?: ApiMetadata;
}

/* -------------------------------------------------------------------------- */
/*                              ERROR RESPONSE                                */
/* -------------------------------------------------------------------------- */

export interface ApiFailure {

    success: false;

    status: Exclude<ApiStatus, ApiStatus.SUCCESS>;

    message: string;

    error: ApiError;

    metadata?: ApiMetadata;
}

/* -------------------------------------------------------------------------- */
/*                            GENERIC RESPONSE                                */
/* -------------------------------------------------------------------------- */

export type ApiResponse<T> =
    | ApiSuccess<T>
    | ApiFailure;

/* -------------------------------------------------------------------------- */
/*                           PAGINATED RESPONSE                               */
/* -------------------------------------------------------------------------- */

export interface PaginatedResponse<T> {

    success: boolean;

    status: ApiStatus;

    message: string;

    data: T[];

    total: number;

    page: number;

    pageSize: number;

    totalPages: number;

    hasNextPage: boolean;

    hasPreviousPage: boolean;

    metadata?: ApiMetadata;
}

/* -------------------------------------------------------------------------- */
/*                              API REQUEST                                   */
/* -------------------------------------------------------------------------- */

export interface ApiRequest<T = unknown> {

    body?: T;

    params?: Record<string, string>;

    query?: Record<string, unknown>;

    headers?: Record<string, string>;
}

/* -------------------------------------------------------------------------- */
/*                             REQUEST OPTIONS                                */
/* -------------------------------------------------------------------------- */

export interface RequestOptions {

    authenticated?: boolean;

    timeout?: number;

    retries?: number;

    cache?: boolean;

    cacheDuration?: number;

    signal?: AbortSignal;
}

/* -------------------------------------------------------------------------- */
/*                           REQUEST HEADERS                                  */
/* -------------------------------------------------------------------------- */

export interface ApiHeaders {

    authorization?: string;

    contentType?: string;

    accept?: string;

    language?: string;

    requestId?: string;

    clientVersion?: string;
}

/* -------------------------------------------------------------------------- */
/*                            FILE UPLOAD                                     */
/* -------------------------------------------------------------------------- */

export interface UploadedFile {

    id: string;

    name: string;

    size: number;

    mimeType: string;

    url: string;

    uploadedAt: Date;
}

export interface UploadResponse {

    success: boolean;

    files: UploadedFile[];

    message: string;
}

/* -------------------------------------------------------------------------- */
/*                             DOWNLOAD RESPONSE                              */
/* -------------------------------------------------------------------------- */

export interface DownloadResponse {

    filename: string;

    mimeType: string;

    size: number;

    downloadUrl: string;
}

/* -------------------------------------------------------------------------- */
/*                           HEALTH CHECK                                     */
/* -------------------------------------------------------------------------- */

export interface HealthCheck {

    service: string;

    status: "UP" | "DOWN";

    uptime: number;

    version: string;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                           RATE LIMIT                                       */
/* -------------------------------------------------------------------------- */

export interface RateLimit {

    limit: number;

    remaining: number;

    reset: number;
}

/* -------------------------------------------------------------------------- */
/*                          WEBSOCKET MESSAGE                                 */
/* -------------------------------------------------------------------------- */

export interface WebSocketMessage<T = unknown> {

    event: string;

    payload: T;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                           API ENDPOINT                                     */
/* -------------------------------------------------------------------------- */

export interface ApiEndpoint {

    name: string;

    path: string;

    method: HttpMethod;

    authenticated: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          DEFAULT REQUEST OPTIONS                           */
/* -------------------------------------------------------------------------- */

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {

    authenticated: true,

    timeout: 30000,

    retries: 3,

    cache: false,

    cacheDuration: 0
};

/* -------------------------------------------------------------------------- */
/*                             DEFAULT HEADERS                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_HEADERS: ApiHeaders = {

    contentType: "application/json",

    accept: "application/json",

    language: "en"
};

/* -------------------------------------------------------------------------- */
/*                             TYPE HELPERS                                   */
/* -------------------------------------------------------------------------- */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncResponse<T> = Promise<ApiResponse<T>>;

export type Dictionary<T> = Record<string, T>;