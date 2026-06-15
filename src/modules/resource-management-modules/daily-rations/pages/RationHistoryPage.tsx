import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigation } from "../../../../shared/app/NavigationContext";
import { PersonService } from "../../../../services/PersonService";
import { useRationsQuery } from "../hooks/useRationsQuery";
import { RationHistoryTable } from "../components/RationHistoryTable";
import PaginationFooter from "../../shared/components/PaginationFooter";

const personService = new PersonService();
const TODAY_STR = new Date().toISOString().split("T")[0];
const SEVEN_DAYS_AGO_STR = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export function RationHistoryPage() {
    const { authContext } = useNavigation();
    const campId = authContext.campId ?? 0;

    const [statusFilter, setStatusFilter] = useState<'Y' | 'N' | ''>('');
    const [dateFrom, setDateFrom] = useState(SEVEN_DAYS_AGO_STR);
    const [dateTo, setDateTo] = useState(TODAY_STR);
    const [page, setPage] = useState(1);
    const pageSize = 30;

    // Obtener raciones
    const { data: rationsResult, isLoading: isLoadingRations } = useRationsQuery(
        campId,
        {
            completed: statusFilter || undefined,
            startDate: dateFrom || undefined,
            endDate: dateTo || undefined,
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

    // Estadísticas
    const totalRations = facets?.total ?? pagination.total;
    const deliveredCount = facets?.delivered ?? (statusFilter === 'Y' ? pagination.total : rations.filter((ration) => ration.completed === 'Y').length);
    const pendingCount = facets?.pending ?? (statusFilter === 'N' ? pagination.total : rations.filter((ration) => ration.completed === 'N').length);
    const deliveryRate = totalRations > 0 ? ((deliveredCount / totalRations) * 100).toFixed(1) : '0';

    const totalPages = pagination.totalPages;

    return (
        <article className="flex flex-1 min-h-0 flex-col bg-transparent overflow-hidden">
            {/* Filter bar */}
            <div className="app-filter-shell shrink-0 px-4 pt-4 pb-0">
                <div className="app-filter-row bg-bg-secondary border border-border-default px-4 py-3">
                    <div className="flex items-center gap-2">
                        <label className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value as 'Y' | 'N' | ''); setPage(1); }}
                            className="app-input text-[11px]!"
                        >
                            <option value="">All</option>
                            <option value="Y">Delivered</option>
                            <option value="N">Pending</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <label className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest">From</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                            className="app-input text-[11px]!"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest">To</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                            className="app-input text-[11px]!"
                        />
                    </div>
                </div>
            </div>

            {/* Main area: stats | table */}
            <div className="app-responsive-columns app-responsive-columns--two flex-1">
                {/* Stats column */}
                <div className="app-responsive-aside app-kpi-stack">
                    <div className="app-kpi-card bg-bg-secondary border border-border-default">
                        <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Total Rations</div>
                        <div className="app-kpi-value font-mono font-bold text-txt-primary">{totalRations}</div>
                    </div>
                    <div className="app-kpi-card bg-bg-secondary border border-status-success">
                        <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Delivered</div>
                        <div className="app-kpi-value font-mono font-bold text-status-success">{deliveredCount}</div>
                    </div>
                    <div className="app-kpi-card bg-bg-secondary border border-status-warning">
                        <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Pending</div>
                        <div className="app-kpi-value font-mono font-bold text-status-warning">{pendingCount}</div>
                    </div>
                    <div className="app-kpi-card bg-bg-secondary border border-accent">
                        <div className="font-mono text-[9px] font-bold text-txt-disabled uppercase tracking-widest mb-2">Rate</div>
                        <div className="app-kpi-value font-mono font-bold text-accent">{deliveryRate}%</div>
                    </div>
                </div>

                {/* Table + footer */}
                <div className="app-responsive-main flex min-h-0 flex-col overflow-hidden">
                    {isLoadingRations ? (
                        <div className="flex-1 flex items-center justify-center text-txt-disabled font-mono text-xs">
                            Loading history...
                        </div>
                    ) : (
                        <div className="app-table-region app-table-frame">
                            <RationHistoryTable rations={rations} personMap={personMap} />
                        </div>
                    )}

                    {/* Pagination footer */}
                    <PaginationFooter
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                        totalRecords={totalRations}
                    />
                </div>
            </div>
        </article>
    );
}

