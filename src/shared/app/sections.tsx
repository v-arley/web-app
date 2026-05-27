import { lazy } from "react";
import type { DashboardSection } from "../hooks/useDashboardNav";
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
    Compass,
    Layers,
    Briefcase,
    Star,
    PlusCircle,
    Globe,
    BarChart2,
    Archive,
    Bell,
    Factory,
    Utensils,
    ArrowLeftRight,
} from "lucide-react";

// ── Shared views (carga diferida) ─────────────────────────────
const DashboardView = lazy(() =>
    import("../pages/DashboardView").then((m) => ({ default: m.DashboardView })),
);
const ExplorationsView = lazy(() =>
    import("../pages/ExplorationsView").then((m) => ({ default: m.ExplorationsView })),
);
const UsersView = lazy(() =>
    import("../pages/UsersView").then((m) => ({ default: m.UsersView })),
);
const RequestsView = lazy(() =>
    import("../pages/RequestsView").then((m) => ({ default: m.RequestsView })),
);
const InventoryView = lazy(() =>
    import("../pages/InventoryView").then((m) => ({ default: m.InventoryView })),
);
const CampsView = lazy(() =>
    import("../pages/CampsView").then((m) => ({ default: m.CampsView })),
);
const SettingsView = lazy(() =>
    import("../pages/SettingsView").then((m) => ({ default: m.SettingsView })),
);
const WorkerProfileView = lazy(() =>
    import("../pages/WorkerProfileView").then((m) => ({ default: m.WorkerProfileView })),
);
const WorkerAchievementsView = lazy(() =>
    import("../pages/WorkerAchievementsView").then((m) => ({ default: m.WorkerAchievementsView })),
);
const WorkerTasksView = lazy(() =>
    import("../pages/WorkerTasksView").then((m) => ({ default: m.WorkerTasksView })),
);
const WorkerProductionView = lazy(() =>
    import("../pages/WorkerProductionView").then((m) => ({ default: m.WorkerProductionView })),
);
const WorkerRationsView = lazy(() =>
    import("../pages/WorkerRationsView").then((m) => ({ default: m.WorkerRationsView })),
);
const WorkerExplorationsView = lazy(() =>
    import("../pages/WorkerExplorationsView").then((m) => ({ default: m.WorkerExplorationsView })),
);
const WarehouseView = lazy(() =>
    import("../pages/WarehouseView").then((m) => ({ default: m.WarehouseView })),
);

// ── Management module pages (carga diferida, import directo al archivo) ──────
const ResourcesPage = lazy(() =>
    import("../../modules/management-modules/catalogs/pages/resources-page").then((m) => ({
        default: m.ResourcesPage,
    })),
);
const ProfessionsPage = lazy(() =>
    import("../../modules/management-modules/catalogs/pages/professions-page").then((m) => ({
        default: m.ProfessionsPage,
    })),
);
const AchievementsPage = lazy(() =>
    import("../../modules/management-modules/catalogs/pages/achievements-page").then((m) => ({
        default: m.AchievementsPage,
    })),
);
const CreateCampModulePage = lazy(() =>
    import("../../modules/management-modules/camps/create-camp/pages/CreateCampModulePage").then((m) => ({
        default: m.CreateCampModulePage,
    })),
);
const GlobalDashboardModulePage = lazy(() =>
    import("../../modules/management-modules/dashboard/global-dashboard/pages/GlobalDashboardView").then((m) => ({
        default: m.GlobalDashboardView,
    })),
);

// ── Resource management module pages (carga diferida, import directo al archivo) ─
const DashboardResourcePage = lazy(() =>
    import("../../modules/resource-management-modules/dashboard/pages/dashboard-resource-page").then((m) => ({
        default: m.DashboardResourcePage,
    })),
);
const InventoryMainPage = lazy(() =>
    import("../../modules/resource-management-modules/inventory/pages/inventory-main-page").then((m) => ({
        default: m.InventoryMainPage,
    })),
);
const StockAlertsMainPage = lazy(() =>
    import("../../modules/resource-management-modules/stock-alerts/pages/stock-alerts-main-page").then((m) => ({
        default: m.StockAlertsMainPage,
    })),
);
const ProductionMainPage = lazy(() =>
    import("../../modules/resource-management-modules/production-daily/pages/production-main-page").then((m) => ({
        default: m.ProductionMainPage,
    })),
);
const RationsMainPage = lazy(() =>
    import("../../modules/resource-management-modules/daily-rations/pages/rations-main-page").then((m) => ({
        default: m.RationsMainPage,
    })),
);
const InterCampMainPage = lazy(() =>
    import("../../modules/resource-management-modules/request-inter-camp/pages/inter-camp-main-page").then((m) => ({
        default: m.InterCampMainPage,
    })),
);

export const SECTIONS: DashboardSection[] = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={18} strokeWidth={2} />,
        component: () => <DashboardView />,
    },
    {
        key: "explorations",
        label: "Explorations",
        icon: <Compass size={18} strokeWidth={2} />,
        component: () => <ExplorationsView />,
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
    {
        key: "worker-explorations",
        label: "Exploraciones",
        icon: <Compass size={18} strokeWidth={2} />,
        component: () => <WorkerExplorationsView />,
    },
    {
        key: "catalog-resources",
        label: "Resources Catalog",
        icon: <Layers size={18} strokeWidth={2} />,
        component: () => <ResourcesPage />,
    },
    {
        key: "catalog-professions",
        label: "Professions",
        icon: <Briefcase size={18} strokeWidth={2} />,
        component: () => <ProfessionsPage />,
    },
    {
        key: "catalog-achievements",
        label: "Achievements",
        icon: <Star size={18} strokeWidth={2} />,
        component: () => <AchievementsPage />,
    },
    {
        key: "create-camp",
        label: "Create Camp",
        icon: <PlusCircle size={18} strokeWidth={2} />,
        component: () => <CreateCampModulePage />,
    },
    {
        key: "global-dashboard",
        label: "Global Dashboard",
        icon: <Globe size={18} strokeWidth={2} />,
        component: () => <GlobalDashboardModulePage />,
    },
    {
        key: "resource-dashboard",
        label: "Resource Dashboard",
        icon: <BarChart2 size={18} strokeWidth={2} />,
        component: () => <DashboardResourcePage />,
    },
    {
        key: "inventory-main",
        label: "Inventory",
        icon: <Archive size={18} strokeWidth={2} />,
        component: () => <InventoryMainPage />,
    },
    {
        key: "stock-alerts",
        label: "Stock Alerts",
        icon: <Bell size={18} strokeWidth={2} />,
        component: () => <StockAlertsMainPage />,
    },
    {
        key: "production",
        label: "Production",
        icon: <Factory size={18} strokeWidth={2} />,
        component: () => <ProductionMainPage />,
    },
    {
        key: "rations",
        label: "Rations",
        icon: <Utensils size={18} strokeWidth={2} />,
        component: () => <RationsMainPage />,
    },
    {
        key: "inter-camp",
        label: "Inter-Camp",
        icon: <ArrowLeftRight size={18} strokeWidth={2} />,
        component: () => <InterCampMainPage />,
    },
];
