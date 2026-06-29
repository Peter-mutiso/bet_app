/**
 * ============================================================================
 * CANDLE CHANNEL
 * ============================================================================
 * Handles realtime OHLC candle subscriptions.
 * ============================================================================
 */

import { BaseChannel } from "./base-channel";
import { WebSocketManager } from "../manager";
import { WebSocketMessage } from "../types";
import { messageFactory } from "../message";
import { logger } from "../logger";

import {

    Candle

} from "../../models/candle";

/* -------------------------------------------------------------------------- */
/*                        CHANNEL                                             */
/* -------------------------------------------------------------------------- */

export class CandleChannel extends BaseChannel<Candle> {

    private symbol?: string;

    private granularity?: number;

    constructor(

        manager: WebSocketManager

    ) {

        super(

            manager,

            "candles"

        );

        this.initialize();

    }

    /* ---------------------------------------------------------------------- */
    /*                        SUBSCRIBE                                       */
    /* ---------------------------------------------------------------------- */

    public async subscribe(

        symbol: string,

        granularity: number

    ): Promise<void> {

        this.ensureConnected();

        this.symbol = symbol;

        this.granularity = granularity;

        const message =

            messageFactory.request(

                "subscribe",

                {

                    candles: symbol,

                    granularity

                },

                this.name()

            );

        await this.subscribeInternal(

            message

        );

        await this.onSubscribed();

    }

    /* ---------------------------------------------------------------------- */
    /*                      UNSUBSCRIBE                                       */
    /* ---------------------------------------------------------------------- */

    public async unsubscribe():

    Promise<void> {

        this.ensureConnected();

        if (

            !this.symbol ||

            !this.granularity

        ) {

            return;

        }

        const message =

            messageFactory.request(

                "unsubscribe",

                {

                    candles: this.symbol,

                    granularity:

                        this.granularity

                },

                this.name()

            );

        await this.unsubscribeInternal(

            message

        );

        this.symbol = undefined;

        this.granularity = undefined;

        await this.onUnsubscribed();

    }

    /* ---------------------------------------------------------------------- */
    /*                    HANDLE MESSAGE                                      */
    /* ---------------------------------------------------------------------- */

