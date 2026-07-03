import {
    WebSocketManager,
    ChannelRegistry,
    SubscriptionManager,
    EventDispatcher,
    createDerivWebSocketClient,
    createWebSocketManager,
    createChannelRegistry,
    createSubscriptionManager,
    createEventDispatcher
} from "../websocket";

export interface Tick {
    symbol: string;
    quote: number;
    epoch: number;
}

export class TradingProvider {

    constructor(
        private readonly manager: WebSocketManager,
        private readonly channels: ChannelRegistry,
        private readonly subscriptions: SubscriptionManager,
        private readonly dispatcher: EventDispatcher
    ) {}

    // =========================================================
    // INTERNAL READY STATE (NEW)
    // =========================================================
    private readyPromise?: Promise<void>;

    private async ensureReady(): Promise<void> {
        if (!this.readyPromise) {
            this.readyPromise = (async () => {
                await this.manager.start();
            })();
        }

        return this.readyPromise;
    }

    /* ---------------------------------------------------------------------- */
    /* CONNECTION                                                             */
    /* ---------------------------------------------------------------------- */

    public async connect(): Promise<void> {
        await this.ensureReady();
    }

    public disconnect(): void {
        this.manager.stop();
        this.readyPromise = undefined;
    }

    public connected(): boolean {
        return this.manager.connected();
    }

    /* ---------------------------------------------------------------------- */
    /* TICKS                                                                  */
    /* ---------------------------------------------------------------------- */

    public async subscribeTicks(
        symbol: string,
        callback: (tick: Tick) => void
    ): Promise<void> {

        await this.ensureReady(); // 🔥 CRITICAL FIX

        const key = `tick:${symbol}`;

        const firstSubscriber =
            this.subscriptions.subscribe(key);

        if (firstSubscriber) {
            this.channels.tick.subscribe(
                symbol,
                tick => this.dispatcher.emit(key, tick)
            );
        }

        this.dispatcher.on(key, callback);
    }

    public unsubscribeTicks(
        symbol: string,
        callback: (tick: Tick) => void
    ): void {

        const key = `tick:${symbol}`;

        this.dispatcher.off(key, callback);

        const removeSubscription =
            this.subscriptions.unsubscribe(key);

        if (removeSubscription) {
            this.channels.tick.unsubscribe(symbol);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* CANDLES                                                                */
    /* ---------------------------------------------------------------------- */

    public async subscribeCandles(
        symbol: string,
        granularity: number,
        callback: (candle: unknown) => void
    ): Promise<void> {

        await this.ensureReady(); // 🔥 CRITICAL FIX

        const key = `candle:${symbol}:${granularity}`;

        const firstSubscriber =
            this.subscriptions.subscribe(key);

        if (firstSubscriber) {
            this.channels.candle.subscribe(
                symbol,
                granularity,
                candle => this.dispatcher.emit(key, candle)
            );
        }

        this.dispatcher.on(key, callback);
    }

    public unsubscribeCandles(
        symbol: string,
        granularity: number,
        callback: (candle: unknown) => void
    ): void {

        const key = `candle:${symbol}:${granularity}`;

        this.dispatcher.off(key, callback);

        const removeSubscription =
            this.subscriptions.unsubscribe(key);

        if (removeSubscription) {
            this.channels.candle.unsubscribe(
                symbol,
                granularity
            );
        }
    }
}

/* -------------------------------------------------------------------------- */
/* SINGLETON                                                                  */
/* -------------------------------------------------------------------------- */

const websocketClient =
    createDerivWebSocketClient({
        endpoint: "wss://ws.binaryws.com/websockets/v3?app_id=1089",
        reconnect: true,
        reconnectInterval: 3000,
        heartbeatInterval: 30000
    });

const websocketManager =
    createWebSocketManager(
        websocketClient,
        {
            autoConnect: false,
            maxReconnectAttempts: Number.MAX_SAFE_INTEGER,
            reconnectDelay: 3000
        }
    );

const channelRegistry =
    createChannelRegistry(
        websocketClient
    );

const subscriptionManager =
    createSubscriptionManager();

const eventDispatcher =
    createEventDispatcher();

export const tradingProvider =
    new TradingProvider(
        websocketManager,
        channelRegistry,
        subscriptionManager,
        eventDispatcher
    );