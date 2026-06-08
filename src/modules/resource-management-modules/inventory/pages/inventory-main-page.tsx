import { useState } from "react";
import { PackagePlus, Settings2, Eye } from "lucide-react";
import { StockViewPage } from "./StockViewPage";
import { MovementsPage } from "./MovementsPage";
import { MinStockConfigPage } from "./MinStockConfigPage";

type InventoryTab = "stock" | "movements" | "config";

export function InventoryMainPage() {
    const [activeTab, setActiveTab] = useState<InventoryTab>("stock");

    const tabs: Array<{ key: InventoryTab; label: string; icon: React.ReactNode; description: string }> = [
        {
            key: "stock",
            label: "Global Inventory",
            icon: <Eye size={16} />,
            description: "Stock overview",
        },
        {
            key: "movements",
            label: "Movements",
            icon: <PackagePlus size={16} />,
            description: "In and out movements",
        },
        {
            key: "config",
            label: "Minimum Stock",
            icon: <Settings2 size={16} />,
            description: "Alert thresholds",
        },
    ];

    return (
        <article className="sa-panel sa-surface p-0">
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                <div className="rmm-module-brand flex items-center gap-3 shrink-0 self-stretch">
                    <div className="rmm-module-accent sa-accent-left h-full" />
                    <div className="rmm-module-copy py-2 px-3">
                        <div className="rmm-module-title text-xl font-abril font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Inventory
                        </div>
                        <p className="rmm-module-subtitle sa-eyebrow mt-0.5">
                            Manager Resources
                        </p>
                    </div>
                </div>

                <nav className="rmm-module-tabs flex items-stretch flex-1 justify-end h-full">
                    {tabs.map((tab, ) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`rmm-module-tab relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "rmm-module-tab--active bg-bg-app/60"
                                    : "hover:bg-bg-secondary/40"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className="rmm-module-tab-indicator absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
                            )}
                            {/* <span className={`rmm-module-tab-index font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-accent opacity-60" : "text-txt-disabled"}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span> */}
                            <span className={`rmm-module-tab-icon ${activeTab === tab.key ? "text-accent" : "text-txt-disabled group-hover:text-txt-secondary"}`}>
                                {tab.icon}
                            </span>
                            <div className="rmm-module-tab-copy text-left">
                                <div className={`rmm-module-tab-label font-mono text-[10px] font-bold uppercase tracking-widest ${activeTab === tab.key ? "text-txt-primary" : "text-txt-secondary"}`}>
                                    {tab.label}
                                </div>
                                {/* <div className="rmm-module-tab-description sa-muted text-[8px] uppercase tracking-wide">
                                    {tab.description}
                                </div> */}
                            </div>
                        </button>
                    ))}
                </nav>
            </header>

            {/* <main className="sa-panel-body p-0 border-t border-border-default"> */}
            <main className="rmm-content-pad space-y-3">
                {activeTab === "stock" && <StockViewPage />}
                {activeTab === "movements" && <MovementsPage />}
                {activeTab === "config" && <MinStockConfigPage />}
            </main>
        </article>
    );
}
