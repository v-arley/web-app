import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") ?? "http://localhost:3000";

/**
 * Instancia singleton de Socket.IO client.
 *
 * - autoConnect: false — la conexión se inicia explícitamente cuando el usuario se autentica.
 * - withCredentials: true — envía las cookies httpOnly (access_token) automáticamente.
 * - transports: websocket primero, polling como fallback.
 */
export const socket: Socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket", "polling"],
});
