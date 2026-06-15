import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import CollapsibleSidePanel from "../../../resource-management-modules/shared/components/CollapsibleSidePanel";

type SystemFloatingFormPanelProps = {
    isOpen: boolean;
    label: string;
    collapsedLabel?: string;
    children: ReactNode;
    onOpen: () => void;
    onClose: () => void;
};

export function SystemFloatingFormPanel({
    isOpen,
    label,
    collapsedLabel = "FORM",
    children,
    onOpen,
    onClose,
}: SystemFloatingFormPanelProps) {
    return (
        <CollapsibleSidePanel
            isOpen={isOpen}
            label={label}
            collapsedLabel={collapsedLabel}
            widthClassName="lg:w-95"
            onOpen={onOpen}
            onClose={onClose}
        >
            <div className="flex min-h-0 flex-1 flex-col relative">
                <button
                    type="button"
                    className="app-side-panel-close absolute right-3 top-3 z-10"
                    onClick={onClose}
                    title={`Collapse ${label}`}
                    aria-label={`Collapse ${label}`}
                >
                    <ChevronRight size={14} aria-hidden="true" />
                </button>
                {children}
            </div>
        </CollapsibleSidePanel>
    );
}

export default SystemFloatingFormPanel;
