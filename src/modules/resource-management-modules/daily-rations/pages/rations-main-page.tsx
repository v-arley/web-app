import { useState, useMemo, useEffect } from "react";
import { Utensils, Play, X, BarChart2 } from "lucide-react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { RationGenerationPanel } from "../components/RationGenerationPanel";
import { DailySummaryTable } from "../components/DailySummaryTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";
import { DAILY_SUMMARY_QUERY_KEY } from "../hooks/useDailySummaryQuery";
import { socket } from "../../../../lib/socket";

const resourceService = new ResourceService();

export function RationsMainPage() {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [rationDate, setRationDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;
    const queryClient = useQueryClient();

    const { data: resourcesData } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const response = await resourceService.findAll();
            return response.getResultado<{ id: number; name: string }[]>("registros") ?? [];
        },
    });

    const resourceMap = useMemo(() => {
        return new Map(resourcesData?.map((r) => [r.id, r.name]) ?? []);
    }, [resourcesData]);

    // Cuando el cron finaliza, refrescar el resumen
    useEffect(() => {
        if (!campId) return;

        const handler = (data: { camp_id: number }) => {
            if (data.camp_id !== campId) return;
            queryClient.invalidateQueries({ queryKey: DAILY_SUMMARY_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["rations"] });
        };

        socket.on("ration:daily-assigned", handler);
        return () => { socket.off("ration:daily-assigned", handler); };
    }, [campId, queryClient]);

    return (
        <article className="app-scope app-module">
            <header className="app-module-header">
                <div className="app-module-brand">
                    <div className="app-module-copy">
                        <div className="app-module-title">Rations</div>
                        <p className="app-module-subtitle">Resource Management</p>
                    </div>
                </div>

                <nav className="app-module-tabs">
                    <button className="app-module-tab app-module-tab--active">
                        <div className="app-module-tab-indicator" />
                        <span className="app-module-tab-icon"><BarChart2 size={16} /></span>
                        <div className="app-module-tab-copy">
                            <div className="app-module-tab-label">Daily Summary</div>
                        </div>
                    </button>

                    <div className="app-module-actions">
                        <button
                            onClick={() => setShowGenerateModal(true)}
                            className="app-btn app-btn--primary"
                        >
                            <Play size={12} fill="currentColor" />
                            Generate Rations
                        </button>
                    </div>
                </nav>
            </header>

            <main className="app-module-body">
                <div
                    key="summary"
                    className="app-animate-in"
                    style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
                >
                    <DailySummaryTable />
                </div>
            </main>

            {showGenerateModal && (
                <div className="app-overlay">
                    <div className="app-modal app-hud-frame" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
                        <div className="app-bracket app-bracket--tl" />
                        <div className="app-bracket app-bracket--br" />

                        <header className="app-panel-header">
                            <div>
                                <div className="app-panel-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Utensils size={14} style={{ color: "var(--color-accent)" }} />
                                    GENERATE DAILY RATIONS
                                </div>
                                <p className="app-panel-subtitle">
                                    Automated distribution for active camp members
                                </p>
                            </div>
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className="app-side-panel-close"
                            >
                                <X size={14} />
                            </button>
                        </header>

                        <div className="app-panel-body">
                            <RationGenerationPanel
                                campId={campId}
                                rationDate={rationDate}
                                onDateChange={setRationDate}
                                resourceMap={resourceMap}
                            />
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
