export enum TradingSessionState {

    DISCONNECTED,

    CONNECTING,

    CONNECTED,

    RECONNECTING

}

export class TradingSession {

    private state =

        TradingSessionState.DISCONNECTED;

    getState() {

        return this.state;

    }

    connect() {

        this.state =

            TradingSessionState.CONNECTED;

    }

    disconnect() {

        this.state =

            TradingSessionState.DISCONNECTED;

    }

    reconnect() {

        this.state =

            TradingSessionState.RECONNECTING;

    }

}