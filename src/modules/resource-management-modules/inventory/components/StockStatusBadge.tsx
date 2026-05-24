type Props = {
    status: "CRITICAL" | "LOW" | "OK";
    size?: "sm" | "md";
};

export function StockStatusBadge({ status, size = "md" }: Props) {
    const sizeClass = size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1";
    
    const statusConfig = {
        CRITICAL: { label: "CRITICO", color: "bg-status-critical/10 border-status-critical/30 text-status-critical" },
        LOW: { label: "BAJO", color: "bg-status-warning/10 border-status-warning/30 text-status-warning" },
        OK: { label: "OK", color: "bg-status-ok/10 border-status-ok/30 text-status-ok" },
    };

    const config = statusConfig[status];

    return (
        <span className={`font-mono font-bold uppercase border ${sizeClass} ${config.color}`}>
            {config.label}
        </span>
    );
}
