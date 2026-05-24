import { ShieldCheck } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export function IntegrityPanel({
    dashboardStatus,
    dashboardTone,
    resourcesCount,
    warehousesCount,
    totalNodes,
    mappedCoverage,
    activeCampRatio,
    activeCampCount,
}: {
    dashboardStatus: string;
    dashboardTone: "blue" | "fire" | "green";
    resourcesCount: number;
    warehousesCount: number;
    totalNodes: number;
    mappedCoverage: number;
    activeCampRatio: number;
    activeCampCount: number;
}) {
    return (
        <section className="bg-bg-primary border border-border-default shadow-lg p-1 text-left">
            <SectionHeader
                title="Resource Integrity"
                subtitle="System footprint analysis"
                icon={<ShieldCheck size={18} />}
                tag={dashboardStatus}
                tone={dashboardTone}
            />
            <div className="p-4 flex flex-col h-full text-left">
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col gap-0.5 p-3 bg-bg-tertiary/40 border border-border-default/30 group hover:border-accent/40 transition-colors">
                        <span className="text-[8px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Mapped Assets</span>
                        <span className="text-xl font-mono text-txt-primary tracking-tighter text-left">{String(resourcesCount).padStart(3, "0")}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 p-3 bg-bg-tertiary/40 border border-border-default/30 group hover:border-status-info/40 transition-colors">
                        <span className="text-[8px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Active Hubs</span>
                        <span className="text-xl font-mono text-txt-primary tracking-tighter text-left">{String(warehousesCount).padStart(3, "0")}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 p-3 bg-bg-tertiary/40 border border-border-default/30 group hover:border-status-ok/40 transition-colors">
                        <span className="text-[8px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Total Nodes</span>
                        <span className="text-xl font-mono text-txt-primary tracking-tighter text-left">{String(totalNodes).padStart(3, "0")}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 p-3 bg-bg-tertiary/40 border border-border-default/30 group hover:border-accent/40 transition-colors">
                        <span className="text-[8px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Coverage</span>
                        <span className="text-xl font-mono text-accent tracking-tighter text-left">{String(mappedCoverage).padStart(2, "0")}%</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-txt-disabled">
                        <span>Sector saturation index</span>
                        <span>{Math.round(activeCampRatio * 100)}%</span>
                    </div>
                    <div className="h-1 w-full bg-bg-tertiary">
                        <div className="h-full bg-status-info transition-all duration-1000" style={{ width: `${activeCampRatio * 100}%` }} />
                    </div>
                </div>

                <div className="mt-4 px-3 py-2 bg-bg-tertiary/60 border border-border-default/30 text-[9px] font-mono text-txt-secondary leading-relaxed uppercase tracking-wider text-left">
                    FINAL_REPORT: Validation complete. Operational footprint stabilized across {activeCampCount} active sectors.
                </div>
            </div>
        </section>
    );
}
