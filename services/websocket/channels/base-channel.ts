import { EventEmitter } from "events";
import { WebSocketManager } from "../manager";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

export interface ChannelConfiguration {

    readonly name: string;

    readonly autoSubscribe?: boolean;

}

/* -------------------------------------------------------------------------- */
/* BASE CHANNEL                                                               */
/* -------------------------------------------------------------------------- */

export abstract class BaseChannel<T> extends EventEmitter {

    protected readonly manager: WebSocketManager;

    protected readonly configuration: ChannelConfiguration;

    private subscribed = false;

    protected constructor(

        manager: WebSocketManager,

        configuration: ChannelConfiguration

    ) {

        super();

        this.manager = manager;

        this.configuration = configuration;

    }

    /* ---------------------------------------------------------------------- */
    /* INITIALIZATION                                                         */
    /* ---------------------------------------------------------------------- */

    protected initialize(): void {

        this.manager.on(

            "message",

            (message: unknown) => {

                void this.handleMessage(message);

            }

        );

        if (

            this.configuration.autoSubscribe

        ) {

            this.subscribe();

        }

    }

    /* ---------------------------------------------------------------------- */
    /* ABSTRACT METHODS                                                       */
    /* ---------------------------------------------------------------------- */

    public abstract subscribe(): void;

    public abstract unsubscribe(): void;

    protected abstract handleMessage(

        message: unknown

    ): Promise<void>;

    /* ---------------------------------------------------------------------- */
    /* CONNECTION                                                             */
    /* ---------------------------------------------------------------------- */

    protected ensureConnected(): void {

        if (

            !this.manager.connected()

        ) {

            throw new Error(

                "WebSocket is not connected."

            );

        }

    }

    protected canProcess(): boolean {

        return this.manager.connected();

    }

    /* ---------------------------------------------------------------------- */
    /* SUBSCRIPTION                                                           */
    /* ---------------------------------------------------------------------- */

    protected setSubscribed(

        value: boolean

    ): void {

        this.subscribed = value;

    }

    public isSubscribed(): boolean {

        return this.subscribed;

    }

    /* ---------------------------------------------------------------------- */
    /* HELPERS                                                                */
    /* ---------------------------------------------------------------------- */

    protected emitSafe(

        payload: T

    ): void {

        this.emit(

            "message",

            payload

        );

    }

    public onMessage(

        listener: (payload: T) => void

    ): this {

        this.on(

            "message",

            listener

        );

        return this;

    }

    public offMessage(

        listener: (payload: T) => void

    ): this {

        this.off(

            "message",

            listener

        );

        return this;

    }

    public name(): string {

        return this.configuration.name;

    }

    /* ---------------------------------------------------------------------- */
    /* STATUS                                                                 */
    /* ---------------------------------------------------------------------- */

    public healthy(): boolean {

        return this.manager.connected();

    }

    public statistics() {

        return {

            name: this.configuration.name,

            subscribed: this.subscribed,

            connected: this.manager.connected()

        };

    }

    public information() {

        return {

            configuration: this.configuration,

            statistics: this.statistics()

        };

    }

    /* ---------------------------------------------------------------------- */
    /* LIFECYCLE                                                              */
    /* ---------------------------------------------------------------------- */

    protected async onSubscribed(): Promise<void> {}

    protected async onUnsubscribed(): Promise<void> {}

    public reset(): void {

        this.subscribed = false;

    }

    public destroy(): void {

        this.removeAllListeners();

        this.reset();

    }

}