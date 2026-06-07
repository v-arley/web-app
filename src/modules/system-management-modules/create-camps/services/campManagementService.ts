import { CampService } from "../../../../services/CampService";
import { WarehouseService } from "../../../../services/WarehouseService";
import type { CampFormValues, CampRecord, CampUpdateValues } from "../schemas/camp.schema";

const campService = new CampService();
const warehouseService = new WarehouseService();

function assertResponse<T>(response: Awaited<ReturnType<CampService["findAll"]>>, key: string, fallback: T): T {
    if (!response.getEstado()) {
        throw new Error(response.getMensaje());
    }

    return response.getResultado<T>(key) ?? fallback;
}

function toCampPayload(values: CampFormValues): CampUpdateValues {
    return {
        code: values.code,
        description: values.description,
        capacity: Number(values.capacity),
        location_x: Number(values.location_x),
        location_y: Number(values.location_y),
        active: values.active,
        state: values.state,
        admin_id: values.admin_id,
    };
}

export const campManagementService = {
    async findAll(): Promise<CampRecord[]> {
        const response = await campService.findAll();
        return assertResponse<CampRecord[]>(response, "registros", []);
    },

    async create(values: CampFormValues): Promise<CampRecord> {
        const response = await campService.save(toCampPayload(values) as CampFormValues);
        const camp = assertResponse<CampRecord>(response, "registro", null as never);

        if (camp.id && values.warehouse_name?.trim()) {
            const warehouseResponse = await warehouseService.save({
                name: values.warehouse_name.trim(),
                location_details: values.warehouse_location_details?.trim() || values.description,
                camp_id: camp.id,
                admin_id: values.admin_id,
            });

            if (!warehouseResponse.getEstado()) {
                throw new Error(warehouseResponse.getMensaje());
            }
        }

        return camp;
    },

    async update(id: number, values: CampUpdateValues): Promise<CampRecord> {
        const response = await campService.update(id, values);
        return assertResponse<CampRecord>(response, "registro", null as never);
    },

    async remove(id: number): Promise<void> {
        const response = await campService.remove(id);
        if (!response.getEstado()) {
            throw new Error(response.getMensaje());
        }
    },
};
