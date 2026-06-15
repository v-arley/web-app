// Árbol declarativo (única fuente de verdad) :::
// Agregar una ruta nueva = 1 línea aquí; las claves planas se generan solas.
const ROUTE_TREE = {
    LOGIN:                "/login",
    APP:                  "/app",
    FORBIDDEN:            "/app/forbidden",
    SYS_ADMIN: {
        REQUESTS:         "/app/requests",
        RESOURCES:        "/app/catalog/resources",
        PROFESSIONS:      "/app/catalog/professions",
        ACHIEVEMENTS:     "/app/catalog/achievements",
        INVENTORY:        "/app/inventory",
        SETTINGS:         "/app/settings",
        CREATE_CAMP:      "/app/create-camp",
        GLOBAL_DASHBOARD: "/app/global-dashboard",
        CAMP:             "/app/camp",
    },
    EXPLORER: {
        EXPLORATIONS:     "/app/explorations",
    },
    CAMP_ADMIN: {
        USERS:            "/app/users",
        DASHBOARD:        "/app/dashboard",
        TASK_MANAGEMENT:  "/app/admin/tasks",
    },
    WORKER: {
        PROFILE:          "/app/worker/profile",
        ACHIEVEMENTS:     "/app/worker/achievements",
        TASKS:            "/app/worker/tasks",
        PRODUCTION:       "/app/worker/production",
        RATIONS:          "/app/worker/rations",
        EXPLORATIONS:     "/app/worker/explorations",
    },
    RESOURCE: {
        DASHBOARD:        "/app/resource/dashboard",
        INVENTORY:        "/app/resource/inventory",
        STOCK_ALERTS:     "/app/resource/stock-alerts",
        PRODUCTION:       "/app/resource/production",
        RATIONS:          "/app/resource/rations",
        INTER_CAMP:       "/app/resource/inter-camp",
        WAREHOUSE:        "/app/warehouse",
    },
} as const;

// Generador :::
// Aplana el árbol jerárquico en un objeto plano con claves PADRE_HIJO.
type RouteGroup = { readonly [K: string]: string | RouteGroup };

function flattenTree(tree: RouteGroup, prefix = ""): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(tree)) {
        const flatKey = prefix ? `${prefix}_${key}` : key;
        if (typeof value === "string") {
            result[flatKey] = value;
        } else {
            Object.assign(result, flattenTree(value, flatKey));
        }
    }
    return result;
}

// Export type-safe :::
// El cast convierte Record<string, string> en las claves y valores literales.
export const ROUTES = flattenTree(ROUTE_TREE) as {
    LOGIN:                 "/login";
    APP:                   "/app";
    FORBIDDEN:             "/app/forbidden";
    DASHBOARD:             "/app/dashboard";
    EXPLORATIONS:          "/app/explorations";
    USERS:                 "/app/users";
    REQUESTS:              "/app/requests";
    INVENTORY:             "/app/inventory";
    WAREHOUSE:             "/app/warehouse";
    CAMP:                  "/app/camp";
    SETTINGS:              "/app/settings";
    CREATE_CAMP:           "/app/create-camp";
    GLOBAL_DASHBOARD:      "/app/global-dashboard";
    WORKER_PROFILE:        "/app/worker/profile";
    WORKER_ACHIEVEMENTS:   "/app/worker/achievements";
    WORKER_TASKS:          "/app/worker/tasks";
    WORKER_PRODUCTION:     "/app/worker/production";
    WORKER_RATIONS:        "/app/worker/rations";
    WORKER_EXPLORATIONS:   "/app/worker/explorations";
    CATALOG_RESOURCES:     "/app/catalog/resources";
    CATALOG_PROFESSIONS:   "/app/catalog/professions";
    CATALOG_ACHIEVEMENTS:  "/app/catalog/achievements";
    RESOURCE_DASHBOARD:    "/app/resource/dashboard";
    RESOURCE_INVENTORY:        "/app/resource/inventory";
    RESOURCE_STOCK_ALERTS:     "/app/resource/stock-alerts";
    RESOURCE_PRODUCTION:       "/app/resource/production";
    RESOURCE_RATIONS:          "/app/resource/rations";
    RESOURCE_INTER_CAMP:       "/app/resource/inter-camp";
    CAMP_ADMIN_TASK_MANAGEMENT: "/app/admin/tasks";
};

// Tipo auxiliar para navegación type-safe: solo acepta rutas válidas del árbol.
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
