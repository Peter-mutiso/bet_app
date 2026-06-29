/**
 * ============================================================================
 * TRADING SESSION
 * ============================================================================
 * Controls the lifecycle of a trading session.
 * ============================================================================
 */

import { EventEmitter } from "events";

/* -------------------------------------------------------------------------- */
/*                         CONFIGURATION                                      */
/* -------------------------------------------------------------------------- */

export interface SessionConfiguration {

    readonly enabled: boolean;

    readonly heartbeatInterval: number;

    readonly automaticRecovery: boolean;

}

/* -------------------------------------------------------------------------- */
/*                           SESSION STATE                                    */
/* -------------------------------------------------------------------------- */

export enum SessionState {

    CREATED = "CREATED",

    STARTING = "STARTING",

    RUNNING = "RUNNING",

    PAUSED = "PAUSED",

    STOPPED = "STOPPED",

    ERROR = "ERROR"

}

/* -------------------------------------------------------------------------- */
/*                         SESSION METRICS                                    */
/* -------------------------------------------------------------------------- */

export interface SessionMetrics {

    startedAt?: Date;

    stoppedAt?: Date;

    heartbeats: number;

    pauses: number;

    resumes: number;

}

/* -------------------------------------------------------------------------- */
/*                        TRADING SESSION                                     */
/* -------------------------------------------------------------------------- */

export class TradingSession

extends EventEmitter {

    private state =

        SessionState.CREATED;

    private readonly metrics:

    SessionMetrics = {

        heartbeats: 0,

        pauses: 0,

        resumes: 0

    };

    constructor(

        private readonly configuration:

        SessionConfiguration

    ) {

        super();

    }

    public enabled():

    boolean {

        return this.configuration.enabled;

    }

    public currentState():

    SessionState {

        return this.state;

    }

    public statistics():

    Readonly<SessionMetrics> {

        return Object.freeze({

            ...this.metrics

        });

    }

}
/* -------------------------------------------------------------------------- */
/*                              START                                         */
/* -------------------------------------------------------------------------- */

    public async start():

    Promise<void> {

        if (

            this.state !==

            SessionState.CREATED &&

            this.state !==

            SessionState.STOPPED

        ) {

            return;

        }

        this.state =

            SessionState.STARTING;

        await this.onStart();

        this.state =

            SessionState.RUNNING;

        this.metrics.startedAt =

            new Date();

        this.emit(

            "started"

        );

    }

/* -------------------------------------------------------------------------- */
/*                               STOP                                         */
/* -------------------------------------------------------------------------- */

    public async stop():

    Promise<void> {

        if (

            this.state ===

            SessionState.STOPPED

        ) {

            return;

        }

        await this.onStop();

        this.state =

            SessionState.STOPPED;

        this.metrics.stoppedAt =

            new Date();

        this.emit(

            "stopped"

        );

    }

/* -------------------------------------------------------------------------- */
/*                              PAUSE                                         */
/* -------------------------------------------------------------------------- */

    public pause():

    void {

        if (

            this.state !==

            SessionState.RUNNING

        ) {

            return;

        }

        this.state =

            SessionState.PAUSED;

        this.metrics.pauses++;

        this.emit(

            "paused"

        );

    }

/* -------------------------------------------------------------------------- */
/*                              RESUME                                        */
/* -------------------------------------------------------------------------- */

    public resume():

    void {

        if (

            this.state !==

            SessionState.PAUSED

        ) {

            return;

        }

        this.state =

            SessionState.RUNNING;

        this.metrics.resumes++;

        this.emit(

            "resumed"

        );

    }

/* -------------------------------------------------------------------------- */
/*                           HEARTBEAT                                        */
/* -------------------------------------------------------------------------- */

    public heartbeat():

    void {

        if (

            this.state !==

            SessionState.RUNNING

        ) {

            return;

        }

        this.metrics.heartbeats++;

        this.emit(

            "heartbeat",

            this.metrics.heartbeats

        );

    }

