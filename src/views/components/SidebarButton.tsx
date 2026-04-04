type SidebarButtonProps = {
    label: string;
    active?: boolean;
    onClick: () => void;
};

export function SidebarButton({ label, active = false, onClick }: SidebarButtonProps) {
    const base =
        "text-left w-full transition-colors font-mono text-[11px] sm:text-xs uppercase tracking-widest py-2 px-3 rounded border-l-2";

    const activeClass = "text-white bg-[#3a3a3a] border-orange-500";
    const inactiveClass =
        "text-[#d4d4d4] hover:bg-[#333] hover:text-orange-500 border-transparent hover:border-[#555]";

    return (
        <button
            className={`${base} ${active ? activeClass : inactiveClass}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
