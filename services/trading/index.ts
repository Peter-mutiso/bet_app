/**
 * ============================================================================
 * TRADING SERVICES
 * ============================================================================
 * Public exports for the trading framework.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/* CORE SERVICES                                                              */
/* -------------------------------------------------------------------------- */

export * from "./signal";

export * from "./strategy";

export * from "./risk-manager";

export * from "./execution";

export * from "./portfolio-manager";

export * from "./session";

export * from "./scheduler";

export * from "./engine";

/* -------------------------------------------------------------------------- */
/* FACTORY FUNCTIONS                                                          */
/* -------------------------------------------------------------------------- */

export {

    createTradingEngine

} from "./engine";

export {

    createTradingScheduler

} from "./scheduler";

export {

    createTradingSession

} from "./session";

export {

    createPortfolioManager

} from "./portfolio-manager";

export {

    createExecutionService

} from "./execution";

export {

    createRiskManager

} from "./risk-manager";

export {

    createStrategy

} from "./strategy";

/* -------------------------------------------------------------------------- */
/* ENUMS                                                                      */
/* -------------------------------------------------------------------------- */

export {

    SessionState

} from "./session";

export {

    SchedulerState

} from "./scheduler";

export {

    PortfolioState

} from "./portfolio-manager";

/* -------------------------------------------------------------------------- */
/* COMMON TYPES                                                               */
/* -------------------------------------------------------------------------- */

export type {

    TradingEngineConfiguration,

    TradingEngineMetrics

} from "./engine";

export type {

    SchedulerConfiguration,

    SchedulerMetrics,

    ScheduledTask

} from "./scheduler";

export type {

    SessionConfiguration,

    SessionMetrics

} from "./session";

export type {

    PortfolioConfiguration,

    PortfolioStatistics

} from "./portfolio-manager";

/* -------------------------------------------------------------------------- */
/* SIGNAL                                                                     */
/* -------------------------------------------------------------------------- */

export type {

    TradingSignal,

    TradingSignalMetadata

} from "./signal";

/* -------------------------------------------------------------------------- */
/* STRATEGY                                                                   */
/* -------------------------------------------------------------------------- */

export type {

    StrategyConfiguration,

    StrategyMetrics,

    StrategyContext

} from "./strategy";

/* -------------------------------------------------------------------------- */
/* RISK MANAGER                                                               */
/* -------------------------------------------------------------------------- */

export type {

    RiskConfiguration,

    RiskDecision,

    RiskEvaluationContext,

    RiskMetrics

} from "./risk-manager";

/* -------------------------------------------------------------------------- */
/* EXECUTION                                                                  */
/* -------------------------------------------------------------------------- */

export type {

    ExecutionConfiguration,

    ExecutionResult,

    ExecutionMetrics

} from "./execution";

/* -------------------------------------------------------------------------- */
/* PORTFOLIO                                                                  */
/* -------------------------------------------------------------------------- */

export type {

    PortfolioConfiguration,

    PortfolioStatistics

} from "./portfolio-manager";

/* -------------------------------------------------------------------------- */
/* SESSION                                                                    */
/* -------------------------------------------------------------------------- */

export type {

    SessionConfiguration,

    SessionMetrics

} from "./session";

/* -------------------------------------------------------------------------- */
/* SCHEDULER                                                                  */
/* -------------------------------------------------------------------------- */

export type {

    SchedulerConfiguration,

    SchedulerMetrics,

    ScheduledTask

} from "./scheduler";

/* -------------------------------------------------------------------------- */
/* ENGINE                                                                     */
/* -------------------------------------------------------------------------- */

export type {

    TradingEngineConfiguration,

    TradingEngineMetrics

} from "./engine";

/* -------------------------------------------------------------------------- */
/* MODULE VERSION                                                             */
/* -------------------------------------------------------------------------- */

export const TRADING_MODULE = Object.freeze({

    name:

        "Trading Framework",

    version:

        "1.0.0"

});

/* -------------------------------------------------------------------------- */
/* PUBLIC API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Public exports:
 *
 *  • TradingEngine
 *  • TradingScheduler
 *  • TradingSession
 *  • PortfolioManager
 *  • ExecutionService
 *  • RiskManager
 *  • Strategy
 *  • TradingSignal
 *
 * Factory functions:
 *
 *  • createTradingEngine()
 *  • createTradingScheduler()
 *  • createTradingSession()
 *  • createPortfolioManager()
 *  • createExecutionService()
 *  • createRiskManager()
 *  • createStrategy()
 *
 * Shared:
 *
 *  • Enums
 *  • Interfaces
 *  • Configuration Types
 *  • Metrics
 */