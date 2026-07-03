/**
 * ============================================================================
 * EVENT DISPATCHER
 * ============================================================================
 *
 * Central event bus for the WebSocket subsystem.
 * ============================================================================
 */

type Listener<T = unknown> = (payload: T) => void;

export class EventDispatcher {

    private readonly listeners =

        new Map<string, Set<Listener>>();

    public on<T = unknown>(

        event: string,

        listener: Listener<T>

    ): void {

        if (

            !this.listeners.has(event)

        ) {

            this.listeners.set(

                event,

                new Set()

            );

        }

        this.listeners

            .get(event)!

            .add(listener as Listener);

    }

    public off<T = unknown>(

        event: string,

        listener: Listener<T>

    ): void {

        this.listeners

            .get(event)

            ?.delete(listener as Listener);

    }

    public emit<T = unknown>(

        event: string,

        payload: T

    ): void {

        this.listeners

            .get(event)

            ?.forEach(listener =>

                listener(payload)

            );

    }

    public clear(): void {

        this.listeners.clear();

    }

}

export function createEventDispatcher() {

    return new EventDispatcher();

}