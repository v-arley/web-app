import { useState, useMemo } from "react";
import { Play, AlertTriangle, Users, Package } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useExecuteDailyRations, useCheckExistingRations, usePreviewRationGeneration } from "../hooks/useExecuteDailyRations";
import { DEFAULT_RATION_CONFIG } from "../schemas/ration-execution.schema";
import type { RationExecutionFormValues, RationExecutionResult } from "../schemas/ration-execution.schema";

type Props = {
    campId: number;
    rationDate: string;
    onDateChange: (date: string) => void;
    resourceMap: Map<number, string>;
};

export function RationGenerationPanel({ campId, rationDate, onDateChange, resourceMap }: Props) {
    const [isExecuting, setIsExecuting] = useState(false);
    const [result, setResult] = useState<RationExecutionResult | null>(null);
    
    const { execute } = useExecuteDailyRations();
    
    const { data: existingCheck } = useCheckExistingRations(campId, rationDate);
    const { data: preview } = usePreviewRationGeneration(campId, rationDate, !existingCheck?.exists);

    const handleExecute = async () => {
        if (!campId || !rationDate) return;

        setIsExecuting(true);
        setResult(null);

        try {
            const payload: RationExecutionFormValues = {
                camp_id: campId,
                ration_date: rationDate,
                resource_config: DEFAULT_RATION_CONFIG,
            };

            const executionResult = await execute.mutateAsync(payload);
            setResult(executionResult);
        } catch (error) {
            console.error("Error al generar raciones:", error);
        } finally {
            setIsExecuting(false);
        }
    };

    const hasInsufficientStock = result && result.insufficient_stock.length > 0;

    return (
        <div className="space-y-5">
            {/* Selector de fecha */}
            <div className="bg-bg-secondary border border-border-default p-5">
                <label className="block font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-2">
                    Fecha de Raciones
                </label>
                <input
                    type="date"
                    value={rationDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-default text-txt-primary font-mono text-sm rounded focus:outline-none focus:border-border-focus"
                />
            </div>

            {/* Vista Previa */}
            {preview && !existingCheck?.exists && (
                <div className="bg-bg-secondary border border-border-default p-5">
                    <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-3">
                        Vista Previa
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-accent-primary" />
                            <span className="font-mono text-xs text-txt-primary">
                                {preview.total_persons} Personas
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-accent-secondary" />
                            <span className="font-mono text-xs text-txt-primary">
                                {preview.resources_needed.length} Tipos de Recursos
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="font-mono text-[10px] text-txt-disabled uppercase tracking-widest">
                            Recursos Necesarios:
                        </div>
                        {preview.resources_needed.map((resource) => (
                            <div key={resource.resource_id} className="flex justify-between font-mono text-xs text-txt-secondary">
                                <span>{resourceMap.get(resource.resource_id) || `ID ${resource.resource_id}`}</span>
                                <span className="text-txt-primary font-bold">{resource.total_amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Advertencia si ya existen raciones */}
            {existingCheck?.exists && (
                <div className="bg-status-warning/10 border border-status-warning p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                    <div>
                        <div className="font-mono text-xs font-bold text-status-warning">
                            Ya existen {existingCheck.count} raciones para esta fecha
                        </div>
                        <div className="font-mono text-[10px] text-txt-secondary mt-1">
                            Selecciona otra fecha para generar nuevas raciones
                        </div>
                    </div>
                </div>
            )}

            {/* Resultado de ejecución */}
            {result && (
                <div className={`border p-4 ${result.success && !hasInsufficientStock ? 'bg-status-success/10 border-status-success' : 'bg-status-error/10 border-status-error'}`}>
                    <div className="font-mono text-xs font-bold mb-2">
                        {result.success && !hasInsufficientStock ? '✓ Generación Exitosa' : '✗ Error en Generación'}
                    </div>
                    <div className="space-y-1 font-mono text-[10px] text-txt-secondary">
                        <div>Raciones creadas: {result.total_rations}</div>
                        <div>Recursos asignados: {result.total_resources_assigned}</div>
                        {result.total_errors > 0 && <div className="text-status-error">Errores: {result.total_errors}</div>}
                    </div>

                    {hasInsufficientStock && (
                        <div className="mt-3 pt-3 border-t border-status-error/30">
                            <div className="font-mono text-[10px] font-bold text-status-error mb-2 uppercase tracking-widest">
                                Inventario Insuficiente:
                            </div>
                            {result.insufficient_stock.map((item) => (
                                <div key={item.resource_id} className="font-mono text-[10px] text-txt-secondary">
                                    {item.resource_name}: Necesario {item.required}, Disponible {item.available}
                                </div>
                            ))}
                        </div>
                    )}

                    {result.errors.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-status-error/30">
                            <div className="font-mono text-[10px] font-bold text-status-error mb-2">
                                Errores:
                            </div>
                            {result.errors.map((error, idx) => (
                                <div key={idx} className="font-mono text-[10px] text-txt-secondary">
                                    • {error}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Botón de ejecución */}
            <Button
                onClick={handleExecute}
                disabled={isExecuting || !campId || !rationDate || existingCheck?.exists}
                className="w-full"
            >
                <Play className="w-4 h-4 mr-2" />
                {isExecuting ? 'Generando Raciones...' : 'Generar Raciones del Día'}
            </Button>
        </div>
    );
}
