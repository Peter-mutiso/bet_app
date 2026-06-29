/**
 * ============================================================================
 * EXECUTION SERVICE
 * ============================================================================
 * Responsible for converting approved trading signals into executed orders.
 * ============================================================================
 */

import { EventEmitter } from "events";

import { TradingSignal } from "./signal";

import { ProposalChannel } from "../websocket/channels/proposal-channel";
import { OrderChannel } from "../websocket/channels/order-channel";

/* -------------------------------------------------------------------------- */
/*                         CONFIGURATION                                      */
/* -------------------------------------------------------------------------- */

export interface ExecutionConfiguration {

    readonly enabled: boolean;

    readonly maximumRetries: number;

    readonly proposalTimeout: number;

    readonly orderTimeout: number;

}

/* -------------------------------------------------------------------------- */
/*                          EXECUTION STATUS                                  */
/* -------------------------------------------------------------------------- */

export enum ExecutionStatus {

    CREATED = "CREATED",

    REQUESTING_PROPOSAL = "REQUESTING_PROPOSAL",

    PLACING_ORDER = "PLACING_ORDER",

    COMPLETED = "COMPLETED",

    FAILED = "FAILED"

}

/* -------------------------------------------------------------------------- */
/*                          EXECUTION RESULT                                  */
/* -------------------------------------------------------------------------- */

export interface ExecutionResult {

    readonly success: boolean;

    readonly status: ExecutionStatus;

    readonly signal: TradingSignal;

    readonly orderId?: string;

    readonly proposalId?: string;

    readonly message: string;

}

/* -------------------------------------------------------------------------- */
/*                           METRICS                                          */
/* -------------------------------------------------------------------------- */

export interface ExecutionMetrics {

    executions: number;

    successful: number;

    failed: number;

    retries: number;

    lastExecution?: Date;

}

/* -------------------------------------------------------------------------- */
/*                        EXECUTION SERVICE                                   */
/* -------------------------------------------------------------------------- */

export class ExecutionService

