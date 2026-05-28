import type { ReactNode } from "react";

type SidebarButtonProps = {
    label: string;
    icon?: ReactNode;
    active?: boolean;
    onClick: () => void;
};

export function SidebarButton({ label, icon, active = false, onClick }: SidebarButtonProps) {
    const buttonClass = `sidebar-button ${active ? "is-active" : "is-idle"}`;

    return (
        <button
            type="button"
            className={buttonClass}
            onClick={onClick}
            aria-current={active ? "page" : undefined}
        >
            {icon && (
                <span className="sidebar-button-icon">
                    {icon}
                </span>
            )}
            <span className="sidebar-button-label">{label}</span>
        </button>
    );
}
