/**
 * ============================================================================
 * BASE CHANNEL
 * ============================================================================
 * Base implementation for every websocket channel.
 * ============================================================================
 */

import {

    WebSocketManager

} from "../manager";

import {

    WebSocketMessage

} from "../types";

import {

    logger

} from "../logger";

/* -------------------------------------------------------------------------- */
/*                           BASE CHANNEL                                     */
/* -------------------------------------------------------------------------- */

export abstract class BaseChannel<TPayload> {

    protected readonly manager: WebSocketManager;

    protected readonly channel: string;

    private subscribed = false;

    private readonly handlers =

        new Set<

            (

                payload: TPayload

            ) => void

        >();

    protected constructor(

        manager: WebSocketManager,

        channel: string

    ) {

        this.manager = manager;

        this.channel = channel;

    }

    /* ---------------------------------------------------------------------- */
    /*                       SUBSCRIPTION                                     */
    /* ---------------------------------------------------------------------- */

    public abstract subscribe():

    Promise<void>;

    public abstract unsubscribe():

    Promise<void>;

    /* ---------------------------------------------------------------------- */
    /*                      HANDLERS                                          */
    /* ---------------------------------------------------------------------- */

    public on(

        handler: (

            payload: TPayload

        ) => void

    ): void {

        this.handlers.add(handler);

    }

    public off(

        handler: (

            payload: TPayload

        ) => void

    ): void {

        this.handlers.delete(handler);

    }

