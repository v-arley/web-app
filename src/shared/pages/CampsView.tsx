import { useEffect, useMemo, useState } from "react";
import { Building2 } from "lucide-react";

import { useCamps } from "../hooks/useCamps";
import type { Camp } from "../../models/Camp";

import CampStats from "../components/CampComponents/CampStats";
import CampFilters, {
  type StateFilter,
} from "../components/CampComponents/CampFilters";
import CampsTable from "../components/CampComponents/CampsTable";
import CampDetailPanel from "../components/CampComponents/CampDetailPanel";

export function CampsView() {
  const { data, isLoading, error, reload } = useCamps();

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("todos");
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);

  const filteredCamps = useMemo(() => {
    const q = search.trim().toLowerCase();

    return data.filter((camp) => {
      const matchesSearch =
        !q ||
        camp.code.toLowerCase().includes(q) ||
        (camp.description ?? "").toLowerCase().includes(q);

      const matchesState =
        stateFilter === "todos"
          ? true
          : stateFilter === "activos"
            ? camp.active
            : !camp.active;

      return matchesSearch && matchesState;
    });
  }, [data, search, stateFilter]);

  useEffect(() => {
    if (filteredCamps.length === 0) {
      setSelectedCamp(null);
      return;
    }

    if (!selectedCamp) {
      setSelectedCamp(filteredCamps[0]);
      return;
    }

    const updatedSelected =
      filteredCamps.find((camp) => camp.id === selectedCamp.id) ?? null;

    if (!updatedSelected) {
      setSelectedCamp(filteredCamps[0]);
    } else {
      setSelectedCamp(updatedSelected);
    }
  }, [filteredCamps, selectedCamp]);

  const totalActive = data.filter((camp) => camp.active).length;

  const totalCapacity = data.reduce(
    (acc, camp) => acc + camp.capacity,
    0,
  );

  const sectionTitle =
    stateFilter === "activos"
      ? "CAMPAMENTOS ACTIVOS"
      : stateFilter === "inactivos"
        ? "CAMPAMENTOS INACTIVOS"
        : "TODOS LOS CAMPAMENTOS";

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
      <CampStats
        totalCamps={data.length}
        totalActive={totalActive}
        totalCapacity={totalCapacity}
      />

      <div className="flex flex-col gap-6 xl:flex-row">
        <section className="min-w-0 flex-1">
          <div className="flex flex-col gap-4">
            <CampFilters
              search={search}
              stateFilter={stateFilter}
              onSearchChange={setSearch}
              onStateFilterChange={setStateFilter}
            />

            <div className="flex w-full items-center justify-between gap-[10px] border-b border-[#B8B8B8] px-3 py-2 text-[#343434] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-[10px]">
                <Building2 className="h-8 w-8 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
                <p>{sectionTitle}</p>
              </div>

              <button
                type="button"
                onClick={() => void reload()}
                className="text-[11px] uppercase tracking-[0.2em] text-[#666] hover:text-[#FF6600]"
              >
                Recargar
              </button>
            </div>

            <CampsTable
              camps={filteredCamps}
              selectedCamp={selectedCamp}
              isLoading={isLoading}
              error={error}
              onSelectCamp={setSelectedCamp}
              onReload={() => void reload()}
            />
          </div>
        </section>

        <CampDetailPanel selectedCamp={selectedCamp} />
      </div>
    </div>
  );
}