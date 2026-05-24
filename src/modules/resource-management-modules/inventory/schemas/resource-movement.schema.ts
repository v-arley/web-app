import { z } from "zod";

const optionalTrimmedText = z.string().trim().max(500).optional().or(z.literal(""));

export const resourceMovementSchema = z.object({
    id: z.number().int().positive().nullable().optional(),
    warehouse_id: z.number().int().positive({ message: "El almacén es requerido" }),
    resource_id: z.number().int().positive({ message: "El recurso es requerido" }),
    movement_type: z.enum(["E", "S", "A"], { message: "El tipo de movimiento es requerido" }),
    amount: z.number().positive({ message: "La cantidad debe ser mayor a 0" }),
    adjustment_sign: z.enum(["+", "-"]).nullable().optional(),
    reason: optionalTrimmedText,
    created_at: z.string().nullable().optional(),
});

export const EMPTY_RESOURCE_MOVEMENT = {
    id: null,
    warehouse_id: 0,
    resource_id: 0,
    movement_type: "E" as const,
    amount: 0,
    adjustment_sign: null,
    reason: "",
    created_at: null,
} satisfies z.input<typeof resourceMovementSchema>;

export type ResourceMovementFormValues = z.infer<typeof resourceMovementSchema>;
