import { z } from "zod";

export const warehouseSchema = z.object({
    id: z.number().int().positive().nullable().optional(),
    name: z.string().trim().min(1, "El nombre del almacen es requerido").max(150),
    location_details: z.string().trim().max(250).optional().or(z.literal("")),
    camp_id: z.number().int().positive(),
    admin_id: z.number().int().positive().nullable().optional(),
});

export const EMPTY_WAREHOUSE = {
    id: null,
    name: "",
    location_details: "",
    camp_id: 0,
    admin_id: null,
} satisfies z.input<typeof warehouseSchema>;

export type WarehouseRecord = z.infer<typeof warehouseSchema>;
