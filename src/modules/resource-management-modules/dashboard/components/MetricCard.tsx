interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    variant?: "default" | "warning" | "critical" | "success";
    showProgressBar?: boolean;
    progressPercentage?: number;
}

export function MetricCard({
    title,
    value,
    subtitle,
    icon,
    variant = "default",
    showProgressBar = false,
    progressPercentage = 0,
}: MetricCardProps) {
    const variantStyles = {
        default: "border-border-default bg-[#000000]/50 backdrop-blur-sm",
        warning: "border-status-warning/30 bg-status-warning/5",
        critical: "border-status-critical/30 bg-status-critical/5",
        success: "border-status-ok/30 bg-status-ok/5",
    };

    const iconStyles = {
        default: "text-accent",
        warning: "text-status-warning",
        critical: "text-status-critical",
        success: "text-status-ok",
    };

    return (
        <div className={`relative border ${variantStyles[variant]} p-4 shadow-lg overflow-hidden`}>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50" />

            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="text-[10px] font-mono font-bold text-txt-disabled uppercase tracking-wide mb-2">
                        {title}
                    </div>
                    <div className="text-xl font-mono font-bold text-txt-primary mb-1">
                        {value}
                    </div>
                    {subtitle && (
                        <div className="text-[10px] font-mono text-txt-secondary tracking-wide opacity-80 uppercase">
                            {subtitle}
                        </div>
                    )}

                    {showProgressBar && (
                        <div className="mt-3">
                            <div className="w-full h-2 bg-bg-tertiary border border-border-default overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        variant === "critical"
                                            ? "bg-status-critical"
                                            : variant === "warning"
                                            ? "bg-status-warning"
                                            : variant === "success"
                                            ? "bg-status-ok"
                                            : "bg-accent"
                                    }`}
                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                />
                            </div>
                            <div className="text-[9px] font-mono text-txt-disabled mt-1 text-right">
                                {progressPercentage.toFixed(1)}%
                            </div>
                        </div>
                    )}
                </div>

                <div className={`${iconStyles[variant]} opacity-80`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
