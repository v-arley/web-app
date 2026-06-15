import { useEffect, useRef } from "react";

/**
 * Eventos de interacción DOM que se consideran «actividad» del usuario.
 * pointerdown captura mouse y touch con un solo listener.
 */
export const USER_ACTIVITY_EVENTS = [
    "mousemove",
    "keydown",
    "pointerdown",
    "scroll",
    "touchstart",
] as const;

/**
 * Evento personalizado despachado por los clientes HTTP (axiosClient y Request)
 * en cada solicitud de red. Se conserva como señal observable, pero no reinicia
 * el contador: un refetch automático no debe contar como uso humano.
 */
export const API_ACTIVITY_EVENT = "user:api-activity";

/**
 * Tiempo de inactividad real antes de considerar que el usuario abandonó la sesión.
 *
 * Este valor debe mantenerse alineado con sessionIdleMinutes del backend.
 * Cuando el token expira, el interceptor 401→refresh→retry de axiosClient y de
 * Request.ts lo renueva de forma transparente sin interrumpir al usuario activo.
 * Solo cuando el usuario lleva INACTIVITY_TIMEOUT_MINUTES sin interacción real
 * con la UI se considera que abandonó la sesión.
 */
export const INACTIVITY_TIMEOUT_MINUTES = 20;
export const INACTIVITY_TIMEOUT_MS = INACTIVITY_TIMEOUT_MINUTES * 60 * 1_000;

/**
 * Dispara `onTimeout` tras `INACTIVITY_TIMEOUT_MS` ms sin interacción del usuario.
 * Reinicia el contador ante cualquier evento de actividad listado en USER_ACTIVITY_EVENTS.
 * Solo actúa cuando `enabled` es `true` (p. ej. cuando el usuario está autenticado).
 *
 * IMPORTANTE: `onTimeout` debe ser una referencia estable — usar `useCallback` en el
 * componente llamante para evitar re-ejecuciones innecesarias del efecto principal.
 */
export function useInactivityTimeout(
    onTimeout: () => void,
    enabled: boolean,
): void {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Ref que siempre apunta a la versión más reciente de onTimeout.
    // Actualizado en efecto separado para evitar reconstruir el efecto del timer.
    const onTimeoutRef = useRef<() => void>(onTimeout);
    useEffect(() => {
        onTimeoutRef.current = onTimeout;
    }, [onTimeout]);

    useEffect(() => {
        // Si el usuario no está autenticado, limpiar y salir.
        if (!enabled) {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        const resetTimer = (): void => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(
                () => onTimeoutRef.current(),
                INACTIVITY_TIMEOUT_MS,
            );
        };

        // Inicia el conteo desde el momento en que el usuario queda autenticado.
        resetTimer();

        USER_ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, resetTimer, { passive: true }),
        );

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            // No se pasa { passive } en removeEventListener: solo `capture` afecta
            // la identidad del listener; passive/once son ignorados al eliminar.
            USER_ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, resetTimer),
            );
        };
    }, [enabled]);
}
