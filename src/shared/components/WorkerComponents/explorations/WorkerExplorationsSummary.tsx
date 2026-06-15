import { Compass } from "lucide-react";

type WorkerExplorationsSummaryProps = {
  total: number;
};

export function WorkerExplorationsSummary({
  total,
}: WorkerExplorationsSummaryProps) {
  return (
    <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <span className="text-[10px] text-[#9A9A9A] font-mono tracking-[0.14em] block uppercase break-words">
            Reconnaissance directory // expedition log
          </span>

          <h2 className="text-lg font-mono font-bold text-white uppercase flex items-start sm:items-center gap-2 mt-1 min-w-0">
            <Compass
              className="text-[#E85D04] shrink-0 mt-0.5 sm:mt-0"
              size={20}
            />
            <span className="break-words">
              My external exploration missions
            </span>
          </h2>
        </div>

        <div className="border border-[#38BDF8]/50 bg-black/60 px-4 py-2 text-[#38BDF8] font-mono text-xs uppercase tracking-[0.14em] font-bold w-full sm:w-auto text-center shrink-0">
          Total assigned: {total}
        </div>
      </div>
    </section>
  );
}