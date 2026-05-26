import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
	SharedModalContext,
	type SharedModalOptions,
	type SharedModalState,
} from './SharedModalContext';

export type { SharedModalOptions } from './SharedModalContext';

function SharedModalView({
	modal,
	onConfirm,
	onCancel,
}: {
	modal: SharedModalState;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	const titleId = useId();
	const descriptionId = useId();
	const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				onCancel();
			}

			if (event.key === 'Enter' && modal.mode === 'confirm') {
				onConfirm();
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [modal.mode, onCancel, onConfirm]);

	useEffect(() => {
		if (modal.mode === 'confirm') {
			cancelButtonRef.current?.focus();
		}
	}, [modal.mode]);

	return (
		<div
			className="modal-backdrop"
			onClick={(event) => {
				if (modal.closeOnOverlayClick && event.target === event.currentTarget) {
					onCancel();
				}
			}}
		>
			<div
				className="modal-panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
			>
				<div className="modal-header">
					<span className={`modal-badge ${modal.tone}`}>{modal.mode === 'confirm' ? 'Confirmacion' : 'Informacion'}</span>
					<h2 id={titleId}>{modal.title}</h2>
				</div>
				<div className="modal-body" id={descriptionId}>
					{modal.message.split('\n').map((line) => (
						<p key={line}>{line}</p>
					))}
				</div>
				<div className="modal-actions">
					{modal.mode === 'confirm' ? (
						<button className="ghost-btn" type="button" onClick={onCancel} ref={cancelButtonRef}>
							{modal.cancelLabel}
						</button>
					) : null}
					<button className={modal.tone === 'error' ? 'danger-btn' : 'primary-btn'} type="button" onClick={onConfirm}>
						{modal.confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

export function SharedModalProvider({ children }: { children: ReactNode }) {
	const [modal, setModal] = useState<SharedModalState | null>(null);
	const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

	function closeModal(confirmed: boolean) {
		resolverRef.current?.(confirmed);
		resolverRef.current = null;
		setModal(null);
	}

	function openModal(options: SharedModalOptions): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			resolverRef.current = resolve;
			setModal({
				title: options.title,
				message: options.message,
				tone: options.tone ?? 'info',
				mode: options.mode ?? 'alert',
				confirmLabel: options.confirmLabel ?? (options.mode === 'confirm' ? 'Continuar' : 'Entendido'),
				cancelLabel: options.cancelLabel ?? 'Cancelar',
				closeOnOverlayClick: options.closeOnOverlayClick ?? false,
			});
		});
	}

	async function confirm(options: SharedModalOptions) {
		return openModal({ ...options, mode: 'confirm' });
	}

	async function notify(options: Omit<SharedModalOptions, 'mode'>) {
		await openModal({ ...options, mode: 'alert' });
	}

	return (
		<SharedModalContext.Provider value={{ confirm, notify }}>
			{children}
			{modal ? (
				<SharedModalView
					modal={modal}
					onConfirm={() => closeModal(true)}
					onCancel={() => closeModal(false)}
				/>
			) : null}
		</SharedModalContext.Provider>
	);
}

