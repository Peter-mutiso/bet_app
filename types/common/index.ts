/**
 * ============================================================================
 * COMMON TYPES INDEX
 * ============================================================================
 *
 * Barrel exports for all shared types, enums, interfaces, and utilities.
 *
 * Instead of importing from individual files:
 *
 * import { ApiResponse } from "@/types/common/api";
 * import { CurrencyCode } from "@/types/common/enums";
 * import { Money } from "@/types/common/money";
 * import { Pagination } from "@/types/common/pagination";
 *
 * simply use:
 *
 * import {
 *   ApiResponse,
 *   CurrencyCode,
 *   Money,
 *   Pagination
 * } from "@/types/common";
 *
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                                API TYPES                                   */
/* -------------------------------------------------------------------------- */

export * from "./api";

/* -------------------------------------------------------------------------- */
/*                              COMMON ENUMS                                  */
/* -------------------------------------------------------------------------- */

export * from "./enums";

/* -------------------------------------------------------------------------- */
/*                              MONEY TYPES                                   */
/* -------------------------------------------------------------------------- */

export * from "./money";

/* -------------------------------------------------------------------------- */
/*                           PAGINATION TYPES                                 */
/* -------------------------------------------------------------------------- */

export * from "./pagination";

/* -------------------------------------------------------------------------- */
/*                           FUTURE MODULES                                   */
/* -------------------------------------------------------------------------- */

/**
 * As the application grows, export additional shared modules here.
 *
 * Example:
 *
 * export * from "./errors";
 * export * from "./events";
 * export * from "./validators";
 * export * from "./constants";
 * export * from "./permissions";
 * export * from "./dates";
 * export * from "./formatters";
 * export * from "./helpers";
 * export * from "./storage";
 * export * from "./websocket";
 */

/* -------------------------------------------------------------------------- */
/*                                END OF FILE                                 */
/* -------------------------------------------------------------------------- */