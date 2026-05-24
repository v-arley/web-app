import { useQuery } from "@tanstack/react-query";
import type { RoleRecord } from "../schemas/role.schema";
import { roleService } from "../services/roleService";

export const ROLES_QUERY_KEY = ["management-modules", "camps", "create-camp", "roles"] as const;

export function useRoleQuery(enabled = true) {
    const query = useQuery<RoleRecord[], Error>({
        queryKey: ROLES_QUERY_KEY,
        queryFn: () => roleService.getRoles(),
        enabled,
    });

    return { query };
}
