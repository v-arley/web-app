import { ClipboardCheck } from "lucide-react";

type WorkerTasksSummaryProps = {
  activeTasksCount: number;
};

export function WorkerTasksSummary({
  activeTasksCount,
}: WorkerTasksSummaryProps) {
  return (
    <section className="border border-[#E85D04]/35 bg-black/65 backdrop-blur-sm p-4 sm:p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <span className="text-[10px] text-[#9A9A9A] font-mono tracking-[0.14em] block uppercase break-words">
            Task and scheduling unit // work order
          </span>

          <h2 className="text-lg font-mono font-bold text-white uppercase flex items-start sm:items-center gap-2 mt-1 min-w-0">
            <ClipboardCheck
              className="text-[#E85D04] shrink-0 mt-0.5 sm:mt-0"
              size={20}
            />
            <span className="break-words">Shift operational assignments</span>
          </h2>
        </div>

        <div className="border border-[#E85D04]/60 bg-black/60 px-4 py-3 font-mono text-center w-full sm:w-auto shrink-0">
          <span className="block text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em]">
            Active tasks
          </span>
          <span className="block text-2xl text-[#E85D04] font-black">
            {activeTasksCount}
          </span>
        </div>
      </div>
    </section>
  );
}