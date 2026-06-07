import { Plus, Search } from "lucide-react";

import type {
    RiskFilter,
    StateFilter,
} from "./explorationHelpers";

type Props = {
    search: string;
    riskFilter: RiskFilter;
    stateFilter: StateFilter;
    onSearchChange: (value: string) => void;
    onRiskFilterChange: (value: RiskFilter) => void;
    onStateFilterChange: (value: StateFilter) => void;
    onCreateClick: () => void;
};

const selectClass =
    "h-12 rounded-lg border border-black bg-black px-5 text-sm text-white outline-none transition-colors hover:border-[#FF6600] hover:text-[#FF6600] focus:border-[#FF6600]";

export default function ExplorationFilters({
    search,
    riskFilter,
    stateFilter,
    onSearchChange,
    onRiskFilterChange,
    onStateFilterChange,
    onCreateClick,
}: Props) {
    return (
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex h-12 w-full overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#D7DDE2] transition-colors focus-within:border-[#FF6600] lg:flex-1">
                <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-[#b8c0c8]">
                    <Search className="h-5 w-5 text-[#6B7280]" />
                </div>

                <input
                    type="text"
                    placeholder="Buscar exploración por código, nombre u objetivo..."
                    className="h-full w-full bg-transparent px-4 text-sm text-[#374151] outline-none placeholder:text-[#6B7280]"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:w-auto lg:items-center">
                <select
                    value={riskFilter}
                    onChange={(event) =>
                        onRiskFilterChange(event.target.value as RiskFilter)
                    }
                    className={`${selectClass} w-full lg:w-[130px]`}
                >
                    <option value="todas">Riesgo</option>
                    <option value="L">Bajo</option>
                    <option value="M">Medio</option>
                    <option value="H">Alto</option>
                </select>

                <select
                    value={stateFilter}
                    onChange={(event) =>
                        onStateFilterChange(event.target.value as StateFilter)
                    }
                    className={`${selectClass} w-full lg:w-[130px]`}
                >
                    <option value="todas">Estado</option>
                    <option value="P">Pendiente</option>
                    <option value="A">Activa</option>
                    <option value="F">Finalizada</option>
                    <option value="C">Cancelada</option>
                </select>

                <button
                    type="button"
                    onClick={onCreateClick}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-black bg-black px-5 text-sm text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black lg:w-[220px]"
                >
                    <Plus className="h-5 w-5" />
                    <span>Nueva exploración</span>
                </button>
            </div>
        </div>
    );
}