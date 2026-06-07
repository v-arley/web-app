import { ProfessionService } from "../../../../services/ProfessionService";
import type { ProfessionCatalogFormValues, ProfessionCatalogRecord, ProfessionCatalogUpdateValues } from "../schemas/profession.schema";

const professionService = new ProfessionService();

function assertResponse<T>(response: Awaited<ReturnType<ProfessionService["findAll"]>>, key: string, fallback: T): T {
    if (!response.getEstado()) {
        throw new Error(response.getMensaje());
    }

    return response.getResultado<T>(key) ?? fallback;
}

export const professionCatalogService = {
    async findAll(): Promise<ProfessionCatalogRecord[]> {
        const response = await professionService.findAll();
        return assertResponse<ProfessionCatalogRecord[]>(response, "registros", []);
    },

    async create(payload: ProfessionCatalogFormValues): Promise<ProfessionCatalogRecord> {
        const response = await professionService.save(payload);
        return assertResponse<ProfessionCatalogRecord>(response, "registro", null as never);
    },

    async update(id: number, payload: ProfessionCatalogUpdateValues): Promise<ProfessionCatalogRecord> {
        const response = await professionService.update(id, payload);
        return assertResponse<ProfessionCatalogRecord>(response, "registro", null as never);
    },

    async remove(id: number): Promise<void> {
        const response = await professionService.remove(id);
        if (!response.getEstado()) {
            throw new Error(response.getMensaje());
        }
    },
};
