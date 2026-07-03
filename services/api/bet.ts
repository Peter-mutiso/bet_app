import { ApiClient } from "./client";
import { WalletService } from "./wallet";

export enum BetStatus {
  PENDING = "PENDING",
  OPEN = "OPEN",
  WON = "WON",
  LOST = "LOST",
  CANCELLED = "CANCELLED",
  CASHED_OUT = "CASHED_OUT",
}

export interface Bet {
  readonly id: string;
  readonly marketId: string;
  readonly selectionId: string;
  readonly stake: number;
  readonly odds: number;
  readonly potentialPayout: number;
  readonly status: BetStatus;
  readonly createdAt: string;
  readonly settledAt?: string;
}

export interface PlaceBetRequest {
  readonly marketId: string;
  readonly selectionId: string;
  readonly stake: number;
}

export interface CashOutResponse {
  readonly bet: Bet;
  readonly amount: number;
}

export interface BetConfiguration {
  readonly validateStake: boolean;
  readonly minimumStake: number;
  readonly maximumStake: number;
}

export interface BetMetrics {
  placed: number;
  cancelled: number;
  cashedOut: number;
  loaded: number;
}

export class BetService {
  private active: Bet[] = [];
  private readonly metrics: BetMetrics = {
    placed: 0,
    cancelled: 0,
    cashedOut: 0,
    loaded: 0,
  };

  constructor(
    private readonly api: ApiClient,
    private readonly wallet: WalletService,
    private readonly configuration: BetConfiguration
  ) {}

  public validateStake(stake: number) {
    if (!this.configuration.validateStake) {
      return;
    }

    if (stake < this.configuration.minimumStake) {
      throw new Error("Stake is below the minimum allowed.");
    }

    if (stake > this.configuration.maximumStake) {
      throw new Error("Stake exceeds the maximum allowed.");
    }

    if (this.wallet.hasWallet() && stake > this.wallet.availableBalance()) {
      throw new Error("Insufficient wallet balance.");
    }
  }

  public async place(request: PlaceBetRequest) {
    this.validateStake(request.stake);
    const response = await this.api.post<Bet, PlaceBetRequest>("/bets", request);
    this.active.push(response.data);
    this.metrics.placed++;

    if (this.wallet.hasWallet()) {
      await this.wallet.refresh();
    }

    return response.data;
  }

  public async loadActive() {
    const response = await this.api.get<Bet[]>("/bets/active");
    this.active = [...response.data];
    this.metrics.loaded += response.data.length;
    return this.active;
  }

  public async history() {
    const response = await this.api.get<Bet[]>("/bets/history");
    return response.data;
  }

  public async cancel(betId: string) {
    const response = await this.api.post<Bet, Record<string, never>>(`/bets/${betId}/cancel`, {});
    this.remove(betId);
    this.metrics.cancelled++;

    if (this.wallet.hasWallet()) {
      await this.wallet.refresh();
    }

    return response.data;
  }

  public async cashOut(betId: string) {
    const response = await this.api.post<CashOutResponse, Record<string, never>>(
      `/bets/${betId}/cashout`,
      {}
    );
    this.remove(betId);
    this.metrics.cashedOut++;

    if (this.wallet.hasWallet()) {
      await this.wallet.refresh();
    }

    return response.data;
  }

  public activeBets(): readonly Bet[] {
    return Object.freeze([...this.active]);
  }

  public find(betId: string) {
    return this.active.find((bet) => bet.id === betId);
  }

  public byStatus(status: BetStatus) {
    return this.active.filter((bet) => bet.status === status);
  }

  public openBets() {
    return this.byStatus(BetStatus.OPEN);
  }

  public pendingBets() {
    return this.byStatus(BetStatus.PENDING);
  }

  public update(bet: Bet) {
    const index = this.active.findIndex((current) => current.id === bet.id);

    if (index >= 0) {
      this.active[index] = bet;
    } else {
      this.active.push(bet);
    }
  }

  public remove(betId: string) {
    this.active = this.active.filter((bet) => bet.id !== betId);
  }

  public statistics(): Readonly<BetMetrics> {
    return Object.freeze({ ...this.metrics });
  }

  public settings(): Readonly<BetConfiguration> {
    return Object.freeze({ ...this.configuration });
  }

  public healthy() {
    return true;
  }

  public information(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      activeBets: this.active.length,
      openBets: this.openBets().length,
      pendingBets: this.pendingBets().length,
      walletLoaded: this.wallet.hasWallet(),
      metrics: this.statistics(),
    });
  }

  public diagnostics() {
    return Object.freeze({ healthy: this.healthy(), information: this.information() });
  }

  public reset() {
    this.active = [];
    this.metrics.placed = 0;
    this.metrics.cancelled = 0;
    this.metrics.cashedOut = 0;
    this.metrics.loaded = 0;
  }

  public destroy() {
    this.reset();
  }
}

export function createBetService(
  api: ApiClient,
  wallet: WalletService,
  configuration: BetConfiguration
) {
  return new BetService(api, wallet, configuration);
}
