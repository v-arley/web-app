import { z } from 'zod';

// Schema para configuración de recursos por defecto
export const rationConfigSchema = z.object({
  resource_id: z.number(),
  amount: z.number().min(1),
});

export type RationConfigFormValues = z.infer<typeof rationConfigSchema>;

export const rationExecutionModeSchema = z.enum(['automatic', 'manual']);

export type RationExecutionMode = z.infer<typeof rationExecutionModeSchema>;

// Schema para la ejecución de generación de raciones
export const rationExecutionSchema = z.object({
  camp_id: z.number({ message: 'El campamento es requerido' }),
  ration_date: z.string({ message: 'La fecha es requerida' }),
  resource_config: z.array(rationConfigSchema).min(1, 'Debe configurar al menos un recurso'),
  execution_mode: rationExecutionModeSchema.default('automatic'),
  person_ids: z.array(z.number()).optional(),
});

export type RationExecutionFormValues = z.infer<typeof rationExecutionSchema>;

// Schema para el resultado de la ejecución
export const rationExecutionResultSchema = z.object({
  success: z.boolean(),
  total_rations: z.number(),
  total_resources_assigned: z.number(),
  total_errors: z.number(),
  insufficient_stock: z.array(z.object({
    resource_id: z.number(),
    resource_name: z.string(),
    required: z.number(),
    available: z.number(),
  })),
  errors: z.array(z.string()),
  rations_created: z.array(z.number()).optional(),
});

export type RationExecutionResult = z.infer<typeof rationExecutionResultSchema>;

// Configuración por defecto: 5L agua + 1 ración de combate
export const DEFAULT_RATION_CONFIG: RationConfigFormValues[] = [
  { resource_id: 1, amount: 5 },  // Agua Potable
  { resource_id: 2, amount: 1 },  // Raciones de Combate
];
