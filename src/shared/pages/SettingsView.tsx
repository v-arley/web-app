import { useState } from "react";
import { RolesView } from "./RolesView";
import { PermsView } from "./PermsView";
import { RulesView } from "./RulesView";
import { CampSettingsView } from "./CampSettingsView";

const TABS = [
  { key: "General", label: "General" },
  { key: "Roles", label: "Roles" },
  { key: "Perms", label: "Permissions" },
  { key: "Rules", label: "Rules" },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("Roles");

  const renderContent = () => {
    switch (activeTab) {
      case "Roles":
        return <RolesView />;
      case "Perms":
        return <PermsView />;
      case "Rules":
        return <RulesView />;
      case "General":
      default:
        return <CampSettingsView />;
    }
  };

  return (
    <div className="settings-system-scope">
      {/* Menú superior */}
      <div className="settings-system-header">
        <div className="settings-system-title">Settings</div>

        <div className="settings-system-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`settings-system-tab ${
                activeTab === tab.key ? "settings-system-tab--active" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="settings-system-content">{renderContent()}</div>
    </div>
  );
}