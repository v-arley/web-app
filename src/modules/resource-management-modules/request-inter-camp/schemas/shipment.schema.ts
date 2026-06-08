import { z } from 'zod';
import { campRequestSchema } from './camp-request.schema';

// Schema de validación para envíos
export const shipmentSchema = z.object({
  id: z.number().optional(),
  request_id: z.number({ message: 'El ID de la solicitud es requerido' }),
  request: campRequestSchema.nullable().optional(),
  departure_date: z.string({ message: 'La fecha de salida es requerida' }),
  arrival_date: z.string().nullable().optional(),
  status: z.enum(['P', 'I', 'D', 'C'], { message: 'El estado es requerido' }),
  observations: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

export type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export const EMPTY_SHIPMENT: Partial<ShipmentFormValues> = {
  request_id: undefined,
  departure_date: new Date().toISOString(),
  arrival_date: null,
  status: 'P',
  observations: null,
};

// Constantes para estados de envío
export const SHIPMENT_STATUS = {
  PENDING: 'P' as const,      // Pendiente
  IN_TRANSIT: 'I' as const,   // En tránsito
  DELIVERED: 'D' as const,    // Entregado
  CANCELLED: 'C' as const,    // Cancelado
};
