import { Droplets } from "lucide-react";
import { useNavigation } from "../app/NavigationContext";
import { SidebarButton } from "./SidebarButton";

const SECTION_GROUPS: Array<{ label: string; keys: string[] }> = [
    { label: "MAIN",   keys: [] },
    //{ label: "OPERACIONES", keys: ["dashboard", "users", "requests", "camp", "explorations"] },
    { label: "OPERACIONES", keys: ["dashboard", "users"] },
    // { label: "RECURSOS",    keys: ["inventory", "warehouse"] },
    { label: "EXPLORATION",    keys: ["explorations"] },
    { label: "R. AVANZADO", keys: ["resource-dashboard", "inventory-main", "stock-alerts", "production", "rations", "inter-camp"] },
    // { label: "CATALOGOS",   keys: ["catalog-resources", "catalog-professions", "catalog-achievements"] },
    { label: "ADMIN",       keys: ["global-dashboard", "create-camp", "settings", "catalog-resources", "catalog-professions", "catalog-achievements"] },
    { label: "MI CUENTA",   keys: ["worker-profile", "worker-achievements", "worker-tasks", "worker-production", "worker-rations", "worker-explorations"] },
];

export default function Sidebar() {
    const { sections, activeKey, navigate } = useNavigation();

    const sectionMap = new Map(sections.map((s) => [s.key, s]));

    return (
        <aside className="sidebar">
            {/* <div className="sidebar-header">
                <div className="logo-container">
                    <Droplets className="logo-icon" />
                </div>
                <div className="brand-info">
                    <h3>Camp</h3>
                    <p>System</p>
                </div>
            </div> */}

            <div className="sidebar-content">
                {SECTION_GROUPS.map((group) => {
                    const groupSections = group.keys
                        .map((key) => sectionMap.get(key))
                        .filter(Boolean) as typeof sections;

                    if (groupSections.length === 0) return null;

                    return (
                        <nav key={group.label} className="nav-group">
                            <p className="eyebrow">{group.label}</p>
                            {groupSections.map((section) => (
                                <SidebarButton
                                    key={section.key}
                                    label={section.label}
                                    icon={section.icon}
                                    active={activeKey === section.key}
                                    onClick={() => navigate(section.key)}
                                />
                            ))}
                        </nav>
                    );
                })}
            </div>
        </aside>
    );
}
