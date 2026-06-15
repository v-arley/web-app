import type { Ration } from "../../../../models/Ration";
import { isDelivered } from "./workerRationUtils";

type WorkerRationStatusBadgeProps = {
  ration: Ration;
};

export function WorkerRationStatusBadge({
  ration,
}: WorkerRationStatusBadgeProps) {
  const delivered = isDelivered(ration);

  return (
    <span
      className={`px-3 py-1 font-mono text-[10px] font-bold border uppercase tracking-[0.14em] whitespace-nowrap ${
        delivered
          ? "bg-black/60 border-[#22C55E]/50 text-[#22C55E]"
          : "bg-black/60 border-[#E85D04]/60 text-[#E85D04]"
      }`}
    >
      {delivered ? "Delivered" : "Pending"}
    </span>
  );
}
