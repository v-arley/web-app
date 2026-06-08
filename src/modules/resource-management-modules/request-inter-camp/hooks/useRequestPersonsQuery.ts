import { useQuery } from "@tanstack/react-query";
import { requestPersonService } from "../services/RequestPersonService";

export const REQUEST_PERSONS_QUERY_KEY = ["request-persons"];

export function useRequestPersonsQuery(requestId: number, enabled = true) {
  return useQuery({
    queryKey: [...REQUEST_PERSONS_QUERY_KEY, requestId],
    queryFn: () => requestPersonService.getRequestPersons(requestId),
    enabled: enabled && requestId > 0,
  });
}
