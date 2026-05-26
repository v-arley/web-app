import type { FeedItem } from "../utils/global-dashboard.types";
import { Activity } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export function OperationsFeed({ feed }: { feed: FeedItem[] }) {
    return (
        <section className="bg-bg-primary border border-border-default shadow-lg overflow-hidden flex flex-col h-120">
            <SectionHeader
                title="Operational Stream"
                subtitle="Latest logistical telemetry"
                icon={<Activity size={18} />}
                tag={feed.length > 0 ? "MONITORING" : "IDLE"}
                tone={feed.some((item) => item.tone === "critical" || item.tone === "warning") ? "fire" : "blue"}
            />
            <div className="flex-1 overflow-y-auto px-4 py-2 bg-bg-app/10">
                <div className="flex flex-col divide-y divide-border-subtle/20">
                    {feed.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 py-3 group hover:bg-bg-selected/20 transition-colors px-1 -mx-1 text-left">
                            <div className="flex flex-col items-center pt-1 shrink-0">
                                <span className="font-mono text-[8px] text-txt-disabled group-hover:text-accent transition-colors">
                                    {item.time}
                                </span>
                            </div>
                            <div className={`w-0.5 self-stretch rounded-full shrink-0 ${
                                item.tone === "critical"
                                    ? "bg-status-critical shadow-[0_0_5px_rgba(232,93,4,0.4)]"
                                    : item.tone === "warning"
                                      ? "bg-status-warning"
                                      : item.tone === "info"
                                        ? "bg-status-info"
                                        : "bg-status-ok"
                            }`} />
                            <div className="flex-1 min-w-0">
                                <div className="text-[9px] font-mono font-bold text-txt-primary uppercase tracking-widest truncate">{item.label}</div>
                                <div className="text-[10px] font-mono text-txt-secondary leading-tight mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">
                                    {item.detail}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
