import { z } from "zod";

export const resourceAlertSchema = z.object({
    id: z.number().int().positive().nullable().optional(),
    warehouse_id: z.number().int().positive(),
    warehouse_name: z.string(),
    resource_id: z.number().int().positive(),
    resource_code: z.string(),
    resource_name: z.string(),
    current_amount: z.number().min(0),
    min_quantity: z.number().min(0),
    alert_date: z.string().nullable().optional(),
    resolved: z.enum(["Y", "N"]).default("N"),
    resolved_at: z.string().nullable().optional(),
});

export type ResourceAlertFormValues = z.infer<typeof resourceAlertSchema>;
