import { useQuery } from "@tanstack/react-query";
import { campRequestService } from "../services/CampRequestService";

export const CAMP_REQUESTS_QUERY_KEY = ["camp-requests"];

interface CampRequestsFilters {
    originCampId?: number;
    destinationCampId?: number;
    requestType?: 'R' | 'P';
    status?: 'P' | 'A' | 'R';
    originApprovalStatus?: 'P' | 'A' | 'R';
    destinationApprovalStatus?: 'P' | 'A' | 'R';
}

export function useCampRequestsQuery(filters?: CampRequestsFilters, enabled = true) {
    return useQuery({
        queryKey: [...CAMP_REQUESTS_QUERY_KEY, filters],
        queryFn: () => campRequestService.getCampRequests(filters),
        enabled,
    });
}

export function useCampRequestByIdQuery(id: number, enabled = true) {
    return useQuery({
        queryKey: [...CAMP_REQUESTS_QUERY_KEY, id],
        queryFn: () => campRequestService.getCampRequestById(id),
        enabled: enabled && id > 0,
    });
}
