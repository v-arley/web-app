import { z } from 'zod';

// Schema para ejecutar producción diaria
export const productionExecutionSchema = z.object({
  camp_id: z.number({ message: 'El campamento es requerido' }),
  production_date: z.string({ message: 'La fecha es requerida' }),
  warehouse_id: z.number({ message: 'La bodega principal es requerida' }),
  force_execution: z.boolean().default(false), // Para re-ejecutar si ya existe
});

export type ProductionExecutionFormValues = z.infer<typeof productionExecutionSchema>;

// Respuesta de la ejecución
export interface ProductionExecutionResult {
  success: boolean;
  total_persons: number;
  total_productions: number;
  total_errors: number;
  productions: Array<{
    person_id: number;
    person_name: string;
    resource_id: number;
    resource_name: string;
    amount: number;
    warehouse_id: number;
  }>;
  errors?: Array<{
    person_id: number;
    person_name: string;
    error: string;
  }>;
}
