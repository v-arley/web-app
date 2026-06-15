import { useState } from "react";
import { PackagePlus, Settings2, Eye } from "lucide-react";
import { StockViewPage } from "./StockViewPage";
import { MovementsPage } from "./MovementsPage";
import { MinStockConfigPage } from "./MinStockConfigPage";

type InventoryTab = "stock" | "movements" | "config";

export function InventoryMainPage() {
    const [activeTab, setActiveTab] = useState<InventoryTab>("stock");

    const tabs: Array<{ key: InventoryTab; label: string; icon: React.ReactNode; description: string }> = [
        { key: "stock",     label: "Global Inventory", icon: <Eye size={16} />,       description: "Stock overview"        },
        { key: "movements", label: "Movements",        icon: <PackagePlus size={16} />, description: "In and out movements" },
        { key: "config",    label: "Minimum Stock",    icon: <Settings2 size={16} />,   description: "Alert thresholds"     },
    ];

    return (
        <article className="app-scope app-module">
            <header className="app-module-header">
                <div className="app-module-brand">
                    <div className="app-module-copy">
                        <div className="app-module-title">Inventory</div>
                        <p className="app-module-subtitle">Manager Resources</p>
                    </div>
                </div>

                <nav className="app-module-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`app-module-tab ${activeTab === tab.key ? "app-module-tab--active" : ""}`}
                        >
                            {activeTab === tab.key && <div className="app-module-tab-indicator" />}
                            <span className="app-module-tab-icon">{tab.icon}</span>
                            <div className="app-module-tab-copy">
                                <div className="app-module-tab-label">{tab.label}</div>
                            </div>
                        </button>
                    ))}
                </nav>
            </header>

            <main className="app-module-body app-content-pad" style={{ gap: "0.75rem" }}>
                <div
                    key={activeTab}
                    className="app-animate-in"
                    style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
                >
                    {activeTab === "stock"     && <StockViewPage />}
                    {activeTab === "movements" && <MovementsPage />}
                    {activeTab === "config"    && <MinStockConfigPage />}
                </div>
            </main>
        </article>
    );
}
