import { useState } from "react";
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

const filterSelectClass = (focused: boolean) =>
    `w-full rounded-lg border px-4 py-2 outline-none transition-all duration-200 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] xl:w-auto ${
        focused
            ? "border-[#FF6600] bg-[#FF6600] text-black"
            : "border-black bg-black text-white hover:border-[#FF6600] hover:text-[#FF6600]"
    }`;

export default function ExplorationFilters({
    search,
    riskFilter,
    stateFilter,
    onSearchChange,
    onRiskFilterChange,
    onStateFilterChange,
    onCreateClick,
}: Props) {
    const [isRiskFocused, setIsRiskFocused] = useState(false);
    const [isStateFocused, setIsStateFocused] = useState(false);

    return (
        <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center xl:gap-4">
            <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
                <Search className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />

                <input
                    type="text"
                    placeholder="Buscar exploración por código, nombre u objetivo..."
                    className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <select
                value={riskFilter}
                onChange={(e) => onRiskFilterChange(e.target.value as RiskFilter)}
                onFocus={() => setIsRiskFocused(true)}
                onBlur={() => setIsRiskFocused(false)}
                className={filterSelectClass(isRiskFocused)}
            >
                <option value="todas">Riesgo</option>
                <option value="L">Bajo</option>
                <option value="M">Medio</option>
                <option value="H">Alto</option>
            </select>

            <select
                value={stateFilter}
                onChange={(e) => onStateFilterChange(e.target.value as StateFilter)}
                onFocus={() => setIsStateFocused(true)}
                onBlur={() => setIsStateFocused(false)}
                className={filterSelectClass(isStateFocused)}
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
                className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black xl:w-auto xl:justify-start"
            >
                <Plus className="text-white transition-colors group-hover:text-black" />
                Nueva exploración
            </button>
        </div>
    );
}