import { Activity, TrendingUp } from "lucide-react";
import type { ProductionPoint } from "../utils/global-dashboard.types";
import { SectionHeader } from "./SectionHeader";

export function ProductionPanel({
    topCampsProduction,
    movementCount,
}: {
    topCampsProduction: ProductionPoint[];
    movementCount: number;
}) {
    const maxValue = Math.max(...topCampsProduction.map((camp) => camp.value), 1);

    return (
        <section className="bg-bg-primary border border-border-default shadow-lg p-1 text-left">
            <SectionHeader
                title="Economic Output"
                subtitle="Top sectors by production metrics"
                icon={<TrendingUp size={18} />}
                tag="ANALYSIS_READY"
                tone="blue"
            />
            <div className="p-4 space-y-4 text-left">
                <div className="flex flex-col gap-2">
                    {topCampsProduction.map((camp, index) => (
                        <div key={camp.campId} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-txt-secondary">
                                <div className="flex items-center gap-2">
                                    <span className="text-txt-disabled">0{index + 1}</span>
                                    <span className="font-bold text-txt-primary">{camp.code}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-accent">{camp.value} UX</span>
                                    {camp.trend === "UP" ? (
                                        <TrendingUp size={10} className="text-status-ok" />
                                    ) : (
                                        <Activity size={10} className="text-status-critical animate-pulse" />
                                    )}
                                </div>
                            </div>
                            <div className="h-1 w-full bg-bg-tertiary">
                                <div
                                    className="h-full bg-accent transition-all duration-1000 shadow-[0_0_8px_rgba(232,93,4,0.4)]"
                                    style={{ width: `${(camp.value / maxValue) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-3 py-2 border font-mono text-[9px] uppercase tracking-wider leading-relaxed bg-bg-tertiary/40 border-border-default/50 text-txt-disabled">
                    INFO: Production data aggregated from {movementCount} logged resource movements in the last cycle.
                </div>
            </div>
        </section>
    );
}
