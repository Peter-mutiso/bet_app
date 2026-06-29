/**
 * ============================================================================
 * PAGINATION TYPES
 * ============================================================================
 * Shared pagination, sorting, searching and filtering models.
 *
 * Used by:
 * - Wallet
 * - Trading
 * - Market
 * - Notifications
 * - Analytics
 * - Admin
 * ============================================================================
 */

import { SortDirection } from "./enums";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum PaginationMode {

    OFFSET = "OFFSET",

    CURSOR = "CURSOR"
}

export enum SearchMode {

    EXACT = "EXACT",

    PARTIAL = "PARTIAL",

    STARTS_WITH = "STARTS_WITH",

    ENDS_WITH = "ENDS_WITH"
}

export enum FilterLogic {

    AND = "AND",

    OR = "OR"
}

/* -------------------------------------------------------------------------- */
/*                          PAGINATION REQUEST                                */
/* -------------------------------------------------------------------------- */

export interface PaginationRequest {

    page: number;

    pageSize: number;
}

/* -------------------------------------------------------------------------- */
/*                              PAGE INFO                                     */
/* -------------------------------------------------------------------------- */

export interface PageInfo {

    page: number;

    pageSize: number;

    totalItems: number;

    totalPages: number;

    hasPreviousPage: boolean;

    hasNextPage: boolean;

    isFirstPage: boolean;

    isLastPage: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             OFFSET PAGINATION                              */
/* -------------------------------------------------------------------------- */

export interface OffsetPagination {

    offset: number;

    limit: number;
}

/* -------------------------------------------------------------------------- */
/*                             CURSOR PAGINATION                              */
/* -------------------------------------------------------------------------- */

export interface CursorPagination {

    cursor?: string;

    nextCursor?: string;

    previousCursor?: string;

    limit: number;
}

/* -------------------------------------------------------------------------- */
/*                           PAGINATED RESULT                                 */
/* -------------------------------------------------------------------------- */

export interface PaginatedResult<T> {

    items: T[];

    pageInfo: PageInfo;
}

/* -------------------------------------------------------------------------- */
/*                               SORT                                         */
/* -------------------------------------------------------------------------- */

export interface Sort {

    field: string;

    direction: SortDirection;
}

/* -------------------------------------------------------------------------- */
/*                           MULTIPLE SORT                                    */
/* -------------------------------------------------------------------------- */

export interface MultiSort {

    sorts: Sort[];
}

/* -------------------------------------------------------------------------- */
/*                             SEARCH                                         */
/* -------------------------------------------------------------------------- */

export interface Search {

    keyword: string;

    mode: SearchMode;
}

/* -------------------------------------------------------------------------- */
/*                               FILTERS                                      */
/* -------------------------------------------------------------------------- */

export interface Filter {

    field: string;

    import { FilterOperator } from "./enums";

    operator: FilterOperator;

    value: unknown;
}

export interface FilterGroup {

    logic: FilterLogic;

    filters: Filter[];
}

export interface DateRangeFilter {

    from?: Date;

    to?: Date;
}

export interface NumberRangeFilter {

    minimum?: number;

    maximum?: number;
}

export interface BooleanFilter {

    value: boolean;
}

export interface StringFilter {

    value: string;

    caseSensitive?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         QUERY OPTIONS                                      */
/* -------------------------------------------------------------------------- */

export interface QueryOptions {

    pagination?: PaginationRequest;

    sort?: Sort;

    multiSort?: MultiSort;

    search?: Search;

    filters?: FilterGroup[];
}

/* -------------------------------------------------------------------------- */
/*                          PAGINATION RESPONSE                               */
/* -------------------------------------------------------------------------- */

export interface PaginationResponse<T> {

    items: T[];

    pageInfo: PageInfo;

    executionTime: number;

    cached: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          INFINITE SCROLL                                   */
/* -------------------------------------------------------------------------- */

export interface InfiniteScrollRequest {

