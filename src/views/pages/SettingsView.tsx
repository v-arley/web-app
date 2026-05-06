import { useState } from "react";
import { RolesView } from "./RolesView";
import { PermsView } from "./PermsView";
import { RulesView } from "./RulesView";
import { CampSettingsView } from "./CampSettingsView";

const TABS = [
    { key: "General",  label: "General"     },
    { key: "Roles",    label: "Roles"       },
    { key: "Perms",    label: "Permissions" },
    { key: "Rules",    label: "Rules"       },
];

export function SettingsView() {
    const [activeTab, setActiveTab] = useState("Roles");

    const renderContent = () => {
        switch (activeTab) {
            case "Roles":   return <RolesView />;
            case "Perms":   return <PermsView />;
            case "Rules":   return <RulesView />;
            case "General": default: return <CampSettingsView />;
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-bg-app overflow-hidden">

            {/* Top bar navigation */}
            <div className="w-full bg-bg-secondary border-b border-border-default px-6 py-3 flex items-center justify-between shrink-0">
                <div className="text-[12px] font-mono tracking-[0.2em] text-txt-secondary uppercase font-bold">
                    Settings
                </div>
                <div className="flex bg-bg-tertiary p-1 border border-border-default gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-6 text-[11px] font-bold uppercase font-mono tracking-widest transition-colors cursor-pointer
                                ${activeTab === tab.key
                                    ? "bg-bg-selected text-accent shadow-sm"
                                    : "text-txt-secondary hover:bg-bg-selected"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {renderContent()}
            </div>
        </div>
    );
}
