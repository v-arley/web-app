import { z } from "zod";

export const roleSchema = z.object({
    id: z.number().int().positive().nullable(),
    name: z.string().trim().min(1, "El nombre del rol es requerido").max(150),
    description: z.string().trim().nullable().optional(),
});

export const EMPTY_ROLE = {
    id: null,
    name: "",
    description: null,
} satisfies z.input<typeof roleSchema>;

export type RoleRecord = z.infer<typeof roleSchema>;