import { useQuery } from "@tanstack/react-query";
import { WarehouseService } from "../../../../../../services/WarehouseService";
import type { Warehouse } from "../../../../../../models/Warehouse";

const warehouseService = new WarehouseService();

export function useCampWarehouses(campId: number) {
  return useQuery<Warehouse[]>({
    queryKey: ["warehouses-by-camp", campId],
    enabled: !!campId,
    queryFn: async () => {
      const res = await warehouseService.findAll();
      const all = res.getResultado<Warehouse[]>("registros") ?? [];
      return all.filter((w) => w.camp_id === campId);
    },
  });
}

export default useCampWarehouses;