    cursor?: string;

    limit: number;
}

export interface InfiniteScrollResponse<T> {

    items: T[];

    nextCursor?: string;

    hasMore: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             TABLE STATE                                    */
/* -------------------------------------------------------------------------- */

export interface TableState {

    page: number;

    pageSize: number;

    search: string;

    sorts: Sort[];

    filters: FilterGroup[];
}

/* -------------------------------------------------------------------------- */
/*                        CLIENT PAGINATION                                   */
/* -------------------------------------------------------------------------- */

export interface ClientPagination {

    currentPage: number;

    pageSize: number;

    totalItems: number;
}

/* -------------------------------------------------------------------------- */
/*                        SERVER PAGINATION                                   */
/* -------------------------------------------------------------------------- */

export interface ServerPagination {

    endpoint: string;

    mode: PaginationMode;

    pageSize: number;
}

/* -------------------------------------------------------------------------- */
/*                           QUERY RESULT                                     */
/* -------------------------------------------------------------------------- */

export interface QueryResult<T> {

    data: T[];

    pageInfo: PageInfo;

    cached: boolean;

    timestamp: Date;
}

/* -------------------------------------------------------------------------- */
/*                         SEARCH SUGGESTION                                  */
/* -------------------------------------------------------------------------- */

export interface SearchSuggestion {

    id: string;

    label: string;

    value: string;
}

/* -------------------------------------------------------------------------- */
/*                          SEARCH RESULT                                     */
/* -------------------------------------------------------------------------- */

export interface SearchResult<T> {

    keyword: string;

    totalResults: number;

    results: T[];

    suggestions?: SearchSuggestion[];
}

import { FilterOperator } from "./enums";

/* -------------------------------------------------------------------------- */
/*                         ADVANCED FILTERS                                   */
/* -------------------------------------------------------------------------- */

export interface AdvancedFilter {

    id: string;

    name: string;

    group: FilterGroup;

    enabled: boolean;
}

export interface FilterPreset {

    id: string;

    name: string;

    description?: string;

    filters: FilterGroup[];

    createdAt: Date;
}

export interface SavedSearch {

    id: string;

    name: string;

    search: Search;

    query: QueryOptions;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         UPDATED FILTER                                     */
/* -------------------------------------------------------------------------- */

export interface QueryFilter {

    field: string;

    operator: FilterOperator;

    value: unknown;
}

/* -------------------------------------------------------------------------- */
/*                          QUERY METADATA                                    */
/* -------------------------------------------------------------------------- */

export interface QueryMetadata {

    executionTime: number;

    cached: boolean;

    cacheKey?: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         DATA LOADER                                        */
/* -------------------------------------------------------------------------- */

export interface DataLoaderOptions {

    preload: boolean;

    cache: boolean;

    retryCount: number;

    timeout: number;
}

export interface LazyLoadOptions {

    enabled: boolean;

    pageSize: number;

    preloadPages: number;
}

/* -------------------------------------------------------------------------- */
/*                           CACHE METADATA                                   */
/* -------------------------------------------------------------------------- */

export interface CacheMetadata {

    key: string;

    createdAt: Date;

    expiresAt: Date;

    hitCount: number;

    stale: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          EXPORT OPTIONS                                    */
/* -------------------------------------------------------------------------- */

export interface ExportOptions {

    includeHeaders: boolean;

    includeFilters: boolean;

    includeSorting: boolean;

    filename?: string;

    format: "CSV" | "XLSX" | "PDF" | "JSON";
}

/* -------------------------------------------------------------------------- */
/*                          IMPORT OPTIONS                                    */
/* -------------------------------------------------------------------------- */

export interface ImportOptions {

    overwriteExisting: boolean;

    validateOnly: boolean;

    ignoreErrors: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          BULK REQUEST                                      */
/* -------------------------------------------------------------------------- */

export interface BulkQueryRequest {

