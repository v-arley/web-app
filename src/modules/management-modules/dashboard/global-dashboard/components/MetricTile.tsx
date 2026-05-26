import type { ReactNode } from "react";

export function MetricTile({
    label,
    value,
    detail,
    icon,
    tone = "blue",
}: {
    label: string;
    value: string | number;
    detail: string;
    icon: ReactNode;
    tone?: "blue" | "fire" | "green";
}) {
    const toneMap = {
        blue: {
            border: "border-border-default hover:border-status-info/50",
            accent: "text-status-info",
            bg: "bg-bg-secondary/50",
            stroke: "var(--color-status-info)",
        },
        fire: {
            border: "border-status-critical/30 hover:border-status-critical/60",
            accent: "text-status-critical",
            bg: "bg-status-critical/5",
            stroke: "var(--color-status-critical)",
        },
        green: {
            border: "border-status-ok/30 hover:border-status-ok/60",
            accent: "text-status-ok",
            bg: "bg-status-ok/5",
            stroke: "var(--color-status-ok)",
        },
    };

    const config = toneMap[tone];

    return (
        <div className={`relative p-5 border ${config.border} ${config.bg} transition-all group overflow-hidden shadow-sm`}>
            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-accent/40" />
            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-accent/40" />

            <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-txt-disabled uppercase tracking-widest">{label}</span>
                <span className={`${config.accent} opacity-80 group-hover:opacity-100 transition-opacity`}>{icon}</span>
            </div>

            <div className="text-2xl font-mono font-bold text-txt-primary uppercase tracking-tight leading-none mb-1">{value}</div>
            <div className={`text-[9px] font-mono uppercase tracking-wider ${tone === "fire" ? "text-status-critical" : "text-txt-secondary"}`}>
                {detail}
            </div>

            <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                <svg width="48" height="20" viewBox="0 0 48 20" aria-hidden="true">
                    <polyline
                        points="0,16 8,12 16,14 24,6 32,9 40,4 48,2"
                        fill="none"
                        stroke={config.stroke}
                        strokeWidth="1.5"
                    />
                </svg>
            </div>
        </div>
    );
}
