import { useQuery } from "@tanstack/react-query";
import type { UserRoleRecord } from "../schemas/user-role.schema";
import { userRoleService } from "../services/userRoleService";

export const USER_ROLES_QUERY_KEY = ["management-modules", "camps", "create-camp", "user-roles"] as const;

export function useUserRoleQuery(enabled = true) {
    const query = useQuery<UserRoleRecord[], Error>({
        queryKey: USER_ROLES_QUERY_KEY,
        queryFn: () => userRoleService.getUserRoles(),
        enabled,
    });

    return { query };
}
