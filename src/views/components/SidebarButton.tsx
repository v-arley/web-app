import { ReactNode } from "react";

type SidebarButtonProps = {
    label: string;
    icon?: ReactNode;
    active?: boolean;
    onClick: () => void;
};

export function SidebarButton({ label, icon, active = false, onClick }: SidebarButtonProps) {
    const base = "w-full text-left transition-all font-mono text-[13px] uppercase tracking-[0.2em] py-4 px-6 relative flex items-center group";

    const activeClass = "text-white bg-[#222225]";
    const inactiveClass = "text-[#666] hover:bg-[#1f1f22] hover:text-white";

    return (
        <button
            className={`${base} ${active ? activeClass : inactiveClass}`}
            onClick={onClick}
        >
            {icon && (
                <span className={`mr-6 ${active ? 'text-[#f05a28]' : 'text-[#555] group-hover:text-white'} transition-colors`}>
                    {icon}
                </span>
            )}
            {label}
        </button>
    );
}
