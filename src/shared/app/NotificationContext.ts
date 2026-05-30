import { createContext, useContext } from "react";

// ── Tipos ────────────────────────────────────────────────────────────────────

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export type NotificationType =
    | "RESOURCE_ALERT"
    | "CAMP_REQUEST_CREATED"
    | "CAMP_REQUEST_STATUS"
    | "AI_DECISION"
    | "EXPLORATION_EVENT"
    | "ACHIEVEMENT_UNLOCKED"
    | "TASK_ASSIGNED";

export interface AppNotification {
    id: number;
    user_id: number;
    type: NotificationType;
    title: string;
    body?: string;
    payload?: Record<string, unknown>;
    priority: NotificationPriority;
    read_at?: string | null;
    created_at: string;
    camp_id?: number | null;
}

export interface NotificationContextValue {
    notifications: AppNotification[];
    unreadCount: number;
    isConnected: boolean;
    markAsRead: (ids: number[]) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────────────────

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotifications debe usarse dentro de <NotificationProvider>");
    }
    return ctx;
}
