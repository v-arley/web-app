import { lazy } from "react";

export const DashboardView = lazy(() =>
    import("../pages/DashboardView").then((m) => ({ default: m.DashboardView })),
);
export const ExplorationsView = lazy(() =>
    import("../pages/ExplorationsView").then((m) => ({ default: m.ExplorationsView })),
);
export const UsersView = lazy(() =>
    import("../pages/UsersView").then((m) => ({ default: m.UsersView })),
);
export const RequestsView = lazy(() =>
    import("../pages/RequestsView").then((m) => ({ default: m.RequestsView })),
);
export const InventoryView = lazy(() =>
    import("../pages/InventoryView").then((m) => ({ default: m.InventoryView })),
);
export const CampsView = lazy(() =>
    import("../pages/CampsView").then((m) => ({ default: m.CampsView })),
);
export const SettingsView = lazy(() =>
    import("../pages/SettingsView").then((m) => ({ default: m.SettingsView })),
);
export const WorkerProfileView = lazy(() =>
    import("../pages/WorkerProfileView").then((m) => ({ default: m.WorkerProfileView })),
);
export const WorkerAchievementsView = lazy(() =>
    import("../pages/WorkerAchievementsView").then((m) => ({ default: m.WorkerAchievementsView })),
);
export const WorkerTasksView = lazy(() =>
    import("../pages/WorkerTasksView").then((m) => ({ default: m.WorkerTasksView })),
);
export const WorkerProductionView = lazy(() =>
    import("../pages/WorkerProductionView").then((m) => ({ default: m.WorkerProductionView })),
);
export const WorkerRationsView = lazy(() =>
    import("../pages/WorkerRationsView").then((m) => ({ default: m.WorkerRationsView })),
);
export const WorkerExplorationsView = lazy(() =>
    import("../pages/WorkerExplorationsView").then((m) => ({ default: m.WorkerExplorationsView })),
);
export const WarehouseView = lazy(() =>
    import("../pages/WarehouseView").then((m) => ({ default: m.WarehouseView })),
);

export const ResourcesPage = lazy(() =>
    import("../../modules/system-management-modules/catalogs/pages/resources-page").then((m) => ({
        default: m.ResourcesPage,
    })),
);
export const ProfessionsPage = lazy(() =>
    import("../../modules/system-management-modules/catalogs/pages/professions-page").then((m) => ({
        default: m.ProfessionsPage,
    })),
);
export const AchievementsPage = lazy(() =>
    import("../../modules/system-management-modules/catalogs/pages/achievements-page").then((m) => ({
        default: m.AchievementsPage,
    })),
);
export const CatalogsMainPage = lazy(() =>
    import("../../modules/system-management-modules/catalogs/pages/catalogs-main-page").then((m) => ({
        default: m.CatalogsMainPage,
    })),
);
export const CreateCampModulePage = lazy(() =>
    import("../../modules/system-management-modules/create-camps/pages/CreateCampPage").then((m) => ({
        default: m.CreateCampModulePage,
    })),
);
export const GlobalDashboardModulePage = lazy(() =>
    import("../../modules/system-management-modules/dashboard/pages/GlobalDashboardView").then((m) => ({
        default: m.GlobalDashboardView,
    })),
);

export const DashboardResourcePage = lazy(() =>
    import("../../modules/resource-management-modules/dashboard/pages/dashboard-resource-page").then((m) => ({
        default: m.DashboardResourcePage,
    })),
);
export const InventoryMainPage = lazy(() =>
    import("../../modules/resource-management-modules/inventory/pages/inventory-main-page").then((m) => ({
        default: m.InventoryMainPage,
    })),
);
export const StockAlertsMainPage = lazy(() =>
    import("../../modules/resource-management-modules/stock-alerts/stock-alerts-main-page").then((m) => ({
        default: m.StockAlertsMainPage,
    })),
);
export const ProductionMainPage = lazy(() =>
    import("../../modules/resource-management-modules/production-daily/pages/production-main-page").then((m) => ({
        default: m.ProductionMainPage,
    })),
);
export const RationsMainPage = lazy(() =>
    import("../../modules/resource-management-modules/daily-rations/pages/rations-main-page").then((m) => ({
        default: m.RationsMainPage,
    })),
);
export const InterCampMainPage = lazy(() =>
    import("../../modules/resource-management-modules/request-inter-camp/pages/inter-camp-main-page").then((m) => ({
        default: m.InterCampMainPage,
    })),
);

export const NotFoundPage = lazy(() =>
    import("../components/$404").then((m) => ({ default: m.default })),
);

export const ForbiddenPage = lazy(() =>
    import("../components/$403").then((m) => ({ default: m.default })),
);
