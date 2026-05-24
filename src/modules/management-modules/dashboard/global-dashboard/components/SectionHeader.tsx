import type { ReactNode } from "react";

export function SectionHeader({
    title,
    subtitle,
    icon,
    tag,
    tone = "blue",
}: {
    title: string;
    subtitle: string;
    icon: ReactNode;
    tag?: string;
    tone?: "blue" | "fire" | "green";
}) {
    const toneMap = {
        blue: "text-status-info border-status-info/30 bg-status-info/5",
        fire: "text-status-critical border-status-critical/30 bg-status-critical/5",
        green: "text-status-ok border-status-ok/30 bg-status-ok/5",
    };

    const iconToneClass =
        tone === "fire" ? "text-status-critical" : tone === "green" ? "text-status-ok" : "text-status-info";

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary/30 border-b border-border-subtle">
            <div className="flex flex-col gap-0.5 text-left">
                <span className="text-[11px] font-mono font-bold text-txt-primary uppercase tracking-[0.15em]">{title}</span>
                <p className="text-[9px] font-mono uppercase tracking-widest text-txt-disabled">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className={`${iconToneClass} opacity-70`}>{icon}</span>
                {tag ? (
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold border rounded-sm uppercase tracking-widest ${toneMap[tone]}`}>
                        {tag}
                    </span>
                ) : null}
            </div>
        </div>
    );
}
