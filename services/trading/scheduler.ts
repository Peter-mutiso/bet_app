/**
 * ============================================================================
 * TRADING SCHEDULER
 * ============================================================================
 * Executes periodic trading tasks.
 * ============================================================================
 */

import { EventEmitter } from "events";

/* -------------------------------------------------------------------------- */
/*                         CONFIGURATION                                      */
/* -------------------------------------------------------------------------- */

export interface SchedulerConfiguration {

    readonly enabled: boolean;

    readonly heartbeatInterval: number;

    readonly evaluationInterval: number;

    readonly synchronizationInterval: number;

}

/* -------------------------------------------------------------------------- */
/*                          TASK                                              */
/* -------------------------------------------------------------------------- */

export interface ScheduledTask {

    readonly name: string;

    readonly interval: number;

    execute(): Promise<void>;

}

/* -------------------------------------------------------------------------- */
/*                         METRICS                                            */
/* -------------------------------------------------------------------------- */

export interface SchedulerMetrics {

    executions: number;

    failures: number;

    startedAt?: Date;

}

/* -------------------------------------------------------------------------- */
/*                          STATE                                              */
/* -------------------------------------------------------------------------- */

export enum SchedulerState {

    CREATED = "CREATED",

    RUNNING = "RUNNING",

    STOPPED = "STOPPED"

}

/* -------------------------------------------------------------------------- */
/*                         SCHEDULER                                          */
/* -------------------------------------------------------------------------- */

export class TradingScheduler

extends EventEmitter {

    private readonly tasks =

        new Map<string, NodeJS.Timeout>();

    private readonly metrics:

    SchedulerMetrics = {

        executions: 0,

        failures: 0

    };

    private state =

        SchedulerState.CREATED;

    constructor(

        private readonly configuration:

        SchedulerConfiguration

    ) {

        super();

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public currentState():

    SchedulerState {

        return this.state;

    }

    public statistics():

    Readonly<SchedulerMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                         REGISTER TASK                                      */
/* -------------------------------------------------------------------------- */

    public register(

        task: ScheduledTask

    ): void {

        if (

            this.tasks.has(

                task.name

            )

        ) {

            throw new Error(

                `Task "${task.name}" is already registered.`

            );

        }

        const timer = setInterval(

            async () => {

                await this.executeTask(

                    task

                );

            },

            task.interval

        );

        this.tasks.set(

            task.name,

            timer

        );

    }

/* -------------------------------------------------------------------------- */
/*                          EXECUTE TASK                                      */
/* -------------------------------------------------------------------------- */

    protected async executeTask(

        task: ScheduledTask

    ): Promise<void> {

        try {

            await task.execute();

            this.metrics.executions++;

            this.emit(

                "taskCompleted",

                task.name

            );

        }

        catch (

            error

        ) {

            this.metrics.failures++;

            this.emit(

                "taskFailed",

                {

                    task: task.name,

                    error

                }

            );

        }

    }

/* -------------------------------------------------------------------------- */
/*                           START                                            */
/* -------------------------------------------------------------------------- */

    public start():

    void {

        if (

            !this.enabled()

        ) {

            return;

        }

        if (

            this.state ===

            SchedulerState.RUNNING

        ) {

            return;

        }

        this.state =

            SchedulerState.RUNNING;

        this.metrics.startedAt =

            new Date();

        this.emit(

            "started"

        );

    }

/* -------------------------------------------------------------------------- */
/*                             STOP                                           */
/* -------------------------------------------------------------------------- */

    public stop():

    void {

        if (

            this.state ===

            SchedulerState.STOPPED

        ) {

            return;

        }

        for (

            const timer of

            this.tasks.values()

        ) {

            clearInterval(

                timer

            );

        }

        this.tasks.clear();

        this.state =

            SchedulerState.STOPPED;

        this.emit(

            "stopped"

        );

    }
    /* -------------------------------------------------------------------------- */
/*                         UNREGISTER TASK                                    */
/* -------------------------------------------------------------------------- */

    public unregister(

        name: string

    ): boolean {

        const timer =

            this.tasks.get(

                name

            );

        if (

            !timer

        ) {

            return false;

        }

        clearInterval(

            timer

        );

        this.tasks.delete(

            name

        );

        this.emit(

            "taskRemoved",

            name

        );

        return true;

    }

/* -------------------------------------------------------------------------- */
/*                          TASK INFORMATION                                  */
/* -------------------------------------------------------------------------- */

    public taskNames():

    readonly string[] {

        return [

            ...this.tasks.keys()

        ];

    }

    public hasTask(

        name: string

    ): boolean {

        return this.tasks.has(

            name

        );

    }

/* -------------------------------------------------------------------------- */
/*                            PAUSE                                           */
/* -------------------------------------------------------------------------- */

    public pause(): void {

        if (

            this.state !==

            SchedulerState.RUNNING

        ) {

            return;

        }

        for (

            const timer of

            this.tasks.values()

        ) {

            clearInterval(

                timer

            );

        }

        this.state =

            SchedulerState.STOPPED;

        this.emit(

            "paused"

        );

    }

/* -------------------------------------------------------------------------- */
/*                           RESUME                                           */
/* -------------------------------------------------------------------------- */

    public resume(): void {

        if (

            this.state !==

            SchedulerState.STOPPED

        ) {

            return;

        }

        this.state =

            SchedulerState.RUNNING;

        this.emit(

            "resumed"

        );

    }

/* -------------------------------------------------------------------------- */
/*                           HEALTH                                           */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.enabled() &&

            this.state !==

            SchedulerState.STOPPED

        );

    }

/* -------------------------------------------------------------------------- */
/*                         INFORMATION                                        */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            enabled:

                this.enabled(),

            state:

                this.state,

            taskCount:

                this.tasks.size,

            tasks:

                this.taskNames(),

            configuration:

                this.configuration

        });

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
/*                              RESET                                         */
/* -------------------------------------------------------------------------- */

    public reset(): void {

        for (

            const timer of

            this.tasks.values()

        ) {

            clearInterval(

                timer

            );

        }

        this.tasks.clear();

        this.state =

            SchedulerState.CREATED;

        this.metrics.executions = 0;

        this.metrics.failures = 0;

        this.metrics.startedAt = undefined;

        this.emit(

            "reset"

        );

    }

/* -------------------------------------------------------------------------- */
/*                         STATE HELPERS                                      */
/* -------------------------------------------------------------------------- */

    public isRunning():

    boolean {

        return (

            this.state ===

            SchedulerState.RUNNING

        );

    }

    public isStopped():

    boolean {

        return (

            this.state ===

            SchedulerState.STOPPED

        );

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
/*                           FACTORY                                          */
/* -------------------------------------------------------------------------- */

export function createTradingScheduler(

    configuration: SchedulerConfiguration

): TradingScheduler {

    return new TradingScheduler(

        configuration

    );

}