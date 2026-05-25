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
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setGenerationFeedback({
                type: "warning",
                message: "⚠️ Endpoint POST /api/rations/generate-today no implementado.",
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
            icon: <Utensils size={16} />,
            description: "Población diaria",
        },
        {
            key: "deliver",
            label: "Entregar Raciones",
            icon: <ClipboardCheck size={16} />,
            description: "Entregas individuales",
        },
        {
            key: "history",
            label: "Historial",
            icon: <History size={16} />,
            description: "Registro histórico",
        },
    ];

    return (
        <article className="rmm-scope flex h-screen flex-col bg-bg-app overflow-hidden relative">
            {/* Corner Brackets */}
            <div className="rmm-bracket rmm-bracket-tl"></div>
            <div className="rmm-bracket rmm-bracket-tr"></div>
            <div className="rmm-bracket rmm-bracket-bl"></div>
            <div className="rmm-bracket rmm-bracket-br"></div>

            {/* Topbar — identity + horizontal nav */}
            <header className="flex items-stretch border-b border-border-default bg-bg-tertiary shrink-0 z-10">
                {/* Module identity */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-0.75 self-stretch bg-accent"></div>
                    <div className="py-2">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Raciones
                        </h3>
                        <p className="font-mono text-[9px] text-txt-muted uppercase tracking-[0.18em] mt-0.5">
                            Administración de Recursos <span className="text-accent"> | </span> RMM-02
                        </p>
                    </div>
                </div>

                {/* Horizontal tab nav + acción global */}
                <nav className="flex items-stretch flex-1 justify-end">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "bg-bg-app/60 text-accent"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                            <span className={`font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-accent opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className={activeTab === tab.key ? "text-accent" : "text-txt-disabled group-hover:text-txt-secondary"}>
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

                    {/* Acción global: Generar Raciones */}
                    <div className="flex items-center px-4 border-l border-border-subtle shrink-0">
                        <button
                            onClick={handleGenerateRations}
                            disabled={isGenerating}
                            className="rmm-btn rmm-btn-accent disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="h-3 w-3 animate-spin border-2 border-white border-t-transparent" />
                                    <span className="font-mono text-[10px]">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={12} fill="currentColor" />
                                    <span className="font-mono text-[10px]">Generar Raciones</span>
                                </>
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Feedback banner */}
            {generationFeedback && (
                <div className={`shrink-0 px-4 py-2 border-b font-mono text-[10px] uppercase tracking-widest flex items-center justify-between ${
                    generationFeedback.type === "error"
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-bg-tertiary border-border-default text-txt-muted"
                }`}>
                    <span>{generationFeedback.message}</span>
                    <button onClick={() => setGenerationFeedback(null)} className="opacity-50 hover:opacity-100 transition-opacity">✕</button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <section className="flex-1 overflow-y-auto">
                    {activeTab === "generate" && <GenerateRationsPage />}
                    {activeTab === "deliver" && <DeliverRationsPage />}
                    {activeTab === "history" && <RationHistoryPage />}
                </section>
            </main>
        </article>
    );
}

