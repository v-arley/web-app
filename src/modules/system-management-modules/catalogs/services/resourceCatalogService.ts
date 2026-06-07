import { ResourceService } from "../../../../services/ResourceService";
import type { ResourceCatalogFormValues, ResourceCatalogRecord, ResourceCatalogUpdateValues } from "../schemas/resource.schema";

const resourceService = new ResourceService();

function assertResponse<T>(response: Awaited<ReturnType<ResourceService["findAll"]>>, key: string, fallback: T): T {
    if (!response.getEstado()) {
        throw new Error(response.getMensaje());
    }

    return response.getResultado<T>(key) ?? fallback;
}

export const resourceCatalogService = {
    async findAll(): Promise<ResourceCatalogRecord[]> {
        const response = await resourceService.findAll();
        return assertResponse<ResourceCatalogRecord[]>(response, "registros", []);
    },

    async create(payload: ResourceCatalogFormValues): Promise<ResourceCatalogRecord> {
        const response = await resourceService.save(payload);
        return assertResponse<ResourceCatalogRecord>(response, "registro", null as never);
    },

    async update(id: number, payload: ResourceCatalogUpdateValues): Promise<ResourceCatalogRecord> {
        const response = await resourceService.update(id, payload);
        return assertResponse<ResourceCatalogRecord>(response, "registro", null as never);
    },

    async remove(id: number): Promise<void> {
        const response = await resourceService.remove(id);
        if (!response.getEstado()) {
            throw new Error(response.getMensaje());
        }
    },
};
