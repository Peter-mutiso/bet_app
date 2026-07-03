import { EventEmitter } from "events";
import { TradingSignal } from "./signal";
import { Balance } from "../../models/balance";
import { Position } from "../../models/position";

declare module "./signal" {
    interface TradingSignal {
        readonly risk: {
            readonly maximumLoss: number;
        };
    }
}

/* ---------------- CONFIGURATION ---------------- */

export interface RiskConfiguration {
    readonly enabled: boolean;
    readonly minimumConfidence: number;
    readonly maximumRiskPerTrade: number;
    readonly maximumOpenPositions: number;
    readonly maximumDailyLoss: number;
    readonly minimumBalance: number;
}

/* ---------------- CONTEXT ---------------- */

export interface RiskContext {
    readonly signal: TradingSignal;
    readonly balance: Balance;
    readonly positions: readonly Position[];
    readonly dailyLoss: number;
}

/* ---------------- RULE ENGINE ---------------- */

export interface RiskRuleResult {
    readonly passed: boolean;
    readonly name: string;
    readonly message: string;
}

export interface RiskRule {
    readonly name: string;
    evaluate(context: RiskContext): Promise<RiskRuleResult>;
}

/* ---------------- DECISION ---------------- */

export interface RiskDecision {
    readonly approved: boolean;
    readonly results: readonly RiskRuleResult[];
}

export interface RiskMetrics {
    evaluations: number;
    approvals: number;
    rejections: number;
    lastEvaluation?: Date;
}

/* ========================================================================== */
/*                              RISK MANAGER                                  */
/* ========================================================================== */

export class RiskManager extends EventEmitter {

    private readonly rules: RiskRule[] = [];

    private readonly metrics: RiskMetrics = {
        evaluations: 0,
        approvals: 0,
        rejections: 0
    };

    constructor(private readonly configuration: RiskConfiguration) {
        super();
    }

    /* ---------------- RULE REGISTRY ---------------- */

    public register(rule: RiskRule): void {
        this.rules.push(rule);
    }

    public registeredRules(): readonly RiskRule[] {
        return [...this.rules];
    }

    public unregister(name: string): boolean {
        const index = this.rules.findIndex(r => r.name === name);
        if (index === -1) return false;
        this.rules.splice(index, 1);
        return true;
    }

    public clearRules(): void {
        this.rules.length = 0;
    }

    public hasRule(name: string): boolean {
        return this.rules.some(r => r.name === name);
    }

    public rule(name: string): RiskRule | undefined {
        return this.rules.find(r => r.name === name);
    }
    /* ---------------- EVALUATION ENGINE ---------------- */

    public async evaluate(context: RiskContext): Promise<RiskDecision> {

        this.metrics.evaluations++;
        this.metrics.lastEvaluation = new Date();

        const results: RiskRuleResult[] = [];

        for (const rule of this.rules) {
            try {
                results.push(await rule.evaluate(context));
            } catch (error) {
                results.push({
                    passed: false,
                    name: rule.name,
                    message: error instanceof Error ? error.message : String(error)
                });
            }
        }

        const approved = results.every(r => r.passed);

        if (approved) this.metrics.approvals++;
        else this.metrics.rejections++;

        const decision: RiskDecision = {
            approved,
            results: Object.freeze([...results])
        };

        this.emit(approved ? "approved" : "rejected", decision);
        this.emit("evaluated", decision);

        return decision;
    }

    /* ---------------- STATUS ---------------- */

    public healthy(): boolean {
        return this.configuration.enabled && this.rules.length > 0;
    }

    public config(): RiskConfiguration {
        return this.configuration;
    }

    public enabled(): boolean {
        return this.configuration.enabled;
    }

    public statistics(): Readonly<RiskMetrics> {
        return Object.freeze({ ...this.metrics });
    }

    public reset(): void {
        this.metrics.evaluations = 0;
        this.metrics.approvals = 0;
        this.metrics.rejections = 0;
        this.metrics.lastEvaluation = undefined;
    }

    public destroy(): void {
        this.clearRules();
        this.reset();
        this.removeAllListeners();
    }

    /* ---------------- DEFAULT RULES ---------------- */

    public registerDefaultRules(): void {

        this.register(new MinimumBalanceRule(this.configuration.minimumBalance));
        this.register(new ConfidenceRule(this.configuration.minimumConfidence));
        this.register(new MaximumOpenPositionsRule(this.configuration.maximumOpenPositions));
        this.register(new MaximumRiskPerTradeRule(this.configuration.maximumRiskPerTrade));
        this.register(new DailyLossRule(this.configuration.maximumDailyLoss));
    }
}

/* ========================================================================== */
/*                               RULES                                        */
/* ========================================================================== */

export class MinimumBalanceRule implements RiskRule {
    readonly name = "MinimumBalanceRule";

    constructor(private readonly minimum: number) {}

    async evaluate(context: RiskContext): Promise<RiskRuleResult> {
        const passed = context.balance.balance >= this.minimum;
        return {
            passed,
            name: this.name,
            message: passed ? "Balance OK" : "Insufficient balance"
        };
    }
}

export class ConfidenceRule implements RiskRule {
    readonly name = "ConfidenceRule";

    constructor(private readonly minimum: number) {}

    async evaluate(context: RiskContext): Promise<RiskRuleResult> {
        const passed = context.signal.confidence >= this.minimum;
        return {
            passed,
            name: this.name,
            message: passed ? "Confidence OK" : "Confidence too low"
        };
    }
}

export class MaximumOpenPositionsRule implements RiskRule {
    readonly name = "MaximumOpenPositionsRule";

    constructor(private readonly maximum: number) {}

    async evaluate(context: RiskContext): Promise<RiskRuleResult> {
        const passed = context.positions.length < this.maximum;
        return {
            passed,
            name: this.name,
            message: passed ? "Positions OK" : "Too many positions"
        };
    }
}

export class MaximumRiskPerTradeRule implements RiskRule {
    readonly name = "MaximumRiskPerTradeRule";

    constructor(private readonly maximum: number) {}

    async evaluate(context: RiskContext): Promise<RiskRuleResult> {
        const passed = context.signal.risk.maximumLoss <= this.maximum;
        return {
            passed,
            name: this.name,
            message: passed ? "Risk OK" : "Risk too high"
        };
    }
}

export class DailyLossRule implements RiskRule {
    readonly name = "DailyLossRule";

    constructor(private readonly maximum: number) {}

    async evaluate(context: RiskContext): Promise<RiskRuleResult> {
        const passed = context.dailyLoss < this.maximum;
        return {
            passed,
            name: this.name,
            message: passed ? "Daily loss OK" : "Daily loss exceeded"
        };
    }
}

/* ========================================================================== */
/*                               FACTORY                                      */
/* ========================================================================== */

export function createRiskManager(config: RiskConfiguration): RiskManager {
    const manager = new RiskManager(config);
    manager.registerDefaultRules();
    return manager;
}
