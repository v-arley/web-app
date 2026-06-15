import { useEffect, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Clock, Play, RefreshCw, Users } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useCheckExistingRations, useExecuteDailyRations, usePreviewRationGeneration } from "../hooks/useExecuteDailyRations";
import { useCompletePendingRations, useDailySummaryQuery } from "../hooks/useDailySummaryQuery";
import { DEFAULT_RATION_CONFIG } from "../schemas/ration-execution.schema";
import type { RationExecutionFormValues } from "../schemas/ration-execution.schema";
import { useToast } from "../../../../shared/hooks/useToast";

type Props = {
    campId: number;
    rationDate: string;
    onDateChange: (date: string) => void;
    resourceMap: Map<number, string>;
};

export function RationGenerationPanel({ campId, rationDate, onDateChange, resourceMap }: Props) {
    const { toast } = useToast();
    const latestManualDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const timezoneOffset = date.getTimezoneOffset() * 60_000;
        return new Date(date.getTime() - timezoneOffset).toISOString().split("T")[0];
    }, []);
    const { execute } = useExecuteDailyRations();
    const complete = useCompletePendingRations(campId);
    const { data: existingCheck } = useCheckExistingRations(campId, rationDate);
    const { data: dailySummary } = useDailySummaryQuery(campId, { date: rationDate, page: 1, limit: 1 });
    const { data: preview } = usePreviewRationGeneration(campId, rationDate);

    const existingCount = existingCheck?.count ?? 0;
    const personsNeedingRation = Math.max(0, (preview?.total_persons ?? 0) - existingCount);
    const hasExistingRations = existingCount > 0;
    const pendingRations = dailySummary?.pending ?? 0;
    const hasPendingRations = pendingRations > 0;

    useEffect(() => {
        if (rationDate > latestManualDate) {
            onDateChange(latestManualDate);
        }
    }, [latestManualDate, onDateChange, rationDate]);

    const handleExecute = async () => {
        if (!campId || !rationDate) return;

        try {
            const payload: RationExecutionFormValues = {
                camp_id: campId,
                ration_date: rationDate,
                resource_config: DEFAULT_RATION_CONFIG,
            };

            const result = await execute.mutateAsync(payload);

            if (!result.success) {
                toast({
                    tone: "error",
                    title: "Error al generar raciones",
                    message: result.errors[0] ?? "No se pudieron generar las raciones.",
                    duration: 6000,
                });
                return;
            }

            const newlyCreated = result.newly_created_rations ?? 0;
            const pending = result.pending_rations ?? 0;

            if (newlyCreated === 0) {
                toast({
                    tone: "info",
                    title: "Sin cambios",
                    message: `Todas las ${existingCount} personas ya tenían ración para esta fecha.`,
                });
                return;
            }

            if (pending > 0) {
                toast({
                    tone: "warning",
                    title: "Generación parcial",
                    message: `${result.delivered_rations ?? 0} raciones entregadas. ${pending} quedaron pendientes por stock insuficiente.`,
                    duration: 7000,
                });
            } else {
                toast({
                    tone: "success",
                    title: "Raciones generadas",
                    message: `${newlyCreated} raciones generadas y confirmadas correctamente.`,
                });
            }
        } catch (error) {
            toast({
                tone: "error",
                title: "Error",
                message: error instanceof Error ? error.message : "Error inesperado al generar raciones.",
                duration: 6000,
            });
        }
    };

    const handleCompletePending = async () => {
        if (!campId || !rationDate) return;

        try {
            const result = await complete.mutateAsync(rationDate);

            if (result.completed_now === 0) {
                toast({
                    tone: "warning",
                    title: "Stock insuficiente",
                    message: `No hay stock suficiente para completar las raciones pendientes. Siguen pendientes: ${result.still_pending}.`,
                    duration: 6000,
                });
            } else {
                toast({
                    tone: "success",
                    title: "Raciones completadas",
                    message: result.still_pending > 0
                        ? `${result.completed_now} completadas. ${result.still_pending} siguen pendientes por stock.`
                        : `${result.completed_now} raciones pendientes completadas correctamente.`,
                });
            }
        } catch (error) {
            toast({
                tone: "error",
                title: "Error",
                message: error instanceof Error ? error.message : "Error inesperado al completar raciones.",
                duration: 6000,
            });
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
                    max={latestManualDate}
                    onChange={(event) => onDateChange(event.target.value)}
                    className="app-input w-full text-[11px]!"
                />
            </div>

            <div className="border border-border-default bg-bg-secondary p-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-txt-disabled">
                    Automatic generation and confirmation
                </div>
                <p className="mt-3 font-mono text-[10px] leading-relaxed text-txt-secondary">
                    Generates rations only for active persons who do not yet have one for the selected date. Rations are confirmed immediately for those covered by available stock; the rest are left pending.
                </p>
            </div>

            {preview && (
                <div className="border border-border-default bg-bg-secondary p-5">
                    <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-txt-disabled">
                        Preview
                    </div>
                    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-accent-primary" />
                            <span className="font-mono text-xs text-txt-primary">{preview.total_persons} total</span>
                        </div>
                        {existingCount > 0 && (
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-status-success" />
                                <span className="font-mono text-xs text-txt-secondary">{existingCount} already assigned</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-accent-secondary" />
                            <span className="font-mono text-xs text-txt-primary font-bold">{personsNeedingRation} pending</span>
                        </div>
                    </div>
                    {personsNeedingRation > 0 && (
                        <div className="space-y-2">
                            <div className="font-mono text-[10px] uppercase tracking-widest text-txt-disabled">
                                Resources required ({personsNeedingRation} persons)
                            </div>
                            {preview.resources_needed.map((resource) => (
                                <div key={resource.resource_id} className="flex flex-wrap justify-between gap-2 font-mono text-xs text-txt-secondary">
                                    <span className="min-w-0 wrap-break-word">{resourceMap.get(resource.resource_id) || `ID ${resource.resource_id}`}</span>
                                    <span className="font-bold text-txt-primary">
                                        {Math.round((resource.total_amount / preview.total_persons) * personsNeedingRation)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {personsNeedingRation === 0 && existingCount > 0 && (
                        <div className="flex items-center gap-2 text-status-success">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-mono text-xs">All persons have rations for this date.</span>
                        </div>
                    )}
                </div>
            )}

            {hasPendingRations && (
                <div className="flex items-start gap-3 border border-status-warning bg-status-warning/10 p-4">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" />
                    <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs font-bold text-status-warning">
                            {pendingRations} pending ration{pendingRations !== 1 ? "s" : ""} for this date
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-txt-secondary">
                            Replenish stock and use "Complete Pending" to deliver already-created pending rations.
                        </div>
                    </div>
                </div>
            )}

            {hasExistingRations && !hasPendingRations && (
                <div className="flex items-start gap-3 border border-border-default bg-bg-secondary p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                    <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs font-bold text-txt-primary">
                            {existingCount} rations already exist for this date
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-txt-secondary">
                            Only the {personsNeedingRation} person{personsNeedingRation !== 1 ? "s" : ""} without a ration will be processed.
                        </div>
                    </div>
                </div>
            )}

            <Button
                onClick={handleExecute}
                disabled={execute.isPending || !campId || !rationDate || personsNeedingRation === 0}
                className="w-full"
            >
                <Play className="mr-2 h-4 w-4" />
                {execute.isPending ? "Generating..." : personsNeedingRation === 0 ? "All rations generated" : `Generate Rations (${personsNeedingRation} persons)`}
            </Button>

            {hasPendingRations && (
                <Button
                    variant="outline"
                    onClick={handleCompletePending}
                    disabled={complete.isPending || !campId || !rationDate}
                    className="w-full"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${complete.isPending ? "animate-spin" : ""}`} />
                    {complete.isPending ? "Completing..." : "Complete Pending Rations"}
                </Button>
            )}
        </div>
    );
}
