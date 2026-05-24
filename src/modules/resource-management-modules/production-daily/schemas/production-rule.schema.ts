import { z } from 'zod';

// Schema de validación para reglas de producción
export const productionRuleSchema = z.object({
  id: z.number().optional(),
  camp_id: z.number({ message: 'El campamento es requerido' }),
  profession_id: z.number({ message: 'La profesión es requerida' }),
  resource_id: z.number({ message: 'El recurso es requerido' }),
  expected_amount: z.number({ message: 'La cantidad esperada es requerida' })
    .positive('La cantidad debe ser mayor a cero'),
  effective_date: z.string({ message: 'La fecha de inicio es requerida' }),
  end_date: z.string().nullable().optional(),
  state: z.enum(['A', 'I']).default('A'),
});

export const EMPTY_PRODUCTION_RULE = {
  camp_id: 0,
  profession_id: 0,
  resource_id: 0,
  expected_amount: 0,
  effective_date: new Date().toISOString().split('T')[0],
  end_date: null,
  state: 'A' as const,
} satisfies z.input<typeof productionRuleSchema>;

export type ProductionRuleFormInput = z.input<typeof productionRuleSchema>;
export type ProductionRuleFormValues = z.infer<typeof productionRuleSchema>;
