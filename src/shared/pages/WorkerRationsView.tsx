import { AlertTriangle, RefreshCw } from "lucide-react";
import { useWorkerRations } from "../hooks/useWorkerRations";
import { WorkerCurrentRationPanel } from "../components/WorkerComponents/rations/WorkerCurrentRationPanel";
import { WorkerRationHistoryPanel } from "../components/WorkerComponents/rations/WorkerRationHistoryPanel";

export function WorkerRationsView() {
  const { currentRation, history, page, setPage, loading, error, reload } =
    useWorkerRations();

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden min-w-0">
      <div className="w-full bg-black/60 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-mono font-bold text-white uppercase tracking-[0.18em] break-words">
            Rations
          </span>
          <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em] break-words">
            Worker ration assignment / supply registry
          </span>
        </div>

        <button
          type="button"
          onClick={() => void reload()}
          className="flex items-center gap-2 border-2 border-[#E85D04]/70 bg-black/70 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono font-bold text-white uppercase tracking-[0.14em] shadow-[0_0_0_1px_rgba(232,93,4,0.25)] hover:bg-[#E85D04]/10 hover:text-[#E85D04] hover:border-[#E85D04] hover:shadow-[0_0_18px_rgba(232,93,4,0.55)] transition-all shrink-0"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
        <div className="p-3 sm:p-4 space-y-4">
          {error && (
            <div className="border border-[#E85D04]/50 bg-black/70 backdrop-blur-sm text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          <WorkerCurrentRationPanel
            currentRation={currentRation}
            loading={loading}
          />

          <WorkerRationHistoryPanel
            history={history}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}