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
        <div className="sa-overlay">
            <section className="rmm-scope sa-modal sa-hud-frame">
                <div className="sa-bracket sa-bracket--tl" />
                <div className="sa-bracket sa-bracket--br" />

                <header className="sa-panel-header">
                    <div className="flex min-w-0 items-start gap-3">
                        <AlertTriangle className={tone === "danger" ? "text-accent shrink-0 text-status-critical" : "text-accent shrink-0"} size={20} />
                        <div>
                            <h2 className="sa-heading sa-heading--accent">{title}</h2>
                            <p className="sa-muted mt-1">{description}</p>
                        </div>
                    </div>
                    <button type="button" className="rmm-form-panel-close" onClick={onCancel} aria-label="Close">
                        <X size={18} />
                    </button>
                </header>

                {children ? <div className="sa-panel-body">{children}</div> : null}

                <footer className="sa-panel-footer">
                    <button type="button" className="rmm-btn rmm-btn-outline" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={tone === "danger" ? "rmm-btn border border-status-critical/30 bg-status-critical/5 text-status-critical hover:bg-status-critical/15" : "rmm-btn rmm-btn-accent"}
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
