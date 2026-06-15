import { Calendar, ChevronLeft, ChevronRight, Package } from "lucide-react";
import type { Ration } from "../../../../models/Ration";
import {
  formatDate,
  getRationDate,
  getRationResources,
  getResourceName,
  getResourceUnit,
} from "../workerRationUtils";
import { WorkerRationStatusBadge } from "../WorkerRationStatusBadge";

type WorkerRationHistoryPanelProps = {
  history: {
    items: Ration[];
    total: number;
    page: number;
    totalPages: number;
  };
  page: number;
  setPage: (value: number) => void;
};

export function WorkerRationHistoryPanel({
  history,
  page,
  setPage,
}: WorkerRationHistoryPanelProps) {
  const safeTotalPages = history.totalPages || 1;

  return (
    <section className="border border-white/10 bg-black/65 backdrop-blur-sm overflow-hidden">
      <div className="border-b border-white/10 bg-black/65 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Calendar size={18} className="text-[#E85D04] shrink-0" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-[0.14em] break-words">
            Supply history
          </h3>
        </div>

        <span className="font-mono text-xs text-[#9A9A9A] uppercase shrink-0">
          Total records: {history.total}
        </span>
      </div>

      <div className="divide-y divide-white/10">
        {history.items.length === 0 && (
          <div className="p-8 text-center text-[#9A9A9A] font-mono text-xs uppercase tracking-[0.14em]">
            No ration history available.
          </div>
        )}

        {history.items.map((item) => {
          const resources = getRationResources(item);

          return (
            <div
              key={item.id}
              className="p-4 hover:bg-[#E85D04]/10 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-xs"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-[#38BDF8] break-all">
                    #{item.id}
                  </span>

                  <span className="text-white font-bold flex items-center gap-2">
                    <Calendar size={13} className="text-[#9A9A9A] shrink-0" />
                    {formatDate(getRationDate(item))}
                  </span>

                  <WorkerRationStatusBadge ration={item} />
                </div>

                <p className="text-[#9A9A9A] text-xs break-words">
                  {item.notes || "No notes recorded."}
                </p>
              </div>

              <div className="shrink-0 flex items-center md:justify-end flex-wrap gap-2 w-full md:w-auto md:max-w-xl">
                {resources.length === 0 ? (
                  <span className="px-2 py-1 bg-black/70 border border-white/10 text-[#9A9A9A] text-[11px] uppercase">
                    No resources
                  </span>
                ) : (
                  resources.map((resource, index) => (
                    <span
                      key={`${resource.resourceId ?? resource.resource_id ?? resource.id}-${index}`}
                      className="px-2 py-1 bg-black/70 border border-white/10 text-[#D0D0D0] text-[11px] uppercase break-words"
                    >
                      <Package
                        size={14}
                        className="inline mr-1.5 text-[#E85D04]"
                      />
                      {getResourceName(resource)}{" "}
                      <strong className="text-[#FACC15]">
                        {resource.amount}
                      </strong>{" "}
                      {getResourceUnit(resource)}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-black/65 border-t border-white/10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <span className="font-mono text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em]">
          Page {history.page} of {safeTotalPages}
        </span>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-xs border border-white/10 bg-black/60 hover:border-[#E85D04]/50 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition-colors font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
          >
            <ChevronLeft size={13} />
            Previous
          </button>

          <button
            type="button"
            onClick={() => setPage(Math.min(safeTotalPages, page + 1))}
            disabled={page >= safeTotalPages}
            className="px-3 py-1.5 text-xs border border-white/10 bg-black/60 hover:border-[#E85D04]/50 disabled:opacity-40 disabled:hover:border-white/10 text-white hover:text-[#E85D04] transition-colors font-mono uppercase flex items-center gap-1 whitespace-nowrap tracking-[0.14em]"
          >
            Next
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