    protected async handleMessage(

        message: WebSocketMessage<Candle>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        this.emitSafe(

            message.payload

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                     VALIDATION                                         */
    /* ---------------------------------------------------------------------- */

    private validateCandle(

        candle: Candle

    ): boolean {

        return (

            typeof candle.open === "number" &&

            typeof candle.high === "number" &&

            typeof candle.low === "number" &&

            typeof candle.close === "number"

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     CACHE                                              */
    /* ---------------------------------------------------------------------- */

    private readonly candles: Candle[] = [];

    private readonly maximumCandles = 1000;

    private lastCandle?: Candle;

    private remember(

        candle: Candle

    ): void {

        this.lastCandle = candle;

        this.candles.push(candle);

        if (

            this.candles.length >

            this.maximumCandles

        ) {

            this.candles.shift();

        }

    }

    public latest():

    Candle | undefined {

        return this.lastCandle;

    }

    public history():

    readonly Candle[] {

        return [...this.candles];

    }

    /* ---------------------------------------------------------------------- */
    /*                    TIMEFRAME MANAGEMENT                                */
    /* ---------------------------------------------------------------------- */

    public currentGranularity():

    number | undefined {

        return this.granularity;

    }

    public currentSymbol():

    string | undefined {

        return this.symbol;

    }

    public async switchTimeframe(

        granularity: number

    ): Promise<void> {

        if (

            this.granularity === granularity ||

            !this.symbol

        ) {

            return;

        }

        await this.unsubscribe();

        await this.subscribe(

            this.symbol,

            granularity

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    RECONNECT                                           */
    /* ---------------------------------------------------------------------- */

    public async reconnect():

    Promise<void> {

        if (

            !this.symbol ||

            !this.granularity

        ) {

            return;

        }

        logger.info(

            `Restoring candle subscription for '${this.symbol}'.`

        );

        await this.subscribe(

            this.symbol,

            this.granularity

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public override statistics() {

        return {

            ...super.statistics(),

            symbol: this.symbol,

            granularity: this.granularity,

            cachedCandles: this.candles.length

        };

    }

    public override healthy(): boolean {

        return (

            super.healthy() &&

            this.symbol !== undefined &&

            this.granularity !== undefined

        );

    }

    protected override async onSubscribed():

    Promise<void> {

        logger.info(

            `Subscribed to candles for '${this.symbol}' (${this.granularity}).`

        );

    }

    protected override async onUnsubscribed():

    Promise<void> {

        logger.info(

            "Candle subscription closed."

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                    CACHE UPDATE                                        */
    /* ---------------------------------------------------------------------- */

    private updateCache(

        candle: Candle

    ): void {

        const index =

            this.candles.findIndex(

                current =>

                    current.epoch ===

                    candle.epoch

            );

        if (

            index >= 0

        ) {

            this.candles[index] = candle;

        }

        else {

            this.candles.push(candle);

        }

        this.lastCandle = candle;

        while (

            this.candles.length >

            this.maximumCandles

        ) {

            this.candles.shift();

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                      LOOKUP                                            */
    /* ---------------------------------------------------------------------- */

    public find(

        epoch: number

    ): Candle | undefined {

        return this.candles.find(

            candle =>

                candle.epoch === epoch

        );

    }

    public hasCandle(

        epoch: number

    ): boolean {

        return this.find(epoch)

            !== undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                    HANDLE MESSAGE                                      */
    /* ---------------------------------------------------------------------- */

    protected override async handleMessage(

        message: WebSocketMessage<Candle>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        const candle =

            message.payload;

        if (

            !this.validateCandle(

                candle

            )

        ) {

            logger.warn(

                "Invalid candle received."

            );

            return;

        }

        this.updateCache(

            candle

        );

        this.emitSafe(

            candle

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     CACHE MANAGEMENT                                   */
    /* ---------------------------------------------------------------------- */

    public clearHistory(): void {

        this.candles.length = 0;

        this.lastCandle = undefined;

    }

    public cacheSize(): number {

        return this.candles.length;

    }

    public hasHistory(): boolean {

        return this.candles.length > 0;

    }

    /* ---------------------------------------------------------------------- */
    /*                        RESET                                           */
    /* ---------------------------------------------------------------------- */

    public override reset(): void {

        super.reset();

        this.symbol = undefined;

        this.granularity = undefined;

        this.clearHistory();

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public override information() {

        return {

            ...super.information(),

            symbol: this.symbol,

            granularity: this.granularity,

            latestEpoch:

                this.lastCandle?.epoch,

            cachedCandles:

                this.candles.length

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                    EXPORT HISTORY                                      */
    /* ---------------------------------------------------------------------- */

    public exportHistory():

    readonly Candle[] {

        return Object.freeze(

            [...this.candles]

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    PRICE HELPERS                                       */
    /* ---------------------------------------------------------------------- */

    public latestClose():

    number | undefined {

        return this.lastCandle?.close;

    }

    public latestOpen():

    number | undefined {

        return this.lastCandle?.open;

    }

    public latestHigh():

    number | undefined {

        return this.lastCandle?.high;

    }

    public latestLow():

    number | undefined {

        return this.lastCandle?.low;

    }

    /* ---------------------------------------------------------------------- */
    /*                    DESTRUCTION                                         */
    /* ---------------------------------------------------------------------- */

    public override destroy(): void {

        this.clearHistory();

        this.symbol = undefined;

        this.granularity = undefined;

        super.destroy();

        logger.info(

            "Candle channel destroyed."

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                     FACTORY                                                */
/* -------------------------------------------------------------------------- */

export function createCandleChannel(

    manager: WebSocketManager

): CandleChannel {

    return new CandleChannel(

        manager

    );

}