import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { ToastContext, type ToastOptions, type ToastTone } from './ToastContext';

export type { ToastTone, ToastOptions } from './ToastContext';

type ToastItem = {
    id: number;
    message: string;
    title?: string;
    tone: ToastTone;
    duration: number;
    leaving: boolean;
};

let _nextId = 1;
const LEAVE_DURATION = 280;

function ToastView({
    item,
    onDismiss,
}: {
    item: ToastItem;
    onDismiss: (id: number) => void;
}) {
    return (
        <div
            className={`toast-item toast-${item.tone}${item.leaving ? ' toast-leaving' : ''}`}
            role="status"
            aria-live="polite"
        >
            <div className="toast-content">
                {item.title && <strong className="toast-title">{item.title}</strong>}
                <span className="toast-message">{item.message}</span>
            </div>
            <button
                className="toast-close"
                type="button"
                aria-label="Cerrar notificación"
                onClick={() => onDismiss(item.id)}
            >
                ×
            </button>
            <div
                className="toast-progress"
                style={{ animationDuration: `${item.duration}ms` }}
            />
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);
    const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

    function scheduleLeave(id: number, delay: number) {
        const t1 = setTimeout(() => {
            setItems(prev =>
                prev.map(t => (t.id === id ? { ...t, leaving: true } : t)),
            );
            const t2 = setTimeout(() => {
                setItems(prev => prev.filter(t => t.id !== id));
                timers.current.delete(id);
            }, LEAVE_DURATION);
            timers.current.set(id, t2);
        }, delay);
        timers.current.set(id, t1);
    }

    const toast = useCallback((options: ToastOptions) => {
        const id = _nextId++;
        const duration = options.duration ?? 4000;
        setItems(prev => [
            ...prev,
            {
                id,
                message: options.message,
                title: options.title,
                tone: options.tone ?? 'info',
                duration,
                leaving: false,
            },
        ]);
        scheduleLeave(id, duration);
    }, []);

    function dismiss(id: number) {
        clearTimeout(timers.current.get(id));
        setItems(prev =>
            prev.map(t => (t.id === id ? { ...t, leaving: true } : t)),
        );
        const t = setTimeout(() => {
            setItems(prev => prev.filter(t => t.id !== id));
            timers.current.delete(id);
        }, LEAVE_DURATION);
        timers.current.set(id, t);
    }

    useEffect(() => {
        const map = timers.current;
        return () => map.forEach(clearTimeout);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {items.length > 0 && (
                <div className="toast-container" aria-label="Notificaciones">
                    {items.map(item => (
                        <ToastView key={item.id} item={item} onDismiss={dismiss} />
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
}
