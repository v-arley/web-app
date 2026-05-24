import { z } from "zod";

const optionalTrimmedText = z.string().trim().max(500).optional().or(z.literal(""));

export const resourceSchema = z.object({
    id: z.number().int().positive().nullable().optional(),
    code: z.string().trim().min(1, "El codigo es requerido").max(50),
    name: z.string().trim().min(1, "El nombre es requerido").max(150),
    description: optionalTrimmedText,
    unitOfMeasure: z.string().trim().min(1, "La unidad es requerida").max(50),
    consumable: z.boolean(),
    category: z.string().trim().min(1, "La categoria es requerida").max(100),
    status: z.enum(["C", "M", "O"]).nullable().optional(),
    state: z.enum(["A", "I"]).default("A"),
    created_at: z.string().nullable().optional(),
});

export const EMPTY_RESOURCE = {
    id: null,
    code: "",
    name: "",
    description: "",
    unitOfMeasure: "",
    consumable: false,
    category: "",
    status: null,
    state: "A",
    created_at: null,
} satisfies z.input<typeof resourceSchema>;

export type ResourceFormInput = z.input<typeof resourceSchema>;
export type ResourceFormValues = z.infer<typeof resourceSchema>;
