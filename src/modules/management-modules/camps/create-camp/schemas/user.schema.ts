import { z } from "zod";

export const userSchema = z.object({
    id: z.number().int().positive().nullable(),
    username: z.string().trim().min(1, "El username es requerido").max(150),
    name: z.string().trim().min(1, "El nombre es requerido").max(200),
    profession: z.string().trim().nullable().optional(),
    state: z.enum(["A", "I"]).optional(),
});

export const EMPTY_USER = {
    id: null,
    username: "",
    name: "",
    profession: null,
    state: "A",
} satisfies z.input<typeof userSchema>;

export type UserRecord = z.infer<typeof userSchema>;

export const adminCandidateSchema = z.object({
    id: z.number().int().positive(),
    label: z.string().trim().min(1),
});

export type CampAdminOption = z.infer<typeof adminCandidateSchema>;
