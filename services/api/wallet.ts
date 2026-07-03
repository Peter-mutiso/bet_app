import { ApiClient } from "./client";

export interface Wallet {
  readonly id: string;
  readonly currency: string;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  updatedAt: string;
}

export interface WalletTransaction {
  readonly id: string;
  readonly type: "deposit" | "withdraw" | "bet" | "win" | "refund" | "bonus" | "adjustment";
  readonly amount: number;
  readonly balance: number;
  readonly description: string;
  readonly createdAt: string;
}

export interface DepositRequest {
  readonly amount: number;
  readonly paymentMethod: string;
}

export interface WithdrawRequest {
  readonly amount: number;
  readonly destination: string;
}

export interface WalletConfiguration {
  readonly autoRefresh: boolean;
  readonly refreshInterval: number;
}

export interface WalletMetrics {
  refreshes: number;
  deposits: number;
  withdrawals: number;
  transactionsLoaded: number;
}

export class WalletService {
  private wallet?: Wallet;
  private refreshTimer?: ReturnType<typeof setInterval>;
  private readonly metrics: WalletMetrics = {
    refreshes: 0,
    deposits: 0,
    withdrawals: 0,
    transactionsLoaded: 0,
  };

  constructor(
    private readonly api: ApiClient,
    private readonly configuration: WalletConfiguration
  ) {}

  public async load() {
  const raw = localStorage.getItem("demoWallet");

  if (!raw) {
    this.wallet = {
      id: crypto.randomUUID(),
      currency: "USD",
      balance: 2500,
      availableBalance: 2500,
      lockedBalance: 0,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("demoWallet", JSON.stringify(this.wallet));
  } else {
    this.wallet = JSON.parse(raw);
  }

  this.metrics.refreshes++;
  return this.wallet;
}

  public refresh() {
    return this.load();
  }

 public async deposit(request: DepositRequest) {
  if (!this.wallet) await this.load();

  this.wallet!.balance += request.amount;
  this.wallet!.availableBalance += request.amount;
  this.wallet!.updatedAt = new Date().toISOString();

  this.saveTransaction({
    id: crypto.randomUUID(),
    type: "deposit",
    amount: request.amount,
    balance: this.wallet!.balance,
    description: `Deposit via ${request.paymentMethod}`,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem("demoWallet", JSON.stringify(this.wallet));

  this.metrics.deposits++;

  return this.wallet!;
}

  public async withdraw(request: WithdrawRequest) {
  if (!this.wallet) await this.load();

  if (this.wallet!.availableBalance < request.amount) {
    throw new Error("Insufficient balance");
  }

  this.wallet!.balance -= request.amount;
  this.wallet!.availableBalance -= request.amount;
  this.wallet!.updatedAt = new Date().toISOString();

  this.saveTransaction({
    id: crypto.randomUUID(),
    type: "withdraw",
    amount: -request.amount,
    balance: this.wallet!.balance,
    description: `Withdrawal to ${request.destination}`,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem("demoWallet", JSON.stringify(this.wallet));

  this.metrics.withdrawals++;

  return this.wallet!;
}

  private getTransactions(): WalletTransaction[] {
  return JSON.parse(localStorage.getItem("demoTransactions") || "[]");
}

private saveTransaction(tx: WalletTransaction) {
  const txs = this.getTransactions();
  txs.unshift(tx);
  localStorage.setItem("demoTransactions", JSON.stringify(txs));
}
public async transactions(): Promise<WalletTransaction[]> {
  const txs = this.getTransactions();

  this.metrics.transactionsLoaded = txs.length;

  return txs;
}
  public current() {
    return this.wallet;
  }

  public hasWallet() {
    return this.wallet !== undefined;
  }

  public startAutoRefresh() {
    if (!this.configuration.autoRefresh || this.refreshTimer) {
      return;
    }

    this.refreshTimer = setInterval(() => {
      void this.refresh();
    }, this.configuration.refreshInterval);
  }

  public stopAutoRefresh() {
    if (!this.refreshTimer) {
      return;
    }

    clearInterval(this.refreshTimer);
    this.refreshTimer = undefined;
  }

  public balance() {
    return this.wallet?.balance ?? 0;
  }

  public availableBalance() {
    return this.wallet?.availableBalance ?? 0;
  }

  public lockedBalance() {
    return this.wallet?.lockedBalance ?? 0;
  }

  public statistics(): Readonly<WalletMetrics> {
    return Object.freeze({ ...this.metrics });
  }

  public settings(): Readonly<WalletConfiguration> {
    return Object.freeze({ ...this.configuration });
  }

  public healthy() {
    return this.hasWallet();
  }

  public information(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      loaded: this.hasWallet(),
      currency: this.wallet?.currency,
      balance: this.balance(),
      availableBalance: this.availableBalance(),
      lockedBalance: this.lockedBalance(),
      autoRefresh: this.configuration.autoRefresh,
      refreshInterval: this.configuration.refreshInterval,
      metrics: this.statistics(),
    });
  }

  public diagnostics() {
    return Object.freeze({ healthy: this.healthy(), information: this.information() });
  }

  public reset() {
    this.stopAutoRefresh();
    this.wallet = undefined;
    this.metrics.refreshes = 0;
    this.metrics.deposits = 0;
    this.metrics.withdrawals = 0;
    this.metrics.transactionsLoaded = 0;
  }

  public destroy() {
    this.reset();
  }
}

export function createWalletService(api: ApiClient, configuration: WalletConfiguration) {
  return new WalletService(api, configuration);
}
