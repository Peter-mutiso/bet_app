import { Timestamped, UUID } from "./common";

export type NotificationType =
    | "trade"
    | "wallet"
    | "market"
    | "system"
    | "security";

export type NotificationPriority =
    | "low"
    | "medium"
    | "high";

export interface Notification extends Timestamped {
    id: UUID;

    title: string;

    message: string;

    type: NotificationType;

    priority: NotificationPriority;

    read: boolean;

    link?: string;
}