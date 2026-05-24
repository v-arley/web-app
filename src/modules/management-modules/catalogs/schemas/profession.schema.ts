import { z } from "zod";

const optionalTrimmedText = z.string().trim().max(500).optional().or(z.literal(""));

export const professionSchema = z.object({
    id: z.number().int().positive().nullable().optional(),
    code: z.string().trim().min(1, "El codigo es requerido").max(50),
    name: z.string().trim().min(1, "El nombre es requerido").max(150),
    description: optionalTrimmedText,
    default_resource_id: z.number().int().positive().nullable().optional(),
    default_production_amount: z
        .number()
        .int("La cantidad debe ser entera.")
        .positive("La cantidad debe ser mayor a cero.")
        .nullable()
        .optional(),
    state: z.enum(["A", "I"]).default("A"),
    created_at: z.string().nullable().optional(),
});

export const EMPTY_PROFESSION = {
    id: null,
    code: "",
    name: "",
    description: "",
    default_resource_id: null,
    default_production_amount: null,
    state: "A",
    created_at: null,
} satisfies z.input<typeof professionSchema>;

export type ProfessionFormInput = z.input<typeof professionSchema>;
export type ProfessionFormValues = z.infer<typeof professionSchema>;
