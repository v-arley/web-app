import { useQuery } from "@tanstack/react-query";
import type { UserRecord } from "../schemas/user.schema";
import { userService } from "../services/userService";

export const USERS_QUERY_KEY = ["management-modules", "camps", "create-camp", "users"] as const;

export function useUserQuery(enabled = true) {
    const query = useQuery<UserRecord[], Error>({
        queryKey: USERS_QUERY_KEY,
        queryFn: () => userService.getUsers(),
        enabled,
    });

    return { query };
}
