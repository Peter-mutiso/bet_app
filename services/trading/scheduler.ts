/**
 * ============================================================================
 * TRADING SCHEDULER
 * ============================================================================
 *
 * Responsible for:
 *  - Contract expiry timers
 *  - Periodic background jobs
 *  - Synchronization events
 * ============================================================================
 */

import EventEmitter from "events";

export interface ScheduledTask {

    id: string;

    interval: number;

    callback: () => void;

}

export class TradingScheduler extends EventEmitter {

    private static instance: TradingScheduler | null = null;

    private readonly intervals =

        new Map<string, ReturnType<typeof setInterval>>();

    private readonly timeouts =

        new Map<string, ReturnType<typeof setTimeout>>();

    private constructor() {

        super();

    }

    /* ---------------------------------------------------------------------- */
    /* SINGLETON                                                              */
    /* ---------------------------------------------------------------------- */

    public static getInstance(): TradingScheduler {

        if (

            !TradingScheduler.instance

        ) {

            TradingScheduler.instance =

                new TradingScheduler();

        }

        return TradingScheduler.instance;

    }

    /* ---------------------------------------------------------------------- */
    /* INTERVAL TASKS                                                         */
    /* ---------------------------------------------------------------------- */

    public schedule(

        task: ScheduledTask

    ): void {

        this.cancel(

            task.id

        );

        const timer =

            setInterval(

                () => {

                    task.callback();

                    this.emit(

                        "task",

                        task.id

                    );

                },

                task.interval

            );

        this.intervals.set(

            task.id,

            timer

        );

    }

    /* ---------------------------------------------------------------------- */
    /* TIMEOUTS                                                               */
    /* ---------------------------------------------------------------------- */

    public scheduleTimeout(

        id: string,

        delay: number,

        callback: () => void

    ): void {

        this.cancelTimeout(

            id

        );

        const timer =

            setTimeout(

                () => {

                    callback();

                    this.emit(

                        "timeout",

                        id

                    );

                    this.timeouts.delete(

                        id

                    );

                },

                delay

            );

        this.timeouts.set(

            id,

            timer

        );

    }

    /* ---------------------------------------------------------------------- */
    /* CANCEL                                                                 */
    /* ---------------------------------------------------------------------- */

    public cancel(

        id: string

    ): void {

        const timer =

            this.intervals.get(

                id

            );

        if (

            timer

        ) {

            clearInterval(

                timer

            );

            this.intervals.delete(

                id

            );

        }

    }

    public cancelTimeout(

        id: string

    ): void {

        const timer =

            this.timeouts.get(

                id

            );

        if (

            timer

        ) {

            clearTimeout(

                timer

            );

            this.timeouts.delete(

                id

            );

        }

    }

    /* ---------------------------------------------------------------------- */
    /* CLEANUP                                                                */
    /* ---------------------------------------------------------------------- */

    public stopAll(): void {

        this.intervals.forEach(

            timer =>

                clearInterval(

                    timer

                )

        );

        this.timeouts.forEach(

            timer =>

                clearTimeout(

                    timer

                )

        );

        this.intervals.clear();

        this.timeouts.clear();
    }

}

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export const tradingScheduler =

    TradingScheduler.getInstance();