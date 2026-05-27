import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getAuthContextFromToken } from "../../../../shared/utils/authAccess";
import { PersonService } from "../../../../services/PersonService";
import { useRationsQuery } from "../hooks/useRationsQuery";
import { RationsTable } from "../components/RationsTable";

const queryClient = new QueryClient();
const personService = new PersonService();

function DeliverRationsPageContent() {
    const authContext = getAuthContextFromToken();
    const campId = authContext.campId ?? 0;
    
    const [statusFilter, setStatusFilter] = useState<'Y' | 'N' | ''>('');

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

    return (
        <div className="flex flex-1 min-h-0 flex-col p-4 md:p-6 bg-bg-app gap-4">
            {/* <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono font-bold text-txt-secondary uppercase tracking-[0.2em]">
                    Raciones Diarias / Entregar Raciones
                </div>
                <ClipboardCheck className="h-5 w-5 text-accent" />
            </div> */}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-bg-secondary border border-border-default shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50 z-10" />
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                {/* <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-accent-secondary/10 border border-accent-secondary/30">
                        <ClipboardCheck className="w-6 h-6 text-accent-secondary" />
                    </div>
                    <div>
                        <h1 className="font-mono text-xl font-bold text-txt-primary uppercase tracking-wide">
                            Entregar Raciones
                        </h1>
                        <p className="font-mono text-xs text-txt-secondary mt-1">
                            Marcar raciones como entregadas o pendientes
                        </p>
                    </div>
                </div> */}

                {/* Filtros */}
                <div className="bg-bg-secondary border border-border-default p-5">
                    <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-3">
                        Filters
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                            <label className="block font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'Y' | 'N' | '')}
                                className="rmm-input w-full text-[11px]!"
                            >
                                <option value="">All</option>
                                <option value="Y">Delivered</option>
                                <option value="N">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-bg-secondary border border-border-default p-5">
                        <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-2">
                            Total Rations
                        </div>
                        <div className="font-mono text-3xl font-bold text-txt-primary">
                            {rations?.length ?? 0}
                        </div>
                    </div>

                    <div className="bg-bg-secondary border border-status-success p-5">
                        <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-2">
                            Delivered
                        </div>
                        <div className="font-mono text-3xl font-bold text-status-success">
                            {deliveredCount}
                        </div>
                    </div>

                    <div className="bg-bg-secondary border border-status-warning p-5">
                        <div className="font-mono text-[10px] font-bold text-txt-disabled uppercase tracking-widest mb-2">
                            Pending
                        </div>
                        <div className="font-mono text-3xl font-bold text-status-warning">
                            {pendingCount}
                        </div>
                    </div>
                </div>

                {/* Tabla de raciones */}
                {isLoadingRations ? (
                    <div className="flex items-center justify-center h-64 text-txt-disabled font-mono text-xs">
                        Loading rations...
                    </div>
                ) : (
                    <RationsTable rations={rations ?? []} personMap={personMap} />
                )}
            </div>
        </div>
            </div>
        </div>
    );
}

export function DeliverRationsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <DeliverRationsPageContent />
        </QueryClientProvider>
    );
}
