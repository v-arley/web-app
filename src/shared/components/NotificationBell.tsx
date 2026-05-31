import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Bell, BellDot, Circle, CheckCheck } from "lucide-react";
import { useNotifications, type AppNotification } from "../app/NotificationContext";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_LABELS: Record<AppNotification["priority"], string> = {
    LOW: "low",
    NORMAL: "normal",
    HIGH: "high",
    CRITICAL: "critical",
};

function formatRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Ahora";
    if (mins < 60) return `Hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs}h`;
    return `Hace ${Math.floor(hrs / 24)}d`;
}

// ── NotificationItem ─────────────────────────────────────────────────────────

function NotificationItem({
    notif,
    onClick,
}: {
    notif: AppNotification;
    onClick: (id: number) => void;
}) {
    return (
        <button
            type="button"
            className={`notif-item notif-priority-${PRIORITY_LABELS[notif.priority]}${notif.read_at ? " notif-read" : " notif-unread"}`}
            onClick={() => onClick(notif.id)}
            aria-label={notif.title}
        >
            <div className="notif-item-content">
                {!notif.read_at && (
                    <Circle className="notif-dot" aria-hidden="true" />
                )}
                <div className="notif-text">
                    <span className="notif-title">{notif.title}</span>
                    {notif.body && <span className="notif-body">{notif.body}</span>}
                    <span className="notif-time">{formatRelativeTime(notif.created_at)}</span>
                </div>
            </div>
        </button>
    );
}

// ── NotificationBell ─────────────────────────────────────────────────────────

/**
 * Componente de bandeja de notificaciones.
 *
 * - Integrado con NotificationContext (sin estado local propio).
 * - Indicador de conexión en tiempo real.
 * - Accesible via teclado (Escape cierra el panel).
 */
export function NotificationBell() {
    const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead } =
        useNotifications();

    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!panelRef.current?.contains(e.target as Node) &&
                !triggerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Escape") setOpen(false);
    };

    const handleItemClick = (id: number) => {
        markAsRead([id]);
    };

    const handleMarkAll = () => {
        markAllAsRead();
    };

    const BellIcon = unreadCount > 0 ? BellDot : Bell;

    return (
        <div className="notif-bell-wrapper">
            <button
                ref={triggerRef}
                type="button"
                className="notif-bell-trigger"
                aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}`}
                aria-expanded={open}
                aria-haspopup="true"
                onClick={() => setOpen((v) => !v)}
                onKeyDown={handleKeyDown}
            >
                <BellIcon className="notif-bell-icon" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span className="notif-badge" aria-hidden="true">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
                <span
                    className={`notif-live-dot ${isConnected ? "notif-live-dot--on" : "notif-live-dot--off"}`}
                    title={isConnected ? "En vivo" : "Reconectando..."}
                    aria-hidden="true"
                />
            </button>

            {open && (
                <div
                    ref={panelRef}
                    className="notif-panel"
                    role="dialog"
                    aria-label="Panel de notificaciones"
                >
                    <div className="notif-panel-header">
                        <span className="notif-panel-title">Notificaciones</span>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="notif-mark-all"
                                onClick={handleMarkAll}
                                aria-label="Marcar todas como leídas"
                            >
                                <CheckCheck className="w-4 h-4" />
                                <span>Todo leído</span>
                            </button>
                        )}
                    </div>

                    <div className="notif-list" role="list">
                        {notifications.length === 0 ? (
                            <p className="notif-empty">Sin notificaciones pendientes</p>
                        ) : (
                            notifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notif={n}
                                    onClick={handleItemClick}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
