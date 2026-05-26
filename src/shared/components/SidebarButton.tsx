import type { ReactNode } from "react";

type SidebarButtonProps = {
    label: string;
    icon?: ReactNode;
    active?: boolean;
    onClick: () => void;
};

export function SidebarButton({ label, icon, active = false, onClick }: SidebarButtonProps) {
    const base = "w-full text-left transition-all font-mono text-[13px] uppercase tracking-[0.2em] py-4 px-6 relative flex items-center group";

    const activeClass = "text-txt-primary bg-bg-selected";
    const inactiveClass = "text-txt-secondary hover:bg-bg-tertiary hover:text-txt-primary";

    return (
        <button
            className={`${base} ${active ? activeClass : inactiveClass}`}
            onClick={onClick}
        >
            {icon && (
                <span className={`mr-6 ${active ? 'text-accent' : 'text-txt-disabled group-hover:text-txt-primary'} transition-colors`}>
                    {icon}
                </span>
            )}
            {label}
        </button>
    );
}