extends EventEmitter {

    private readonly metrics:

    ExecutionMetrics = {

        executions: 0,

        successful: 0,

        failed: 0,

        retries: 0

    };

    constructor(

        private readonly configuration:

        ExecutionConfiguration,

        private readonly proposalChannel:

        ProposalChannel,

        private readonly orderChannel:

        OrderChannel

    ) {

        super();

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public statistics():

    Readonly<ExecutionMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                           EXECUTION                                        */
/* -------------------------------------------------------------------------- */

    public async execute(

        signal: TradingSignal

    ): Promise<ExecutionResult> {

        this.metrics.executions++;

        this.metrics.lastExecution =

            new Date();

        try {

            this.validateSignal(

                signal

            );

            this.emit(

                "executionStarted",

                signal

            );

            const proposal =

                await this.requestProposal(

                    signal

                );

            this.validateProposal(

                proposal

            );

            const order =

                await this.submitOrder(

                    proposal
                );

            this.metrics.successful++;

            const result: ExecutionResult = {

                success: true,

                status:

                    ExecutionStatus.COMPLETED,

                signal,

                proposalId:

                    proposal.id,

                orderId:

                    order.id,

                message:

                    "Trade executed successfully."

            };

            this.emit(

                "executionCompleted",

                result

            );

            return result;

        }

        catch (

            error

        ) {

            this.metrics.failed++;

            const result: ExecutionResult = {

                success: false,

                status:

                    ExecutionStatus.FAILED,

                signal,

                message:

                    error instanceof Error

                        ? error.message

                        : String(error)

            };

            this.emit(

                "executionFailed",

                result

            );

            return result;

        }

    }

/* -------------------------------------------------------------------------- */
/*                      SIGNAL VALIDATION                                     */
/* -------------------------------------------------------------------------- */

    protected validateSignal(

        signal: TradingSignal

    ): void {

        if (

            !this.enabled()

        ) {

            throw new Error(

                "Execution service is disabled."

            );

        }

        if (

            signal.direction ===

            "HOLD"

        ) {

            throw new Error(

                "Cannot execute HOLD signal."

            );

        }

    }

/* -------------------------------------------------------------------------- */
/*                     PROPOSAL REQUEST                                       */
/* -------------------------------------------------------------------------- */

    protected async requestProposal(

        signal: TradingSignal

    ): Promise<any> {

        return this.proposalChannel.request({

            symbol:

                signal.metadata.symbol,

            direction:

                signal.direction,

            amount:

                signal.risk.positionSize

        });

    }

/* -------------------------------------------------------------------------- */
/*                     PROPOSAL VALIDATION                                    */
/* -------------------------------------------------------------------------- */

    protected validateProposal(

        proposal: any

    ): void {

        if (

            !proposal

        ) {

            throw new Error(

                "Proposal was not received."

            );

        }

        if (

            !proposal.id

        ) {

            throw new Error(

                "Proposal ID is missing."

            );

        }

    }

/* -------------------------------------------------------------------------- */
/*                      ORDER SUBMISSION                                      */
/* -------------------------------------------------------------------------- */

    protected async submitOrder(

        proposal: any

    ): Promise<any> {

        return this.orderChannel.buy(

            proposal.id

        );

    }
    /* -------------------------------------------------------------------------- */
/*                      ACTIVE EXECUTIONS                                     */
/* -------------------------------------------------------------------------- */

    private readonly activeExecutions =

        new Set<string>();

/* -------------------------------------------------------------------------- */
/*                       EXECUTION WITH RETRIES                               */
/* -------------------------------------------------------------------------- */

    protected async executeWithRetry(

        signal: TradingSignal

    ): Promise<ExecutionResult> {

        let attempt = 0;

        let lastError: unknown;

        while (

            attempt <=

            this.configuration.maximumRetries

        ) {

            try {

                return await this.executeInternal(

                    signal

                );

            }

            catch (

                error

            ) {

                lastError = error;

                attempt++;

                this.metrics.retries++;

            }

        }

        throw lastError;

    }

/* -------------------------------------------------------------------------- */
/*                     INTERNAL EXECUTION                                     */
/* -------------------------------------------------------------------------- */

    protected async executeInternal(

        signal: TradingSignal

    ): Promise<ExecutionResult> {

        if (

            this.activeExecutions.has(

                signal.id

            )

        ) {

            throw new Error(

                "Signal is already being executed."

            );

        }

        this.activeExecutions.add(

            signal.id

        );

        try {

            return await this.execute(

                signal

            );

        }

        finally {

            this.activeExecutions.delete(

                signal.id

            );

        }

    }

/* -------------------------------------------------------------------------- */
/*                           TIMEOUT                                          */
/* -------------------------------------------------------------------------- */

    protected async withTimeout<T>(

        promise: Promise<T>,

        milliseconds: number

    ): Promise<T> {

        return Promise.race([

            promise,

            new Promise<T>(

                (_, reject) =>

                    setTimeout(

                        () =>

                            reject(

                                new Error(

                                    "Execution timed out."

                                )

                            ),

                        milliseconds

                    )

            )

        ]);

    }

/* -------------------------------------------------------------------------- */
/*                    SAFE PROPOSAL REQUEST                                   */
/* -------------------------------------------------------------------------- */

    protected async requestProposal(

        signal: TradingSignal

    ): Promise<any> {

        return this.withTimeout(

            this.proposalChannel.request({

                symbol:

                    signal.metadata.symbol,

                direction:

                    signal.direction,

                amount:

                    signal.risk.positionSize

            }),

            this.configuration.proposalTimeout

        );

    }

/* -------------------------------------------------------------------------- */
/*                      SAFE ORDER SUBMISSION                                 */
/* -------------------------------------------------------------------------- */

    protected async submitOrder(

        proposal: any

    ): Promise<any> {

        return this.withTimeout(

            this.orderChannel.buy(

                proposal.id

            ),

            this.configuration.orderTimeout

        );

    }
    /* -------------------------------------------------------------------------- */
/*                            INFORMATION                                     */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            enabled:

                this.enabled(),

            activeExecutions:

                this.activeExecutions.size,

            configuration:

                this.configuration

        });

    }

/* -------------------------------------------------------------------------- */
/*                           HEALTH                                           */
/* -------------------------------------------------------------------------- */

    public healthy(): boolean {

        return (

            this.enabled() &&

            this.proposalChannel.healthy() &&

            this.orderChannel.healthy()

        );

    }

/* -------------------------------------------------------------------------- */
/*                         DIAGNOSTICS                                        */
/* -------------------------------------------------------------------------- */

    public diagnostics():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            healthy:

                this.healthy(),

            metrics:

                this.statistics(),

            information:

                this.information()

        });

    }

/* -------------------------------------------------------------------------- */
/*                             RESET                                          */
/* -------------------------------------------------------------------------- */

    public reset(): void {

        this.metrics.executions = 0;

        this.metrics.successful = 0;

        this.metrics.failed = 0;

        this.metrics.retries = 0;

        this.metrics.lastExecution = undefined;

        this.activeExecutions.clear();

    }

/* -------------------------------------------------------------------------- */
/*                            CLEANUP                                         */
/* -------------------------------------------------------------------------- */

    public destroy(): void {

        this.reset();

        this.removeAllListeners();

    }

}

/* -------------------------------------------------------------------------- */
/*                             FACTORY                                        */
/* -------------------------------------------------------------------------- */

export function createExecutionService(

    configuration: ExecutionConfiguration,

    proposalChannel: ProposalChannel,

    orderChannel: OrderChannel

): ExecutionService {

    return new ExecutionService(

        configuration,

        proposalChannel,

        orderChannel

    );

}