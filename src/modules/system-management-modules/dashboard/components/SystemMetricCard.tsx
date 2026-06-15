import type { CSSProperties, ReactNode } from "react";

type SystemMetricCardProps = {
    label: string;
    value: string | number;
    subtitle: string;
    icon: ReactNode;
    tone?: "default" | "success" | "warning" | "critical" | "info";
};

const TONE_STYLE: Record<NonNullable<SystemMetricCardProps["tone"]>, CSSProperties> = {
    default:  {},
    success:  { borderColor: "color-mix(in srgb, var(--color-status-ok) 35%, transparent)",       background: "color-mix(in srgb, var(--color-status-ok) 6%, transparent)" },
    warning:  { borderColor: "color-mix(in srgb, var(--color-status-warning) 35%, transparent)",  background: "color-mix(in srgb, var(--color-status-warning) 6%, transparent)" },
    critical: { borderColor: "color-mix(in srgb, var(--color-status-critical) 35%, transparent)", background: "color-mix(in srgb, var(--color-status-critical) 6%, transparent)" },
    info:     { borderColor: "color-mix(in srgb, var(--color-status-info) 35%, transparent)",     background: "color-mix(in srgb, var(--color-status-info) 6%, transparent)" },
};

const ICON_COLOR: Record<NonNullable<SystemMetricCardProps["tone"]>, string> = {
    default:  "var(--color-accent)",
    success:  "var(--color-status-ok)",
    warning:  "var(--color-status-warning)",
    critical: "var(--color-status-critical)",
    info:     "var(--color-status-info)",
};

export function SystemMetricCard({ label, value, subtitle, icon, tone = "default" }: SystemMetricCardProps) {
    return (
        <div className="app-kpi-card app-hud-frame" style={TONE_STYLE[tone]}>
            <div className="app-bracket app-bracket--tl" />
            <div className="app-bracket app-bracket--br" />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="app-kpi-label">{label}</div>
                    <div className="app-kpi-value" style={{ marginBlock: "0.4rem 0.25rem" }}>{value}</div>
                    <div className="app-kpi-sub">{subtitle}</div>
                </div>
                <div style={{ color: ICON_COLOR[tone], opacity: 0.85, flexShrink: 0 }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default SystemMetricCard;
