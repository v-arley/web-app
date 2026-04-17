import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/routes";
import {
  useDashboardNav,
  type DashboardSection,
} from "../../hooks/useDashboardNav";
import { SidebarButton } from "../components/SidebarButton";
import { DashboardView } from "./DashboardView";

import { SettingsView } from "./SettingsView";
import { CampsView } from "./CampsView";
import { WarehouseView } from "./WarehouseView";
import { UsersView } from "./UsersView";
import { RequestsView } from "./RequestsView";
import {
  LayoutDashboard,
  Users,
  Send,
  Database,
  Tent,
  Filter,
} from "lucide-react";

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
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    activeKey,
    activeSection,
    sections,
    navigate: navTo,
  } = useDashboardNav(SECTIONS);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-24 bg-[#141417] flex justify-between items-center px-8 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4 text-[10px] text-white/40 font-mono tracking-widest uppercase">
            <span>ADMIN: VARGAS</span>
            <span className="text-[#444]">|</span>
            <span>COORDS: -70.000, 10.000</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <h1 className="text-4xl font-bold tracking-[0.2em] uppercase flex items-center gap-4">
              <span className="text-white/50">CAMP</span>
              <span className="text-white">ALPHA</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] text-[#666] font-mono uppercase tracking-[0.2em]">
            System Status
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00e676] animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
            <span className="text-[12px] font-mono text-[#00e676] tracking-widest font-semibold">
              ONLINE
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col sm:flex-row w-full overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside className="w-full sm:w-64 bg-[#18181b] flex flex-col justify-between py-6 shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="text-[#555] font-mono text-[11px] font-bold tracking-[0.3em] uppercase px-8">
              Menu
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
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#f0f2f5]">
          {activeSection?.component()}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#18181b] flex flex-col sm:flex-row justify-between items-center px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 text-[11px] text-[#777] font-mono tracking-[0.2em] uppercase">
          <div className="flex items-center gap-6">
            <span>
              TIME:{" "}
              <span className="text-[#aaa]">{formatTime(currentDate)}</span>
            </span>
            <span>
              DATE:{" "}
              <span className="text-[#aaa]">{formatDate(currentDate)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00e676] shadow-[0_0_8px_rgba(0,230,118,0.5)]"></div>
            <span className="text-[#00e676] font-semibold">ONLINE</span>
          </div>
        </div>
        <button
          className="mt-4 sm:mt-0 text-[11px] font-mono uppercase text-[#777] hover:text-white transition-colors tracking-[0.2em]"
          onClick={handleLogout}
        >
          [ LOG OUT ]
        </button>
      </footer>
    </div>
  );
}
