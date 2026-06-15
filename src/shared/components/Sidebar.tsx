// import { Droplets } from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import { useAuth } from "../app/AuthContext";
import { useNavigation } from "../app/NavigationContext";
import { SidebarButton } from "./SidebarButton";

const SIDEBAR_KEYS = [
    "dashboard",
    "users",
    "task-management",
    "explorations",
    "resource-dashboard",
    "inventory-main",
    "stock-alerts",
    "production",
    "rations",
    "inter-camp",
    "global-dashboard",
    "create-camp",
    "catalogs-main",
    "settings",
    "worker-profile",
    "worker-achievements",
    "worker-tasks",
    "worker-production",
    "worker-rations",
    "worker-explorations",
];

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { sections, activeKey, navigate } = useNavigation();
    const { logout } = useAuth();
    const routerNavigate = useNavigate();

    const sectionMap = new Map(sections.map((s) => [s.key, s]));
    const sidebarSections = SIDEBAR_KEYS
        .map((key) => sectionMap.get(key))
        .filter((section): section is (typeof sections)[number] => Boolean(section));

    const handleLogout = async () => {
        await logout();
        onClose();
        routerNavigate(ROUTES.LOGIN);
    };

    return (
        <aside
            id="app-sidebar"
            className={`sidebar${isOpen ? " open" : ""}`}
            aria-label="Navegacion principal"
        >
            {/* <div className="sidebar-header">
                <div className="logo-container">
                    <Droplets className="logo-icon" />
                </div>
                <div className="brand-info">
                    <h3>Camp</h3>
                    <p>System</p>
                </div>
            </div> */}

            <nav className="sidebar-content" aria-label="Accesos principales">
                {sidebarSections.map((section) => (
                    <SidebarButton
                        key={section.key}
                        label={section.label}
                        icon={section.icon}
                        active={activeKey === section.key}
                        onClick={() => {
                            navigate(section.key);
                            onClose();
                        }}
                    />
                ))}
            </nav>
            <div className="sidebar-footer">
                <button
                    type="button"
                    className="sidebar-logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut className="sidebar-logout-icon" aria-hidden="true" />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
}