/* -------------------------------------------------------------------------- */
/*                       LIFECYCLE HOOKS                                      */
/* -------------------------------------------------------------------------- */

    protected async onStart():

    Promise<void> {}

    protected async onStop():

    Promise<void> {}
    /* -------------------------------------------------------------------------- */
/*                         ACTIVITY TRACKING                                  */
/* -------------------------------------------------------------------------- */

    private lastActivity =

        new Date();

/* -------------------------------------------------------------------------- */
/*                          HEARTBEAT UPDATE                                  */
/* -------------------------------------------------------------------------- */

    public override heartbeat():

    void {

        if (

            this.state !==

            SessionState.RUNNING

        ) {

            return;

        }

        this.metrics.heartbeats++;

        this.lastActivity =

            new Date();

        this.emit(

            "heartbeat",

            this.metrics.heartbeats

        );

    }

/* -------------------------------------------------------------------------- */
/*                         SESSION DURATION                                   */
/* -------------------------------------------------------------------------- */

    public duration():

    number {

        if (

            !this.metrics.startedAt

        ) {

            return 0;

        }

        return (

            Date.now() -

            this.metrics.startedAt.getTime()

        );

    }

/* -------------------------------------------------------------------------- */
/*                           IDLE TIME                                        */
/* -------------------------------------------------------------------------- */

    public idleTime():

    number {

        return (

            Date.now() -

            this.lastActivity.getTime()

        );

    }

/* -------------------------------------------------------------------------- */
/*                            HEALTH                                          */
/* -------------------------------------------------------------------------- */

    public healthy():

    boolean {

        return (

            this.enabled() &&

            this.state !==

            SessionState.ERROR

        );

    }

/* -------------------------------------------------------------------------- */
/*                     AUTOMATIC RECOVERY                                     */
/* -------------------------------------------------------------------------- */

    public async recover():

    Promise<void> {

        if (

            !this.configuration.automaticRecovery

        ) {

            return;

        }

        if (

            this.state !==

            SessionState.ERROR

        ) {

            return;

        }

        this.emit(

            "recovering"

        );

        this.state =

            SessionState.STARTING;

        await this.onStart();

        this.state =

            SessionState.RUNNING;

        this.lastActivity =

            new Date();

        this.emit(

            "recovered"

        );

    }

/* -------------------------------------------------------------------------- */
/*                          INFORMATION                                       */
/* -------------------------------------------------------------------------- */

    public information():

    Readonly<Record<string, unknown>> {

        return Object.freeze({

            state:

                this.state,

            enabled:

                this.enabled(),

            duration:

                this.duration(),

            idle:

                this.idleTime(),

            configuration:

                this.configuration

        });

    }

/* -------------------------------------------------------------------------- */
/*                          DIAGNOSTICS                                       */
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
/*                        STATE HELPERS                                       */
/* -------------------------------------------------------------------------- */

    public isRunning(): boolean {

        return this.state ===

            SessionState.RUNNING;

    }

    public isPaused(): boolean {

        return this.state ===

            SessionState.PAUSED;

    }

    public isStopped(): boolean {

        return this.state ===

            SessionState.STOPPED;

    }

    public hasFailed(): boolean {

        return this.state ===

            SessionState.ERROR;

    }

/* -------------------------------------------------------------------------- */
/*                             RESET                                          */
/* -------------------------------------------------------------------------- */

    public reset(): void {

        this.state =

            SessionState.CREATED;

        this.metrics.startedAt = undefined;

        this.metrics.stoppedAt = undefined;

        this.metrics.heartbeats = 0;

        this.metrics.pauses = 0;

        this.metrics.resumes = 0;

        this.lastActivity =

            new Date();

        this.emit(

            "reset"

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
/*                             FACTORY                                        */
/* -------------------------------------------------------------------------- */

export function createTradingSession(

    configuration: SessionConfiguration

): TradingSession {

    return new TradingSession(

        configuration

    );

}

