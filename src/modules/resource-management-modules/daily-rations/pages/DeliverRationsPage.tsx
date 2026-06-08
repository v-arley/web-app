import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { PersonService } from "../../../../services/PersonService";
import { useRationsQuery } from "../hooks/useRationsQuery";
import { useRationMutation } from "../hooks/useRationMutation";
import { RationsTable } from "../components/RationsTable";
import { RationResourcesDetail } from "../components/RationResourcesDetail";
import { CheckCircle2, Package } from "lucide-react";
import PaginationFooter from "../../shared/components/PaginationFooter";
import { useToast } from "../../../../shared/hooks/useToast";
import CollapsibleSidePanel, { CollapsiblePanelHeader, getInitialSidePanelOpenState } from "../../shared/components/CollapsibleSidePanel";

const personService = new PersonService();

export function DeliverRationsPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const [statusFilter, setStatusFilter] = useState<'Y' | 'N' | ''>('');
    const [selectedRationId, setSelectedRationId] = useState<number | null>(null);
    const [deliveryNotes, setDeliveryNotes] = useState("");
    const [page, setPage] = useState(1);
    const [isDetailOpen, setIsDetailOpen] = useState(getInitialSidePanelOpenState);
    const pageSize = 20;
    const { toast } = useToast();
    const rationMutation = useRationMutation();

    // Obtener raciones
    const { data: rationsResult, isLoading: isLoadingRations } = useRationsQuery(
        campId,
        {
            completed: statusFilter || undefined,
            page,
            limit: pageSize,
        }
    );
    const rations = rationsResult?.items ?? [];
    const pagination = rationsResult?.pagination ?? { page, limit: pageSize, total: 0, totalPages: 1 };
    const facets = rationsResult?.facets;

    // Obtener personas
    const { data: personsData } = useQuery({
        queryKey: ["persons", campId],
        queryFn: async () => {
            const response = await personService.findAll();
            const allPersons = response.getResultado<{ id: number; name: string; camp_id: number }[]>("registros") ?? [];
            return allPersons.filter((p) => p.camp_id === campId);
        },
        enabled: campId > 0,
    });

    const personMap = useMemo(() => {
        return new Map(personsData?.map((p) => [p.id, p.name]) ?? []);
    }, [personsData]);

    const deliveredCount = facets?.delivered ?? (statusFilter === 'Y' ? pagination.total : rations.filter((ration) => ration.completed === 'Y').length);
    const pendingCount = facets?.pending ?? (statusFilter === 'N' ? pagination.total : rations.filter((ration) => ration.completed === 'N').length);
    const totalRecords = facets?.total ?? pagination.total;
    const totalPages = pagination.totalPages;
    const selectedRation = useMemo(
        () => rations.find((ration) => ration.id === selectedRationId) ?? null,
        [rations, selectedRationId],
    );
    const isSavingDelivery = rationMutation.markAsDelivered.isPending;

    useEffect(() => {
        setDeliveryNotes(selectedRation?.notes ?? "");
    }, [selectedRation?.id, selectedRation?.notes]);

    const handleConfirmDelivery = async () => {
        if (!selectedRation?.id) return;

        try {
            await rationMutation.markAsDelivered.mutateAsync({
                id: selectedRation.id,
                notes: deliveryNotes,
            });
            toast({ tone: "success", title: "Ration delivered", message: "Delivery was confirmed by the resource manager." });
        } catch (error) {
            toast({
                tone: "error",
                title: "Delivery failed",
                message: error instanceof Error ? error.message : "Unable to confirm the ration delivery.",
            });
        }
    };

    return (
        <article className="flex flex-1 min-h-0 flex-col rmm-content-pad overflow-hidden bg-transparent">
            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-black/50 backdrop-blur-lg border border-border-default">
                <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-border-default">
                        <header className="rmm-panel-header border-b border-border-default bg-bg-secondary/30 shrink-0">
                            <div className="rmm-panel-title flex-1 min-w-0">
                                <div className="font-mono text-[11px] font-bold text-txt-primary uppercase tracking-wide">
                                    Daily Ration Delivery
                                </div>
                                <p className="font-mono text-[11px] text-txt-muted uppercase tracking-widest mt-0.5">
                                    Select a pending ration to confirm delivery
                                </p>
                            </div>
                            <label className="flex min-w-0 items-center overflow-hidden gap-2 w-full sm:w-56">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-txt-disabled">
                                    Status
                                </span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value as 'Y' | 'N' | '');
                                        setPage(1);
                                        setSelectedRationId(null);
                                        setIsDetailOpen(false);
                                    }}
                                    className="rmm-input min-w-0 text-xs"
                                >
                                    <option value="">All</option>
                                    <option value="Y">Delivered</option>
                                    <option value="N">Pending</option>
                                </select>
                            </label>
                        </header>

                        <div className="grid shrink-0 gap-3 border-b border-border-default p-3 sm:grid-cols-3">
                            <div className="rmm-kpi-card bg-bg-secondary border border-border-default">
                                <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Total Rations</div>
                                <div className="rmm-kpi-value font-mono font-bold text-txt-primary">{totalRecords}</div>
                            </div>
                            <div className="rmm-kpi-card bg-bg-secondary border border-status-success">
                                <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Delivered</div>
                                <div className="rmm-kpi-value font-mono font-bold text-status-success">{deliveredCount}</div>
                            </div>
                            <div className="rmm-kpi-card bg-bg-secondary border border-status-warning">
                                <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Pending</div>
                                <div className="rmm-kpi-value font-mono font-bold text-status-warning">{pendingCount}</div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-3">
                            {isLoadingRations ? (
                                <div className="flex items-center justify-center h-full text-txt-disabled font-mono text-xs">
                                    Loading rations...
                                </div>
                            ) : (
                                <RationsTable
                                    rations={rations}
                                    personMap={personMap}
                                    selectedRationId={selectedRationId}
                                    onRationSelect={(id) => {
                                        setSelectedRationId(id);
                                        if (id) setIsDetailOpen(true);
                                    }}
                                />
                            )}
                        </div>

                        <PaginationFooter
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                            totalRecords={totalRecords}
                        />
                    </div>

                    <CollapsibleSidePanel
                        isOpen={isDetailOpen}
                        label="Ration delivery detail"
                        collapsedLabel="DETAIL"
                        widthClassName="lg:w-90"
                        onOpen={() => setIsDetailOpen(true)}
                        onClose={() => setIsDetailOpen(false)}
                    >
                        <CollapsiblePanelHeader
                            title="Ration Detail"
                            subtitle={selectedRation ? `Ration #${selectedRation.id}` : "Select a ration"}
                            onClose={() => setIsDetailOpen(false)}
                        />
                        <div className="flex-1 overflow-y-auto p-3">
                        {selectedRationId && selectedRation ? (
                            <div className="space-y-4">
                                <RationResourcesDetail rationId={selectedRationId} />

                                <div className="border-t border-border-default pt-4 space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                                            Delivery Control
                                        </span>
                                        <span className={`table-system-badge ${selectedRation.completed === "Y" ? "table-system-badge--online" : "table-system-badge--pending"}`}>
                                            {selectedRation.completed === "Y" ? "DELIVERED" : "PENDING"}
                                        </span>
                                    </div>

                                    <label className="block">
                                        <span className="block font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-2">
                                            Delivery notes
                                        </span>
                                        <textarea
                                            value={deliveryNotes}
                                            onChange={(event) => setDeliveryNotes(event.target.value)}
                                            className="rmm-input min-h-24 w-full resize-none text-[11px]!"
                                            placeholder="Optional operational note"
                                            disabled={isSavingDelivery || selectedRation.completed === "Y"}
                                        />
                                    </label>

                                    {selectedRation.completed === "Y" ? (
                                        <div className="border border-status-success/40 bg-status-success/10 p-3 font-mono text-[10px] uppercase tracking-widest text-status-success">
                                            Delivery has been confirmed and cannot be moved back to pending.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => void handleConfirmDelivery()}
                                                disabled={isSavingDelivery}
                                                className="rmm-btn rmm-btn-accent justify-center disabled:opacity-50"
                                            >
                                                <CheckCircle2 size={13} />
                                                <span className="font-mono text-[10px]">Confirm Delivery</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-txt-disabled">
                                <Package size={20} className="opacity-30" />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-center">
                                    Select a ration to view resources
                                </span>
                            </div>
                        )}
                        </div>
                    </CollapsibleSidePanel>
                </div>
            </div>
        </article>
    );
}
