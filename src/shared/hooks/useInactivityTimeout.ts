import { useEffect, useLayoutEffect, useRef } from "react";

const ACTIVITY_EVENTS = [
    "mousemove",
    "keydown",
    "click",
    "scroll",
    "touchstart",
] as const;

/** Tiempo de inactividad en ms antes de disparar el cierre de sesión (5 minutos). */
const TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Dispara `onTimeout` después de `TIMEOUT_MS` ms sin actividad del usuario.
 * El timer se reinicia ante cualquier evento de interacción (mouse, teclado,
 * scroll o touch). Solo está activo cuando `enabled` es `true`.
 */
export function useInactivityTimeout(onTimeout: () => void, enabled: boolean): void {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Ref estable para que el closure del evento nunca quede desactualizado.
    // Se actualiza en useLayoutEffect para que siempre tenga el valor más reciente
    // sin violar las reglas del React Compiler.
    const onTimeoutRef = useRef(onTimeout);
    useLayoutEffect(() => {
        onTimeoutRef.current = onTimeout;
    });

    useEffect(() => {
        if (!enabled) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        const reset = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => onTimeoutRef.current(), TIMEOUT_MS);
        };

        reset(); // Inicia el conteo desde el momento en que el usuario se autentica.

        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, reset, { passive: true }),
        );

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset));
        };
    }, [enabled]);
}
