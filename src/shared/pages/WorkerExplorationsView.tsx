import { AlertTriangle, RefreshCw, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useWorkerExplorations } from "../hooks/useWorkerExplorations";
import { WorkerExplorationCard } from "../components/WorkerComponents/explorations/WorkerExplorationCard";
import { WorkerExplorationsFilters } from "../components/WorkerComponents/explorations/WorkerExplorationsFilters";
import { WorkerExplorationsPagination } from "../components/WorkerComponents/explorations/WorkerExplorationsPagination";
import { WorkerExplorationsSummary } from "../components/WorkerComponents/explorations/WorkerExplorationsSummary";

export function WorkerExplorationsView() {
  const {
    data,
    page,
    setPage,
    name,
    setName,
    state,
    setState,
    riskLevel,
    setRiskLevel,
    loading,
    error,
    reload,
    clearFilters,
  } = useWorkerExplorations();

  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggleExpand(id?: number) {
    if (!id) return;
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden min-w-0">
      <div className="w-full bg-black/60 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-mono font-bold text-white uppercase tracking-[0.18em] break-words">
            Exploraciones
          </span>
          <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em] break-words">
            Worker exploration registry / assigned expeditions
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 border border-white/10 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono text-[#C0C0C0] hover:text-[#E85D04] hover:border-[#E85D04]/40 uppercase tracking-[0.14em] transition-colors shrink-0"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
        <div className="p-3 sm:p-4 space-y-4">
          <WorkerExplorationsSummary total={data.total} />

          <WorkerExplorationsFilters
            name={name}
            setName={setName}
            state={state}
            setState={setState}
            riskLevel={riskLevel}
            setRiskLevel={setRiskLevel}
            clearFilters={clearFilters}
          />

          {error && (
            <div className="border border-[#E85D04]/50 bg-black/70 backdrop-blur-sm text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          <section className="space-y-4">
            {loading && (
              <div className="border border-white/10 bg-black/70 backdrop-blur-sm p-6 text-[#9A9A9A] font-mono text-xs uppercase tracking-[0.14em]">
                Loading exploration data...
              </div>
            )}

            {!loading && data.items.length === 0 && (
              <div className="border border-[#FACC15]/40 bg-black/70 backdrop-blur-sm p-8 text-center space-y-2 font-mono">
                <ShieldAlert size={28} className="text-[#FACC15] mx-auto" />
                <p className="text-sm text-[#FACC15] uppercase tracking-[0.14em]">
                  No explorations found with current filters.
                </p>
              </div>
            )}

            {!loading &&
              data.items.map((exploration) => (
                <WorkerExplorationCard
                  key={exploration.id}
                  exploration={exploration}
                  expanded={expandedId === exploration.id}
                  onToggle={() => toggleExpand(exploration.id)}
                />
              ))}
          </section>

          <WorkerExplorationsPagination
            page={page}
            totalPages={data.totalPages || 1}
            total={data.total}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
