import {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../../lib/socket";
import { useAuth } from "./AuthContext";
import { useToast } from "../hooks/useToast";
import axiosClient from "../../api/axiosClient";
import {
    NotificationContext,
    type AppNotification,
    type NotificationContextValue,
} from "./NotificationContext";

// ── Estado y reducer ─────────────────────────────────────────────────────────

type State = {
    notifications: AppNotification[];
    isConnected: boolean;
};

type Action =
    | { type: "SET_NOTIFICATIONS"; payload: AppNotification[] }
    | { type: "ADD_NOTIFICATION"; payload: AppNotification }
    | { type: "MARK_READ"; payload: { ids: number[] } }
    | { type: "MARK_ALL_READ" }
    | { type: "SET_CONNECTED"; payload: boolean };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_NOTIFICATIONS":
            return { ...state, notifications: action.payload };
        case "ADD_NOTIFICATION":
            // Deduplica: evitar doble notificación si ya existe por ID
            if (state.notifications.some((n) => n.id === action.payload.id)) {
                return state;
            }
            return {
                ...state,
                notifications: [action.payload, ...state.notifications].slice(0, 60),
            };
        case "MARK_READ": {
            const readSet = new Set(action.payload.ids);
            return {
                ...state,
                notifications: state.notifications.map((n) =>
                    readSet.has(n.id) ? { ...n, read_at: new Date().toISOString() } : n,
                ),
            };
        }
        case "MARK_ALL_READ":
            return {
                ...state,
                notifications: state.notifications.map((n) => ({
                    ...n,
                    read_at: n.read_at ?? new Date().toISOString(),
                })),
            };
        case "SET_CONNECTED":
            return { ...state, isConnected: action.payload };
        default:
            return state;
    }
}

// ── Provider ─────────────────────────────────────────────────────────────────

/**
 * NotificationProvider gestiona el ciclo de vida del socket y el historial
 * de notificaciones del usuario autenticado.
 *
 * Diseño:
 * - Fuente de verdad: el servidor (HTTP para el historial, WS para novedades).
 * - El socket actúa como señal de invalidación de React Query además de push de UI.
 * - Graceful degradation: si el socket falla, el usuario sigue operando con polling.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [state, dispatch] = useReducer(reducer, { notifications: [], isConnected: false });

    // Ref para evitar doble-carga en StrictMode
    const loadedRef = useRef(false);

    // ── Carga inicial desde HTTP ───────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated || loadedRef.current) return;
        loadedRef.current = true;

        axiosClient
            .get<{ resultado: { notifications: { items: AppNotification[] } } }>("/notifications")
            .then((res) => {
                const items = res.data?.resultado?.notifications?.items ?? [];
                dispatch({ type: "SET_NOTIFICATIONS", payload: items });
            })
            .catch((err) => {
                console.warn("[NotificationProvider] No se pudo cargar el historial:", err);
            });

        return () => {
            loadedRef.current = false;
        };
    }, [isAuthenticated]);

    // ── Ciclo de vida del socket ───────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) {
            socket.disconnect();
            dispatch({ type: "SET_CONNECTED", payload: false });
            return;
        }

        socket.connect();

        socket.on("connect", () => {
            dispatch({ type: "SET_CONNECTED", payload: true });
        });

        socket.on("disconnect", () => {
            dispatch({ type: "SET_CONNECTED", payload: false });
        });

        // ── Evento: nueva notificación persistida del usuario ──────────────
        socket.on("notification:new", (notif: AppNotification) => {
            dispatch({ type: "ADD_NOTIFICATION", payload: notif });

            // Invalidar queries según tipo para que las vistas refresquen datos
            if (notif.type === "CAMP_REQUEST_CREATED" || notif.type === "CAMP_REQUEST_STATUS") {
                queryClient.invalidateQueries({ queryKey: ["camp-requests"] });
            }
            if (notif.type === "RESOURCE_ALERT") {
                queryClient.invalidateQueries({ queryKey: ["warehouse-resources"] });
            }
            if (notif.type === "ACHIEVEMENT_UNLOCKED") {
                queryClient.invalidateQueries({ queryKey: ["user-achievements"] });
            }

            const toastTone =
                notif.priority === "CRITICAL" || notif.priority === "HIGH"
                    ? "error"
                    : notif.priority === "LOW"
                    ? "success"
                    : "info";

            toast({ title: notif.title, message: notif.body ?? "", tone: toastTone });
        });

        // ── Evento: solicitud de campamento nueva (broadcast a campamento) ──
        socket.on("camp-request:new", () => {
            queryClient.invalidateQueries({ queryKey: ["camp-requests"] });
        });

        socket.on("camp-request:updated", () => {
            queryClient.invalidateQueries({ queryKey: ["camp-requests"] });
        });

        // ── Evento: alerta de recurso crítica (broadcast a campamento) ──────
        socket.on("resource-alert:new", () => {
            queryClient.invalidateQueries({ queryKey: ["warehouse-resources"] });
            queryClient.invalidateQueries({ queryKey: ["resource-alerts"] });
        });

        // ── Evento: expiración de sesión forzada por el servidor ────────────
        socket.on("session:expired", () => {
            socket.disconnect();
            window.dispatchEvent(new CustomEvent("auth:session-expired"));
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("notification:new");
            socket.off("camp-request:new");
            socket.off("camp-request:updated");
            socket.off("resource-alert:new");
            socket.off("session:expired");
            socket.disconnect();
        };
    }, [isAuthenticated, queryClient, toast]);

    // ── Acciones ──────────────────────────────────────────────────────────
    const markAsRead = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        dispatch({ type: "MARK_READ", payload: { ids } });
        try {
            await axiosClient.patch("/notifications/read", { ids });
        } catch (err) {
            console.warn("[NotificationProvider] Error al marcar como leído:", err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        dispatch({ type: "MARK_ALL_READ" });
        try {
            await axiosClient.patch("/notifications/read-all");
        } catch (err) {
            console.warn("[NotificationProvider] Error al marcar todo como leído:", err);
        }
    }, []);

    const unreadCount = state.notifications.filter((n) => !n.read_at).length;

    const value: NotificationContextValue = {
        notifications: state.notifications,
        unreadCount,
        isConnected: state.isConnected,
        markAsRead,
        markAllAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
