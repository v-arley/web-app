import { z } from "zod";
import { campSchema } from "./camp.schema";

export const createCampSchema = z
    .object({
        id: campSchema.shape.id,
        code: campSchema.shape.code,
        description: campSchema.shape.description,
        capacity: campSchema.shape.capacity,
        location_x: campSchema.shape.location_x,
        location_y: campSchema.shape.location_y,
        admin_id: campSchema.shape.admin_id,
        state: campSchema.shape.state,
        warehouse_name: z.string().trim().max(150),
        warehouse_location_details: z.string().trim().max(250),
        created_at: campSchema.shape.created_at,
    })
    .superRefine((values, ctx) => {
        if (values.id == null && !values.warehouse_name.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["warehouse_name"],
                message: "Ingrese el nombre del almacen inicial para el campamento.",
            });
        }
    });

export type CampFormValues = z.infer<typeof createCampSchema>;

export const EMPTY_CAMP_FORM: CampFormValues = {
    id: null,
    code: "",
    description: "",
    capacity: 0,
    location_x: null,
    location_y: null,
    admin_id: null,
    state: "A",
    warehouse_name: "",
    warehouse_location_details: "",
    created_at: null,
};

