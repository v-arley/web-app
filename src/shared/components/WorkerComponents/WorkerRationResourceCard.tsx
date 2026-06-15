import type { RationResource } from "../../../models/RationResource";
import {
  getResourceCode,
  getResourceName,
  getResourceUnit,
} from "./workerRationUtils";

type WorkerRationResourceCardProps = {
  item: RationResource;
};

export function WorkerRationResourceCard({
  item,
}: WorkerRationResourceCardProps) {
  return (
    <div className="p-3 bg-black/70 border border-white/10 text-center flex flex-col justify-between hover:border-[#E85D04]/60 transition-colors min-w-0">
      <span className="text-[10px] text-[#38BDF8] bg-black/60 py-0.5 px-1 border border-white/10 uppercase tracking-[0.14em] truncate block">
        {getResourceCode(item)}
      </span>

      <span className="text-white font-bold block my-2 truncate">
        {getResourceName(item)}
      </span>

      <span className="text-sm font-mono text-[#E85D04] font-bold break-words">
        {item.amount}{" "}
        <span className="text-[10px] text-[#9A9A9A] uppercase">
          {getResourceUnit(item)}
        </span>
      </span>
    </div>
  );
}