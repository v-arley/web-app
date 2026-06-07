import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { PersonService } from "../../../../services/PersonService";
import { useRationsQuery } from "../hooks/useRationsQuery";
import { RationsTable } from "../components/RationsTable";
import { RationResourcesDetail } from "../components/RationResourcesDetail";
import { Package } from "lucide-react";
import PaginationFooter from "../../shared/components/PaginationFooter";

const personService = new PersonService();

export function DeliverRationsPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const [statusFilter, setStatusFilter] = useState<'Y' | 'N' | ''>('');
    const [selectedRationId, setSelectedRationId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    // Obtener raciones
    const { data: rations, isLoading: isLoadingRations } = useRationsQuery(
        campId,
        {
            completed: statusFilter || undefined,
        }
    );

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

    const deliveredCount = rations?.filter((r) => r.completed === 'Y').length ?? 0;
    const pendingCount = rations?.filter((r) => r.completed === 'N').length ?? 0;

    const totalRecords = rations?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    const pagedRations = (rations ?? []).slice((page - 1) * pageSize, page * pageSize);

    return (
        <article className="flex flex-1 min-h-0 flex-col bg-transparent overflow-hidden">
            {/* Filter bar */}
            <div className="rmm-filter-shell shrink-0 px-4 pt-4 pb-0">
                <div className="rmm-filter-row bg-bg-secondary border border-border-default px-4 py-3">
                    <label className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest shrink-0">
                        Status
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'Y' | 'N' | '')}
                        className="rmm-input text-[11px]!"
                    >
                        <option value="">All</option>
                        <option value="Y">Delivered</option>
                        <option value="N">Pending</option>
                    </select>
                </div>
            </div>

            {/* Main area: stats | table | allocated resources */}
            <div className="rmm-responsive-columns flex-1">

                {/* Stats column */}
                <div className="rmm-responsive-aside rmm-kpi-stack">
                    <div className="rmm-kpi-card bg-bg-secondary border border-border-default">
                        <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Total Rations</div>
                        <div className="rmm-kpi-value font-mono font-bold text-txt-primary">{rations?.length ?? 0}</div>
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

                {/* Table */}
                <div className="rmm-responsive-main flex flex-col">
                    {isLoadingRations ? (
                        <div className="flex items-center justify-center h-full text-txt-disabled font-mono text-xs">
                            Loading rations...
                        </div>
                    ) : (
                        <RationsTable
                            rations={pagedRations}
                            personMap={personMap}
                            selectedRationId={selectedRationId}
                            onRationSelect={setSelectedRationId}
                        />
                    )}
                    {/* Pagination footer */}
                    <PaginationFooter
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                    />
                </div>

                {/* Allocated Resources panel */}
                <div className="rmm-responsive-aside flex flex-col bg-bg-secondary border border-border-default overflow-hidden">
                    <div className="px-4 py-3 border-b border-border-default shrink-0">
                        <span className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest">
                            Allocated Resources
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        {selectedRationId ? (
                            <RationResourcesDetail rationId={selectedRationId} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-txt-disabled">
                                <Package size={20} className="opacity-30" />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-center">
                                    Select a ration to view resources
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
