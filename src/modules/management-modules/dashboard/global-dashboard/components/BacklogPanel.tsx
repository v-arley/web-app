import { ClipboardList } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export function BacklogPanel({
    openAlertsCount,
    pendingAdmissionsCount,
    activeShipmentsCount,
    activeExplorationsCount,
}: {
    openAlertsCount: number;
    pendingAdmissionsCount: number;
    activeShipmentsCount: number;
    activeExplorationsCount: number;
}) {
    const overloaded = pendingAdmissionsCount > 0 || openAlertsCount > 0;

    return (
        <section className="bg-bg-primary border border-border-default shadow-lg p-1 text-left">
            <SectionHeader
                title="Strategic Backlog"
                subtitle="Critical tasks and validation queue"
                icon={<ClipboardList size={18} />}
                tag={overloaded ? "OVERLOAD" : "NOMINAL"}
                tone={overloaded ? "fire" : "green"}
            />
            <div className="p-4 flex flex-col h-full text-left">
                <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="flex flex-col gap-1 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-status-critical/30 transition-all cursor-crosshair">
                        <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Inventory Alerts</span>
                        <span className={`text-xl font-mono ${openAlertsCount > 0 ? "text-status-critical" : "text-txt-primary"} text-left`}>
                            {String(openAlertsCount).padStart(2, "0")}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-status-warning/30 transition-all cursor-crosshair">
                        <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Pending Access</span>
                        <span className={`text-xl font-mono ${pendingAdmissionsCount > 0 ? "text-status-warning" : "text-txt-primary"} text-left`}>
                            {String(pendingAdmissionsCount).padStart(2, "0")}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-status-info/30 transition-all cursor-crosshair">
                        <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Active Ships</span>
                        <span className="text-xl font-mono text-status-info text-left">{String(activeShipmentsCount).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-bg-tertiary/40 border border-border-default/50 hover:border-accent/30 transition-all cursor-crosshair">
                        <span className="text-[9px] font-mono font-bold text-txt-disabled uppercase tracking-widest text-left">Ongoing Exp</span>
                        <span className="text-xl font-mono text-accent text-left">{String(activeExplorationsCount).padStart(2, "0")}</span>
                    </div>
                </div>
                <div className={`mt-4 px-3 py-2 border font-mono text-[9px] uppercase tracking-wider ${
                    pendingAdmissionsCount > 0
                        ? "bg-status-critical/10 border-status-critical/20 text-status-critical"
                        : "bg-status-ok/10 border-status-ok/20 text-status-ok"
                }`}>
                    {pendingAdmissionsCount > 0
                        ? `URGENT: ${pendingAdmissionsCount} PERSONNEL_REQS REQUIRE IMMEDIATE CLEARANCE.`
                        : "QUEUES_SYNCED: NO BOTTLENECKS DETECTED."}
                </div>
            </div>
        </section>
    );
}
