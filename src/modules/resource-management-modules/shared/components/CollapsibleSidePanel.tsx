import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, PanelRightOpen } from "lucide-react";

type CollapsibleSidePanelProps = {
    isOpen: boolean;
    label: string;
    collapsedLabel?: string;
    widthClassName?: string;
    children: ReactNode;
    onOpen: () => void;
    onClose: () => void;
};

const FLOATING_PANEL_QUERY = "(max-width: 1279px)";

export function getInitialSidePanelOpenState() {
    if (typeof window === "undefined") {
        return true;
    }

    return !window.matchMedia(FLOATING_PANEL_QUERY).matches;
}

export function CollapsibleSidePanel({
    isOpen,
    label,
    collapsedLabel = "FORM",
    widthClassName = "lg:w-100",
    children,
    onOpen,
    onClose,
}: CollapsibleSidePanelProps) {
    const didApplyInitialMobileState = useRef(false);

    useEffect(() => {
        if (didApplyInitialMobileState.current) return;
        didApplyInitialMobileState.current = true;

        if (window.matchMedia(FLOATING_PANEL_QUERY).matches) {
            onClose();
        }
    }, [onClose]);

    return (
        <>
            <button
                type="button"
                className={`app-side-panel-backdrop${isOpen ? " is-visible" : ""}`}
                aria-label={`Close ${label}`}
                onClick={onClose}
            />
            <aside
                className={`app-side-panel ${isOpen ? "is-open" : "is-collapsed"} ${widthClassName}`}
                aria-label={label}
            >
                {isOpen ? (
                    children
                ) : (
                    <button
                        type="button"
                        className="app-side-panel-rail"
                        title={`Expand ${label}`}
                        aria-label={`Expand ${label}`}
                        onClick={onOpen}
                    >
                        <ChevronLeft className="app-side-panel-rail-icon app-side-panel-rail-icon--desktop" size={16} aria-hidden="true" />
                        <PanelRightOpen className="app-side-panel-rail-icon app-side-panel-rail-icon--mobile" size={16} aria-hidden="true" />
                        <span>{collapsedLabel}</span>
                    </button>
                )}
            </aside>
        </>
    );
}

export function CollapsiblePanelHeader({
    title,
    subtitle,
    onClose,
}: {
    title: string;
    subtitle?: ReactNode;
    onClose: () => void;
}) {
    return (
        <header className="app-side-panel-header">
            <div className="min-w-0">
                <div className="app-side-panel-title">{title}</div>
                {subtitle ? (
                    <p className="app-side-panel-subtitle">{subtitle}</p>
                ) : null}
            </div>
            <button
                type="button"
                onClick={onClose}
                className="app-side-panel-close"
                title="Collapse form"
                aria-label="Collapse form"
            >
                <ChevronRight size={14} aria-hidden="true" />
            </button>
        </header>
    );
}

export default CollapsibleSidePanel;
