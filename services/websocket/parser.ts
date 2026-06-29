/**
 * ============================================================================
 * WEBSOCKET PARSER
 * ============================================================================
 * Responsible for safely parsing, validating and normalizing incoming
 * websocket messages before they enter the application.
 * ============================================================================
 */

import {

    WebSocketMessage,
    ParseResult,
    ErrorMessage,
    WebSocketMessageType

} from "./types";

import {

    logger

} from "./logger";

/* -------------------------------------------------------------------------- */
/*                           PARSER CLASS                                     */
/* -------------------------------------------------------------------------- */

export class WebSocketParser {

    /* ---------------------------------------------------------------------- */
    /*                      SAFE JSON PARSER                                  */
    /* ---------------------------------------------------------------------- */

    public parse<T>(

        raw: string

    ): ParseResult<T> {

        try {

            const parsed = JSON.parse(raw);

            const normalized =

                this.normalize(parsed);

            const validation =

                this.validate(normalized);

            if (!validation.successful) {

                return validation;

            }

            return {

                successful: true,

                message: normalized

            };

        }

        catch (error) {

            logger.error(

                "Failed to parse websocket message.",

                {

                    raw,

                    error

                }

            );

            return {

                successful: false,

                error: {

                    code: "PARSE_ERROR",

                    message: "Invalid JSON received.",

                    details: error,

                    recoverable: true,

                    timestamp: new Date()

                }

            };

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                        NORMALIZATION                                   */
    /* ---------------------------------------------------------------------- */

    private normalize<T>(

        message: any

    ): WebSocketMessage<T> {

        if (

            message?.header?.timestamp

        ) {

            message.header.timestamp =

                new Date(

                    message.header.timestamp

                );

        }

        return message;

    }

    /* ---------------------------------------------------------------------- */
    /*                          VALIDATION                                    */
    /* ---------------------------------------------------------------------- */

    private validate<T>(

        message: WebSocketMessage<T>

    ): ParseResult<T> {

        if (!message) {

            return this.failure(

                "Message is null."

            );

        }

        if (!message.header) {

            return this.failure(

                "Header is missing."

            );

        }

        if (!message.metadata) {

            return this.failure(

                "Metadata is missing."

            );

        }

        if (

            message.payload === undefined

        ) {

            return this.failure(

                "Payload is missing."

            );

        }

        return {

            successful: true,

            message

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                    MESSAGE TYPE VALIDATION                             */
    /* ---------------------------------------------------------------------- */

    private validateMessageType(

        type: unknown

    ): boolean {

        return Object.values(

            WebSocketMessageType

        ).includes(

            type as WebSocketMessageType

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                      HEADER VALIDATION                                 */
    /* ---------------------------------------------------------------------- */

    private validateHeader(

        header: unknown

    ): ErrorMessage | null {

        if (

            !header ||

            typeof header !== "object"

        ) {

            return this.error(

                "INVALID_HEADER",

                "Header is invalid."

            );

        }

        const value =

            header as Record<string, unknown>;

        if (

            typeof value.id !== "string" ||

            value.id.length === 0

        ) {

            return this.error(

                "INVALID_MESSAGE_ID",

                "Message id is invalid."

            );

        }

        if (

            !this.validateMessageType(

                value.type

            )

        ) {

            return this.error(

                "INVALID_MESSAGE_TYPE",

                "Unknown message type."

            );

        }

        if (

            !this.isValidTimestamp(

                value.timestamp

            )

        ) {

            return this.error(

                "INVALID_TIMESTAMP",

                "Timestamp is invalid."

            );

        }

        return null;

    }

    /* ---------------------------------------------------------------------- */
    /*                    METADATA VALIDATION                                 */
    /* ---------------------------------------------------------------------- */

    private validateMetadata(

        metadata: unknown

    ): ErrorMessage | null {

        if (

            !metadata ||

            typeof metadata !== "object"

        ) {

            return this.error(

                "INVALID_METADATA",

                "Metadata is invalid."

            );

        }

        const value =

            metadata as Record<string, unknown>;

        if (

            typeof value.compressed !== "boolean"

        ) {

            return this.error(

                "INVALID_METADATA",

                "compressed must be boolean."

            );

        }

        if (

            typeof value.encrypted !== "boolean"

        ) {

            return this.error(

                "INVALID_METADATA",

                "encrypted must be boolean."

            );

        }

        if (

            typeof value.retryCount !== "number"

        ) {

            return this.error(

                "INVALID_METADATA",

                "retryCount must be numeric."

            );

        }

        return null;

    }

    /* ---------------------------------------------------------------------- */
    /*                    PAYLOAD VALIDATION                                  */
    /* ---------------------------------------------------------------------- */

    private validatePayload(

        payload: unknown

    ): ErrorMessage | null {

        if (

            payload === undefined

        ) {

            return this.error(

                "INVALID_PAYLOAD",

                "Payload is missing."

            );

        }

        return null;

    }

    /* ---------------------------------------------------------------------- */
    /*                    TIMESTAMP VALIDATION                                */
    /* ---------------------------------------------------------------------- */

    private isValidTimestamp(

        value: unknown

    ): boolean {

        if (

            value instanceof Date

        ) {

            return !isNaN(

                value.getTime()

            );

        }

        if (

            typeof value === "string"

        ) {

            return !isNaN(

                Date.parse(value)

            );

        }

        return false;

    }

    /* ---------------------------------------------------------------------- */
    /*                      UUID VALIDATION                                   */
    /* ---------------------------------------------------------------------- */

    private isValidUuid(

        value: string

    ): boolean {

        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

            .test(value);

    }

    /* ---------------------------------------------------------------------- */
    /*                     VALIDATION RUNNER                                  */
    /* ---------------------------------------------------------------------- */

    private validateStructure<T>(

        message: WebSocketMessage<T>

    ): ParseResult<T> {

        const headerError =

            this.validateHeader(

                message.header

            );

        if (headerError) {

            return {

                successful: false,

                error: headerError

            };

        }

        const metadataError =

            this.validateMetadata(

                message.metadata

            );

        if (metadataError) {

            return {

                successful: false,

                error: metadataError

            };

        }

        const payloadError =

            this.validatePayload(

                message.payload

            );

        if (payloadError) {

            return {

                successful: false,

                error: payloadError

            };

        }

        return {

            successful: true,

            message

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                     UNKNOWN FIELD DETECTION                            */
    /* ---------------------------------------------------------------------- */

    private removeUnknownFields<T>(

        message: Record<string, unknown>

    ): Record<string, unknown> {

        const allowedFields = [

            "header",

            "metadata",

            "payload"

        ];

        return Object.fromEntries(

            Object.entries(message).filter(

                ([key]) => allowedFields.includes(key)

            )

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                        MESSAGE SANITIZATION                            */
    /* ---------------------------------------------------------------------- */

    private sanitize<T>(

        message: WebSocketMessage<T>

    ): WebSocketMessage<T> {

        return {

            ...message,

            header: {

                ...message.header,

                id: String(message.header.id).trim(),

                version: String(message.header.version).trim()

            }

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                     MAXIMUM PAYLOAD SIZE                               */
    /* ---------------------------------------------------------------------- */

    private validatePayloadSize<T>(

        message: WebSocketMessage<T>,

        maximumSize = 1024 * 1024

    ): ErrorMessage | null {

        const size = new TextEncoder()

            .encode(

                JSON.stringify(message.payload)

            ).length;

        if (size > maximumSize) {

            return this.error(

                "PAYLOAD_TOO_LARGE",

                `Payload exceeds ${maximumSize} bytes.`

            );

        }

        return null;

    }

    /* ---------------------------------------------------------------------- */
    /*                       STRING LENGTH VALIDATION                         */
    /* ---------------------------------------------------------------------- */

    private validateStringLength(

        value: string,

        maximumLength = 4096

    ): boolean {

        return value.length <= maximumLength;

    }

    /* ---------------------------------------------------------------------- */
    /*                      RECURSIVE NORMALIZATION                           */
    /* ---------------------------------------------------------------------- */

    private normalizeObject(

        value: unknown

    ): unknown {

        if (Array.isArray(value)) {

            return value.map(item =>

                this.normalizeObject(item)

            );

        }

        if (

            value !== null &&

            typeof value === "object"

        ) {

            const normalized:

                Record<string, unknown> = {};

            for (

                const [key, val]

                of Object.entries(

                    value as Record<string, unknown>

                )

            ) {

                normalized[key] =

                    this.normalizeObject(val);

            }

            return normalized;

        }

        if (

            typeof value === "string"

        ) {

            return value.trim();

        }

        return value;

    }

    /* ---------------------------------------------------------------------- */
    /*                      SAFE CLONE                                        */
    /* ---------------------------------------------------------------------- */

    private clone<T>(

        value: T

    ): T {

        return structuredClone(value);

    }

    /* ---------------------------------------------------------------------- */
    /*                    COMPLETE SANITIZATION                               */
    /* ---------------------------------------------------------------------- */

    public sanitizeMessage<T>(

        message: WebSocketMessage<T>

    ): ParseResult<T> {

        const payloadError =

            this.validatePayloadSize(message);

        if (payloadError) {

            return {

                successful: false,

                error: payloadError

            };

        }

        const cleaned =

            this.sanitize(

                this.clone(message)

            );

        cleaned.payload =

            this.normalizeObject(

                cleaned.payload

            ) as T;

        return {

            successful: true,

            message: cleaned

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                        SECURITY CHECKS                                 */
    /* ---------------------------------------------------------------------- */

    private containsDangerousKeys(

        value: unknown

    ): boolean {

        if (

            value === null ||

            typeof value !== "object"

        ) {

            return false;

        }

        const dangerousKeys = [

            "__proto__",

            "prototype",

            "constructor"

        ];

        for (

            const [key, child]

            of Object.entries(

                value as Record<string, unknown>

            )

        ) {

            if (

                dangerousKeys.includes(key)

            ) {

                return true;

            }

            if (

                this.containsDangerousKeys(child)

            ) {

                return true;

            }

        }

        return false;

    }

    /* ---------------------------------------------------------------------- */
    /*                      SECURITY VALIDATION                               */
    /* ---------------------------------------------------------------------- */

    public securityCheck<T>(

        message: WebSocketMessage<T>

    ): ParseResult<T> {

        if (

            this.containsDangerousKeys(message)

        ) {

            return this.failure(

                "Dangerous object detected."

            );

        }

        return {

            successful: true,

            message

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                      RECOVERY                                          */
    /* ---------------------------------------------------------------------- */

    public recover<T>(

        raw: string

    ): ParseResult<T> {

        try {

            const cleaned = raw.trim();

            return this.parse<T>(cleaned);

        }

        catch {

            return this.failure(

                "Unable to recover message."

            );

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                      FAILURE HELPER                                    */
    /* ---------------------------------------------------------------------- */

    private failure<T>(

        message: string

    ): ParseResult<T> {

        logger.warn(

            message

        );

        return {

            successful: false,

            error: this.error(

                "PARSER_ERROR",

                message

            )

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                      ERROR FACTORY                                     */
    /* ---------------------------------------------------------------------- */

    private error(

        code: string,

        message: string,

        details?: unknown

    ): ErrorMessage {

        return {

            code,

            message,

            details,

            recoverable: false,

            timestamp: new Date()

        };

    }

    /* ---------------------------------------------------------------------- */
    /*                      PUBLIC UTILITIES                                  */
    /* ---------------------------------------------------------------------- */

    public isValid<T>(

        raw: string

    ): boolean {

        return this.parse<T>(raw).successful;

    }

    public parseOrThrow<T>(

        raw: string

    ): WebSocketMessage<T> {

        const result = this.parse<T>(raw);

        if (

            !result.successful ||

            !result.message

        ) {

            throw new Error(

                result.error?.message ??

                "Failed to parse message."

            );

        }

        return result.message;

    }

    public pretty<T>(

        message: WebSocketMessage<T>

    ): string {

        return JSON.stringify(

            message,

            null,

            4

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                          SINGLETON                                         */
/* -------------------------------------------------------------------------- */

export const parser =

    new WebSocketParser();

/* -------------------------------------------------------------------------- */
/*                          FACTORY                                           */
/* -------------------------------------------------------------------------- */

export function createParser():

WebSocketParser {

    return new WebSocketParser();

}