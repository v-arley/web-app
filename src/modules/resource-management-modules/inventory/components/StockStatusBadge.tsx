type Props = {
    status: "CRITICAL" | "LOW" | "OK";
    size?: "sm" | "md";
};

export function StockStatusBadge({ status, size = "md" }: Props) {
    const sizeClass = size === "sm" ? "text-[8px] px-1" : "text-[10px] px-1.5 py-0.5";
    
    const statusConfig = {
        CRITICAL: { label: "CRITICAL_ALERT", color: "bg-status-critical/10 text-status-critical border-status-critical" },
        LOW: { label: "LOW_STOCK", color: "bg-status-warning/10 text-status-warning border-status-warning" },
        OK: { label: "STABLE", color: "bg-status-ok/10 text-status-ok border-status-ok" },
    };

    const config = statusConfig[status];

    return (
        <span className={`font-mono font-bold uppercase border-l-2 ${sizeClass} ${config.color} tracking-tighter`}>
            [{config.label}]
        </span>
    );
}