    queries: QueryOptions[];
}

export interface BulkQueryResponse<T> {

    responses: PaginationResponse<T>[];
}

/* -------------------------------------------------------------------------- */
/*                           DATA WINDOW                                      */
/* -------------------------------------------------------------------------- */

export interface DataWindow {

    startIndex: number;

    endIndex: number;

    totalItems: number;
}

/* -------------------------------------------------------------------------- */
/*                           VIRTUAL SCROLL                                   */
/* -------------------------------------------------------------------------- */

export interface VirtualScroll {

    itemHeight: number;

    visibleItems: number;

    overscan: number;
}

/* -------------------------------------------------------------------------- */
/*                           PAGE CACHE                                       */
/* -------------------------------------------------------------------------- */

export interface CachedPage<T> {

    page: number;

    data: T[];

    cachedAt: Date;
}

export interface PaginationCache<T> {

    pages: CachedPage<T>[];

    totalPages: number;
}

/* -------------------------------------------------------------------------- */
/*                           QUERY STATISTICS                                 */
/* -------------------------------------------------------------------------- */

export interface QueryStatistics {

    totalQueries: number;

    successfulQueries: number;

    failedQueries: number;

    averageExecutionTime: number;

    cacheHitRate: number;
}

/* -------------------------------------------------------------------------- */
/*                           SEARCH HISTORY                                   */
/* -------------------------------------------------------------------------- */

export interface SearchHistoryItem {

    keyword: string;

    searchedAt: Date;

    resultCount: number;
}

export interface SearchHistory {

    items: SearchHistoryItem[];
}

/* -------------------------------------------------------------------------- */
/*                           PAGE BOOKMARK                                    */
/* -------------------------------------------------------------------------- */

export interface PageBookmark {

    id: string;

    page: number;

    pageSize: number;

    name: string;

    createdAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          DATA REFRESH                                      */
/* -------------------------------------------------------------------------- */

export interface RefreshOptions {

    autoRefresh: boolean;

    refreshInterval: number;

    refreshOnFocus: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          QUERY SNAPSHOT                                    */
/* -------------------------------------------------------------------------- */

export interface QuerySnapshot<T> {

    request: QueryOptions;

    response: PaginationResponse<T>;

    capturedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                         DEFAULT CONFIGURATION                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PAGE = 1;

export const DEFAULT_PAGE_SIZE = 20;

export const MAX_PAGE_SIZE = 100;

export const DEFAULT_SEARCH_MODE = SearchMode.PARTIAL;

export const DEFAULT_PAGINATION_MODE = PaginationMode.OFFSET;

export const DEFAULT_FILTER_LOGIC = FilterLogic.AND;

export const DEFAULT_SORT_DIRECTION = SortDirection.ASC;

/* -------------------------------------------------------------------------- */
/*                          DEFAULT PAGE INFO                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PAGE_INFO: PageInfo = {

    page: DEFAULT_PAGE,

    pageSize: DEFAULT_PAGE_SIZE,

    totalItems: 0,

    totalPages: 0,

    hasPreviousPage: false,

    hasNextPage: false,

    isFirstPage: true,

    isLastPage: true
};

/* -------------------------------------------------------------------------- */
/*                          DEFAULT QUERY OPTIONS                             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_QUERY_OPTIONS: QueryOptions = {

    pagination: {

        page: DEFAULT_PAGE,

        pageSize: DEFAULT_PAGE_SIZE
    },

    sort: {

        field: "createdAt",

        direction: DEFAULT_SORT_DIRECTION
    },

    search: {

        keyword: "",

        mode: DEFAULT_SEARCH_MODE
    },

    filters: []
};

/* -------------------------------------------------------------------------- */
/*                            TYPE ALIASES                                    */
/* -------------------------------------------------------------------------- */

export type Pageable = PaginationRequest;

export type PageableResponse<T> = PaginationResponse<T>;

export type Searchable = Search;

export type Sortable = Sort;

export type Filterable = FilterGroup;

export type InfiniteResult<T> = InfiniteScrollResponse<T>;

export type CursorPage = CursorPagination;

export type OffsetPage = OffsetPagination;

/* -------------------------------------------------------------------------- */
/*                      GENERIC COLLECTION TYPES                              */
/* -------------------------------------------------------------------------- */

export interface Collection<T> {

