import { z } from "zod";

export const minStockConfigSchema = z.object({
    warehouse_id: z.number().int().positive({ message: "El almacén es requerido" }),
    resource_id: z.number().int().positive({ message: "El recurso es requerido" }),
    min_quantity: z.number().min(0, { message: "La cantidad mínima debe ser >= 0" }),
});

export type MinStockConfigFormValues = z.infer<typeof minStockConfigSchema>;
