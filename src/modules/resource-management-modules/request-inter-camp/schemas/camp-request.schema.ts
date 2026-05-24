import { z } from 'zod';

// Schema de validación para solicitudes entre campamentos
export const campRequestSchema = z.object({
  id: z.number().optional(),
  origin_camp_id: z.number({ message: 'El campamento origen es requerido' }),
  destination_camp_id: z.number({ message: 'El campamento destino es requerido' }),
  request_type: z.enum(['R', 'P'], { message: 'El tipo de solicitud es requerido' }),
  status: z.enum(['P', 'A', 'R'], { message: 'El estado es requerido' }),
  origin_approval_status: z.enum(['P', 'A', 'R']).nullable().optional(),
  destination_approval_status: z.enum(['P', 'A', 'R']).nullable().optional(),
  approved_by_origin_user_id: z.number().nullable().optional(),
  approved_by_destination_user_id: z.number().nullable().optional(),
  approved_at: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  created_at: z.string().optional(),
  resolved_at: z.string().nullable().optional(),
}).refine((data) => data.origin_camp_id !== data.destination_camp_id, {
  message: 'El campamento origen debe ser diferente al destino',
  path: ['destination_camp_id'],
});

export type CampRequestFormValues = z.infer<typeof campRequestSchema>;

export const EMPTY_CAMP_REQUEST: Partial<CampRequestFormValues> = {
  origin_camp_id: undefined,
  destination_camp_id: undefined,
  request_type: 'R',
  status: 'P',
  origin_approval_status: 'P',
  destination_approval_status: 'P',
  description: null,
};

// Constantes para estados
export const REQUEST_STATUS = {
  PENDING: 'P' as const,
  APPROVED: 'A' as const,
  REJECTED: 'R' as const,
};

export const REQUEST_TYPE = {
  RESOURCES: 'R' as const,
  PERSONS: 'P' as const,
};
