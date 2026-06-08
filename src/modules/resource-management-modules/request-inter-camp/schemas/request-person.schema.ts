import { z } from "zod";

export const requestPersonSummarySchema = z.object({
  id: z.number(),
  dni: z.string().optional().default(""),
  name: z.string().optional().default(""),
  surname: z.string().optional().default(""),
  camp_id: z.number().nullable().optional(),
  state: z.string().optional().default("A"),
});

export const requestPersonSchema = z.object({
  id: z.number().optional(),
  request_id: z.number({ message: "El ID de la solicitud es requerido" }),
  person_id: z.number({ message: "La persona es requerida" }),
  person: requestPersonSummarySchema.nullable().optional(),
});

export type RequestPersonFormValues = z.infer<typeof requestPersonSchema>;
export type RequestPersonSummary = z.infer<typeof requestPersonSummarySchema>;

export const EMPTY_REQUEST_PERSON: Partial<RequestPersonFormValues> = {
  request_id: undefined,
  person_id: undefined,
};
