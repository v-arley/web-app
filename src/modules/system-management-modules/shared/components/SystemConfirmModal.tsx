import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

type SystemConfirmModalProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    tone?: "danger" | "default";
    children?: ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
};

export function SystemConfirmModal({
    open,
    title,
    description,
    confirmLabel,
    tone = "default",
    children,
    onCancel,
    onConfirm,
}: SystemConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="app-overlay">
            <section className="app-scope app-modal app-hud-frame">
                <div className="app-bracket app-bracket--tl" />
                <div className="app-bracket app-bracket--br" />

                <header className="app-panel-header">
                    <div className="flex min-w-0 items-start gap-3">
                        <AlertTriangle className={tone === "danger" ? "text-accent shrink-0 text-status-critical" : "text-accent shrink-0"} size={20} />
                        <div>
                            <h2 className="app-heading app-heading--accent">{title}</h2>
                            <p className="app-muted mt-1">{description}</p>
                        </div>
                    </div>
                    <button type="button" className="app-side-panel-close" onClick={onCancel} aria-label="Close">
                        <X size={18} />
                    </button>
                </header>

                {children ? <div className="app-panel-body">{children}</div> : null}

                <footer className="app-panel-footer">
<button type="button" className="app-btn app-btn--outline" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        type="button"
className={tone === "danger" ? "app-btn app-btn--danger" : "app-btn app-btn--primary"}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </footer>
            </section>
        </div>
    );
}

export default SystemConfirmModal;
