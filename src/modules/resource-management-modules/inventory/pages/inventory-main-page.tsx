import { useState } from "react";
import { PackagePlus, Settings2, Eye, } from "lucide-react";
//import { getAuthContextFromToken } from "../../../../utils/authAccess";
import { StockViewPage } from "./StockViewPage";
import { MovementsPage } from "./MovementsPage";
import { MinStockConfigPage } from "./MinStockConfigPage";

type InventoryTab = "stock" | "movements" | "config";

export function InventoryMainPage() {
    const [activeTab, setActiveTab] = useState<InventoryTab>("stock");

    const tabs: Array<{ key: InventoryTab; label: string; icon: React.ReactNode; description: string }> = [
        {
            key: "stock",
            label: "Inventario Global",
            icon: <Eye size={16} />,
            description: "Consulta de existencias",
        },
        {
            key: "movements",
            label: "Movimientos",
            icon: <PackagePlus size={16} />,
            description: "Entradas y salidas",
        },
        {
            key: "config",
            label: "Stock Mínimo",
            icon: <Settings2 size={16} />,
            description: "Umbrales de alerta",
        },
    ];

    return (
        <article className="rmm-scope flex h-screen flex-col bg-bg-app overflow-hidden relative">
            {/* Corner Brackets */}
            <div className="rmm-bracket rmm-bracket-tl"></div>
            <div className="rmm-bracket rmm-bracket-tr"></div>
            <div className="rmm-bracket rmm-bracket-bl"></div>
            <div className="rmm-bracket rmm-bracket-br"></div>

            {/* Topbar — identity + horizontal nav + status */}
            <header className="flex items-stretch border-b border-border-default bg-bg-tertiary shrink-0 z-10">

                {/* Module identity */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-0.75 self-stretch bg-accent"></div>
                    <div className="py-2">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-txt-primary leading-none">
                            Inventory
                        </h3>
                        <p className="font-mono text-[9px] text-txt-muted uppercase tracking-[0.18em] mt-0.5">
                            Manager Resources <span className="text-accent"> | </span> RMM-01
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
                            {/* Active bottom indicator */}
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                            {/* Tab number badge */}
                            <span className={`font-mono text-[9px] opacity-40 ${activeTab === tab.key ? "text-accent opacity-60" : ""}`}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            {/* Icon */}
                            <span className={activeTab === tab.key ? "text-accent" : "text-txt-disabled group-hover:text-txt-secondary"}>
                                {tab.icon}
                            </span>
                            {/* Label + desc */}
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

                {/* Status indicators */}
                {/* <div className="hidden md:flex items-center gap-3 px-4 border-l border-border-default shrink-0">
                    <div className="flex flex-col gap-1 font-mono text-[9px] text-txt-muted uppercase tracking-widest text-right">
                        <div>Status: <span className="text-accent active-pulse">Updated</span></div>
                        <div>Log: <span className="text-accent">STK-ONLINE</span></div>
                    </div>
                </div> */}
            </header>

            {/* Main Content — full width */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <section className="flex-1 overflow-y-auto">
                    {activeTab === "stock" && <StockViewPage />}
                    {activeTab === "movements" && <MovementsPage />}
                    {activeTab === "config" && <MinStockConfigPage />}
                </section>
            </main>
        </article>
    );
}

