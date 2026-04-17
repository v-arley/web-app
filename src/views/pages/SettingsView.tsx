import { useState } from "react";
import { RolesView } from "./RolesView";
import { PermsView } from "./PermsView";
import { RulesView } from "./RulesView";
import { CampSettingsView } from "./CampSettingsView";

export function SettingsView() {
    const [activeTab, setActiveTab] = useState('Roles');

    const renderContent = () => {
        switch(activeTab) {
            case 'Roles': return <RolesView />;
            case 'Perms': return <PermsView />;
            case 'Rules': return <RulesView />;
            case 'General': default: return <CampSettingsView />;
        }
    };
    return (
        <div className="w-full h-full flex flex-col bg-[#f0f2f5] overflow-y-auto shadow-inner">
            {/* Top Bar Navigation */}
            <div className="w-full bg-[#e5e7eb] px-8 py-3 flex items-center justify-between">
                <div className="text-[12px] font-mono tracking-[0.2em] text-[#888] uppercase font-bold">
                    Settings
                </div>
                <div className="flex bg-black p-1 shadow-inner gap-1">
                    {['General', 'Roles', 'Perms', 'Rules'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 text-[11px] font-bold uppercase font-mono tracking-widest transition-all cursor-pointer py-1.5 ${
                                activeTab === tab 
                                    ? "text-white bg-[#f05a28] shadow-sm transform -translate-y-[1px]" 
                                    : "text-[#666] hover:bg-white/50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex flex-col w-full flex-1">  
                {renderContent()}
            </div>
        </div>
    );
}
