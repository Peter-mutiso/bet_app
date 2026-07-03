import { ApiClient, createApiClient } from "./api/client";
import { AuthService, createAuthService } from "./api/auth";
import { BetService, createBetService } from "./api/bet";
import { WalletService, createWalletService } from "./api/wallet";
import { DerivWebSocketClient, createDerivWebSocketClient } from "./websocket/client";

export interface ServiceProviderConfiguration {
  readonly apiBaseUrl: string;
  readonly websocketUrl: string;
}

export class ServiceProvider {
  public readonly api: ApiClient;
  public readonly websocket: DerivWebSocketClient;
  public readonly auth: AuthService;
  public readonly wallet: WalletService;
  public readonly bets: BetService;

  private initialized = false;
  private running = false;

  constructor(private readonly providerConfiguration: ServiceProviderConfiguration) {
    this.api = createApiClient({
      baseUrl: providerConfiguration.apiBaseUrl,
      timeout: 30000,
      withCredentials: true,
    });

    this.websocket = createDerivWebSocketClient({
      endpoint: providerConfiguration.websocketUrl,
      reconnect: true,
      reconnectInterval: 5000,
      heartbeatInterval: 30000,
    });

    this.auth = createAuthService(this.api, {
      rememberSession: true,
    });

    this.wallet = createWalletService(this.api, {
      autoRefresh: true,
      refreshInterval: 30000,
    });

    this.bets = createBetService(this.api, this.wallet, {
      validateStake: true,
      minimumStake: 1,
      maximumStake: 100000,
    });
  }

  public async initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
  }

  public async start() {
    if (this.running) {
      return;
    }

    await this.initialize();

// Restore the saved session first
await this.auth.refresh();

if (this.providerConfiguration.websocketUrl) {
    await this.websocket.connect();
}

if (this.auth.authenticated()) {
    await this.wallet.load();
    await this.bets.loadActive();
    this.wallet.startAutoRefresh();
}

this.running = true;
  }

  public async stop() {
    if (!this.running) {
      return;
    }

    this.wallet.stopAutoRefresh();
    this.websocket.disconnect();
    this.running = false;
  }

  public async restart() {
    await this.stop();
    await this.start();
  }

  public initializedState() {
    return this.initialized;
  }

  public runningState() {
    return this.running;
  }

  public healthy() {
    return this.initialized && this.running;
  }

  public configuration(): Readonly<ServiceProviderConfiguration> {
    return Object.freeze({ ...this.providerConfiguration });
  }

  public services() {
    return Object.freeze({
      api: this.api,
      websocket: this.websocket,
      auth: this.auth,
      wallet: this.wallet,
      bets: this.bets,
    });
  }

  public ready() {
    return this.initializedState() && this.runningState() && this.healthy();
  }

  public serviceCount() {
    return 5;
  }

  public information(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      initialized: this.initialized,
      running: this.running,
      services: {
        api: this.api.information(),
        websocket: this.websocket.information(),
        auth: this.auth.information(),
        wallet: this.wallet.information(),
        bets: this.bets.information(),
      },
    });
  }

  public diagnostics(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      healthy: this.healthy(),
      services: {
        api: this.api.diagnostics(),
        websocket: this.websocket.diagnostics(),
        auth: this.auth.diagnostics(),
        wallet: this.wallet.diagnostics(),
        bets: this.bets.diagnostics(),
      },
    });
  }

  public reset() {
    this.auth.reset();
    this.wallet.reset();
    this.bets.reset();
    this.api.reset();
    this.initialized = false;
    this.running = false;
  }

  public destroy() {
    void this.stop();
    this.websocket.destroy();
    this.auth.destroy();
    this.wallet.destroy();
    this.bets.destroy();
    this.api.destroy();
    this.initialized = false;
    this.running = false;
  }

  public toJSON() {
    return {
      initialized: this.initializedState(),
      running: this.runningState(),
      healthy: this.healthy(),
      services: this.serviceCount(),
      version: ServiceProvider.VERSION,
      module: ServiceProvider.MODULE,
    };
  }

  public static readonly VERSION = "1.0.0";
  public static readonly MODULE = "Application Service Provider";
}

let provider: ServiceProvider | undefined;

export function createServiceProvider(configuration: ServiceProviderConfiguration) {
  return new ServiceProvider(configuration);
}

export function serviceProvider(configuration: ServiceProviderConfiguration) {
  provider ??= createServiceProvider(configuration);
  return provider;
}
