import {
  AlertTriangle,
  Award,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useWorkerTasks } from "../hooks/useWorkerTasks";
import type { Task, TaskDifficulty, TaskPriority } from "../../models/Task";

function formatDate(value?: Date | string | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getPriorityLabel(priority?: string) {
  if (priority === "H") return "High";
  if (priority === "M") return "Medium";
  if (priority === "L") return "Low";
  return "N/A";
}

function getDifficultyLabel(difficulty?: string) {
  if (difficulty === "H") return "High";
  if (difficulty === "M") return "Medium";
  if (difficulty === "L") return "Low";
  return "N/A";
}

function getDifficultyPoints(difficulty?: string) {
  if (difficulty === "H") return 15;
  if (difficulty === "M") return 10;
  if (difficulty === "L") return 5;
  return 0;
}

function getPriorityStyle(priority?: TaskPriority | string) {
  if (priority === "H") {
    return "bg-black/60 border-[#E85D04]/70 text-[#E85D04]";
  }

  if (priority === "M") {
    return "bg-black/60 border-[#FACC15]/60 text-[#FACC15]";
  }

  if (priority === "L") {
    return "bg-black/60 border-[#38BDF8]/50 text-[#38BDF8]";
  }

  return "bg-black/60 border-white/10 text-[#9A9A9A]";
}

function getDifficultyStyle(difficulty?: TaskDifficulty | string) {
  if (difficulty === "H") {
    return "bg-black/60 border-[#E85D04]/70 text-[#E85D04]";
  }

  if (difficulty === "M") {
    return "bg-black/60 border-[#38BDF8]/50 text-[#38BDF8]";
  }

  if (difficulty === "L") {
    return "bg-black/60 border-[#22C55E]/50 text-[#22C55E]";
  }

  return "bg-black/60 border-white/10 text-[#9A9A9A]";
}

function formatEstimatedTime(task: Task) {
  const minutes = task.estimatedMinutes ?? task.estimated_minutes;

  if (!minutes) return "N/A";

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}

function getAssignedDate(task: Task) {
  return task.assignment?.assignedAt ?? task.assignment?.assigned_at;
}

function TaskCard({
  task,
  completing,
  onComplete,
}: {
  task: Task;
  completing: boolean;
  onComplete: (taskId: number) => void;
}) {
  const points = getDifficultyPoints(task.difficulty);

  return (
    <div className="border border-white/10 bg-black/70 backdrop-blur-sm p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-[#E85D04]/70 hover:bg-[#E85D04]/10 transition-colors min-w-0">
      <div className="space-y-3 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <span className="text-[10px] text-[#9A9A9A] font-mono tracking-[0.14em] uppercase break-all">
            {task.type || "General"} // REF: {task.id}
          </span>

          <span
            className={`px-2 py-0.5 text-[10px] font-mono border uppercase tracking-[0.14em] font-bold w-fit whitespace-nowrap shrink-0 ${getPriorityStyle(task.priority)}`}
          >
            Priority {getPriorityLabel(task.priority)}
          </span>
        </div>

        <h3 className="font-mono text-sm text-white font-bold leading-tight tracking-[0.14em] uppercase break-words">
          {task.name || task.title || "Untitled task"}
        </h3>

        <p className="font-mono text-xs text-[#D0D0D0] bg-black/70 p-3 border border-white/10 leading-relaxed break-words">
          {task.description || "No description recorded."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
          <div className="border border-white/10 p-3 bg-black/70 min-w-0">
            <span className="text-[#9A9A9A] block text-[9px] uppercase tracking-[0.14em]">
              Difficulty
            </span>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] font-bold whitespace-nowrap ${getDifficultyStyle(task.difficulty)}`}
              >
                {getDifficultyLabel(task.difficulty)}
              </span>

              <span className="text-[#FACC15] font-bold whitespace-nowrap">
                +{points} pts
              </span>
            </div>
          </div>

          <div className="border border-white/10 p-3 bg-black/70 min-w-0">
            <span className="text-[#9A9A9A] block text-[9px] uppercase tracking-[0.14em]">
              Estimated time
            </span>

            <span className="text-white font-medium flex items-center gap-1 mt-2 break-words">
              <Clock size={13} className="text-[#38BDF8] shrink-0" />
              {formatEstimatedTime(task)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="font-mono text-[10px] text-[#9A9A9A] flex items-center gap-1 uppercase tracking-[0.14em] break-words">
          <Calendar size={13} className="shrink-0" />
          <span>Asignado: {formatDate(getAssignedDate(task))}</span>
        </div>

        <button
          type="button"
          onClick={() => onComplete(task.id)}
          disabled={completing}
          className="w-full sm:w-auto px-4 py-2 border border-[#E85D04]/70 bg-black/60 text-[#E85D04] hover:bg-[#E85D04] hover:text-[#111111] disabled:opacity-50 disabled:hover:bg-black/60 disabled:hover:text-[#E85D04] font-bold font-mono text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap"
        >
          {completing ? "Completing..." : "Complete task"}
        </button>
      </div>
    </div>
  );
}

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
                  <span className="break-words">
                    Shift operational assignments
                  </span>
                </h2>
              </div>

              <div className="border border-[#E85D04]/60 bg-black/60 px-4 py-3 font-mono text-center w-full sm:w-auto shrink-0">
                <span className="block text-[10px] text-[#9A9A9A] uppercase tracking-[0.14em]">
                  Active tasks
                </span>
                <span className="block text-2xl text-[#E85D04] font-black">
                  {activeTasks.length}
                </span>
              </div>
            </div>
          </section>

          {error && (
            <div className="border border-[#E85D04]/50 bg-black/70 backdrop-blur-sm text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] flex items-start sm:items-center gap-2 break-words">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 sm:mt-0" />
              {error}
            </div>
          )}

          {lastCompleted && (
            <div className="p-4 bg-black/70 backdrop-blur-sm border border-[#22C55E]/50 text-[#22C55E] font-mono text-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center gap-2 min-w-0">
                  <CheckSquare
                    size={17}
                    className="text-[#22C55E] shrink-0 mt-0.5 sm:mt-0"
                  />
                  <span className="font-bold uppercase tracking-[0.14em] break-words">
                    Task completed successfully
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearLastCompleted}
                  className="text-[#9A9A9A] hover:text-[#22C55E] uppercase tracking-[0.14em] self-end sm:self-auto shrink-0"
                >
                  Close
                </button>
              </div>

              <p className="text-[#D0D0D0] break-words">
                {lastCompleted.alreadyCompleted
                  ? "This task was already completed. No new points were awarded."
                  : `The task "${lastCompleted.taskName}" was completed. You earned +${lastCompleted.pointsAwarded} points.`}
              </p>

              {lastCompleted.points && (
                <p className="text-[#D0D0D0] break-words">
                  Current points:{" "}
                  <strong className="text-[#FACC15]">
                    {lastCompleted.points.totalPoints ??
                      lastCompleted.points.total_points ??
                      0}
                  </strong>{" "}
                  | Level:{" "}
                  <strong className="text-[#FACC15]">
                    {lastCompleted.points.level ?? "N/A"}
                  </strong>
                </p>
              )}

              {!!lastCompleted.unlockedAchievements?.length && (
                <div className="border border-[#FACC15]/40 bg-black/65 p-3 text-[#FACC15]">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-[0.14em]">
                    <Award size={15} className="shrink-0" />
                    <span className="break-words">New achievements unlocked</span>
                  </div>

                  <p className="mt-1 text-[#D0D0D0] break-words">
                    {`${lastCompleted.unlockedAchievements.length} new achievement(s) unlocked.`}
                  </p>
                </div>
              )}
            </div>
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
                <TaskCard
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