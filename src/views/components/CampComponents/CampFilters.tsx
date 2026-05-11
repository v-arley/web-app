import { useState } from "react";
import { Plus, Search } from "lucide-react";

export type StateFilter = "activos" | "inactivos" | "todos";

type Props = {
  search: string;
  stateFilter: StateFilter;
  onSearchChange: (value: string) => void;
  onStateFilterChange: (value: StateFilter) => void;
};

const filterSelectClass = (focused: boolean) =>
  `w-full rounded-lg border px-4 py-2 outline-none transition-all duration-200 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] xl:w-auto ${
    focused
      ? "border-[#FF6600] bg-[#FF6600] text-black"
      : "border-black bg-black text-white hover:border-[#FF6600] hover:text-[#FF6600]"
  }`;

export default function CampFilters({
  search,
  stateFilter,
  onSearchChange,
  onStateFilterChange,
}: Props) {
  const [isFilterFocused, setIsFilterFocused] = useState(false);

  return (
    <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center xl:gap-4">
      <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
        <Search className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />

        <input
          type="text"
          placeholder="Buscar campamento por código o descripción..."
          className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        value={stateFilter}
        onChange={(e) => onStateFilterChange(e.target.value as StateFilter)}
        onFocus={() => setIsFilterFocused(true)}
        onBlur={() => setIsFilterFocused(false)}
        className={filterSelectClass(isFilterFocused)}
      >
        <option value="todos">Todos</option>
        <option value="activos">Activos</option>
        <option value="inactivos">Inactivos</option>
      </select>

      <button
        type="button"
        className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black xl:w-auto xl:justify-start"
      >
        <Plus className="text-white transition-colors group-hover:text-black" />
        Nuevo campamento
      </button>
    </div>
  );
}