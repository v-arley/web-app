import { AlertTriangle, CheckCircle, RefreshCw, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { useToast } from "../../../../shared/hooks/useToast";
import { AlertsTable } from "../components/AlertsTable";
import { useAlertMutation } from "../hooks/useAlertMutation";
import { useAlertsQuery } from "../hooks/useAlertsQuery";

export function AlertsPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<"active" | "history">("active");

    const { query: activeQuery } = useAlertsQuery(campId, true, "N");
    const { query: historyQuery } = useAlertsQuery(campId, activeTab === "history", "Y");
    const alertMutation = useAlertMutation();

    const currentQuery = activeTab === "active" ? activeQuery : historyQuery;
    const currentAlerts = currentQuery.data ?? [];

    useEffect(() => {
        if (currentQuery.error) {
            toast({
                tone: "error",
                title: "Query error",
                message: currentQuery.error.message,
            });
        }
    }, [currentQuery.error, toast]);

    const handleResolve = async (alertId: number) => {
        try {
            await alertMutation.resolve.mutateAsync(alertId);
            toast({
                tone: "success",
                title: "Alert resolved",
                message: "The alert record has been updated.",
            });
        } catch (error) {
            toast({
                tone: "error",
                title: "Resolution failed",
                message: error instanceof Error ? error.message : "Could not resolve the alert.",
            });
        }
    };

    const handleViewDetail = (warehouseId: number, resourceId: number) => {
        console.log("Ver detalle:", { warehouseId, resourceId });
    };

    const tabs: Array<{ key: "active" | "history"; label: string; icon: React.ReactNode; description: string }> = [
        { key: "active", label: "Critical / Low Stock", icon: <AlertTriangle size={16} />, description: "Immediate attention required" },
        { key: "history", label: "Resolved History", icon: <CheckCircle size={16} />, description: "Handled alerts archive" },
    ];

    return (
            <article className="rmm-scope flex h-full min-h-0 flex-col bg-bg-app overflow-hidden relative">
            {/* Corner Brackets */}
            <div className="rmm-bracket rmm-bracket-tl"></div>
            <div className="rmm-bracket rmm-bracket-tr"></div>
            <div className="rmm-bracket rmm-bracket-bl"></div>
            <div className="rmm-bracket rmm-bracket-br"></div>

            {/* Topbar — identity + horizontal nav */}
            <header className="flex items-stretch border-b border-border-default bg-bg-tertiary shrink-0 z-10">
                {/* Module identity */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-0.75 self-stretch bg-status-critical"></div>
                    <div className="py-2 px-3">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Alerts
                        </h3>
                        <p className="font-mono text-[9px] text-txt-muted uppercase tracking-wide mt-0.5">
                            Stock Monitoring <span className="text-status-critical"> | </span> RMM-ALRT
                        </p>
                    </div>
                </div>

                {/* Horizontal tab nav */}
                <nav className="flex items-stretch flex-1 justify-start">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "bg-bg-app/60 text-status-critical"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-status-critical" />
                            )}
                            <span className={`font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-status-critical opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className={activeTab === tab.key ? "text-status-critical" : "text-txt-disabled group-hover:text-txt-secondary"}>
                                {tab.icon}
                            </span>
                            <div className="text-left">
                                <div className="font-mono text-[10px] font-bold uppercase tracking-widest">
                                    {tab.label}
                                </div>
                                <div className="font-mono text-[8px] text-txt-disabled uppercase tracking-wide">
                                    {tab.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Scan button */}
                <div className="flex items-center px-4 border-l border-border-default shrink-0 gap-3">
                    <button
                        onClick={() => currentQuery.refetch()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-status-critical/10 border border-status-critical/30 text-status-critical font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-status-critical/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentQuery.isLoading}
                    >
                        <RefreshCw size={12} className={currentQuery.isLoading ? "animate-spin" : ""} />
                        RE-SCAN
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col p-4 md:p-8 space-y-4">
                <section className="flex-1 flex flex-col overflow-hidden bg-bg-tertiary border border-border-default shadow-sm">
                    <header className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-secondary/20">
                        <h3 className="text-[12px] font-bold text-txt-primary uppercase tracking-wide flex items-center gap-2">
                            <div className={`w-1 h-3 ${activeTab === "active" ? "bg-status-critical" : "bg-status-ok"}`} />
                            {activeTab === "active" ? "Critical Asset Monitoring" : "Resolved Incidents Archive"}
                        </h3>
                        {currentAlerts.length > 0 && (
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 ${activeTab === "active" ? "text-status-critical bg-status-critical/10" : "text-status-ok bg-status-ok/10"}`}>
                                COUNT: {String(currentAlerts.length).padStart(4, "0")}
                            </span>
                        )}
                    </header>

                    <div className="flex-1 overflow-auto">
                        {currentQuery.isLoading ? (
                            <div className="flex h-full items-center justify-center bg-bg-secondary/10">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-5 w-5 border-2 border-status-critical border-t-transparent animate-spin" />
                                    <span className="font-mono text-[10px] text-txt-muted uppercase tracking-[0.3em]">Querying Database...</span>
                                </div>
                            </div>
                        ) : currentAlerts.length > 0 ? (
                            <AlertsTable
                                alerts={currentAlerts}
                                onResolve={handleResolve}
                                onViewDetail={handleViewDetail}
                                showResolveButton={activeTab === "active"}
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center p-20 opacity-40 grayscale">
                                <CheckCircle size={48} className="text-txt-disabled mb-4" />
                                <div className="font-mono text-[12px] font-bold text-txt-primary uppercase tracking-widest mb-1">
                                    {activeTab === "active" ? "No active alerts" : "No resolved alerts"}
                                </div>
                                <div className="font-mono text-[10px] text-txt-disabled uppercase tracking-wider">
                                    System status within normal operating parameters.
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <footer className={`px-5 py-4 border-l-4 font-mono text-[10px] text-txt-secondary leading-relaxed ${activeTab === "active" ? "bg-status-critical/5 border-status-critical" : "bg-status-ok/5 border-status-ok"}`}>
                    <div className="flex items-start gap-3">
                        <Info size={16} className={`${activeTab === "active" ? "text-status-critical" : "text-status-ok"} shrink-0 mt-0.5`} />
                        <div>
                            <span className={`font-bold uppercase tracking-widest block mb-1 ${activeTab === "active" ? "text-status-critical" : "text-status-ok"}`}>
                                OPERATIONAL_GUIDE
                            </span>
                            {activeTab === "active" 
                                ? "System triggers alerts when resource quantity ≤ configured minimum. Resolve alerts after replenishing stock." 
                                : "History of all previously triggered stock alerts that have been acknowledged and resolved by personnel."}
                        </div>
                    </div>
                </footer>
            </main>
        </article>
    );
}
