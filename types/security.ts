export type SecurityLevel =
    | "LOW"
    | "MEDIUM"
    | "HIGH";

export type SessionStatus =
    | "CURRENT"
    | "ACTIVE"
    | "EXPIRED";

export interface LoginSession {
    id: string;
    device: string;
    browser: string;
    os: string;
    ip: string;
    location: string;
    status: SessionStatus;
    lastActive: string;
}

export interface LoginHistoryItem {
    id: string;
    browser: string;
    device: string;
    ip: string;
    location: string;
    success: boolean;
    timestamp: string;
}

export interface TrustedDevice {
    id: string;
    name: string;
    browser: string;
    os: string;
    addedAt: string;
}

export interface SecuritySettings {
    passwordUpdatedAt: string;

    emailVerified: boolean;
    phoneVerified: boolean;

    twoFactorEnabled: boolean;

    loginAlerts: boolean;
    browserNotifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;

    withdrawalConfirmation: boolean;
    tradingPinEnabled: boolean;

    autoLogout: boolean;
    autoLogoutMinutes: number;
}