import { CheckCircle2, Clock, Info, ShoppingBag } from "lucide-react";
import type { Ration } from "../../../../models/Ration";
import {
  formatDate,
  getRationDate,
  getRationResources,
  isDelivered,
} from "./workerRationUtils";
import { WorkerRationResourceCard } from "./WorkerRationResourceCard";
import { WorkerRationStatusBadge } from "./WorkerRationStatusBadge";

type WorkerCurrentRationPanelProps = {
  currentRation: Ration | null;
  loading: boolean;
};

export function WorkerCurrentRationPanel({
  currentRation,
  loading,
}: WorkerCurrentRationPanelProps) {
  const currentResources = getRationResources(currentRation);

  return (
    <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-4 mb-5">
        <div className="min-w-0">
          <span className="text-[10px] text-[#9A9A9A] font-mono tracking-[0.14em] block uppercase break-words">
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

        {currentRation && <WorkerRationStatusBadge ration={currentRation} />}
      </div>

      {loading ? (
        <div className="text-[#9A9A9A] font-mono text-xs uppercase tracking-[0.14em]">
          Loading ration data...
        </div>
      ) : !currentRation ? (
        <div className="border border-[#FACC15]/40 bg-black/70 p-4 text-[#FACC15] font-mono text-xs uppercase tracking-[0.14em]">
          No current ration assigned.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-[#D0D0D0]">
          <div className="md:col-span-2 space-y-3 min-w-0">
            <h4 className="text-[#D0D0D0] text-xs uppercase tracking-[0.14em] font-bold">
              Included resources
            </h4>

            {currentResources.length === 0 ? (
              <div className="border border-white/10 bg-black/70 p-4 text-[#9A9A9A] uppercase tracking-[0.14em]">
                No resources are associated with this ration.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentResources.map((item, index) => (
                  <WorkerRationResourceCard
                    key={`${item.resourceId ?? item.resource_id ?? item.id}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-black/70 border border-white/10 flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div>
                <span className="text-[#9A9A9A] block text-[10px] uppercase mb-1">
                  Status
                </span>

                <div className="flex items-center gap-2 text-white break-words">
                  {isDelivered(currentRation) ? (
                    <CheckCircle2
                      size={15}
                      className="text-[#22C55E] shrink-0"
                    />
                  ) : (
                    <Clock size={15} className="text-[#E85D04] shrink-0" />
                  )}
                  <span>
                    {isDelivered(currentRation)
                      ? "Delivered"
                      : "Pending delivery"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#9A9A9A] block text-[10px] uppercase mb-1">
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
                <span className="text-[#9A9A9A] block text-[10px] uppercase mb-1">
                  Notes
                </span>

                <p className="text-xs text-[#D0D0D0] leading-relaxed break-words">
                  {currentRation.notes || "No notes recorded."}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 mt-3 text-[10px] text-[#9A9A9A] flex items-start gap-2">
              <Info size={14} className="text-[#E85D04] shrink-0" />
              <span className="break-words">
                This view only shows the status of the assigned ration.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
