import { Wallet } from "../../types";

export function mapWallet(raw: any): Wallet {

    return {

        id: raw.id,
        userId: raw.userId,
        accountId: raw.accountId,
        walletType: raw.walletType,
        balance: raw.balance,
        currency: raw.currency,
        status: raw.status,
        visibility: raw.visibility,
        isDefault: raw.isDefault,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt

    };

}