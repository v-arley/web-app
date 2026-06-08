import { useQuery } from "@tanstack/react-query";
import { useSystemCrud } from "../../shared/hooks/useSystemCrud";
import { adminCandidateService } from "../services/adminCandidateService";
import { campManagementService } from "../services/campManagementService";
import type { CampFormValues, CampRecord, CampUpdateValues } from "../schemas/camp.schema";

export const CAMP_MANAGEMENT_QUERY_KEY = ["system-management-modules", "create-camps", "camps"] as const;
export const ADMIN_CANDIDATES_QUERY_KEY = ["system-management-modules", "create-camps", "admin-candidates"] as const;

export function useCampManagement() {
    return useSystemCrud<CampRecord, CampFormValues, CampUpdateValues>(CAMP_MANAGEMENT_QUERY_KEY, campManagementService);
}

export function useAdminCandidates() {
    return useQuery({
        queryKey: ADMIN_CANDIDATES_QUERY_KEY,
        queryFn: adminCandidateService.findAll,
    });
}
