import { z } from 'zod';

// Schema de validación para registros de producción
export const productionRecordSchema = z.object({
  id: z.number().optional(),
  person_id: z.number({ message: 'La persona es requerida' }),
  warehouse_id: z.number({ message: 'La bodega es requerida' }),
  resource_id: z.number({ message: 'El recurso es requerido' }),
  amount: z.number({ message: 'La cantidad es requerida' })
    .min(1, 'La cantidad debe ser mayor a 0'),
  production_date: z.string({ message: 'La fecha de producción es requerida' }),
  notes: z.string().nullable().optional(),
  created_by: z.number().optional(),
});

export type ProductionRecordFormValues = z.infer<typeof productionRecordSchema>;

export const EMPTY_PRODUCTION_RECORD: Partial<ProductionRecordFormValues> = {
  person_id: undefined,
  warehouse_id: undefined,
  resource_id: undefined,
  amount: undefined,
  production_date: new Date().toISOString().split('T')[0],
  notes: null,
};
