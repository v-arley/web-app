/**
 * section-registry.tsx
 *
 * Registro declarativo de secciones de navegación.
 * Técnica: ICONS + COMPONENTS como mapas tipados → SECTION_CONFIGS como
 * array de datos puros → buildSections() como factory.
 * Agregar una sección nueva = 1 línea en SECTION_CONFIGS.
 */
import {
    Boxes, LayoutDashboard, Users, Send, Database,
    Tent, Filter, UserRound, Trophy, ClipboardCheck, ShoppingBag,
    Compass, Layers, Briefcase, Star, PlusCircle, Globe,
    BarChart2, Archive, Bell, Factory, Utensils, ArrowLeftRight,
} from "lucide-react";
import {
    AchievementsPage,
    CampsView, CreateCampModulePage, DashboardResourcePage, DashboardView, ExplorationsView, GlobalDashboardModulePage,
    InterCampMainPage, InventoryMainPage, InventoryView, ProductionMainPage, ProfessionsPage, RationsMainPage,
    RequestsView, ResourcesPage, SettingsView, StockAlertsMainPage, UsersView, WarehouseView,
    WorkerAchievementsView, WorkerExplorationsView, WorkerProductionView, WorkerProfileView, WorkerRationsView, WorkerTasksView,
} from "./section-components";
import type { DashboardSection } from "../hooks/useDashboardNav";

// Registro de iconos :::
const ICONS = {
    Boxes, LayoutDashboard, Users, Send, Database,
    Tent, Filter, UserRound, Trophy, ClipboardCheck, ShoppingBag,
    Compass, Layers, Briefcase, Star, PlusCircle, Globe,
    BarChart2, Archive, Bell, Factory, Utensils, ArrowLeftRight,
};

type IconName = keyof typeof ICONS;

// Registro de componentes :::
const COMPONENTS = {
    DashboardView, ExplorationsView,
    UsersView, RequestsView, InventoryView, WarehouseView, CampsView, SettingsView,
    WorkerProfileView, WorkerAchievementsView, WorkerTasksView, WorkerProductionView, WorkerRationsView,
    WorkerExplorationsView, ResourcesPage, ProfessionsPage, AchievementsPage, CreateCampModulePage, GlobalDashboardModulePage,
    DashboardResourcePage, InventoryMainPage, StockAlertsMainPage, ProductionMainPage, RationsMainPage, InterCampMainPage,
};

type ComponentName = keyof typeof COMPONENTS;

// Configuración declarativa (solo datos, cero JSX) :::
interface SectionConfig {
    key: string;
    path: string;
    label: string;
    iconName: IconName;
    componentName: ComponentName;
}

const SECTION_CONFIGS: SectionConfig[] = [
    { key: "dashboard",            path: "/app/dashboard",            label: "Dashboard",        iconName: "LayoutDashboard", componentName: "DashboardView" },
    { key: "explorations",         path: "/app/explorations",         label: "Explorations",     iconName: "Compass",         componentName: "ExplorationsView" },
    { key: "users",                path: "/app/users",                label: "Users",            iconName: "Users",           componentName: "UsersView" },
    { key: "requests",             path: "/app/requests",             label: "Requests",         iconName: "Send",            componentName: "RequestsView" },
    { key: "inventory",            path: "/app/inventory",            label: "Resources",        iconName: "Boxes",           componentName: "InventoryView" },
    { key: "warehouse",            path: "/app/warehouse",            label: "Warehouse",        iconName: "Database",        componentName: "WarehouseView" },
    { key: "camp",                 path: "/app/camp",                 label: "Camp",             iconName: "Tent",            componentName: "CampsView" },
    { key: "settings",             path: "/app/settings",             label: "Settings",         iconName: "Filter",          componentName: "SettingsView" },
    { key: "worker-profile",       path: "/app/worker/profile",       label: "My Profile",        iconName: "UserRound",       componentName: "WorkerProfileView" },
    { key: "worker-achievements",  path: "/app/worker/achievements",  label: "Achievements and Points",  iconName: "Trophy",          componentName: "WorkerAchievementsView" },
    { key: "worker-tasks",         path: "/app/worker/tasks",         label: "My tasks",       iconName: "ClipboardCheck",  componentName: "WorkerTasksView" },
    { key: "worker-production",    path: "/app/worker/production",    label: "Daily Production",iconName: "Database",        componentName: "WorkerProductionView" },
    { key: "worker-rations",       path: "/app/worker/rations",       label: "Rations",         iconName: "ShoppingBag",     componentName: "WorkerRationsView" },
    { key: "worker-explorations",  path: "/app/worker/explorations",  label: "Explorations",    iconName: "Compass",         componentName: "WorkerExplorationsView" },
    { key: "catalog-resources",    path: "/app/catalog/resources",    label: "Resources Catalog",iconName: "Layers",          componentName: "ResourcesPage" },
    { key: "catalog-professions",  path: "/app/catalog/professions",  label: "Professions",      iconName: "Briefcase",       componentName: "ProfessionsPage" },
    { key: "catalog-achievements", path: "/app/catalog/achievements", label: "Achievements",     iconName: "Star",            componentName: "AchievementsPage" },
    { key: "create-camp",          path: "/app/create-camp",          label: "Create Camp",      iconName: "PlusCircle",      componentName: "CreateCampModulePage" },
    { key: "global-dashboard",     path: "/app/global-dashboard",     label: "Global Dashboard", iconName: "Globe",           componentName: "GlobalDashboardModulePage" },
    { key: "resource-dashboard",   path: "/app/resource/dashboard",   label: "Dashboard",        iconName: "BarChart2",       componentName: "DashboardResourcePage" },
    { key: "inventory-main",       path: "/app/resource/inventory",   label: "Inventory",        iconName: "Archive",         componentName: "InventoryMainPage" },
    { key: "stock-alerts",         path: "/app/resource/stock-alerts",label: "Stock Alerts",     iconName: "Bell",            componentName: "StockAlertsMainPage" },
    { key: "production",           path: "/app/resource/production",  label: "Production",       iconName: "Factory",         componentName: "ProductionMainPage" },
    { key: "rations",              path: "/app/resource/rations",     label: "Rations",          iconName: "Utensils",        componentName: "RationsMainPage" },
    { key: "inter-camp",           path: "/app/resource/inter-camp",  label: "Inter-Camp",       iconName: "ArrowLeftRight",  componentName: "InterCampMainPage" },
];

// Factory :::
export function buildSections(): DashboardSection[] {
    return SECTION_CONFIGS.map((config) => {
        const Icon = ICONS[config.iconName];
        const Comp = COMPONENTS[config.componentName];
        return {
            key: config.key,
            path: config.path,
            label: config.label,
            icon: <Icon size={18} strokeWidth={2} />,
            component: () => <Comp />,
        };
    });
}
