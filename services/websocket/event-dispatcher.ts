/**
 * ============================================================================
 * EVENT DISPATCHER
 * ============================================================================
 */

type Listener<T = unknown> = (payload: T) => void;

export class EventDispatcher {

    private readonly listeners =

        new Map<string, Set<Listener>>();

    public on<T>(

        event: string,

        listener: Listener<T>

    ) {

        const set =

            this.listeners.get(event)

            ?? new Set();

        set.add(

            listener as Listener

        );

        this.listeners.set(

            event,

            set

        );

    }

    public off<T>(

        event: string,

        listener: Listener<T>

    ) {

        this.listeners

            .get(event)

            ?.delete(

                listener as Listener

            );

    }

    public emit<T>(

        event: string,

        payload: T

    ) {

        for (

            const listener

            of this.listeners.get(event)

            ?? []

        ) {

            listener(payload);

        }

    }

    public clear() {

        this.listeners.clear();

    }

}

export function createEventDispatcher() {

    return new EventDispatcher();

}