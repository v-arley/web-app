import { z } from "zod";

export const campSchema = z.object({
    id: z.number().int().positive().nullable(),
    code: z.string().trim().min(1, "El codigo es requerido").max(50),
    description: z.string().trim().min(1, "La descripcion es requerida").max(500),
    capacity: z.coerce.number().int("La capacidad debe ser entera.").positive("La capacidad debe ser mayor a cero."),
    location_x: z.preprocess(
        (value) => (value === "" || value == null ? null : Number(value)),
        z.number().min(-180, "La longitud debe estar entre -180 y 180.").max(180, "La longitud debe estar entre -180 y 180.").nullable(),
    ),
    location_y: z.preprocess(
        (value) => (value === "" || value == null ? null : Number(value)),
        z.number().min(-90, "La latitud debe estar entre -90 y 90.").max(90, "La latitud debe estar entre -90 y 90.").nullable(),
    ),
    admin_id: z.preprocess(
        (value) => (value === "" || value == null ? null : Number(value)),
        z.number().int().positive().nullable(),
    ),
    state: z.enum(["A", "I"]).default("A"),
    active: z.boolean().optional(),
    created_at: z.string().nullable().optional(),
});

export const EMPTY_CAMP = {
    id: null,
    code: "",
    description: "",
    capacity: 1,
    location_x: null,
    location_y: null,
    admin_id: null,
    state: "A",
    active: true,
    created_at: null,
} satisfies z.input<typeof campSchema>;

export type CampRecord = z.infer<typeof campSchema>;
