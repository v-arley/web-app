import { z } from "zod";

export const userRoleSchema = z.object({
    id: z.number().int().positive().nullable().optional(),
    user_id: z.number().int().positive().nullable(),
    role_id: z.number().int().positive().nullable(),
    status: z.string().trim().nullable().optional(),
    active: z.boolean().optional(),
    temporal: z.boolean().optional(),
});

export const EMPTY_USER_ROLE = {
    id: null,
    user_id: null,
    role_id: null,
    status: "A",
    active: true,
    temporal: false,
} satisfies z.input<typeof userRoleSchema>;

export type UserRoleRecord = z.infer<typeof userRoleSchema>;
