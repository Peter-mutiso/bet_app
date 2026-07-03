/**
 * ============================================================================
 * SUBSCRIPTION MANAGER
 * ============================================================================
 */

export class SubscriptionManager {

    private readonly subscriptions =

        new Map<string, number>();

    subscribe(

        key: string

    ): boolean {

        const count =

            this.subscriptions.get(

                key

            ) ?? 0;

        this.subscriptions.set(

            key,

            count + 1

        );

        return count === 0;

    }

    unsubscribe(

        key: string

    ): boolean {

        const count =

            this.subscriptions.get(

                key

            );

        if (

            count === undefined

        ) {

            return false;

        }

        if (

            count <= 1

        ) {

            this.subscriptions.delete(

                key

            );

            return true;

        }

        this.subscriptions.set(

            key,

            count - 1

        );

        return false;

    }

    subscribed(

        key: string

    ) {

        return this.subscriptions.has(

            key

        );

    }

    count(

        key: string

    ) {

        return this.subscriptions.get(

            key

        ) ?? 0;

    }

    clear() {

        this.subscriptions.clear();

    }

}

export function createSubscriptionManager() {

    return new SubscriptionManager();

}