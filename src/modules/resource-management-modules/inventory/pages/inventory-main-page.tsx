import { useState } from "react";
import { PackagePlus, Settings2, Eye, History } from "lucide-react";
import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { StockViewPage } from "./StockViewPage";
import { MovementsPage } from "./MovementsPage";
import { MinStockConfigPage } from "./MinStockConfigPage";

type InventoryTab = "stock" | "movements" | "config";

export function InventoryMainPage() {
    const [activeTab, setActiveTab] = useState<InventoryTab>("stock");
    const authContext = getAuthContextFromToken();

    const tabs: Array<{ key: InventoryTab; label: string; icon: React.ReactNode; description: string }> = [
        {
            key: "stock",
            label: "Ver Inventario",
            icon: <Eye size={20} />,
            description: "Consulta el stock actual de todos los recursos",
        },
        {
            key: "movements",
            label: "Movimientos",
            icon: <PackagePlus size={20} />,
            description: "Registra entradas, salidas y ajustes",
        },
        {
            key: "config",
            label: "Configurar Mínimos",
            icon: <Settings2 size={20} />,
            description: "Establece cantidades mínimas de alerta",
        },
    ];

    return (
        <div className="flex h-full flex-col bg-bg-app overflow-hidden">
            {/* Header with tabs */}
            <div className="shrink-0 border-b border-border-default bg-bg-secondary">
                <div className="px-5 py-3">
                    <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] mb-3">
                        Administración de Recursos / Inventario
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

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "stock" && <StockViewPage />}
                {activeTab === "movements" && <MovementsPage />}
                {activeTab === "config" && <MinStockConfigPage />}
            </div>
        </div>
    );
}
