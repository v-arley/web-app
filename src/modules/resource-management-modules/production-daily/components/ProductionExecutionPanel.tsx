import { Play, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { ProductionExecutionFormValues, ProductionExecutionResult } from "../schemas/production-execution.schema";

type Props = {
    campId: number;
    warehouseOptions: { id: number; label: string }[];
    onExecute: (data: ProductionExecutionFormValues) => Promise<ProductionExecutionResult>;
};

export function ProductionExecutionPanel({ campId, warehouseOptions, onExecute }: Props) {
    const [selectedWarehouse, setSelectedWarehouse] = useState(0);
    const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);
    const [forceExecution, setForceExecution] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [result, setResult] = useState<ProductionExecutionResult | null>(null);

    const handleExecute = async () => {
        if (selectedWarehouse === 0) return;

        setIsExecuting(true);
        setResult(null);

        try {
            const data: ProductionExecutionFormValues = {
                camp_id: campId,
                warehouse_id: selectedWarehouse,
                production_date: productionDate,
                force_execution: forceExecution,
            };

            const executionResult = await onExecute(data);
            setResult(executionResult);
        } catch (error) {
            console.error('Error ejecutando producción:', error);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-bg-secondary border border-border-default">
                <div className="px-5 py-4 border-b border-border-default bg-bg-secondary/50">
                    <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-label">
                        Execute Daily Production
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-status-critical">
                                Warehouse Main
                        </span>
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
                            className="bg-bg-tertiary border border-border-default px-3 py-2.5 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all w-full"
                        >
                            <option value={0}>[ SELECT WAREHOUSE ]</option>
                            {warehouseOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-status-critical">
                            Production Date
                        </span>
                        <input
                            type="date"
                            value={productionDate}
                            onChange={(e) => setProductionDate(e.target.value)}
                            className="bg-bg-tertiary border border-border-default px-3 py-2.5 font-mono text-xs text-txt-primary focus:border-accent outline-none transition-all w-full"
                        />
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={forceExecution}
                            onChange={(e) => setForceExecution(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-txt-secondary">
                            Force Execution (if already exists)
                        </span>
                    </label>

                    <button
                        onClick={handleExecute}
                        disabled={isExecuting || selectedWarehouse === 0}
                        className="w-full flex items-center justify-center gap-2 bg-accent border border-accent px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-bg-primary hover:bg-accent/90 transition-all disabled:opacity-50"
                    >
                        <Play className="w-4 h-4" />
                        {isExecuting ? "Executing..." : "Execute Production"}
                    </button>
                </div>
            </div>

            {result && (
                <div className={`bg-bg-secondary border ${result.success ? 'border-status-ok' : 'border-status-critical'}`}>
                    <div className={`px-5 py-4 border-b ${result.success ? 'border-status-ok bg-status-ok/10' : 'border-status-critical bg-status-critical/10'}`}>
                        <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-label">
                            {result.success ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-status-ok" />
                                    <span className="text-status-ok">Successful Execution</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 text-status-critical" />
                                    <span className="text-status-critical">Execution with Errors</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                            <div>
                                <div className="text-txt-disabled text-[10px] uppercase tracking-widest">Persons</div>
                                <div className="text-txt-primary font-bold text-lg">{result.total_persons}</div>
                            </div>
                            <div>
                                <div className="text-txt-disabled text-[10px] uppercase tracking-widest">Productions</div>
                                <div className="text-status-ok font-bold text-lg">{result.total_productions}</div>
                            </div>
                            <div>
                                <div className="text-txt-disabled text-[10px] uppercase tracking-widest">Errors</div>
                                <div className="text-status-critical font-bold text-lg">{result.total_errors}</div>
                            </div>
                        </div>

                        {result.productions.length > 0 && (
                            <div className="mt-4">
                                <div className="text-[10px] font-mono font-bold text-txt-disabled uppercase tracking-widest mb-2">
                                    Registered Productions
                                </div>
                                <div className="bg-bg-tertiary border border-border-default divide-y divide-border-default max-h-64 overflow-y-auto">
                                    {result.productions.map((prod, idx) => (
                                        <div key={idx} className="px-3 py-2 flex justify-between text-[11px] font-mono">
                                            <span className="text-txt-primary">{prod.person_name}</span>
                                            <span className="text-txt-secondary">
                                                {prod.resource_name}: <strong className="text-txt-primary">{prod.amount}</strong>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.errors && result.errors.length > 0 && (
                            <div className="mt-4">
                                <div className="text-[10px] font-mono font-bold text-status-critical uppercase tracking-widest mb-2">
                                    Found Errors
                                </div>
                                <div className="bg-status-critical/10 border border-status-critical divide-y divide-status-critical/30">
                                    {result.errors.map((err, idx) => (
                                        <div key={idx} className="px-3 py-2 text-[11px] font-mono text-status-critical">
                                            <strong>{err.person_name}:</strong> {err.error}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
