import { AlertTriangle, CheckSquare, RefreshCw } from "lucide-react";
import { useWorkerTasks } from "../hooks/useWorkerTasks";
import { WorkerTaskCard } from "../components/WorkerComponents/tasks/WorkerTaskCard";
import { WorkerTaskCompletedAlert } from "../components/WorkerComponents/tasks/WorkerTaskCompletedAlert";
import { WorkerTasksSummary } from "../components/WorkerComponents/tasks/WorkerTasksSummary";

export function WorkerTasksView() {
  const {
    tasks,
    loading,
    error,
    lastCompleted,
    completingTaskId,
    reload,
    completeTask,
    clearLastCompleted,
  } = useWorkerTasks();

  const activeTasks = tasks.filter((task) => task.assignment?.state !== "C");

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden min-w-0">
      <div className="w-full bg-black/60 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-mono font-bold text-white uppercase tracking-[0.18em] break-words">
            My tasks
          </span>
          <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-[0.14em] break-words">
            Active worker assignments / completion protocol
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
        <div className="p-3 sm:p-4 flex flex-col gap-4">
          <WorkerTasksSummary activeTasksCount={activeTasks.length} />

          {error && (
            <div className="border border-[#E85D04]/50 bg-black/70 backdrop-blur-sm text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          {lastCompleted && (
            <WorkerTaskCompletedAlert
              lastCompleted={lastCompleted}
              clearLastCompleted={clearLastCompleted}
            />
          )}

          {loading && (
            <div className="border border-white/10 bg-black/70 backdrop-blur-sm p-6 font-mono text-xs text-[#9A9A9A] uppercase tracking-[0.14em]">
              Loading tasks...
            </div>
          )}

          {!loading && activeTasks.length === 0 && (
            <div className="border border-white/10 bg-black/70 backdrop-blur-sm min-h-[235px] p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-3">
              <CheckSquare size={42} className="text-[#22C55E]" />

              <h3 className="font-mono text-sm text-[#D0D0D0] uppercase tracking-[0.14em] break-words">
                No active tasks assigned
              </h3>

              <p className="text-xs text-[#9A9A9A] font-mono max-w-md mx-auto text-center leading-relaxed break-words">
                The worker has no pending active directives in this operational
                cycle.
              </p>
            </div>
          )}

          {!loading && activeTasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTasks.map((task) => (
                <WorkerTaskCard
                  key={task.id}
                  task={task}
                  completing={completingTaskId === task.id}
                  onComplete={(taskId) => void completeTask(taskId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
