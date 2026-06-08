import { useState } from "react";
import { AlertTriangle, Package, Play, Users } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useCheckExistingRations, useExecuteDailyRations, usePreviewRationGeneration } from "../hooks/useExecuteDailyRations";
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
    const today = new Date().toISOString().split("T")[0];
    const { execute } = useExecuteDailyRations();
    const { data: existingCheck } = useCheckExistingRations(campId, rationDate);
    const { data: preview } = usePreviewRationGeneration(campId, rationDate, !existingCheck?.exists);

    const shouldBlockForExisting = Boolean(existingCheck?.exists);
    const hasInsufficientStock = Boolean(result && result.insufficient_stock.length > 0);

    const handleExecute = async () => {
        if (!campId || !rationDate || shouldBlockForExisting) return;

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
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="border border-border-default bg-bg-secondary p-5">
                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-txt-disabled">
                    Date of rations
                </label>
                <input
                    type="date"
                    value={rationDate}
                    min={today}
                    max={today}
                    onChange={(event) => onDateChange(event.target.value)}
                    className="rmm-input w-full text-[11px]!"
                />
            </div>

            <div className="border border-border-default bg-bg-secondary p-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-txt-disabled">
                    Automatic assignment
                </div>
                <p className="mt-3 font-mono text-[10px] leading-relaxed text-txt-secondary">
                    Creates one ration for every active person in the camp, assigns default resources, and deducts inventory in one server operation.
                </p>
            </div>

            {preview && !shouldBlockForExisting && (
                <div className="border border-border-default bg-bg-secondary p-5">
                    <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-txt-disabled">
                        Preview
                    </div>
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-accent-primary" />
                            <span className="font-mono text-xs text-txt-primary">{preview.total_persons} Persons</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-accent-secondary" />
                            <span className="font-mono text-xs text-txt-primary">{preview.resources_needed.length} Resource types</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">
                            Required resources
                        </div>
                        {preview.resources_needed.map((resource) => (
                            <div key={resource.resource_id} className="flex flex-wrap justify-between gap-2 font-mono text-xs text-txt-secondary">
                                <span className="min-w-0 break-words">{resourceMap.get(resource.resource_id) || `ID ${resource.resource_id}`}</span>
                                <span className="font-bold text-txt-primary">{resource.total_amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {shouldBlockForExisting && (
                <div className="flex items-start gap-3 border border-status-warning bg-status-warning/10 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-warning" />
                    <div>
                        <div className="font-mono text-xs font-bold text-status-warning">
                            There are already {existingCheck?.count ?? 0} rations for this date
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-txt-secondary">
                            Automatic generation is available once per camp and date.
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div className={`border p-4 ${result.success && !hasInsufficientStock ? "border-status-success bg-status-success/10" : "border-status-error bg-status-error/10"}`}>
                    <div className="mb-2 font-mono text-xs font-bold">
                        {result.success && !hasInsufficientStock ? "Generation successful" : "Generation failed"}
                    </div>
                    <div className="space-y-1 font-mono text-[10px] text-txt-secondary">
                        <div>Rations created: {result.total_rations}</div>
                        <div>Resources assigned: {result.total_resources_assigned}</div>
                        {result.total_errors > 0 && <div className="text-status-error">Errors: {result.total_errors}</div>}
                    </div>

                    {hasInsufficientStock && (
                        <div className="mt-3 border-t border-status-error/30 pt-3">
                            <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-status-error">
                                Insufficient inventory
                            </div>
                            {result.insufficient_stock.map((item) => (
                                <div key={item.resource_id} className="font-mono text-[10px] text-txt-secondary">
                                    {item.resource_name}: Required {item.required}, Available {item.available}
                                </div>
                            ))}
                        </div>
                    )}

                    {result.errors.length > 0 && (
                        <div className="mt-3 border-t border-status-error/30 pt-3">
                            <div className="mb-2 font-mono text-[10px] font-bold text-status-error">Errors</div>
                            {result.errors.map((error, index) => (
                                <div key={`${error}-${index}`} className="font-mono text-[10px] text-txt-secondary">
                                    - {error}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Button
                onClick={handleExecute}
                disabled={isExecuting || !campId || !rationDate || shouldBlockForExisting}
                className="w-full"
            >
                <Play className="mr-2 h-4 w-4" />
                {isExecuting ? "Generating Rations..." : "Generate Daily Rations"}
            </Button>
        </div>
    );
}
