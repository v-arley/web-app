import { useState, useMemo } from "react";
import { Utensils, ClipboardCheck, History, Play, X } from "lucide-react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { DeliverRationsPage } from "./DeliverRationsPage";
import { RationHistoryPage } from "./RationHistoryPage";
import { RationGenerationPanel } from "../components/RationGenerationPanel";
import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../services/ResourceService";

const resourceService = new ResourceService();

type RationTab = "deliver" | "history";

export function RationsMainPage() {
    const [activeTab, setActiveTab] = useState<RationTab>("deliver");
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [rationDate, setRationDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

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

    const tabs: Array<{
        key: RationTab;
        label: string;
        icon: React.ReactNode;
        description: string;
    }> = [
        {
            key: "deliver",
            label: "Deliver Rations",
            icon: <ClipboardCheck size={16} />,
            description: "Individual deliveries",
        },
        {
            key: "history",
            label: "History",
            icon: <History size={16} />,
            description: "Historical record",
        },
    ];

    return (
        <article className="rmm-scope flex h-full min-h-0 flex-col bg-black/50 backdrop-blur-lg overflow-hidden relative border border-border-default">
            <header className="rmm-module-header flex items-stretch bg-black/50 backdrop-blur-lg shrink-0 z-10">
                <div className="rmm-module-brand flex items-center gap-3 shrink-0">
                    <div className="rmm-module-accent w-0.75 self-stretch bg-accent"></div>
                    <div className="rmm-module-copy py-2 px-3">
                        <div className="rmm-module-title text-xl font-abril font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Rations
                        </div>
                        <p className="rmm-module-subtitle font-mono text-[9px] text-txt-muted uppercase tracking-[0.18em] mt-0.5">
                            Resource Management
                        </p>
                    </div>
                </div>

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

                    <div className="rmm-module-actions flex items-center px-4 border-l border-border-subtle shrink-0">
                        <button
                            onClick={() => setShowGenerateModal(true)}
                            className="rmm-module-action-btn rmm-btn rmm-btn-accent"
                        >
                            <Play size={12} fill="currentColor" />
                            <span className="font-mono text-[10px]">Generate Rations</span>
                        </button>
                    </div>
                </nav>
            </header>

            <main className="flex-1 overflow-hidden flex flex-col">
                <section className="flex-1 flex flex-col overflow-hidden">
                    {activeTab === "deliver" && <DeliverRationsPage />}
                    {activeTab === "history" && <RationHistoryPage />}
                </section>
            </main>

            {showGenerateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="relative bg-bg-tertiary border border-border-strong max-w-lg w-full max-h-[90vh] flex flex-col">
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent" />

                        <header className="px-5 py-4 border-b border-border-subtle bg-bg-secondary/50 shrink-0 flex items-center justify-between">
                            <div>
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide flex items-center gap-2">
                                    <Utensils size={14} className="text-accent" />
                                    GENERATE DAILY RATIONS
                                </div>
                                <p className="font-mono text-[9px] text-txt-muted uppercase tracking-wide mt-0.5">
                                    Automated distribution for active camp members
                                </p>
                            </div>
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className="p-1.5 hover:bg-bg-secondary border border-transparent hover:border-border-default transition-all text-txt-muted hover:text-txt-primary"
                            >
                                <X size={14} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-5">
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
