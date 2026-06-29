/**
 * ============================================================================
 * WEBSOCKET MESSAGE FACTORY
 * ============================================================================
 * Responsible for creating, serializing and validating websocket messages.
 * ============================================================================
 */

import {

    WebSocketMessage,
    MessageHeader,
    MessageMetadata,
    RequestMessage,
    ResponseMessage,
    EventMessage,
    ErrorMessage,
    WebSocketMessageType

} from "./types";

import {

    logger

} from "./logger";

import {

    WS_API_VERSION

} from "./constants";

/* -------------------------------------------------------------------------- */
/*                         MESSAGE FACTORY                                    */
/* -------------------------------------------------------------------------- */

export class WebSocketMessageFactory {

    /* ---------------------------------------------------------------------- */
    /*                           HEADER                                       */
    /* ---------------------------------------------------------------------- */

    private static createHeader(

        type: WebSocketMessageType,

        channel?: string,

        correlationId?: string

    ): MessageHeader {

        return {

            id: crypto.randomUUID(),

            type,

            timestamp: new Date(),

            correlationId,

            requestId: undefined,

            channel,

            version: WS_API_VERSION

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                         METADATA                                       */
    /* ---------------------------------------------------------------------- */

    private static createMetadata(): MessageMetadata {

        return {

            compressed: false,

            encrypted: false,

            retryCount: 0

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                       BASE MESSAGE                                     */
    /* ---------------------------------------------------------------------- */

    public static create<T>(

        type: WebSocketMessageType,

        payload: T,

        channel?: string

    ): WebSocketMessage<T> {

        return {

            header: this.createHeader(

                type,

                channel

            ),

            metadata: this.createMetadata(),

            payload

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                       REQUEST                                          */
    /* ---------------------------------------------------------------------- */

    public static request<T>(

        operation: string,

        payload: T,

        channel?: string

    ): RequestMessage<T> {

        return {

            ...this.create(

                WebSocketMessageType.REQUEST,

                payload,

                channel

            ),

            operation,

            requiresAuthentication: true,

            sent: false

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                       RESPONSE                                         */
    /* ---------------------------------------------------------------------- */

    public static response<T>(

        payload: T,

        statusCode = 200,

        statusMessage = "OK"

    ): ResponseMessage<T> {

        return {

            ...this.create(

                WebSocketMessageType.RESPONSE,

                payload

            ),

            receivedAt: new Date(),

            success: statusCode < 400,

            statusCode,

            statusMessage

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                         EVENT                                          */
    /* ---------------------------------------------------------------------- */

    public static event<T>(

        event: string,

        channel: string,

        payload: T

    ): EventMessage<T> {

        return {

            ...this.create(

                WebSocketMessageType.EVENT,

                payload,

                channel

            ),

            receivedAt: new Date(),

            event,

            channel

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                          ERROR                                         */
    /* ---------------------------------------------------------------------- */

    public static error(

        code: string,

        message: string,

        details?: unknown,

        recoverable = false

    ): ResponseMessage<ErrorMessage> {

        return {

            ...this.create(

                WebSocketMessageType.ERROR,

                {

                    code,

                    message,

                    details,

                    recoverable,

                    timestamp: new Date()

                }

            ),

            receivedAt: new Date(),

            success: false,

            statusCode: 500,

            statusMessage: message

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                           PING                                         */
    /* ---------------------------------------------------------------------- */

    public static ping(): WebSocketMessage<null> {

        return this.create(

            WebSocketMessageType.PING,

            null

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                           PONG                                         */
    /* ---------------------------------------------------------------------- */

    public static pong(): WebSocketMessage<null> {

        return this.create(

            WebSocketMessageType.PONG,

            null

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                        HEARTBEAT                                       */
    /* ---------------------------------------------------------------------- */

    public static heartbeat(): WebSocketMessage<null> {

        return this.create(

            WebSocketMessageType.HEARTBEAT,

            null

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     AUTHENTICATION                                     */
    /* ---------------------------------------------------------------------- */

    public static authentication(

        token: string

    ): RequestMessage<{

        token: string;

    }> {

        return this.request(

            "authenticate",

            {

                token

            }

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     SUBSCRIPTION                                       */
    /* ---------------------------------------------------------------------- */

    public static subscribe(

        channel: string,

        payload: Record<string, unknown> = {}

    ): RequestMessage<Record<string, unknown>> {

        return this.request(

            "subscribe",

            payload,

            channel

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    UNSUBSCRIPTION                                      */
    /* ---------------------------------------------------------------------- */

    public static unsubscribe(

        channel: string,

        payload: Record<string, unknown> = {}

    ): RequestMessage<Record<string, unknown>> {

        return this.request(

            "unsubscribe",

            payload,

            channel

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                          LOGGING                                       */
    /* ---------------------------------------------------------------------- */

    public static logCreatedMessage<T>(

        message: WebSocketMessage<T>

    ): void {

        logger.debug(

            "WebSocket message created.",

            {

                id: message.header.id,

                type: message.header.type,

                channel: message.header.channel

            }

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                      SERIALIZATION                                     */
    /* ---------------------------------------------------------------------- */

    public static serialize<T>(

        message: WebSocketMessage<T>

    ): string {

        this.logCreatedMessage(message);

        return JSON.stringify(message);

    }

    /* ---------------------------------------------------------------------- */
    /*                     DESERIALIZATION                                    */
    /* ---------------------------------------------------------------------- */

    public static deserialize<T>(

        data: string

    ): WebSocketMessage<T> {

        return JSON.parse(data) as WebSocketMessage<T>;

    }

    /* ---------------------------------------------------------------------- */
    /*                        SAFE DESERIALIZATION                            */
    /* ---------------------------------------------------------------------- */

    public static tryDeserialize<T>(

        data: string

    ): {

        success: boolean;

        message?: WebSocketMessage<T>;

        error?: Error;

    } {

        try {

            return {

                success: true,

                message: this.deserialize<T>(data)

            };

        }

        catch (error) {

            return {

                success: false,

                error: error instanceof Error

                    ? error

                    : new Error("Unknown deserialization error.")

            };

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                         VALIDATION                                     */
    /* ---------------------------------------------------------------------- */

    public static validate<T>(

        message: WebSocketMessage<T>

    ): boolean {

        return (

            message !== null &&

            message !== undefined &&

            message.header !== undefined &&

            message.metadata !== undefined &&

            message.payload !== undefined &&

            typeof message.header.id === "string" &&

            message.header.id.length > 0 &&

            message.header.timestamp instanceof Date

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                        CORRELATION ID                                  */
    /* ---------------------------------------------------------------------- */

    public static setCorrelationId<T>(

        message: WebSocketMessage<T>,

        correlationId: string

    ): WebSocketMessage<T> {

        message.header.correlationId = correlationId;

        return message;

    }

    /* ---------------------------------------------------------------------- */
    /*                          REQUEST ID                                    */
    /* ---------------------------------------------------------------------- */

    public static setRequestId<T>(

        message: WebSocketMessage<T>,

        requestId: string

    ): WebSocketMessage<T> {

        message.header.requestId = requestId;

        return message;

    }

    /* ---------------------------------------------------------------------- */
    /*                            CLONE                                       */
    /* ---------------------------------------------------------------------- */

    public static clone<T>(

        message: WebSocketMessage<T>

    ): WebSocketMessage<T> {

        return this.deserialize<T>(

            this.serialize(message)

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                       MESSAGE SIZE                                     */
    /* ---------------------------------------------------------------------- */

    public static size<T>(

        message: WebSocketMessage<T>

    ): number {

        return new TextEncoder()

            .encode(

                this.serialize(message)

            ).length;

    }

    /* ---------------------------------------------------------------------- */
    /*                        MESSAGE TYPE                                    */
    /* ---------------------------------------------------------------------- */

    public static isRequest<T>(

        message: WebSocketMessage<T>

    ): boolean {

        return (

            message.header.type ===

            WebSocketMessageType.REQUEST

        );

    }

    public static isResponse<T>(

        message: WebSocketMessage<T>

    ): boolean {

        return (

            message.header.type ===

            WebSocketMessageType.RESPONSE

        );

    }

    public static isEvent<T>(

        message: WebSocketMessage<T>

    ): boolean {

        return (

            message.header.type ===

            WebSocketMessageType.EVENT

        );

    }

    public static isError<T>(

        message: WebSocketMessage<T>

    ): boolean {

        return (

            message.header.type ===

            WebSocketMessageType.ERROR

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                    TIMESTAMP NORMALIZATION                             */
    /* ---------------------------------------------------------------------- */

    public static normalize<T>(

        message: WebSocketMessage<T>

    ): WebSocketMessage<T> {

        message.header.timestamp =

            new Date(message.header.timestamp);

        return message;

    }

    /* ---------------------------------------------------------------------- */
    /*                         MESSAGE ID                                     */
    /* ---------------------------------------------------------------------- */

    public static generateMessageId(): string {

        return crypto.randomUUID();

    }

    public static assignMessageId<T>(

        message: WebSocketMessage<T>

    ): WebSocketMessage<T> {

        message.header.id =

            this.generateMessageId();

        return message;

    }

    /* ---------------------------------------------------------------------- */
    /*                    CORRELATION HELPERS                                 */
    /* ---------------------------------------------------------------------- */

    public static correlate<

        TRequest,

        TResponse

    >(

        request: WebSocketMessage<TRequest>,

        response: WebSocketMessage<TResponse>

    ): boolean {

        return (

            request.header.id ===

            response.header.correlationId

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     COPY WITH PAYLOAD                                  */
    /* ---------------------------------------------------------------------- */

    public static withPayload<

        TOld,

        TNew

    >(

        message: WebSocketMessage<TOld>,

        payload: TNew

    ): WebSocketMessage<TNew> {

        return {

            ...message,

            payload

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                    COPY WITH CHANNEL                                   */
    /* ---------------------------------------------------------------------- */

    public static withChannel<T>(

        message: WebSocketMessage<T>,

        channel: string

    ): WebSocketMessage<T> {

        return {

            ...message,

            header: {

                ...message.header,

                channel

            }

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                    COPY WITH METADATA                                  */
    /* ---------------------------------------------------------------------- */

    public static withMetadata<T>(

        message: WebSocketMessage<T>,

        metadata: Partial<MessageMetadata>

    ): WebSocketMessage<T> {

        return {

            ...message,

            metadata: {

                ...message.metadata,

                ...metadata

            }

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                       PRETTY PRINT                                     */
    /* ---------------------------------------------------------------------- */

    public static prettyPrint<T>(

        message: WebSocketMessage<T>

    ): string {

        return JSON.stringify(

            message,

            null,

            4

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     IMMUTABLE COPY                                     */
    /* ---------------------------------------------------------------------- */

    public static freeze<T>(

        message: WebSocketMessage<T>

    ): Readonly<WebSocketMessage<T>> {

        return Object.freeze(

            this.clone(message)

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                     EMPTY MESSAGE                                      */
    /* ---------------------------------------------------------------------- */

    public static empty(): WebSocketMessage<null> {

        return this.create(

            WebSocketMessageType.EVENT,

            null

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                    DEFAULT FACTORY                                         */
/* -------------------------------------------------------------------------- */

export const messageFactory =

    WebSocketMessageFactory;