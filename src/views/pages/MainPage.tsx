import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import {
  useDashboardNav,
  type DashboardSection,
} from "../../hooks/useDashboardNav";
import { SidebarButton } from "../components/SidebarButton";
import { DashboardView } from "./DashboardView";

import { SettingsView } from "./SettingsView";
import { WarehouseView } from "./WarehouseView";
import { UsersView } from "./UsersView";
import { RequestsView } from "./RequestsView";
import { CampService } from "../../services/CampService";
import { InventoryView } from "./InventoryView";
import type { Camp } from "../../models/Camp";
import {
  Boxes,
  LayoutDashboard,
  Users,
  Send,
  Database,
  Tent,
  Filter,
  UserRound,
  Trophy,
  ClipboardCheck,
  ShoppingBag,
} from "lucide-react";
import {
  getAuthContextFromToken,
  getAvailableSections,
  getRoleLabel,
} from "../../utils/authAccess";
import { CampsView } from "./CampsView";
import { WorkerProfileView } from "./WorkerProfileView";
import { WorkerAchievementsView } from "./WorkerAchievementsView";
import { WorkerTasksView } from "./WorkerTasksView";
import { WorkerProductionView } from "./WorkerProductionView";
import { WorkerRationsView } from "./WorkerRationsView";

const SECTIONS: DashboardSection[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} strokeWidth={2} />,
    component: () => <DashboardView />,
  },
  {
    key: "users",
    label: "Users",
    icon: <Users size={18} strokeWidth={2} />,
    component: () => <UsersView />,
  },
  {
    key: "requests",
    label: "Requests",
    icon: <Send size={18} strokeWidth={2} />,
    component: () => <RequestsView />,
  },
  {
    key: "inventory",
    label: "Resources",
    icon: <Boxes size={18} strokeWidth={2} />,
    component: () => <InventoryView />,
  },
  {
    key: "warehouse",
    label: "Warehouse",
    icon: <Database size={18} strokeWidth={2} />,
    component: () => <WarehouseView />,
  },
  {
    key: "camp",
    label: "Camp",
    icon: <Tent size={18} strokeWidth={2} />,
    component: () => <CampsView />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Filter size={18} strokeWidth={2} />,
    component: () => <SettingsView />,
  },
  {
    key: "worker-profile",
    label: "Mi Perfil",
    icon: <UserRound size={18} strokeWidth={2} />,
    component: () => <WorkerProfileView />,
  },
  {
    key: "worker-achievements",
    label: "Logros y puntos",
    icon: <Trophy size={18} strokeWidth={2} />,
    component: () => <WorkerAchievementsView />,
  },
  {
    key: "worker-tasks",
    label: "Mis tareas",
    icon: <ClipboardCheck size={18} strokeWidth={2} />,
    component: () => <WorkerTasksView />,
  },
  {
    key: "worker-production",
    label: "Producción diaria",
    icon: <Database size={18} strokeWidth={2} />,
    component: () => <WorkerProductionView />,
  },
  {
    key: "worker-rations",
    label: "Raciones",
    icon: <ShoppingBag size={18} strokeWidth={2} />,
    component: () => <WorkerRationsView />,
  },
];

const campSvc = new CampService();

export function DashboardPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [authContext] = useState(getAuthContextFromToken);
  const roleLabel = useMemo(() => getRoleLabel(authContext), [authContext]);
  const availableSections = useMemo(
    () => getAvailableSections(SECTIONS, authContext),
    [authContext],
  );
  const {
    activeKey,
    activeSection,
    sections,
    navigate: navTo,
  } = useDashboardNav(availableSections);
  const [activeCamp, setActiveCamp] = useState<Camp | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch active camp for header coordinates
    campSvc
      .findAll()
      .then((res) => {
        if (res.getEstado()) {
          const camps = res.getResultado<Camp[]>("registros") ?? [];
          setActiveCamp(
            camps.find((c) => c.state === "A" || c.active) ?? camps[0] ?? null,
          );
        }
      })
      .catch(() => {
        /* ignore */
      });
  }, [authContext.campId]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: false });
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}:${month}:${year}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="h-screen flex flex-col bg-bg-app">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border-default flex justify-between items-end px-8 py-3 shrink-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-[11px] text-txt-disabled font-mono tracking-label uppercase">
            <span>ADMIN: {authContext.name}</span>
            <span className="text-border-default mx-0.5">|</span>
            <span>ROLE: {roleLabel}</span>
            {authContext.profession && (
              <>
                <span className="text-border-default mx-0.5">|</span>
                <span>PROFILE: {authContext.profession}</span>
              </>
            )}
            {activeCamp &&
              activeCamp.location_x != null &&
              activeCamp.location_y != null && (
                <>
                  <span className="text-border-default mx-0.5">|</span>
                  <span>
                    COORDS: {activeCamp.location_x.toFixed(3)},{" "}
                    {activeCamp.location_y.toFixed(3)}
                  </span>
                </>
              )}
          </div>
          <div className="font-mono tracking-[0.2em] uppercase leading-tight">
            <span className="text-[25px] text-txt-secondary font-normal">
              CAMP{" "}
            </span>
            <span className="text-[25px] text-txt-primary font-bold">
              {activeCamp?.code ?? "ALPHA"}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col sm:flex-row w-full overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside className="w-full sm:w-56 bg-bg-primary border-r border-border-default flex flex-col justify-between py-4 shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="text-txt-disabled font-mono text-[11px] font-bold tracking-label uppercase px-6 pt-2">
              Navigation
            </div>
            <nav className="flex flex-col">
              {sections.map((section) => (
                <SidebarButton
                  key={section.key}
                  label={section.label}
                  icon={section.icon}
                  active={activeKey === section.key}
                  onClick={() => navTo(section.key)}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Center Main Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-bg-app">
          {activeSection?.key === "warehouse" ? (
            <WarehouseView activeCamp={activeCamp} />
          ) : (
            activeSection?.component()
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-bg-secondary border-t border-border-default flex flex-col sm:flex-row justify-between items-center px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-[11px] text-txt-disabled font-mono tracking-label uppercase">
          <div className="flex items-center gap-5">
            <span>
              Time:{" "}
              <span className="text-txt-secondary">
                {formatTime(currentDate)}
              </span>
            </span>
            <span>
              Date:{" "}
              <span className="text-txt-secondary">
                {formatDate(currentDate)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-status-ok"></div>
            <span className="text-status-ok font-bold">Online</span>
          </div>
        </div>
        <button
          className="mt-3 sm:mt-0 text-[11px] font-mono uppercase text-txt-disabled hover:text-accent transition-colors tracking-label"
          onClick={handleLogout}
        >
          [ Log Out ]
        </button>
      </footer>
    </div>
  );
}
