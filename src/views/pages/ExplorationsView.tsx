import { useMemo, useState } from "react";
import { Binoculars } from "lucide-react";

import ExplorationStats from "../components/ExplorationsComponents/ExplorationStats";
import ExplorationFilters from "../components/ExplorationsComponents/ExplorationFilters";
import ExplorationsTable from "../components/ExplorationsComponents/ExplorationsTable";
import ExplorationDetailPanel from "../components/ExplorationsComponents/ExplorationDetailPanel";

import type {
    ExplorationRow,
    RiskFilter,
    StateFilter,
} from "../components/ExplorationsComponents/explorationHelpers";

const explorations: ExplorationRow[] = [
    {
        id: 1,
        camp_id: 1,
        code: "EXP-001",
        name: "Reconocimiento norte",
        objective: "Explorar rutas seguras y detectar recursos recuperables.",
        notes: "Evitar zona rocosa al oeste.",
        departure_date: "2026-04-22",
        estimated_return_date: "2026-04-25",
        duration_days: 3,
        risk_level: "M",
        state: "A",
    },
    {
        id: 2,
        camp_id: 2,
        code: "EXP-002",
        name: "Búsqueda de suministros médicos",
        objective: "Localizar botiquines y material quirúrgico en hospital abandonado.",
        notes: "Posible presencia hostil en el perímetro.",
        departure_date: "2026-04-24",
        estimated_return_date: "2026-04-27",
        duration_days: 3,
        risk_level: "H",
        state: "P",
    },
    {
        id: 3,
        camp_id: 1,
        code: "EXP-003",
        name: "Inspección de punto hídrico",
        objective: "Verificar acceso y estado de reserva de agua subterránea.",
        notes: "Llevar equipo de extracción manual.",
        departure_date: "2026-04-18",
        estimated_return_date: "2026-04-19",
        duration_days: 1,
        risk_level: "L",
        state: "F",
    },
    {
        id: 4,
        camp_id: 3,
        code: "EXP-004",
        name: "Ruta de observación este",
        objective: "Registrar movimientos y actividad cercana al perímetro exterior.",
        notes: "Revisión cancelada por tormenta.",
        departure_date: "2026-04-16",
        estimated_return_date: "2026-04-17",
        duration_days: 1,
        risk_level: "M",
        state: "C",
    },
];

export function ExplorationsView() {
    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] = useState<RiskFilter>("todas");
    const [stateFilter, setStateFilter] = useState<StateFilter>("todas");

    const [selectedExploration, setSelectedExploration] =
        useState<ExplorationRow | null>(explorations[0] ?? null);

    const filteredExplorations = useMemo(() => {
        const q = search.trim().toLowerCase();

        return explorations.filter((exploration) => {
            const matchesSearch =
                !q ||
                exploration.code.toLowerCase().includes(q) ||
                exploration.name.toLowerCase().includes(q) ||
                (exploration.objective ?? "").toLowerCase().includes(q);

            const matchesRisk =
                riskFilter === "todas" || exploration.risk_level === riskFilter;

            const matchesState =
                stateFilter === "todas" || exploration.state === stateFilter;

            return matchesSearch && matchesRisk && matchesState;
        });
    }, [search, riskFilter, stateFilter]);

    const activeCount = explorations.filter(
        (exploration) => exploration.state === "A",
    ).length;

    const highRiskCount = explorations.filter(
        (exploration) => exploration.risk_level === "H",
    ).length;

    return (
        <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
            <ExplorationStats
                totalExplorations={explorations.length}
                activeCount={activeCount}
                highRiskCount={highRiskCount}
            />

            <div className="flex flex-col gap-6 xl:flex-row">
                <section className="min-w-0 flex-1">
                    <div className="flex flex-col gap-4">
                        <ExplorationFilters
                            search={search}
                            riskFilter={riskFilter}
                            stateFilter={stateFilter}
                            onSearchChange={setSearch}
                            onRiskFilterChange={setRiskFilter}
                            onStateFilterChange={setStateFilter}
                        />

                        <div className="flex w-full items-center gap-[10px] border-b border-[#B8B8B8] px-3 py-2 text-[#343434] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)]">
                            <Binoculars className="h-8 w-8 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
                            <p>LISTA GENERAL DE EXPLORACIONES</p>
                        </div>

                        <ExplorationsTable
                            explorations={filteredExplorations}
                            selectedExploration={selectedExploration}
                            onSelectExploration={setSelectedExploration}
                        />
                    </div>
                </section>

                <ExplorationDetailPanel
                    selectedExploration={selectedExploration}
                />
            </div>
        </div>
    );
}