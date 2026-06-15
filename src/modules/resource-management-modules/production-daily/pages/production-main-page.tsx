import { useState } from "react";
import { Settings2, FileText } from "lucide-react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { ProductionRulesPage } from "./ProductionRulesPage";
import { ProductionRecordsPage } from "./ProductionRecordsPage";

type ProductionTab = "rules" | "records";

export function ProductionMainPage() {
    const [activeTab, setActiveTab] = useState<ProductionTab>("rules");

    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;
    void campId;

    const tabs: Array<{ key: ProductionTab; label: string; icon: React.ReactNode; description: string }> = [
        { key: "rules",   label: "Production Rules",    icon: <Settings2 size={16} />, description: "Rules & Daily Execution" },
        { key: "records", label: "Records & Adjustments", icon: <FileText size={16} />, description: "Output control"          },
    ];

    return (
        <article className="app-scope app-module">
            <header className="app-module-header">
                <div className="app-module-brand">
                    <div className="app-module-copy">
                        <div className="app-module-title">Production</div>
                        <p className="app-module-subtitle">Resource Management</p>
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

            <main className="app-module-body app-content-pad">
                <div
                    key={activeTab}
                    className="app-animate-in"
                    style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
                >
                    {activeTab === "rules"   && <ProductionRulesPage />}
                    {activeTab === "records" && <ProductionRecordsPage />}
                </div>
            </main>
        </article>
    );
}
