import { useQuery } from "@tanstack/react-query";
import type { CampAdminOption } from "../schemas/user.schema";
import { userService } from "../services/userService";

export const ADMIN_CANDIDATES_QUERY_KEY = [
    "management-modules",
    "camps",
    "create-camp",
    "admin-candidates",
] as const;

export function useAdminCandidatesQuery(selectedCampId: number | null, enabled = true) {
    const query = useQuery<CampAdminOption[], Error>({
        queryKey: [...ADMIN_CANDIDATES_QUERY_KEY, selectedCampId],
        queryFn: () => userService.getAdminCandidates(selectedCampId),
        enabled,
    });

    return { query };
}
