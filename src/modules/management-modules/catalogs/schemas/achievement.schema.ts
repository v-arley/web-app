import { z } from "zod";

const optionalTrimmedText = z.string().trim().max(1000).optional().or(z.literal(""));

export const achievementSchema = z.object({
    id: z.number().int().positive().nullable().optional(),
    code: z.string().trim().min(1, "El codigo es requerido").max(50),
    name: z.string().trim().min(1, "El nombre es requerido").max(150),
    description: optionalTrimmedText,
    icon_url: z.string().trim().max(500).optional().or(z.literal("")),
    condition_logic: z.string().trim().min(1, "La condicion es requerida"),
    points: z
        .number()
        .int("Los puntos deben ser enteros.")
        .min(0, "Los puntos no pueden ser negativos."),
    category: z.string().trim().max(100).optional().or(z.literal("")),
    state: z.enum(["A", "I"]).default("A"),
    created_at: z.string().nullable().optional(),
});

export const EMPTY_ACHIEVEMENT = {
    id: null,
    code: "",
    name: "",
    description: "",
    icon_url: "",
    condition_logic: "",
    points: 0,
    category: "",
    state: "A",
    created_at: null,
} satisfies z.input<typeof achievementSchema>;

export type AchievementFormInput = z.input<typeof achievementSchema>;
export type AchievementFormValues = z.infer<typeof achievementSchema>;
