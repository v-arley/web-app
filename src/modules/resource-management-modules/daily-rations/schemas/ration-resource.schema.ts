import { z } from 'zod';

// Schema de validación para recursos en raciones
export const rationResourceSchema = z.object({
  ration_id: z.number({ message: 'El ID de la ración es requerido' }),
  resource_id: z.number({ message: 'El recurso es requerido' }),
  amount: z.number({ message: 'La cantidad es requerida' })
    .min(1, 'La cantidad debe ser mayor a 0'),
});

export type RationResourceFormValues = z.infer<typeof rationResourceSchema>;

export const EMPTY_RATION_RESOURCE: Partial<RationResourceFormValues> = {
  ration_id: undefined,
  resource_id: undefined,
  amount: undefined,
};
