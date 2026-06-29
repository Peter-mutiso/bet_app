/**
 * ============================================================================
 * WEBSOCKET LOGGER
 * ============================================================================
 * Enterprise-grade structured logger for the WebSocket subsystem.
 * ============================================================================
 */

import {

    LogEntry,

    LoggerConfiguration

} from "./types";

import {

    WebSocketLogLevel

} from "./constants";

/* -------------------------------------------------------------------------- */
/*                            LOGGER CLASS                                    */
/* -------------------------------------------------------------------------- */

export class WebSocketLogger {

    private configuration: LoggerConfiguration;

    private history: LogEntry[] = [];

    private readonly maximumHistorySize = 5000;

    constructor(configuration?: Partial<LoggerConfiguration>) {

        this.configuration = {

            enabled: true,

            level: WebSocketLogLevel.INFO,

            includeTimestamp: true,

            includeContext: true,

            ...configuration

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                          PUBLIC METHODS                                */
    /* ---------------------------------------------------------------------- */

    public trace(

        message: string,

        context?: Record<string, unknown>

    ): void {

        this.log(

            WebSocketLogLevel.TRACE,

            message,

            context

        );

    }

    public debug(

        message: string,

        context?: Record<string, unknown>

    ): void {

        this.log(

            WebSocketLogLevel.DEBUG,

            message,

            context

        );

    }

    public info(

        message: string,

        context?: Record<string, unknown>

    ): void {

        this.log(

            WebSocketLogLevel.INFO,

            message,

            context

        );

    }

    public warn(

        message: string,

        context?: Record<string, unknown>

    ): void {

        this.log(

            WebSocketLogLevel.WARN,

            message,

            context

        );

    }

    public error(

        message: string,

        context?: Record<string, unknown>

    ): void {

        this.log(

            WebSocketLogLevel.ERROR,

            message,

            context

        );

    }

    public fatal(

        message: string,

        context?: Record<string, unknown>

    ): void {

        this.log(

            WebSocketLogLevel.FATAL,

            message,

            context

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                        PRIVATE LOGGING                                 */
    /* ---------------------------------------------------------------------- */

    private log(

        level: WebSocketLogLevel,

        message: string,

        context?: Record<string, unknown>

    ): void {

        if (!this.configuration.enabled) {

            return;

        }

        if (!this.shouldLog(level)) {

            return;

        }

        const entry: LogEntry = {

            timestamp: new Date(),

            level,

            message,

            context

        };

        this.store(entry);

        this.write(entry);

    }
        /* ---------------------------------------------------------------------- */
    /*                      PRIVATE HELPERS                                   */
    /* ---------------------------------------------------------------------- */

    private shouldLog(

        level: WebSocketLogLevel

    ): boolean {

        const levels: Record<WebSocketLogLevel, number> = {

            [WebSocketLogLevel.TRACE]: 0,

            [WebSocketLogLevel.DEBUG]: 1,

            [WebSocketLogLevel.INFO]: 2,

            [WebSocketLogLevel.WARN]: 3,

            [WebSocketLogLevel.ERROR]: 4,

            [WebSocketLogLevel.FATAL]: 5

        };

        return levels[level] >= levels[this.configuration.level];

    }

    private store(

        entry: LogEntry

    ): void {

        this.history.push(entry);

        if (

            this.history.length >

            this.maximumHistorySize

        ) {

            this.history.shift();

        }

    }

    private write(

        entry: LogEntry

    ): void {

        const prefix = this.configuration.includeTimestamp

            ? `[${entry.timestamp.toISOString()}]`

            : "";

        const output = `${prefix} [${entry.level}] ${entry.message}`;

        switch (entry.level) {

            case WebSocketLogLevel.TRACE:

                console.trace(output, entry.context);

                break;

            case WebSocketLogLevel.DEBUG:

                console.debug(output, entry.context);

                break;

            case WebSocketLogLevel.INFO:

                console.info(output, entry.context);

                break;

            case WebSocketLogLevel.WARN:

                console.warn(output, entry.context);

                break;

            case WebSocketLogLevel.ERROR:

            case WebSocketLogLevel.FATAL:

                console.error(output, entry.context);

                break;

            default:

                console.log(output, entry.context);

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                          HISTORY                                       */
    /* ---------------------------------------------------------------------- */

    public getHistory(): ReadonlyArray<LogEntry> {

        return [...this.history];

    }

    public clearHistory(): void {

        this.history = [];

    }

    public getLogsByLevel(

        level: WebSocketLogLevel

    ): ReadonlyArray<LogEntry> {

        return this.history.filter(

            log => log.level === level

        );

    }

    public getLatest(

        count = 100

    ): ReadonlyArray<LogEntry> {

        return this.history.slice(-count);

    }

    public historySize(): number {

        return this.history.length;

    }
        /* ---------------------------------------------------------------------- */
    /*                     PERFORMANCE TIMERS                                 */
    /* ---------------------------------------------------------------------- */

    private readonly timers = new Map<string, number>();

    public startTimer(

        name: string

    ): void {

        this.timers.set(

            name,

            performance.now()

        );

    }

    public endTimer(

        name: string,

        context?: Record<string, unknown>

    ): number | null {

        const start = this.timers.get(name);

        if (start === undefined) {

            this.warn(

                `Timer '${name}' does not exist.`,

                context

            );

            return null;

        }

        const duration = performance.now() - start;

        this.timers.delete(name);

        this.info(

            `Timer '${name}' completed in ${duration.toFixed(2)} ms.`,

            {

                duration,

                ...context

            }

        );

        return duration;

    }

    /* ---------------------------------------------------------------------- */
    /*                      EXCEPTION LOGGING                                 */
    /* ---------------------------------------------------------------------- */

    public exception(

        error: unknown,

        context?: Record<string, unknown>

    ): void {

        if (error instanceof Error) {

            this.error(

                error.message,

                {

                    name: error.name,

                    stack: error.stack,

                    ...context

                }

            );

            return;

        }

        this.error(

            "Unknown exception.",

            {

                error,

                ...context

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    CONFIGURATION MANAGEMENT                            */
    /* ---------------------------------------------------------------------- */

    public configure(

        configuration: Partial<LoggerConfiguration>

    ): void {

        this.configuration = {

            ...this.configuration,

            ...configuration

        };

    }

    public getConfiguration():

        Readonly<LoggerConfiguration> {

        return {

            ...this.configuration

        };

    }

    public enable(): void {

        this.configuration.enabled = true;

    }

    public disable(): void {

        this.configuration.enabled = false;

    }

    public isEnabled(): boolean {

        return this.configuration.enabled;

    }

    /* ---------------------------------------------------------------------- */
    /*                          EXPORT                                         */
    /* ---------------------------------------------------------------------- */

    public export(): string {

        return JSON.stringify(

            this.history,

            null,

            2

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                           RESET                                         */
    /* ---------------------------------------------------------------------- */

    public reset(): void {

        this.clearHistory();

        this.timers.clear();

    }

}

/* -------------------------------------------------------------------------- */
/*                       SINGLETON LOGGER                                     */
/* -------------------------------------------------------------------------- */

export const logger =

    new WebSocketLogger();

/* -------------------------------------------------------------------------- */
/*                       LOGGER FACTORY                                       */
/* -------------------------------------------------------------------------- */

export function createLogger(

    configuration?: Partial<LoggerConfiguration>

): WebSocketLogger {

    return new WebSocketLogger(

        configuration

    );

}
/* -------------------------------------------------------------------------- */
/*                          SCOPED LOGGER                                     */
/* -------------------------------------------------------------------------- */

public child(

    scope: string

): WebSocketLogger {

    const parent = this;

    const childLogger = new WebSocketLogger(

        parent.getConfiguration()

    );

    const originalInfo = childLogger.info.bind(childLogger);
    const originalDebug = childLogger.debug.bind(childLogger);
    const originalWarn = childLogger.warn.bind(childLogger);
    const originalError = childLogger.error.bind(childLogger);
    const originalTrace = childLogger.trace.bind(childLogger);
    const originalFatal = childLogger.fatal.bind(childLogger);

    childLogger.info = (

        message: string,

        context?: Record<string, unknown>

    ): void => {

        originalInfo(

            `[${scope}] ${message}`,

            context

        );

    };

    childLogger.debug = (

        message: string,

        context?: Record<string, unknown>

    ): void => {

        originalDebug(

            `[${scope}] ${message}`,

            context

        );

    };

    childLogger.warn = (

        message: string,

        context?: Record<string, unknown>

    ): void => {

        originalWarn(

            `[${scope}] ${message}`,

            context

        );

    };

    childLogger.error = (

        message: string,

        context?: Record<string, unknown>

    ): void => {

        originalError(

            `[${scope}] ${message}`,

            context

        );

    };

    childLogger.trace = (

        message: string,

        context?: Record<string, unknown>

    ): void => {

        originalTrace(

            `[${scope}] ${message}`,

            context

        );

    };

    childLogger.fatal = (

        message: string,

        context?: Record<string, unknown>

    ): void => {

        originalFatal(

            `[${scope}] ${message}`,

            context

        );

    };

    return childLogger;

}

/* -------------------------------------------------------------------------- */
/*                            GROUP LOGGING                                   */
/* -------------------------------------------------------------------------- */

public group(

    title: string,

    callback: () => void

): void {

    console.group(title);

    try {

        callback();

    } finally {

        console.groupEnd();

    }

}

/* -------------------------------------------------------------------------- */
/*                            TABLE LOGGING                                   */
/* -------------------------------------------------------------------------- */

public table(

    data: unknown

): void {

    console.table(data);

}

/* -------------------------------------------------------------------------- */
/*                           ASSERTION                                        */
/* -------------------------------------------------------------------------- */

public assert(

    condition: boolean,

    message: string

): void {

    if (!condition) {

        this.error(

            `Assertion failed: ${message}`

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                       MEMORY INFORMATION                                   */
/* -------------------------------------------------------------------------- */

public logMemoryUsage(): void {

    const memory = (

        performance as Performance & {

            memory?: {

                usedJSHeapSize: number;

                totalJSHeapSize: number;

                jsHeapSizeLimit: number;

            };

        }

    ).memory;

    if (!memory) {

        this.warn(

            "Memory information is unavailable."

        );

        return;

    }

    this.info(

        "Memory usage.",

        {

            usedJSHeapSize: memory.usedJSHeapSize,

            totalJSHeapSize: memory.totalJSHeapSize,

            jsHeapSizeLimit: memory.jsHeapSizeLimit

        }

    );

}

/* -------------------------------------------------------------------------- */
/*                           STATISTICS                                       */
/* -------------------------------------------------------------------------- */

public statistics() {

    return {

        totalLogs: this.history.length,

        trace: this.getLogsByLevel(

            WebSocketLogLevel.TRACE

        ).length,

        debug: this.getLogsByLevel(

            WebSocketLogLevel.DEBUG

        ).length,

        info: this.getLogsByLevel(

            WebSocketLogLevel.INFO

        ).length,

        warn: this.getLogsByLevel(

            WebSocketLogLevel.WARN

        ).length,

        error: this.getLogsByLevel(

            WebSocketLogLevel.ERROR

        ).length,

        fatal: this.getLogsByLevel(

            WebSocketLogLevel.FATAL

        ).length

    };

}

/* -------------------------------------------------------------------------- */
/*                           FLUSH                                            */
/* -------------------------------------------------------------------------- */

public flush(): void {

    this.history = [];

}

/* -------------------------------------------------------------------------- */
/*                         DESTROY                                            */
/* -------------------------------------------------------------------------- */

public destroy(): void {

    this.reset();

    this.disable();

}