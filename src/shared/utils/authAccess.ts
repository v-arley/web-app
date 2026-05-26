import type { DashboardSection } from "../hooks/useDashboardNav";

export type AppRole =
  | "ADMIN_GLOBAL"
  | "ADMIN_CAMP"
  | "WORKER"
  | "RES_MANAGER"
  | "EXPLORATOR_LEADER";

export const SYSTEM_ADMIN_ROLES = ["SYSTEM_ADMINISTRATOR", "GLOBAL_ADMIN"] as const;
export const CAMP_ADMIN_ROLES = ["CAMP_ADMINISTRATOR", "CAMP_ADMIN"] as const;

const ROLE_ALIASES: Record<string, AppRole> = {
  SYSTEM_ADMINISTRATOR: "ADMIN_GLOBAL",
  GLOBAL_ADMIN: "ADMIN_GLOBAL",
  ADMIN_GLOBAL: "ADMIN_GLOBAL",
  CAMP_ADMINISTRATOR: "ADMIN_CAMP",
  CAMP_ADMIN: "ADMIN_CAMP",
  ADMIN_CAMP: "ADMIN_CAMP",
  WORKER: "WORKER",
  RES_MANAGER: "RES_MANAGER",
  RESOURCE_MANAGER: "RES_MANAGER",
  EXPLORATOR_LEADER: "EXPLORATOR_LEADER",
  EXPEDITION_LEADER: "EXPLORATOR_LEADER",
  EXPLORATION_LEADER: "EXPLORATOR_LEADER",
  EXPLORATION: "EXPLORATOR_LEADER",
};

const SECTION_ACCESS_BY_ROLE: Record<AppRole, string[]> = {
  // Pendiente de definir completamente. Se deja una superficie administrativa provisional.
  ADMIN_GLOBAL: [
    "global-dashboard",
    "create-camp",
    "catalog-resources",
    "catalog-professions",
    "catalog-achievements",
    "settings",
  ],
  ADMIN_CAMP: ["dashboard", "users", "settings"],
  WORKER: [
    "worker-profile",
    "worker-achievements",
    "worker-tasks",
    "worker-production",
    "worker-rations",
    "worker-explorations",
  ],
  RES_MANAGER: [
    "resource-dashboard",
    "inventory-main",
    "stock-alerts",
    "production",
    "rations",
    "inter-camp",
  ],
  EXPLORATOR_LEADER: ["explorations"],
};


export type ProfessionKey = "worker" | "resource_manager" | "expedition_leader";

export type AuthContext = {
  name: string;
  userId?: number;
  profession?: string;
  roles: string[];
  campId?: number;
};

const PROFESSION_BY_BACKEND_VALUE: Record<string, ProfessionKey> = {
  WORKER: "worker",
  RESOURCE_MANAGER: "resource_manager",
  EXPEDITION_LEADER: "expedition_leader",
  EXPLORATION: "expedition_leader",
};

const BACKEND_PROFESSION_BY_KEY: Record<ProfessionKey, string> = {
  worker: "WORKER",
  resource_manager: "RESOURCE_MANAGER",
  expedition_leader: "EXPEDITION_LEADER",
};

export const PROFESSION_OPTIONS: Array<{
  value: ProfessionKey;
  label: string;
}> = [
  { value: "worker", label: "Trabajador" },
  { value: "resource_manager", label: "Gestor de recursos" },
  { value: "expedition_leader", label: "Lider de expedicion" },
];

export const PROFESSION_LABELS: Record<ProfessionKey, string> = {
  worker: "Trabajador",
  resource_manager: "Gestor de recursos",
  expedition_leader: "Lider de expedicion",
};

function getAppRoleFromRoles(roles: string[]): AppRole | null {
  for (const role of roles) {
    const resolvedRole = ROLE_ALIASES[normalize(role)];
    if (resolvedRole) {
      return resolvedRole;
    }
  }

  return null;
}

function getAppRoleFromProfession(profession: unknown): AppRole {
  const normalizedProfession = normalizeProfession(profession);

  if (normalizedProfession === "resource_manager") {
    return "RES_MANAGER";
  }

  if (normalizedProfession === "expedition_leader") {
    return "EXPLORATOR_LEADER";
  }

  return "WORKER";
}

function resolveAppRole(auth: Pick<AuthContext, "roles" | "profession">): AppRole {
  return getAppRoleFromRoles(auth.roles) ?? getAppRoleFromProfession(auth.profession);
}

function normalize(value: string) {
  return value.trim().toUpperCase();
}

export function normalizeRoles(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((role): role is string => typeof role === "string")
    .map(normalize)
    .filter(Boolean);
}

export function hasAnyRole(
  roles: readonly string[] | undefined,
  allowedRoles: readonly string[],
) {
  if (!roles?.length) {
    return false;
  }

  const roleSet = new Set(roles.map(normalize));
  return allowedRoles.some((role) => roleSet.has(normalize(role)));
}

export function isSystemAdmin(auth: Pick<AuthContext, "roles">) {
  return hasAnyRole(auth.roles, SYSTEM_ADMIN_ROLES);
}

export function isCampAdmin(auth: Pick<AuthContext, "roles">) {
  return hasAnyRole(auth.roles, CAMP_ADMIN_ROLES);
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const rawPayload = token.split(".")[1];
    if (!rawPayload) {
      return null;
    }

    const base64 = rawPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getAuthContextFromToken(): AuthContext {
  const token = localStorage.getItem("token") ?? "";
  const payload = decodeTokenPayload(token);

  if (!payload) {
    return { name: "---", roles: [] };
  }

  const name = (payload.sub ??
    payload.username ??
    payload.name ??
    "") as string;
  const userId =
    typeof payload.userId === "number" ? payload.userId : undefined;
  const profession =
    typeof payload.profession === "string" ? payload.profession : undefined;
  const campId =
    typeof payload.camp_id === "number" ? payload.camp_id : undefined;
  const roles = normalizeRoles(payload.roles);

  return {
    name: name ? name.toUpperCase() : userId ? `USER-${userId}` : "---",
    userId,
    profession,
    roles,
    campId,
  };
}

export function normalizeProfession(value: unknown): ProfessionKey {
  return (
    PROFESSION_BY_BACKEND_VALUE[normalize(String(value ?? ""))] ?? "worker"
  );
}

export function toBackendProfession(profession: ProfessionKey) {
  return BACKEND_PROFESSION_BY_KEY[profession];
}

export function getRoleLabel(auth: Pick<AuthContext, "roles" | "profession">) {
  return auth.roles.length ? resolveAppRole(auth) : getAppRoleFromProfession(auth.profession);
}

export function getAvailableSections(
  sections: DashboardSection[],
  auth: AuthContext,
): DashboardSection[] {
  const resolvedRole = resolveAppRole(auth);
  const allowed = new Set(SECTION_ACCESS_BY_ROLE[resolvedRole]);

  return sections.filter((section) => allowed.has(section.key));
}
