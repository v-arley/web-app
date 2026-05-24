import { z } from "zod";

export const stockSummarySchema = z.object({
    warehouse_id: z.number().int().positive(),
    warehouse_name: z.string(),
    resource_id: z.number().int().positive(),
    resource_code: z.string(),
    resource_name: z.string(),
    category: z.string(),
    unit_of_measure: z.string(),
    current_amount: z.number().min(0),
    min_quantity: z.number().min(0),
    stock_status: z.enum(["CRITICAL", "LOW", "OK"]),
    date_last_movement: z.string().nullable().optional(),
});

export type StockSummary = z.infer<typeof stockSummarySchema>;
