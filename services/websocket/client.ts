export enum ConnectionState {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  RECONNECTING = "RECONNECTING",
  CLOSING = "CLOSING",
}

export interface WebSocketConfiguration {
  readonly endpoint: string;
  readonly reconnect: boolean;
  readonly reconnectInterval: number;
  readonly heartbeatInterval: number;
}

export interface WebSocketMetrics {
  sent: number;
  received: number;
  reconnects: number;
  lastConnected?: Date;
  lastDisconnected?: Date;
}

type Listener = (...args: unknown[]) => void;

export class DerivWebSocketClient {
  private socket?: WebSocket;
  private state = ConnectionState.DISCONNECTED;
  private heartbeat?: ReturnType<typeof setInterval>;
  private reconnectTimer?: ReturnType<typeof setTimeout>;

  private readonly listeners = new Map<string, Set<Listener>>();
  private readonly pending = new Map<string, (response: unknown) => void>();

  private readonly metrics: WebSocketMetrics = {
    sent: 0,
    received: 0,
    reconnects: 0,
  };

  // =========================================================
  // ✅ NEW: READY PROMISE SYSTEM
  // =========================================================
  private readyPromise?: Promise<void>;
  private resolveReady?: () => void;
  private rejectReady?: (err?: unknown) => void;

  constructor(private readonly configuration: WebSocketConfiguration) {}

  // =========================================================
  // READY API (NEW)
  // =========================================================
  public ready(): Promise<void> {
    if (this.state === ConnectionState.CONNECTED) {
      return Promise.resolve();
    }

    if (!this.readyPromise) {
      this.readyPromise = new Promise((resolve, reject) => {
        this.resolveReady = resolve;
        this.rejectReady = reject;
      });
    }

    return this.readyPromise;
  }

  public on(event: string, listener: Listener) {
    const listeners = this.listeners.get(event) ?? new Set<Listener>();
    listeners.add(listener);
    this.listeners.set(event, listeners);
    return this;
  }

  public off(event: string, listener: Listener) {
    this.listeners.get(event)?.delete(listener);
    return this;
  }

  public removeAllListeners() {
    this.listeners.clear();
  }

  private emit(event: string, ...args: unknown[]) {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(...args);
    }
  }

  public connectionState() {
    return this.state;
  }

  public connected() {
    return this.state === ConnectionState.CONNECTED;
  }

  public statistics(): Readonly<WebSocketMetrics> {
    return Object.freeze({ ...this.metrics });
  }

  public async connect() {
    if (this.connected() || this.state === ConnectionState.CONNECTING) {
      return;
    }

    if (typeof WebSocket === "undefined" || !this.configuration.endpoint) {
      this.state = ConnectionState.DISCONNECTED;

      // ❌ fail ready promise
      this.rejectReady?.("WebSocket unavailable");
      this.readyPromise = undefined;

      return;
    }

    this.state = ConnectionState.CONNECTING;
    this.socket = new WebSocket(this.configuration.endpoint);

    this.registerEvents();
  }

  public disconnect(code = 1000, reason = "Normal Closure") {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }

    this.stopHeartbeat();

    if (!this.socket) {
      this.state = ConnectionState.DISCONNECTED;
      return;
    }

    this.state = ConnectionState.CLOSING;
    this.socket.close(code, reason);
  }

  // =========================================================
  // 🔥 FIXED SEND (SAFE WITH READY CHECK)
  // =========================================================
  public send(payload: unknown) {
    if (!this.connected() || !this.socket) {
      throw new Error("WebSocket is not connected.");
    }

    this.socket.send(JSON.stringify(payload));
    this.metrics.sent++;
  }

  public request(payload: Record<string, unknown>) {
    const requestId = crypto.randomUUID();

    return new Promise<unknown>((resolve) => {
      this.pending.set(requestId, resolve);
      this.send({ req_id: requestId, ...payload });
    });
  }

  private registerEvents() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.state = ConnectionState.CONNECTED;
      this.metrics.lastConnected = new Date();

      // =====================================================
      // ✅ RESOLVE READY PROMISE HERE
      // =====================================================
      this.resolveReady?.();
      this.readyPromise = undefined;

      this.startHeartbeat();
      this.emit("connected");
    };

    this.socket.onmessage = (event) => {
      this.metrics.received++;
      this.handleMessage(String(event.data));
    };

    this.socket.onerror = (event) => {
      this.emit("error", event);
    };

    this.socket.onclose = () => {
      this.stopHeartbeat();
      this.state = ConnectionState.DISCONNECTED;
      this.metrics.lastDisconnected = new Date();

      // ❌ reject ready on disconnect
      this.rejectReady?.("Socket closed");
      this.readyPromise = undefined;

      this.emit("disconnected");
      this.reconnect();
    };
  }

  private handleMessage(raw: string) {
    let message: unknown = raw;

    try {
      message = JSON.parse(raw);
    } catch {}

    if (
      message &&
      typeof message === "object" &&
      "req_id" in message &&
      typeof message.req_id === "string" &&
      this.pending.has(message.req_id)
    ) {
      const resolve = this.pending.get(message.req_id)!;
      this.pending.delete(message.req_id);
      resolve(message);
    }

    this.emit("message", message);
  }

  private reconnect() {
    if (!this.configuration.reconnect || this.state === ConnectionState.CLOSING) {
      return;
    }

    this.state = ConnectionState.RECONNECTING;
    this.metrics.reconnects++;

    this.reconnectTimer = setTimeout(() => {
      void this.connect();
    }, this.configuration.reconnectInterval);
  }

  private startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeat = setInterval(() => {
      if (this.connected()) {
        this.send({ ping: 1 });
      }
    }, this.configuration.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (!this.heartbeat) return;

    clearInterval(this.heartbeat);
    this.heartbeat = undefined;
  }

  public healthy() {
    return this.connected();
  }

  public information(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      endpoint: this.configuration.endpoint,
      state: this.connectionState(),
      connected: this.connected(),
      reconnect: this.configuration.reconnect,
      heartbeatInterval: this.configuration.heartbeatInterval,
      metrics: this.statistics(),
    });
  }

  public diagnostics() {
    return Object.freeze({
      healthy: this.healthy(),
      information: this.information(),
      pendingRequests: this.pending.size,
    });
  }

  public reset() {
    this.pending.clear();
    this.metrics.sent = 0;
    this.metrics.received = 0;
    this.metrics.reconnects = 0;
    this.metrics.lastConnected = undefined;
    this.metrics.lastDisconnected = undefined;
  }

  public destroy() {
    this.stopHeartbeat();
    this.pending.clear();
    this.disconnect();
    this.removeAllListeners();
    this.reset();
  }
}

export function createDerivWebSocketClient(configuration: WebSocketConfiguration) {
  return new DerivWebSocketClient(configuration);
}