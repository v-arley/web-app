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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-bg-secondary border-2 border-accent shadow-2xl max-w-md w-full mx-4">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

                <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertCircle size={24} className="text-status-warning shrink-0 mt-1" />
                        <div>
                            <h3 className="text-[13px] font-mono font-bold text-txt-primary uppercase tracking-[0.15em] mb-2">
                                Confirmar Ejecución
                            </h3>
                            <p className="text-[11px] font-mono text-txt-secondary leading-relaxed">
                                ¿Estás seguro de que deseas ejecutar el job de producción diaria? Esta acción:
                            </p>
                            <ul className="mt-3 space-y-2 text-[10px] font-mono text-txt-secondary list-disc list-inside">
                                <li>Generará registros de producción para todas las personas con profesiones activas</li>
                                <li>Aplicará las reglas de producción configuradas</li>
                                <li>Actualizará el inventario del almacén</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={isExecuting}
                            className="flex-1 px-4 py-3 bg-bg-tertiary border border-border-default hover:border-txt-disabled text-txt-primary text-[10px] font-mono uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isExecuting}
                            className="flex-1 px-4 py-3 bg-accent border border-accent hover:bg-accent/90 text-bg-primary text-[10px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {isExecuting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-3 w-3 animate-spin border-2 border-bg-primary border-t-transparent rounded-full" />
                                    Ejecutando...
                                </span>
                            ) : (
                                "Ejecutar Job"
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
            // TODO: Implementar llamada al endpoint POST /api/production/execute-daily
            // const response = await productionService.executeDailyJob(campId);

            // Simulación temporal
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setExecutionFeedback({
                type: "error",
                message:
                    "⚠️ Endpoint POST /api/production/execute-daily no implementado. Implementa este endpoint en el backend.",
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
            icon: <Settings2 size={20} />,
            description: "Configura las reglas de producción por profesión",
        },
        {
            key: "execute",
            label: "Ejecutar Job Diario",
            icon: <Play size={20} />,
            description: "Genera registros de producción del día",
        },
        {
            key: "records",
            label: "Registros y Ajustes",
            icon: <FileText size={20} />,
            description: "Consulta y ajusta registros de producción",
        },
    ];

    return (
        <div className="flex h-full flex-col bg-bg-app overflow-hidden">
            {/* Header with tabs */}
            <div className="shrink-0 border-b border-border-default bg-bg-secondary">
                <div className="px-5 py-3">
                    <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] mb-3">
                        Administración de Recursos / Producción
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
            {executionFeedback && (
                <div
                    className={`px-4 py-3 border font-mono text-[11px] uppercase tracking-widest ${
                        executionFeedback.type === "success"
                            ? "bg-status-ok/10 border-status-ok/30 text-status-ok"
                            : "bg-status-warning/10 border-status-warning/30 text-status-warning"
                    }`}
                >
                    {executionFeedback.message}
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "rules" && <ProductionRulesPage />}
                {activeTab === "execute" && (
                    <div className="flex h-full items-center justify-center p-6">
                        <div className="max-w-xl w-full">
                            <div className="relative bg-bg-secondary border border-border-default p-8 shadow-2xl">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50" />

                                <div className="text-center mb-6">
                                    <Play size={48} className="mx-auto mb-4 text-accent" />
                                    <h2 className="text-[13px] font-mono font-bold text-txt-primary uppercase tracking-[0.2em] mb-2">
                                        Ejecutar Job de Producción Diaria
                                    </h2>
                                    <p className="text-[11px] font-mono text-txt-secondary leading-relaxed">
                                        Genera automáticamente los registros de producción para todas las personas con
                                        profesiones activas según las reglas configuradas.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    className="w-full px-6 py-4 bg-accent border-2 border-accent hover:bg-accent/90 text-bg-primary text-[11px] font-mono font-bold uppercase tracking-widest transition-all"
                                >
                                    Ejecutar Job Diario
                                </button>

                                <div className="mt-6 px-4 py-3 bg-status-info/10 border border-status-info/30 text-[10px] font-mono text-txt-secondary leading-relaxed">
                                    <span className="font-bold text-status-info">NOTA:</span> Esta acción ejecutará la
                                    lógica de producción solo una vez por día. Si ya se ejecutó hoy, no se generarán
                                    registros duplicados.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "records" && <ProductionRecordsPage />}
            </div>

            {/* Confirmation Modal */}
            <ExecuteJobConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleExecuteJob}
                isExecuting={isExecuting}
            />
        </div>
    );
}
