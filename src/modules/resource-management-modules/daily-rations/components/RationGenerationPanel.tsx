import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, AlertTriangle, Users, Package, CheckSquare, Square } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useExecuteDailyRations, useCheckExistingRations, usePreviewRationGeneration } from "../hooks/useExecuteDailyRations";
import { DEFAULT_RATION_CONFIG } from "../schemas/ration-execution.schema";
import type { RationExecutionFormValues, RationExecutionMode, RationExecutionResult } from "../schemas/ration-execution.schema";
import { PersonService } from "../../../../services/PersonService";

const personService = new PersonService();

type Props = {
    campId: number;
    rationDate: string;
    onDateChange: (date: string) => void;
    resourceMap: Map<number, string>;
};

export function RationGenerationPanel({ campId, rationDate, onDateChange, resourceMap }: Props) {
    const [isExecuting, setIsExecuting] = useState(false);
    const [result, setResult] = useState<RationExecutionResult | null>(null);
    const [executionMode, setExecutionMode] = useState<RationExecutionMode>("automatic");
    const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);
    const today = new Date().toISOString().split("T")[0];
    
    const { execute } = useExecuteDailyRations();

    const manualPersonIds = useMemo(
        () => executionMode === "manual" ? selectedPersonIds : [],
        [executionMode, selectedPersonIds],
    );
    
    const { data: existingCheck } = useCheckExistingRations(campId, rationDate, executionMode, manualPersonIds);
    const shouldLoadPreview = executionMode === "automatic"
        ? !existingCheck?.exists
        : selectedPersonIds.length > 0;
    const { data: preview } = usePreviewRationGeneration(
        campId,
        rationDate,
        executionMode,
        manualPersonIds,
        shouldLoadPreview,
    );

    const { data: peopleData } = useQuery({
        queryKey: ["persons", campId, "ration-generation"],
        queryFn: async () => {
            const response = await personService.findAll();
            const people = response.getResultado<Array<{ id: number; name: string; last_name?: string; surname?: string; camp_id?: number; state?: string }>>("registros") ?? [];
            return people.filter((person) => person.camp_id === campId && (person.state ?? "A") === "A");
        },
        enabled: campId > 0,
    });

    const manualPeople = peopleData ?? [];
    const isManualWithoutSelection = executionMode === "manual" && selectedPersonIds.length === 0;
    const shouldBlockForExisting = executionMode === "automatic" && existingCheck?.exists;

    const handleExecute = async () => {
        if (!campId || !rationDate || isManualWithoutSelection) return;

        setIsExecuting(true);
        setResult(null);

        try {
            const payload: RationExecutionFormValues = {
                camp_id: campId,
                ration_date: rationDate,
                resource_config: DEFAULT_RATION_CONFIG,
                execution_mode: executionMode,
                person_ids: executionMode === "manual" ? selectedPersonIds : undefined,
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

    const togglePerson = (personId: number) => {
        setSelectedPersonIds((current) =>
            current.includes(personId)
                ? current.filter((id) => id !== personId)
                : [...current, personId],
        );
    };

    const selectAllManualPeople = () => {
        setSelectedPersonIds(manualPeople.map((person) => person.id));
    };

    const clearManualPeople = () => {
        setSelectedPersonIds([]);
    };

    return (
        <div className="space-y-5">
            {/* Selector de fecha */}
            <div className="bg-bg-secondary border border-border-default p-5">
                <label className="block font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-2">
                    Date of Rations
                </label>
                <input
                    type="date"
                    value={rationDate}
                    min={today}
                    max={today}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="rmm-input w-full text-[11px]!"
                />
            </div>

            <div className="bg-bg-secondary border border-border-default p-5">
                <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-3">
                    Assignment Mode
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setExecutionMode("automatic")}
                        className={`rmm-btn justify-center border text-[10px] ${
                            executionMode === "automatic"
                                ? "border-accent bg-accent/15 text-accent"
                                : "border-border-default bg-bg-tertiary text-txt-secondary hover:text-txt-primary"
                        }`}
                    >
                        Automatic
                    </button>
                    <button
                        type="button"
                        onClick={() => setExecutionMode("manual")}
                        className={`rmm-btn justify-center border text-[10px] ${
                            executionMode === "manual"
                                ? "border-accent bg-accent/15 text-accent"
                                : "border-border-default bg-bg-tertiary text-txt-secondary hover:text-txt-primary"
                        }`}
                    >
                        Manual
                    </button>
                </div>
                <p className="font-mono text-[10px] text-txt-disabled mt-3 leading-relaxed">
                    {executionMode === "automatic"
                        ? "Creates one ration for every active person in the camp."
                        : "Creates rations only for selected people. Duplicates for the same person and day must remain blocked by the server."}
                </p>
            </div>

            {executionMode === "manual" && (
                <div className="bg-bg-secondary border border-border-default p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            People
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={selectAllManualPeople}
                                className="font-mono text-[10px] text-accent hover:text-txt-primary uppercase"
                            >
                                Select all
                            </button>
                            <button
                                type="button"
                                onClick={clearManualPeople}
                                className="font-mono text-[10px] text-txt-muted hover:text-txt-primary uppercase"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="max-h-44 overflow-y-auto border border-border-default bg-bg-primary/30">
                        {manualPeople.length === 0 ? (
                            <div className="p-4 font-mono text-[10px] text-txt-disabled uppercase tracking-widest">
                                No active people available for this camp
                            </div>
                        ) : (
                            manualPeople.map((person) => {
                                const selected = selectedPersonIds.includes(person.id);
                                const name = `${person.name} ${person.last_name ?? person.surname ?? ""}`.trim();

                                return (
                                    <button
                                        key={person.id}
                                        type="button"
                                        onClick={() => togglePerson(person.id)}
                                        className={`flex w-full items-center gap-3 border-b border-border-default px-3 py-2 text-left font-mono text-[11px] transition-colors last:border-b-0 ${
                                            selected ? "bg-accent/10 text-txt-primary" : "text-txt-secondary hover:bg-bg-tertiary"
                                        }`}
                                    >
                                        {selected ? (
                                            <CheckSquare size={14} className="text-accent shrink-0" />
                                        ) : (
                                            <Square size={14} className="text-txt-disabled shrink-0" />
                                        )}
                                        <span className="min-w-0 truncate">{name || `Person ${person.id}`}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-3 font-mono text-[10px] text-txt-muted uppercase tracking-widest">
                        Selected: {selectedPersonIds.length}
                    </div>
                </div>
            )}

            {/* Vista Previa */}
            {preview && (executionMode === "manual" || !existingCheck?.exists) && (
                <div className="bg-bg-secondary border border-border-default p-5">
                    <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-3">
                        Preview
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-accent-primary" />
                            <span className="font-mono text-xs text-txt-primary">
                                {preview.total_persons} Persons
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-accent-secondary" />
                            <span className="font-mono text-xs text-txt-primary">
                                {preview.resources_needed.length} Types of Resources
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="font-mono text-[10px] text-txt-disabled uppercase tracking-widest">
                            Required Resources:
                        </div>
                        {preview.resources_needed.map((resource) => (
                            <div key={resource.resource_id} className="flex flex-wrap justify-between gap-2 font-mono text-xs text-txt-secondary">
                                <span className="min-w-0 break-words">{resourceMap.get(resource.resource_id) || `ID ${resource.resource_id}`}</span>
                                <span className="text-txt-primary font-bold">{resource.total_amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Warning if rations already exist */}
            {shouldBlockForExisting && (
                <div className="bg-status-warning/10 border border-status-warning p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                    <div>
                        <div className="font-mono text-xs font-bold text-status-warning">
                            There are already {existingCheck.count} rations available for this date
                        </div>
                        <div className="font-mono text-[10px] text-txt-secondary mt-1">
                            Select another date to generate new rations
                        </div>
                    </div>
                </div>
            )}

            {executionMode === "manual" && existingCheck?.exists && (
                <div className="bg-status-warning/10 border border-status-warning p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                    <div>
                        <div className="font-mono text-xs font-bold text-status-warning">
                            {existingCheck.count} rations already exist for this date
                        </div>
                        <div className="font-mono text-[10px] text-txt-secondary mt-1">
                            Manual assignment can continue only for people without an existing ration.
                        </div>
                    </div>
                </div>
            )}

            {/* Resultado de ejecución */}
            {result && (
                <div className={`border p-4 ${result.success && !hasInsufficientStock ? 'bg-status-success/10 border-status-success' : 'bg-status-error/10 border-status-error'}`}>
                    <div className="font-mono text-xs font-bold mb-2">
                        {result.success && !hasInsufficientStock ? 'Generation successful' : 'Generation failed'}
                    </div>
                    <div className="space-y-1 font-mono text-[10px] text-txt-secondary">
                        <div>Rations created: {result.total_rations}</div>
                        <div>Resources assigned: {result.total_resources_assigned}</div>
                        {result.total_errors > 0 && <div className="text-status-error">Errors: {result.total_errors}</div>}
                    </div>

                    {hasInsufficientStock && (
                        <div className="mt-3 pt-3 border-t border-status-error/30">
                            <div className="font-mono text-[10px] font-bold text-status-error mb-2 uppercase tracking-widest">
                                Insufficient Inventory:
                            </div>
                            {result.insufficient_stock.map((item) => (
                                <div key={item.resource_id} className="font-mono text-[10px] text-txt-secondary">
                                    {item.resource_name}: Required {item.required}, Available {item.available}
                                </div>
                            ))}
                        </div>
                    )}

                    {result.errors.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-status-error/30">
                            <div className="font-mono text-[10px] font-bold text-status-error mb-2">
                                Errors:
                            </div>
                            {result.errors.map((error, idx) => (
                                <div key={idx} className="font-mono text-[10px] text-txt-secondary">
                                    - {error}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Botón de ejecución */}
            <Button
                onClick={handleExecute}
                disabled={isExecuting || !campId || !rationDate || isManualWithoutSelection || shouldBlockForExisting}
                className="w-full"
            >
                <Play className="w-4 h-4 mr-2" />
                {isExecuting ? 'Generating Rations...' : 'Generate Daily Rations'}
            </Button>
        </div>
    );
}
