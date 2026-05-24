import { useState } from "react";
import { Utensils, ClipboardCheck, History, Play } from "lucide-react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { GenerateRationsPage } from "./GenerateRationsPage";
import { DeliverRationsPage } from "./DeliverRationsPage";
import { RationHistoryPage } from "./RationHistoryPage";

type RationTab = "generate" | "deliver" | "history";

export function RationsMainPage() {
    const [activeTab, setActiveTab] = useState<RationTab>("generate");
    const [generationFeedback, setGenerationFeedback] = useState<{
        type: "success" | "error" | "warning";
        message: string;
    } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const handleGenerateRations = async () => {
        setIsGenerating(true);
        setGenerationFeedback(null);

        try {
            // TODO: Implementar llamada al endpoint POST /api/rations/generate-today
            // const response = await rationService.generateToday(campId);

            // Simulación temporal
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setGenerationFeedback({
                type: "warning",
                message:
                    "⚠️ Endpoint POST /api/rations/generate-today no implementado. Implementa este endpoint en el backend.",
            });
        } catch (error: any) {
            setGenerationFeedback({
                type: "error",
                message: error.message || "Error al generar raciones",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const tabs: Array<{
        key: RationTab;
        label: string;
        icon: React.ReactNode;
        description: string;
    }> = [
        {
            key: "generate",
            label: "Generar Raciones",
            icon: <Utensils size={20} />,
            description: "Genera raciones para la población del día",
        },
        {
            key: "deliver",
            label: "Entregar Raciones",
            icon: <ClipboardCheck size={20} />,
            description: "Entrega raciones pendientes individualmente",
        },
        {
            key: "history",
            label: "Historial",
            icon: <History size={20} />,
            description: "Consulta el historial de raciones",
        },
    ];

    return (
        <div className="flex h-full flex-col bg-bg-app overflow-hidden">
            {/* Header with tabs */}
            <div className="shrink-0 border-b border-border-default bg-bg-secondary">
                <div className="px-5 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                            Administración de Recursos / Raciones
                        </div>

                        {/* Generate Today Button */}
                        <button
                            onClick={handleGenerateRations}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-accent border-2 border-accent hover:bg-accent/90 text-bg-primary text-[10px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="h-3 w-3 animate-spin border-2 border-bg-primary border-t-transparent rounded-full" />
                                    Generando...
                                </>
                            ) : (
                                <>
                                    <Play size={14} />
                                    Generar Raciones Hoy
                                </>
                            )}
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-start gap-3 p-4 border-2 transition-all text-left ${
                                    activeTab === tab.key
                                        ? "border-accent bg-accent/10"
                                        : "border-border-default bg-bg-primary/20 hover:border-accent/50"
                                }`}
                            >
                                <div
                                    className={`shrink-0 ${
                                        activeTab === tab.key ? "text-accent" : "text-txt-disabled"
                                    }`}
                                >
                                    {tab.icon}
                                </div>
                                <div className="flex-1">
                                    <div
                                        className={`text-[11px] font-mono font-bold uppercase tracking-[0.15em] mb-1 ${
                                            activeTab === tab.key ? "text-accent" : "text-txt-primary"
                                        }`}
                                    >
                                        {tab.label}
                                    </div>
                                    {/* <div className="text-[10px] font-mono text-txt-secondary">
                                        {tab.description}
                                    </div> */}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback Banner */}
            {generationFeedback && (
                <div
                    className={`px-4 py-3 border font-mono text-[11px] uppercase tracking-widest ${
                        generationFeedback.type === "success"
                            ? "bg-status-ok/10 border-status-ok/30 text-status-ok"
                            : generationFeedback.type === "error"
                            ? "bg-status-critical/10 border-status-critical/30 text-status-critical"
                            : "bg-status-warning/10 border-status-warning/30 text-status-warning"
                    }`}
                >
                    {generationFeedback.message}
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "generate" && <GenerateRationsPage />}
                {activeTab === "deliver" && <DeliverRationsPage />}
                {activeTab === "history" && <RationHistoryPage />}
            </div>
        </div>
    );
}
