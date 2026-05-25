import { useState } from "react";
import { Settings2, Play, FileText, AlertCircle } from "lucide-react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { ProductionRulesPage } from "./ProductionRulesPage";
import { DailyProductionPage } from "./DailyProductionPage";
import { ProductionRecordsPage } from "./ProductionRecordsPage";

type ProductionTab = "rules" | "execute" | "records";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isExecuting: boolean;
}

function ExecuteJobConfirmModal({ isOpen, onClose, onConfirm, isExecuting }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative bg-bg-tertiary border border-border-strong max-w-md w-full">
                {/* Modal Brackets */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent" />

                <header className="p-4 border-b border-border-subtle bg-bg-secondary/50">
                    <div className="rmm-section-header mb-0 border-none pb-0">
                        <span className="rmm-section-title">Confirmación</span>
                        <span className="rmm-section-id">PRD_EXEC_REQ</span>
                    </div>
                </header>

                <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                        <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
                        <div>
                            <p className="font-mono text-[11px] text-txt-primary leading-relaxed mb-3">
                                ¿Estás seguro de que deseas ejecutar el job de producción diaria?
                            </p>
                            <div className="space-y-2 bg-bg-secondary/30 p-3 border border-border-subtle">
                                <div className="flex items-center gap-2 font-mono text-[10px] text-txt-muted uppercase">
                                    <div className="w-1 h-1 bg-accent"></div>
                                    <span>Generación de registros automáticos</span>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-[10px] text-txt-muted uppercase">
                                    <div className="w-1 h-1 bg-accent"></div>
                                    <span>Aplicación de reglas por profesión</span>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-[10px] text-txt-muted uppercase">
                                    <div className="w-1 h-1 bg-accent"></div>
                                    <span>Actualización de inventario central</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isExecuting}
                            className="flex-1 rmm-btn border border-border-strong hover:bg-bg-secondary transition-all disabled:opacity-50"
                        >
                            <span className="font-mono">Cancelar</span>
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isExecuting}
                            className="flex-1 rmm-btn rmm-btn-accent transition-all disabled:opacity-50"
                        >
                            {isExecuting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-3 w-3 animate-spin border-2 border-white border-t-transparent" />
                                    <span className="font-mono">Ejecutando...</span>
                                </span>
                            ) : (
                                <span className="font-mono">Confirmar Ejecución</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProductionMainPage() {
    const [activeTab, setActiveTab] = useState<ProductionTab>("rules");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionFeedback, setExecutionFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;

    const handleExecuteJob = async () => {
        setIsExecuting(true);
        setExecutionFeedback(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setExecutionFeedback({
                type: "error",
                message: "⚠️ Endpoint POST /api/production/execute-daily no implementado.",
            });
            setShowConfirmModal(false);
        } catch (error: any) {
            setExecutionFeedback({
                type: "error",
                message: error.message || "Error al ejecutar el job de producción",
            });
        } finally {
            setIsExecuting(false);
        }
    };

    const tabs: Array<{
        key: ProductionTab;
        label: string;
        icon: React.ReactNode;
        description: string;
    }> = [
        {
            key: "rules",
            label: "Reglas de Producción",
            icon: <Settings2 size={16} />,
            description: "Configuración base",
        },
        {
            key: "execute",
            label: "Ejecutar Job Diario",
            icon: <Play size={16} />,
            description: "Procesamiento diario",
        },
        {
            key: "records",
            label: "Registros y Ajustes",
            icon: <FileText size={16} />,
            description: "Control de salida",
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
                            Producción
                        </h3>
                        <p className="font-mono text-[9px] text-txt-muted uppercase tracking-[0.18em] mt-0.5">
                            Administración de Recursos <span className="text-accent"> | </span> RMM-03
                        </p>
                    </div>
                </div>

                {/* Horizontal tab nav */}
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
                </nav>
            </header>

            {/* Execution feedback banner */}
            {executionFeedback && (
                <div className="shrink-0 px-4 py-2 border-b border-accent/30 bg-accent/10 font-mono text-[10px] text-accent uppercase tracking-widest flex items-center justify-between">
                    <span>{executionFeedback.message}</span>
                    <button onClick={() => setExecutionFeedback(null)} className="opacity-50 hover:opacity-100 transition-opacity">✕</button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <section className="flex-1 overflow-y-auto">
                    {activeTab === "rules" && <ProductionRulesPage />}
                    {activeTab === "execute" && (
                        <div className="flex h-full items-center justify-center p-4">
                            <div className="max-w-md w-full relative">
                                <div className="relative bg-bg-tertiary border border-border-strong p-4 group">
                                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-accent/30 group-hover:border-accent transition-colors" />
                                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-accent/30 group-hover:border-accent transition-colors" />
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mx-auto mb-3">
                                            <Play size={22} className="text-accent ml-1" />
                                        </div>
                                        <h2 className="rmm-section-header justify-center border-none mb-3">
                                            <span className="rmm-section-title text-lg tracking-[0.3em]">Módulo de Ejecución</span>
                                        </h2>
                                        <p className="font-mono text-[11px] text-txt-secondary leading-relaxed uppercase tracking-wider">
                                            Generación masiva de registros de producción diaria basada en profesiones activas.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowConfirmModal(true)}
                                        className="w-full rmm-btn rmm-btn-accent justify-center py-2 text-sm tracking-[0.2em]"
                                    >
                                        <span className="font-mono">INICIAR PROCESO DIARIO</span>
                                    </button>
                                    <div className="mt-3 p-3 bg-bg-secondary/50 border-l-2 border-accent/50 font-mono text-[10px] text-txt-muted uppercase tracking-widest leading-loose">
                                        <span className="text-accent font-bold">WARNING:</span> Esta acción es irreversible para el periodo actual. Asegúrese de haber configurado las reglas correctamente.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "records" && <ProductionRecordsPage />}
                </section>
            </main>

            {/* Confirmation Modal */}
            <ExecuteJobConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleExecuteJob}
                isExecuting={isExecuting}
            />
        </article>
    );
}

