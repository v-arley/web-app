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

    const tabs: Array<{
        key: ProductionTab;
        label: string;
        icon: React.ReactNode;
        description: string;
    }> = [
        {
            key: "rules",
            label: "Production Rules",
            icon: <Settings2 size={16} />,
            description: "Rules & Daily Execution",
        },
        {
            key: "records",
            label: "Records & Adjustments",
            icon: <FileText size={16} />,
            description: "Output control",
        },
    ];

    return (
        <article className="rmm-scope flex h-full min-h-0 flex-col bg-black/50 backdrop-blur-lg overflow-hidden relative border border-border-default">

            {/* Topbar — identity + horizontal nav */}
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                {/* Module identity */}
                <div className="rmm-module-brand flex items-center gap-3 shrink-0">
                    {/* <div className="rmm-module-accent w-0.75 self-stretch bg-accent"></div> */}
                    <div className="rmm-module-copy py-2 px-3">
                        <div className="rmm-module-title text-xl font-abril font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Production
                        </div>
                        <p className="rmm-module-subtitle font-mono text-[9px] text-txt-muted uppercase tracking-[0.18em] mt-0.5">
                            Resource Management
                        </p>
                    </div>
                </div>

                {/* Horizontal tab nav */}
                <nav className="rmm-module-tabs flex items-stretch flex-1 justify-end">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`rmm-module-tab relative flex items-center gap-2.5 px-5 border-r border-border-subtle transition-all group ${
                                activeTab === tab.key
                                    ? "rmm-module-tab--active bg-bg-app/60 text-accent"
                                    : "text-txt-muted hover:bg-bg-secondary/40 hover:text-txt-primary"
                            }`}
                        >
                            {activeTab === tab.key && (
                                <div className="rmm-module-tab-indicator absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                            {/* <span className={`rmm-module-tab-index font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-accent opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span> */}
                            <span className={`rmm-module-tab-icon ${activeTab === tab.key ? "text-accent" : "text-txt-disabled group-hover:text-txt-secondary"}`}>
                                {tab.icon}
                            </span>
                            <div className="rmm-module-tab-copy text-left">
                                <div className="rmm-module-tab-label font-mono text-[10px] font-bold uppercase tracking-widest">
                                    {tab.label}
                                </div>
                                {/* <div className="rmm-module-tab-description font-mono text-[8px] text-txt-disabled uppercase tracking-wide">
                                    {tab.description}
                                </div> */}
                            </div>
                        </button>
                    ))}
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <section className="flex-1 flex flex-col overflow-hidden">
                    {activeTab === "rules" && <ProductionRulesPage />}
                    {activeTab === "records" && <ProductionRecordsPage />}
                </section>
            </main>
        </article>
    );
}

