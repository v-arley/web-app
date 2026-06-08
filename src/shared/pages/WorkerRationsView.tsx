import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useWorkerRations } from "../hooks/useWorkerRations";
import type { Ration } from "../../models/Ration";
import type { RationResource } from "../../models/RationResource";

function formatDate(value?: string | Date | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getRationDate(ration?: Ration | null) {
  return ration?.rationDate ?? ration?.ration_date;
}

function isDelivered(ration?: Ration | null) {
  return ration?.completed === "Y";
}

function getRationResources(ration?: Ration | null) {
  return ration?.sources ?? ration?.rationResources ?? ration?.resources ?? [];
}

function getResourceName(item: RationResource) {
  return (
    item.name ??
    item.resource?.name ??
    `Recurso #${item.resourceId ?? item.resource_id ?? item.id ?? "N/A"}`
  );
}

function getResourceCode(item: RationResource) {
  return (
    item.code ??
    item.resource?.code ??
    `RES-${item.resourceId ?? item.resource_id ?? item.id ?? "N/A"}`
  );
}

function getResourceUnit(item: RationResource) {
  return (
    item.unitOfMeasure ??
    item.unit_of_measure ??
    item.resource?.unitOfMeasure ??
    item.resource?.unit_of_measure ??
    item.resource?.unitName ??
    item.resource?.unit_name ??
    item.resource?.unit ??
    "u"
  );
}

function RationStatusBadge({ ration }: { ration: Ration }) {
  const delivered = isDelivered(ration);

  return (
    <span
      className={`px-3 py-1 font-mono text-[10px] font-bold border uppercase tracking-label whitespace-nowrap ${
        delivered
          ? "bg-[#22C55E]/10 border-[#22C55E]/50 text-[#22C55E]"
          : "bg-[#E85D04]/10 border-[#E85D04]/60 text-[#E85D04]"
      }`}
    >
      {delivered ? "Delivered" : "Pending"}
    </span>
  );
}

function ResourceCard({ item }: { item: RationResource }) {
  return (
    <div className="p-3 bg-[#111111] border border-[#3a3a3a] text-center flex flex-col justify-between hover:border-[#E85D04]/60 transition-colors min-w-0">
      <span className="text-[10px] text-[#38BDF8] bg-[#242424] py-0.5 px-1 border border-[#3a3a3a] uppercase tracking-label truncate block">
        {getResourceCode(item)}
      </span>

      <span className="text-white font-bold block my-2 truncate">
        {getResourceName(item)}
      </span>

      <span className="text-sm font-mono text-[#E85D04] font-bold break-words">
        {item.amount}{" "}
        <span className="text-[10px] text-[#6B7280] uppercase">
          {getResourceUnit(item)}
        </span>
      </span>
    </div>
  );
}

export function WorkerRationsView() {
  const { currentRation, history, page, setPage, loading, error, reload } =
    useWorkerRations();

  const currentResources = getRationResources(currentRation);

  return (
    <div className="w-full h-full flex flex-col bg-[#111111] overflow-hidden min-w-0">
      <div className="w-full bg-[#242424] border-b border-[#3a3a3a] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-mono font-bold text-[#C0C0C0] uppercase tracking-label break-words">
            Rations
          </span>
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-label break-words">
            Worker ration assignment / supply registry
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] hover:text-[#E85D04] uppercase tracking-label transition-colors shrink-0"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 sm:p-4 space-y-4">
          {error && (
            <div className="border border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-label flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          <section className="border border-[#E85D04]/45 bg-[#1a1a1a] p-4 sm:p-5 shadow-[0_0_18px_rgba(232,93,4,0.1)]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#3a3a3a] pb-4 mb-5">
              <div className="min-w-0">
                <span className="text-[10px] text-[#6B7280] font-mono tracking-label block uppercase break-words">
                  Latest assigned allowance // recent assignment
                </span>

                <h2 className="text-lg font-mono font-bold text-white uppercase flex items-start sm:items-center gap-2 mt-1 min-w-0">
                  <ShoppingBag
                    className="text-[#E85D04] shrink-0 mt-0.5 sm:mt-0"
                    size={20}
                  />
                  <span className="break-words">
                    Shift ration: {formatDate(getRationDate(currentRation))}
                  </span>
                </h2>
              </div>

              {currentRation && <RationStatusBadge ration={currentRation} />}
            </div>

            {loading ? (
              <div className="text-[#6B7280] font-mono text-xs uppercase tracking-label">
                Loading ration data...
              </div>
            ) : !currentRation ? (
              <div className="border border-[#FACC15]/40 bg-[#FACC15]/10 p-4 text-[#FACC15] font-mono text-xs uppercase tracking-label">
                No current ration assigned.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-[#C0C0C0]">
                <div className="md:col-span-2 space-y-3 min-w-0">
                  <h4 className="text-[#C0C0C0] text-xs uppercase tracking-label font-bold">
                    Included resources
                  </h4>

                  {currentResources.length === 0 ? (
                    <div className="border border-[#3a3a3a] bg-[#111111] p-4 text-[#6B7280] uppercase tracking-label">
                      No resources are associated with this ration.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentResources.map((item, index) => (
                        <ResourceCard
                          key={`${item.resourceId ?? item.resource_id ?? item.id}-${index}`}
                          item={item}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#111111] border border-[#3a3a3a] flex flex-col justify-between min-w-0">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase mb-1">
                        Status
                      </span>

                      <div className="flex items-center gap-2 text-white break-words">
                        {isDelivered(currentRation) ? (
                          <CheckCircle2
                            size={15}
                            className="text-[#22C55E] shrink-0"
                          />
                        ) : (
                          <Clock
                            size={15}
                            className="text-[#E85D04] shrink-0"
                          />
                        )}
                        <span>
                          {isDelivered(currentRation)
                            ? "Delivered"
                            : "Pending delivery"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase mb-1">
                        Camp
                      </span>

                      <span className="text-[#38BDF8] break-words">
                        {currentRation.camp?.code ??
                          currentRation.camp?.description ??
                          currentRation.campId ??
                          currentRation.camp_id}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase mb-1">
                        Notes
                      </span>

                      <p className="text-xs text-[#C0C0C0] leading-relaxed break-words">
                        {currentRation.notes || "No notes recorded."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#3a3a3a] mt-3 text-[10px] text-[#6B7280] flex items-start gap-2">
                    <Info size={14} className="text-[#E85D04] shrink-0" />
                    <span className="break-words">
                      This view only shows the status of the assigned ration.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="border border-[#3a3a3a] bg-[#1a1a1a] overflow-hidden">
            <div className="border-b border-[#3a3a3a] bg-[#242424] p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar size={18} className="text-[#E85D04] shrink-0" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-label break-words">
                  Supply history
                </h3>
              </div>

              <span className="font-mono text-xs text-[#6B7280] uppercase shrink-0">
                Total records: {history.total}
              </span>
            </div>

            <div className="divide-y divide-[#3a3a3a]">
              {history.items.length === 0 && (
                <div className="p-8 text-center text-[#6B7280] font-mono text-xs uppercase tracking-label">
                  No ration history available.
                </div>
              )}

              {history.items.map((item) => {
                const resources = getRationResources(item);

                return (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-[#242424] transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-xs"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-[#38BDF8] break-all">
                          #{item.id}
                        </span>

                        <span className="text-white font-bold flex items-center gap-2">
                          <Calendar
                            size={13}
                            className="text-[#6B7280] shrink-0"
                          />
                          {formatDate(getRationDate(item))}
                        </span>

                        <RationStatusBadge ration={item} />
                      </div>

                      <p className="text-[#6B7280] text-xs break-words">
                        {item.notes || "No notes recorded."}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center md:justify-end flex-wrap gap-2 w-full md:w-auto md:max-w-xl">
                      {resources.length === 0 ? (
                        <span className="px-2 py-1 bg-[#111111] border border-[#3a3a3a] text-[#6B7280] text-[11px] uppercase">
                          No resources
                        </span>
                      ) : (
                        resources.map((resource, index) => (
                          <span
                            key={`${resource.resourceId ?? resource.resource_id ?? resource.id}-${index}`}
                            className="px-2 py-1 bg-[#111111] border border-[#3a3a3a] text-[#C0C0C0] text-[11px] uppercase break-words"
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

            <div className="p-3 bg-[#111111] border-t border-[#3a3a3a] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <span className="font-mono text-[10px] text-[#6B7280] uppercase tracking-label">
                Page {history.page} of {history.totalPages || 1}
              </span>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white transition-colors font-mono uppercase flex items-center gap-1 whitespace-nowrap"
                >
                  <ChevronLeft size={13} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage(Math.min(history.totalPages || 1, page + 1))
                  }
                  disabled={page >= (history.totalPages || 1)}
                  className="px-3 py-1.5 text-xs border border-[#3a3a3a] hover:border-[#E85D04] disabled:opacity-40 disabled:hover:border-[#3a3a3a] text-white transition-colors font-mono uppercase flex items-center gap-1 whitespace-nowrap"
                >
                  Next
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}