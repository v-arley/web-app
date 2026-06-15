import { Boxes, BriefcaseBusiness, Trophy } from "lucide-react";
import { useState } from "react";
import SystemModuleShell, { type SystemTab } from "../../shared/components/SystemModuleShell";
import { AchievementsPage } from "./achievements-page";
import { ProfessionsPage } from "./professions-page";
import { ResourcesPage } from "./resources-page";

type CatalogTab = "resources" | "professions" | "achievements";

const TABS: Array<SystemTab<CatalogTab>> = [
    { key: "resources",    label: "Resources",    description: "Global supply catalog", icon: <Boxes size={16} /> },
    { key: "professions",  label: "Professions",  description: "Production roles",      icon: <BriefcaseBusiness size={16} /> },
    { key: "achievements", label: "Achievements", description: "Points and badges",     icon: <Trophy size={16} /> },
];

export function CatalogsMainPage() {
    const [activeTab, setActiveTab] = useState<CatalogTab>("resources");

    return (
        <SystemModuleShell
            title="Catalogs"
            subtitle="System Management"
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {activeTab === "resources" ? <ResourcesPage /> : null}
            {activeTab === "professions" ? <ProfessionsPage /> : null}
            {activeTab === "achievements" ? <AchievementsPage /> : null}
        </SystemModuleShell>
    );
}