    protected emit(

        payload: TPayload

    ): void {

        for (

            const handler

            of this.handlers

        ) {

            try {

                handler(payload);

            }

            catch (error) {

                logger.exception(

                    error,

                    {

                        channel:

                            this.channel

                    }

                );

            }

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                      STATE                                             */
    /* ---------------------------------------------------------------------- */

    protected setSubscribed(

        value: boolean

    ): void {

        this.subscribed = value;

    }

    public isSubscribed():

    boolean {

        return this.subscribed;

    }

    public name():

    string {

        return this.channel;

    }

    public handlerCount():

    number {

        return this.handlers.size;

    }

    /* ---------------------------------------------------------------------- */
    /*                     MESSAGE                                            */
    /* ---------------------------------------------------------------------- */

    protected abstract handleMessage(

        message: WebSocketMessage<TPayload>

    ): Promise<void>;

}
    /* ---------------------------------------------------------------------- */
    /*                  MANAGER REGISTRATION                                  */
    /* ---------------------------------------------------------------------- */

    protected register(): void {

        this.manager.onMessage(

            this.channel,

            this.routeMessage.bind(this)

        );

        logger.info(

            `Registered '${this.channel}' channel.`

        );

    }

    protected unregister(): void {

        this.manager.offMessage(

            this.channel,

            this.routeMessage.bind(this)

        );

        logger.info(

            `Unregistered '${this.channel}' channel.`

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    MESSAGE ROUTING                                     */
    /* ---------------------------------------------------------------------- */

    private async routeMessage(

        message: WebSocketMessage

    ): Promise<void> {

        await this.handleMessage(

            message as WebSocketMessage<TPayload>

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                   DEFAULT SUBSCRIBE                                    */
    /* ---------------------------------------------------------------------- */

    protected async subscribeInternal(

        message: WebSocketMessage

    ): Promise<void> {

        const sent =

            this.manager.send(message);

        if (!sent) {

            throw new Error(

                `Failed to subscribe to '${this.channel}'.`

            );

        }

        this.manager.subscribe(

            this.channel

        );

        this.setSubscribed(true);

        logger.info(

            `Subscribed to '${this.channel}'.`

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                 DEFAULT UNSUBSCRIBE                                    */
    /* ---------------------------------------------------------------------- */

    protected async unsubscribeInternal(

        message: WebSocketMessage

    ): Promise<void> {

        const sent =

            this.manager.send(message);

        if (!sent) {

            throw new Error(

                `Failed to unsubscribe from '${this.channel}'.`

            );

        }

        this.manager.unsubscribe(

            this.channel

        );

        this.setSubscribed(false);

        logger.info(

            `Unsubscribed from '${this.channel}'.`

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     RECONNECT                                          */
    /* ---------------------------------------------------------------------- */

    public async reconnect(

        subscribeMessage: WebSocketMessage

    ): Promise<void> {

        if (

            !this.isSubscribed()

        ) {

            return;

        }

        logger.info(

            `Reconnecting '${this.channel}' channel.`

        );

        await this.subscribeInternal(

            subscribeMessage

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    LIFECYCLE                                           */
    /* ---------------------------------------------------------------------- */

    protected async onSubscribed():

    Promise<void> {

        // For subclasses

    }

    protected async onUnsubscribed():

    Promise<void> {

        // For subclasses

    }

    protected async beforeHandle(

        _message: WebSocketMessage<TPayload>

    ): Promise<void> {

        // For subclasses

    }

    protected async afterHandle(

        _message: WebSocketMessage<TPayload>

    ): Promise<void> {

        // For subclasses

    }
        /* ---------------------------------------------------------------------- */
    /*                        ERROR HANDLING                                  */
    /* ---------------------------------------------------------------------- */

    protected async handleError(

        error: unknown

    ): Promise<void> {

        logger.exception(

            error,

            {

                channel: this.channel

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                          RETRY                                         */
    /* ---------------------------------------------------------------------- */

    protected async retry(

        operation: () => Promise<void>,

        attempts = 3

    ): Promise<void> {

        let lastError: unknown;

        for (

            let attempt = 1;

            attempt <= attempts;

            attempt++

        ) {

            try {

                await operation();

                return;

            }

            catch (error) {

                lastError = error;

                logger.warn(

                    `Retry ${attempt}/${attempts} failed.`,

                    {

                        channel: this.channel

                    }

                );

            }

        }

        throw lastError;

    }

    /* ---------------------------------------------------------------------- */
    /*                       STATISTICS                                       */
    /* ---------------------------------------------------------------------- */

    public statistics() {

        return {

            channel: this.channel,

            subscribed: this.subscribed,

            handlers: this.handlers.size

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                       HEALTH                                           */
    /* ---------------------------------------------------------------------- */

    public healthy(): boolean {

        return (

            this.manager.healthy() &&

            this.subscribed

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                        PAUSE                                           */
    /* ---------------------------------------------------------------------- */

    private paused = false;

    public pause(): void {

        this.paused = true;

        logger.info(

            `Paused '${this.channel}' channel.`

        );

    }

    public resume(): void {

        this.paused = false;

        logger.info(

            `Resumed '${this.channel}' channel.`

        );

    }

    public isPaused(): boolean {

        return this.paused;

    }

    /* ---------------------------------------------------------------------- */
    /*                      SAFE EMIT                                         */
    /* ---------------------------------------------------------------------- */

    protected emitSafe(

        payload: TPayload

    ): void {

        if (

            this.paused

        ) {

            return;

        }

        this.emit(payload);

    }

    /* ---------------------------------------------------------------------- */
    /*                       RESET                                            */
    /* ---------------------------------------------------------------------- */

    public reset(): void {

        this.handlers.clear();

        this.subscribed = false;

        this.paused = false;

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public information() {

        return {

            ...this.statistics(),

            healthy: this.healthy(),

            paused: this.paused

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                      INITIALIZATION                                    */
    /* ---------------------------------------------------------------------- */

    protected initialize(): void {

        this.register();

        logger.info(

            `Initialized '${this.channel}' channel.`

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      CONNECTION HELPERS                                */
    /* ---------------------------------------------------------------------- */

    protected ensureConnected(): void {

        if (

            !this.manager.isConnected()

        ) {

            throw new Error(

                `WebSocket is not connected for channel '${this.channel}'.`

            );

        }

    }

    protected ensureSubscribed(): void {

        if (

            !this.subscribed

        ) {

            throw new Error(

                `Channel '${this.channel}' is not subscribed.`

            );

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                      UTILITIES                                         */
    /* ---------------------------------------------------------------------- */

    protected canProcess(): boolean {

        return (

            this.manager.healthy() &&

            this.subscribed &&

            !this.paused

        );

    }

    protected async processMessage(

        message: WebSocketMessage<TPayload>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        try {

            await this.beforeHandle(

                message

            );

            await this.handleMessage(

                message

            );

            await this.afterHandle(

                message

            );

        }

        catch (error) {

            await this.handleError(

                error

            );

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                        CLEANUP                                         */
    /* ---------------------------------------------------------------------- */

    public destroy(): void {

        this.unregister();

        this.reset();

        logger.info(

            `Destroyed '${this.channel}' channel.`

        );

    }

}