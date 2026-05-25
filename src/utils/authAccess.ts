import type { DashboardSection } from "../hooks/useDashboardNav";

// export const SYSTEM_ADMIN_ROLES = [ "SYSTEM_ADMINISTRATOR", "GLOBAL_ADMIN", ] as const;
// export const CAMP_ADMIN_ROLES = ["CAMP_ADMINISTRATOR", "CAMP_ADMIN"] as const;

export const SYSTEM_ADMIN_ROLES = ["SYSTEM_ADMINISTRATOR", "GLOBAL_ADMIN", "RES_MANAGER", "RESOURCE_MANAGER"] as const;
export const CAMP_ADMIN_ROLES = ["CAMP_ADMINISTRATOR", "CAMP_ADMIN", "RES_MANAGER", "RESOURCE_MANAGER"] as const;


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

export function getRoleLabel(auth: Pick<AuthContext, "roles">) {
  if (isSystemAdmin(auth)) {
    return "GLOBAL_ADMIN";
  }

  if (isCampAdmin(auth)) {
    return "CAMP_ADMINISTRATOR";
  }

  return auth.roles[0] ?? "OPERATOR";
}

export function getAvailableSections(
  sections: DashboardSection[],
  auth: AuthContext,
): DashboardSection[] {
  if (isSystemAdmin(auth)) {
    return sections;
  }

  if (isCampAdmin(auth)) {
    return sections.filter((section) => section.key !== "camp");
  }

  const normalizedRoles = auth.roles.map(normalize);

  if (normalizedRoles.includes("EXPEDITION_LEADER")) {
    const allowed = new Set([
      "dashboard",
      "explorations",
      "requests",
      "inventory",
    ]);
    return sections.filter((section) => allowed.has(section.key));
  }

  if (normalizedRoles.includes("RESOURCE_MANAGER")) {
    const allowed = new Set([
      "dashboard",
      "inventory",
      "warehouse",
      "requests",
    ]);
    return sections.filter((section) => allowed.has(section.key));
  }

  if (normalizedRoles.includes("WORKER")) {
    const allowed = new Set([
      "dashboard",
      "requests",
      "worker-profile",
      "worker-achievements",
      "worker-tasks",
      "worker-production",
      "worker-rations",
      "worker-explorations",
    ]);

    return sections.filter((section) => allowed.has(section.key));
  }

  const profession = normalizeProfession(auth.profession);
  const allowedByProfession: Record<ProfessionKey, string[]> = {
    worker: [
      "dashboard",
      "requests",
      "worker-profile",
      "worker-achievements",
      "worker-tasks",
      "worker-production",
      "worker-rations",
      "worker-explorations",
    ],
    resource_manager: ["dashboard", "inventory", "warehouse", "requests"],
    expedition_leader: ["dashboard", "explorations", "requests", "inventory"],
  };

  // const allowedByProfession: Record<ProfessionKey, string[]> = {
  //   worker: ["dashboard", "requests"],
  //   resource_manager: [
  //     "dashboard",
  //     "inventory",
  //     "warehouse",
  //     "requests",
  //     "inventory-stock",
  //     "inventory-movements",
  //     "inventory-config",
  //     "inventory-alerts",
  //     "production-rules",
  //     "production-execute",
  //     "production-records",
  //   ],
  //   expedition_leader: [
  //     "dashboard",
  //     "requests",
  //     "inventory",
  //     "inventory-stock",
  //     "inventory-movements",
  //     "inventory-config",
  //     "inventory-alerts",
  //     "production-rules",
  //     "production-execute",
  //     "production-records",
  //   ],
  // };

  const allowed = new Set(allowedByProfession[profession]);
  return sections.filter((section) => allowed.has(section.key));
}
