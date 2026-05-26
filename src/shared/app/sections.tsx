import type { DashboardSection } from "../hooks/useDashboardNav";
import { DashboardView } from "../pages/DashboardView";
import { ExplorationsView } from "../pages/ExplorationsView";
import { UsersView } from "../pages/UsersView";
import { RequestsView } from "../pages/RequestsView";
import { InventoryView } from "../pages/InventoryView";
import { WarehouseView } from "../pages/WarehouseView";
import { CampsView } from "../pages/CampsView";
import { SettingsView } from "../pages/SettingsView";
import { WorkerProfileView } from "../pages/WorkerProfileView";
import { WorkerAchievementsView } from "../pages/WorkerAchievementsView";
import { WorkerTasksView } from "../pages/WorkerTasksView";
import { WorkerProductionView } from "../pages/WorkerProductionView";
import { WorkerRationsView } from "../pages/WorkerRationsView";
import { WorkerExplorationsView } from "../pages/WorkerExplorationsView";
import { ResourcesPage, ProfessionsPage, AchievementsPage } from "../../modules/management-modules/catalogs";
import { CreateCampModulePage } from "../../modules/management-modules/camps/create-camp";
import { GlobalDashboardModulePage } from "../../modules/management-modules/dashboard/global-dashboard";
import { DashboardResourcePage } from "../../modules/resource-management-modules/dashboard";
import { InventoryMainPage } from "../../modules/resource-management-modules/inventory";
import { StockAlertsMainPage } from "../../modules/resource-management-modules/stock-alerts";
import { ProductionMainPage } from "../../modules/resource-management-modules/production-daily";
import { RationsMainPage } from "../../modules/resource-management-modules/daily-rations";
import { InterCampMainPage } from "../../modules/resource-management-modules/request-inter-camp";
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
