import { z } from 'zod';

// Schema de validación para raciones diarias
export const rationSchema = z.object({
  id: z.number().optional(),
  person_id: z.number({ message: 'La persona es requerida' }),
  camp_id: z.number({ message: 'El campamento es requerido' }),
  completed: z.enum(['Y', 'N'], { message: 'El estado de entrega es requerido' }),
  ration_date: z.string({ message: 'La fecha de la ración es requerida' }),
  notes: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

export type RationFormValues = z.infer<typeof rationSchema>;

export const EMPTY_RATION: Partial<RationFormValues> = {
  person_id: undefined,
  camp_id: undefined,
  completed: 'N',
  ration_date: new Date().toISOString().split('T')[0],
  notes: null,
};
