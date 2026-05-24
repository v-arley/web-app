import { z } from 'zod';

// Schema de validación para recursos en solicitudes
export const requestResourceSchema = z.object({
  id: z.number().optional(),
  request_id: z.number({ message: 'El ID de la solicitud es requerido' }),
  resource_id: z.number({ message: 'El recurso es requerido' }),
  amount: z.number({ message: 'La cantidad es requerida' })
    .min(1, 'La cantidad debe ser mayor a 0'),
});

export type RequestResourceFormValues = z.infer<typeof requestResourceSchema>;

export const EMPTY_REQUEST_RESOURCE: Partial<RequestResourceFormValues> = {
  request_id: undefined,
  resource_id: undefined,
  amount: undefined,
};