    items: T[];

    total: number;
}

export interface PageableCollection<T> {

    collection: Collection<T>;

    pageInfo: PageInfo;
}

export interface GroupedCollection<TKey, TValue> {

    key: TKey;

    items: TValue[];
}

/* -------------------------------------------------------------------------- */
/*                         TABLE CONFIGURATION                                */
/* -------------------------------------------------------------------------- */

export interface TableColumn {

    key: string;

    title: string;

    sortable: boolean;

    searchable: boolean;

    filterable: boolean;

    visible: boolean;

    width?: number;
}

export interface TableConfiguration {

    columns: TableColumn[];

    pagination: PaginationRequest;

    sorting: Sort[];

    filtering: FilterGroup[];
}

/* -------------------------------------------------------------------------- */
/*                         LIST RESPONSE                                      */
/* -------------------------------------------------------------------------- */

export interface ListResponse<T> {

    success: boolean;

    data: T[];

    pageInfo: PageInfo;

    metadata?: QueryMetadata;
}

/* -------------------------------------------------------------------------- */
/*                          QUERY CONTEXT                                     */
/* -------------------------------------------------------------------------- */

export interface QueryContext {

    requestId: string;

    executedAt: Date;

    executionTime: number;

    source: "API" | "CACHE" | "LOCAL";
}

/* -------------------------------------------------------------------------- */
/*                          QUERY BUILDER                                     */
/* -------------------------------------------------------------------------- */

export interface QueryBuilder {

    pagination: PaginationRequest;

    sorting: Sort[];

    filtering: FilterGroup[];

    search?: Search;
}

/* -------------------------------------------------------------------------- */
/*                          DATA PROVIDER                                     */
/* -------------------------------------------------------------------------- */

export interface DataProvider<T> {

    fetch(
        options: QueryOptions
    ): Promise<PaginationResponse<T>>;
}

/* -------------------------------------------------------------------------- */
/*                        PAGINATION UTILITIES                                */
/* -------------------------------------------------------------------------- */

export interface PaginationUtilities {

    getNextPage(
        current: number
    ): number;

    getPreviousPage(
        current: number
    ): number;

    hasNext(
        info: PageInfo
    ): boolean;

    hasPrevious(
        info: PageInfo
    ): boolean;
}

/* -------------------------------------------------------------------------- */
/*                      REUSABLE CALLBACK TYPES                               */
/* -------------------------------------------------------------------------- */

export type SearchHandler = (
    keyword: string
) => void;

export type SortHandler = (
    sort: Sort
) => void;

export type FilterHandler = (
    filters: FilterGroup[]
) => void;

export type PageChangeHandler = (
    page: number
) => void;

export type PageSizeChangeHandler = (
    pageSize: number
) => void;

/* -------------------------------------------------------------------------- */
/*                           READONLY TYPES                                   */
/* -------------------------------------------------------------------------- */

export type ReadonlyPageInfo =
    Readonly<PageInfo>;

export type ReadonlyPaginationRequest =
    Readonly<PaginationRequest>;

export type ReadonlySort =
    Readonly<Sort>;

export type ReadonlySearch =
    Readonly<Search>;

export type ReadonlyFilter =
    Readonly<Filter>;

export type ReadonlyQueryOptions =
    Readonly<QueryOptions>;

/* -------------------------------------------------------------------------- */
/*                             END OF FILE                                    */
/* -------------------------------------------------------------------------- */