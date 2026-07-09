export interface PasswordRequirements {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumber: boolean;
    requireSymbol: boolean;
}

export interface PasswordStrength {

    score: number;

    label:
        | "Weak"
        | "Fair"
        | "Good"
        | "Strong"
        | "Excellent";

    color: string;

    suggestions: string[];
}

export interface PasswordHistory {

    id: string;

    changedAt: string;

    device: string;

    ip: string;

    successful: boolean;

}