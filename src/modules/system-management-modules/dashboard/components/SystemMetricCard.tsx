import type { ReactNode } from "react";

type SystemMetricCardProps = {
    label: string;
    value: string | number;
    subtitle: string;
    icon: ReactNode;
    tone?: "default" | "success" | "warning" | "critical" | "info";
};

const TONE_CLASS: Record<NonNullable<SystemMetricCardProps["tone"]>, string> = {
    default: "border-border-default bg-[#000000]/50",
    success: "border-status-ok/30 bg-status-ok/5",
    warning: "border-status-warning/30 bg-status-warning/5",
    critical: "border-status-critical/30 bg-status-critical/5",
    info: "border-status-info/30 bg-status-info/5",
};

const ICON_CLASS: Record<NonNullable<SystemMetricCardProps["tone"]>, string> = {
    default: "text-accent",
    success: "text-status-ok",
    warning: "text-status-warning",
    critical: "text-status-critical",
    info: "text-status-info",
};

export function SystemMetricCard({ label, value, subtitle, icon, tone = "default" }: SystemMetricCardProps) {
    return (
        <div className={`relative border ${TONE_CLASS[tone]} rmm-kpi-card shadow-lg overflow-hidden backdrop-blur-sm`}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50" />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono font-bold text-txt-disabled uppercase tracking-wide mb-2">
                        {label}
                    </div>
                    <div className="text-xl font-mono font-bold text-txt-primary mb-1">
                        {value}
                    </div>
                    <div className="text-[10px] font-mono text-txt-secondary tracking-wide opacity-80 uppercase">
                        {subtitle}
                    </div>
                </div>

                <div className={`${ICON_CLASS[tone]} opacity-80 shrink-0`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default SystemMetricCard;
