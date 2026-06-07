import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "../../../../../../services/ResourceService";
import type { Resource } from "../../../../../../models/Resource";

const resourceService = new ResourceService();

export function useGlobalResources() {
  return useQuery<Resource[]>({
    queryKey: ["global-resources"],
    queryFn: async () => {
      const res = await resourceService.findAll();
      return res.getResultado<Resource[]>("registros") ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export default useGlobalResources;
