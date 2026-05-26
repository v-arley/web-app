import { createContext } from 'react';

export type ModalTone = 'success' | 'error' | 'info';
export type ModalMode = 'alert' | 'confirm';

export type SharedModalOptions = {
	title: string;
	message: string;
	tone?: ModalTone;
	mode?: ModalMode;
	confirmLabel?: string;
	cancelLabel?: string;
	closeOnOverlayClick?: boolean;
};

export type SharedModalState = {
	title: string;
	message: string;
	tone: ModalTone;
	mode: ModalMode;
	confirmLabel: string;
	cancelLabel: string;
	closeOnOverlayClick: boolean;
};

export type SharedModalContextValue = {
	confirm: (options: SharedModalOptions) => Promise<boolean>;
	notify: (options: Omit<SharedModalOptions, 'mode'>) => Promise<void>;
};

export const SharedModalContext = createContext<SharedModalContextValue | null>(null);
