import { useMutation } from "@tanstack/react-query";
import { warehouseService } from "../services/warehouseService";

type CreateWarehouseInput = {
    name: string;
    location_details: string;
    camp_id: number;
    admin_id?: number | null;
};

export function useWarehouseMutations() {
    const create = useMutation({
        mutationFn: (data: CreateWarehouseInput) => warehouseService.createWarehouse(data),
    });

    return { create };
}
