import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
import type { RationFormValues } from "../schemas/ration.schema";

const personService = new PersonService();
const EMPTY_RATIONS: RationFormValues[] = [];

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

    const { data: rationsResult, isLoading: isLoadingRations } = useRationsQuery(
        campId,
        { completed: statusFilter || undefined, page, limit: pageSize },
    );
    const rations = rationsResult?.items ?? EMPTY_RATIONS;
    const pagination = rationsResult?.pagination ?? { page, limit: pageSize, total: 0, totalPages: 1 };
    const facets = rationsResult?.facets;

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

    const deliveredCount = facets?.delivered ?? (statusFilter === 'Y' ? pagination.total : rations.filter((r) => r.completed === 'Y').length);
    const pendingCount   = facets?.pending   ?? (statusFilter === 'N' ? pagination.total : rations.filter((r) => r.completed === 'N').length);
    const totalRecords   = facets?.total ?? pagination.total;
    const totalPages     = pagination.totalPages;
    const selectedRation = useMemo(
        () => rations.find((r) => r.id === selectedRationId) ?? null,
        [rations, selectedRationId],
    );
    const isSavingDelivery = rationMutation.markAsDelivered.isPending;

    const handleConfirmDelivery = async () => {
        if (!selectedRation?.id) return;
        try {
            await rationMutation.markAsDelivered.mutateAsync({ id: selectedRation.id, notes: deliveryNotes });
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
        <article className="app-content-body">
            <div className="app-split app-split--glass">
                <div className="app-split__inner">
                    <div className="app-split__main">
                        <header className="app-panel-header">
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="app-panel-title">Daily Ration Delivery</div>
                                <p className="app-panel-subtitle">Select a pending ration to confirm delivery</p>
                            </div>
                            <label style={{ display: "flex", minWidth: 0, alignItems: "center", overflow: "hidden", gap: "0.5rem", width: "100%", maxWidth: "14rem" }}>
                                <span className="app-eyebrow">Status</span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value as 'Y' | 'N' | '');
                                        setPage(1);
                                        setSelectedRationId(null);
                                        setDeliveryNotes("");
                                        setIsDetailOpen(false);
                                    }}
                                    className="app-input"
                                    style={{ minWidth: 0, fontSize: "12px" }}
                                >
                                    <option value="">All</option>
                                    <option value="Y">Delivered</option>
                                    <option value="N">Pending</option>
                                </select>
                            </label>
                        </header>

                        <div className="app-kpi-stripe">
                            <div className="app-kpi-card">
                                <div className="app-kpi-label">Total Rations</div>
                                <div className="app-kpi-value">{totalRecords}</div>
                            </div>
                            <div className="app-kpi-card" style={{ borderColor: "var(--color-status-ok)" }}>
                                <div className="app-kpi-label">Delivered</div>
                                <div className="app-kpi-value" style={{ color: "var(--color-status-ok)" }}>{deliveredCount}</div>
                            </div>
                            <div className="app-kpi-card" style={{ borderColor: "var(--color-status-warning)" }}>
                                <div className="app-kpi-label">Pending</div>
                                <div className="app-kpi-value" style={{ color: "var(--color-status-warning)" }}>{pendingCount}</div>
                            </div>
                        </div>

                        <div className="app-table-region app-table-frame">
                            {isLoadingRations ? (
                                <div className="app-loading-state">
                                    Loading rations...
                                </div>
                            ) : (
                                <RationsTable
                                    rations={rations}
                                    personMap={personMap}
                                    selectedRationId={selectedRationId}
                                    onRationSelect={(id) => {
                                        setSelectedRationId(id);
                                        setDeliveryNotes(rations.find((r) => r.id === id)?.notes ?? "");
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
                        <div className="app-panel-body">
                            {selectedRationId && selectedRation ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <RationResourcesDetail rationId={selectedRationId} />

                                    <div style={{ borderTop: "1px solid var(--color-border-default)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                                            <span className="app-eyebrow">Delivery Control</span>
                                            <span className={`app-table-badge ${selectedRation.completed === "Y" ? "app-table-badge--ok" : "app-table-badge--warn"}`}>
                                                {selectedRation.completed === "Y" ? "DELIVERED" : "PENDING"}
                                            </span>
                                        </div>

                                        <div className="app-field">
                                            <label className="app-label">Delivery notes</label>
                                            <textarea
                                                value={deliveryNotes}
                                                onChange={(event) => setDeliveryNotes(event.target.value)}
                                                className="app-input"
                                                style={{ minHeight: "6rem", resize: "none", fontSize: "11px" }}
                                                placeholder="Optional operational note"
                                                disabled={isSavingDelivery || selectedRation.completed === "Y"}
                                            />
                                        </div>

                                        {selectedRation.completed === "Y" ? (
                                            <div className="app-alert app-alert--ok">
                                                Delivery has been confirmed and cannot be moved back to pending.
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => void handleConfirmDelivery()}
                                                disabled={isSavingDelivery}
                                                className="app-btn app-btn--primary app-btn--full"
                                            >
                                                <CheckCircle2 size={13} />
                                                Confirm Delivery
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="app-empty-state">
                                    <Package size={20} style={{ opacity: 0.3 }} />
                                    <span className="app-eyebrow" style={{ textAlign: "center" }}>
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
