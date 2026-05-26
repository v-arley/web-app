import { createContext } from 'react';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
    message: string;
    title?: string;
    tone?: ToastTone;
    duration?: number;
};

export type ToastContextValue = {
    toast: (options: ToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
