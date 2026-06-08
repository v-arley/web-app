import { Activity, AlertTriangle, Compass } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
    totalExplorations: number;
    activeCount: number;
    highRiskCount: number;
};

type MetricCardProps = {
    label: string;
    value: number;
    tone: "orange" | "blue" | "yellow";
    icon: ReactNode;
};

function MetricCard({ label, value, tone, icon }: MetricCardProps) {
    const toneClasses = {
        orange: {
            border: "border-[#E85D04]/45",
            text: "text-[#E85D04]",
            bg: "bg-[#E85D04]/10",
            shadow: "shadow-[0_0_18px_rgba(232,93,4,0.10)]",
        },
        blue: {
            border: "border-[#38BDF8]/45",
            text: "text-[#38BDF8]",
            bg: "bg-[#38BDF8]/10",
            shadow: "shadow-[0_0_18px_rgba(56,189,248,0.10)]",
        },
        yellow: {
            border: "border-[#FACC15]/45",
            text: "text-[#FACC15]",
            bg: "bg-[#FACC15]/10",
            shadow: "shadow-[0_0_18px_rgba(250,204,21,0.10)]",
        },
    };

    const colors = toneClasses[tone];

    return (
        <div
            className={`border ${colors.border} bg-[#1a1a1a] p-5 ${colors.shadow} transition-colors hover:bg-[#202020]`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-label text-[#6B7280]">
                        {label}
                    </p>

                    <p className={`mt-3 text-4xl font-mono font-black ${colors.text}`}>
                        {value.toString().padStart(2, "0")}
                    </p>
                </div>

                <div
                    className={`border ${colors.border} ${colors.bg} ${colors.text} p-3`}
                >
                    {icon}
                </div>
            </div>

            <div className="mt-4 h-1 w-full overflow-hidden border border-[#3a3a3a] bg-[#111111]">
                <div className={`h-full ${colors.bg}`} />
            </div>
        </div>
    );
}

export default function ExplorationStats({
    totalExplorations,
    activeCount,
    highRiskCount,
}: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricCard
                label="Total explorations"
                value={totalExplorations}
                tone="orange"
                icon={<Compass size={20} />}
            />

            <MetricCard
                label="Active explorations"
                value={activeCount}
                tone="blue"
                icon={<Activity size={20} />}
            />

            <MetricCard
                label="High risk"
                value={highRiskCount}
                tone="yellow"
                icon={<AlertTriangle size={20} />}
            />
        </div>
    );
}