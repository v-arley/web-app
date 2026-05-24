import { useState } from "react";
import { CatalogsToolbar, type CatalogTab } from "../components/CatalogsToolbar";
import { AchievementsPage } from "./achievements-page";
import { ProfessionsPage } from "./professions-page";
import { ResourcesPage } from "./resources-page";

const TAB_CONTENT: Record<CatalogTab, { title: string; description: string; render: () => JSX.Element }> = {
    resources: {
        title: "Catalogos de recursos",
        description: "Administra tipos de recursos, categorias y estados operativos.",
        render: () => <ResourcesPage />,
    },
    professions: {
        title: "Catalogos de profesiones",
        description: "Mantiene profesiones y su configuracion de produccion por defecto.",
        render: () => <ProfessionsPage />,
    },
    achievements: {
        title: "Catalogos de logros",
        description: "Define reglas de logro y puntajes asociados.",
        render: () => <AchievementsPage />,
    },
};

export function GlobalCatalogsModulePage() {
    const [activeTab, setActiveTab] = useState<CatalogTab>("resources");
    const currentTab = TAB_CONTENT[activeTab];

    return (
        <section className="flex h-full min-h-0 flex-col bg-bg-app p-4 md:p-6">
            <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em] mb-4">
                Management / Catalogs Slice
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />

                <div className="flex flex-col border-b border-border-default bg-bg-primary/30 px-5 py-4">
                    <h2 className="text-lg font-bold text-txt-primary uppercase tracking-tight">{currentTab.title}</h2>
                    <p className="text-[11px] font-mono text-txt-secondary uppercase tracking-widest">{currentTab.description}</p>
                </div>

                <CatalogsToolbar value={activeTab} onChange={setActiveTab} />

                <div className="min-h-0 flex-1">{currentTab.render()}</div>
            </div>
        </section>
    );
}