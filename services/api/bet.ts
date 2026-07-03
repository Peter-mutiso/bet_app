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

  private getStoredBets(): Bet[] {

    if (typeof window === "undefined") {
      return [];
    }

    return JSON.parse(
      localStorage.getItem("demoBets") || "[]"
    );

  }

  private saveStoredBets(bets: Bet[]) {

    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      "demoBets",
      JSON.stringify(bets)
    );

  }

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

    if (
      this.wallet.hasWallet() &&
      stake > this.wallet.availableBalance()
    ) {
      throw new Error("Insufficient wallet balance.");
    }

  }
    public async place(request: PlaceBetRequest) {

    this.validateStake(request.stake);

    const bet: Bet = {

      id: crypto.randomUUID(),

      marketId: request.marketId,

      selectionId: request.selectionId,

      stake: request.stake,

      odds: 2.0,

      potentialPayout: request.stake * 2,

      status: BetStatus.OPEN,

      createdAt: new Date().toISOString(),

    };

    const bets = this.getStoredBets();

    bets.unshift(bet);

    this.saveStoredBets(bets);

    this.active = bets.filter(
      bet =>
        bet.status === BetStatus.OPEN ||
        bet.status === BetStatus.PENDING
    );

    this.metrics.placed++;

    if (this.wallet.hasWallet()) {

      await this.wallet.refresh();

    }

    return bet;

  }

  public async loadActive() {

    const bets = this.getStoredBets();

    this.active = bets.filter(
      bet =>
        bet.status === BetStatus.OPEN ||
        bet.status === BetStatus.PENDING
    );

    this.metrics.loaded += this.active.length;

    return this.active;

  }

  public async history() {

    return this.getStoredBets();

  }
    public async cancel(betId: string) {

    const bets = this.getStoredBets();

    const index = bets.findIndex(
      bet => bet.id === betId
    );

    if (index === -1) {
      throw new Error("Bet not found.");
    }

    const updated: Bet = {
      ...bets[index],
      status: BetStatus.CANCELLED,
      settledAt: new Date().toISOString(),
    };

    bets[index] = updated;

    this.saveStoredBets(bets);

    this.active = bets.filter(
      bet =>
        bet.status === BetStatus.OPEN ||
        bet.status === BetStatus.PENDING
    );

    this.metrics.cancelled++;

    if (this.wallet.hasWallet()) {
      await this.wallet.refresh();
    }

    return updated;

  }

  public async cashOut(
    betId: string
  ): Promise<CashOutResponse> {

    const bets = this.getStoredBets();

    const index = bets.findIndex(
      bet => bet.id === betId
    );

    if (index === -1) {
      throw new Error("Bet not found.");
    }

    const original = bets[index];

    const amount =
      original.stake * 0.85;

    const updated: Bet = {
      ...original,
      status: BetStatus.CASHED_OUT,
      settledAt: new Date().toISOString(),
    };

    bets[index] = updated;

    this.saveStoredBets(bets);

    this.active = bets.filter(
      bet =>
        bet.status === BetStatus.OPEN ||
        bet.status === BetStatus.PENDING
    );

    this.metrics.cashedOut++;

    if (this.wallet.hasWallet()) {
      await this.wallet.refresh();
    }

    return {
      bet: updated,
      amount,
    };

  }