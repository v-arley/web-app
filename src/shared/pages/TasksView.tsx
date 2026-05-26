import {
  Calendar,
  ClipboardList,
  Eye,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  getCampLabel,
  getEstimatedMinutes,
  getLevelBadge,
  getLevelLabel,
  useTasksView,
  type TaskFilter,
} from "../hooks/useTasksView";

const GRID_COLS =
  "grid-cols-[50px_minmax(220px,1.6fr)_120px_100px_100px_90px_80px_90px]";

const metricCardClass =
  "border border-[#d7d7d7] bg-[#f7f7f7] px-6 py-5 shadow-sm";

const detailCardClass = "bg-white/5 px-4 py-3";

const detailLabelClass =
  "text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]";

const actionButtonClass =
  "inline-flex items-center justify-center rounded-md border border-[#FF6600] p-2 text-[#FF6600] transition-colors hover:bg-[#FF6600] hover:text-black";

const filterSelectClass = (focused: boolean) =>
  `w-full rounded-lg border px-4 py-2 outline-none transition-all duration-200 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] xl:w-auto ${
    focused
      ? "border-[#FF6600] bg-[#FF6600] text-black"
      : "border-black bg-black text-white hover:border-[#FF6600] hover:text-[#FF6600]"
  }`;

export function TasksView() {
  const {
    tasks,
    search,
    setSearch,
    priority,
    setPriority,
    difficulty,
    setDifficulty,
    selectedTask,
    setSelectedTask,
    isPriorityFocused,
    setIsPriorityFocused,
    isDifficultyFocused,
    setIsDifficultyFocused,
    filteredTasks,
    totalHigh,
    totalMinutes,
  } = useTasksView();

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6 p-4 font-mono sm:gap-7 sm:p-6 lg:p-[30px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            Total tasks
          </p>
          <p className="mt-3 text-4xl font-bold text-[#111]">{tasks.length}</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            High priority
          </p>
          <p className="mt-3 text-4xl font-bold text-[#f05a28]">{totalHigh}</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7b8794]">
            Estimated time
          </p>
          <p className="mt-3 text-4xl font-bold text-[#111]">{totalMinutes}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <section className="min-w-0 flex-1">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center xl:gap-4">
              <div className="group flex w-full flex-1 items-center gap-3 rounded-lg border border-[#B8B8B8] bg-[#CCCCCC] px-3 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.10)] transition-colors focus-within:border-[#FF6600] sm:gap-5 sm:py-[15px] lg:gap-[30px]">
                <Search className="self-center text-gray-500 transition-colors group-focus-within:text-[#FF6600]" />
                <input
                  type="text"
                  placeholder="Search tasks by name, description, or type..."
                  className="w-full self-center bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-500"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskFilter)
                }
                onFocus={() => setIsPriorityFocused(true)}
                onBlur={() => setIsPriorityFocused(false)}
                className={filterSelectClass(isPriorityFocused)}
              >
                <option value="all">Priority</option>
                <option value="L">Low</option>
                <option value="M">Medium</option>
                <option value="H">High</option>
              </select>

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as TaskFilter)
                }
                onFocus={() => setIsDifficultyFocused(true)}
                onBlur={() => setIsDifficultyFocused(false)}
                className={filterSelectClass(isDifficultyFocused)}
              >
                <option value="all">Difficulty</option>
                <option value="L">Low</option>
                <option value="M">Medium</option>
                <option value="H">High</option>
              </select>

              <button
                type="button"
                className="group flex w-full items-center justify-center gap-[10px] rounded-lg border border-black bg-black px-4 py-2 text-white transition-colors hover:border-[#FF6600] hover:bg-[#FF6600] hover:text-black xl:w-auto xl:justify-start"
              >
                <Plus className="text-white transition-colors group-hover:text-black" />
                New task
              </button>
            </div>

            <div className="flex w-full items-center gap-[10px] border-b border-[#B8B8B8] px-3 py-2 text-[#343434] shadow-[0_10px_8px_-8px_rgba(0,0,0,0.45)]">
              <ClipboardList className="h-8 w-8 rounded-md bg-[#A6A6A6] p-1 text-[#343434]" />
              <p>GENERAL TASK LIST</p>
            </div>

            <div className="rounded-xl bg-[#cecece] p-[25px] shadow-[0_0_18px_rgba(0,0,0,0.35),inset_0_0_14px_rgba(115,115,115,0.33)]">
              <div
                className={`hidden xl:grid ${GRID_COLS} gap-4 border-b border-[#9ca3af] px-4 py-4 text-[11px] uppercase tracking-[0.25em] text-[#64748b]`}
              >
                <span>ID</span>
                <span>Nombre</span>
                <span>Tipo</span>
                <span>Prioridad</span>
                <span>Dificultad</span>
                <span>Tiempo</span>
                <span>Camp</span>
                <span>Acciones</span>
              </div>

              <div className="flex flex-col">
                {filteredTasks.length === 0 ? (
                  <div className="py-16 text-center text-sm uppercase tracking-[0.25em] text-[#f05a28]">
                    No tasks found
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`mt-4 rounded-xl border px-4 py-5 transition-all duration-250 ease-out cursor-pointer ${
                        selectedTask?.id === task.id
                          ? "border-[#FF6600] bg-[#1f1f1f] text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                          : "border-[#c7c7c7] bg-[#f7f7f7] text-[#222] hover:-translate-y-[1px] hover:border-[#FF6600]"
                      }`}
                    >
                      <div
                        className={`hidden xl:grid ${GRID_COLS} gap-4 items-start min-w-0`}
                      >
                        <div className="text-sm">{task.id}</div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-relaxed break-words">
                            {task.name}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#8b8b8b] break-words">
                            {task.description || "No description"}
                          </p>
                        </div>

                        <div className="text-sm">{task.type || "N/A"}</div>

                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getLevelBadge(
                              task.priority,
                            )}`}
                          >
                            {getLevelLabel(task.priority)}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getLevelBadge(
                              task.difficulty,
                            )}`}
                          >
                            {getLevelLabel(task.difficulty)}
                          </span>
                        </div>

                        <div className="text-sm">
                          {getEstimatedMinutes(task.estimated_minutes)}
                        </div>

                        <div className="text-sm">
                          {getCampLabel(task.camp_id)}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={actionButtonClass}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className={actionButtonClass}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 xl:hidden">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{task.name}</p>
                            <p className="mt-1 text-xs text-[#8b8b8b]">
                              {task.description || "Sin descripción"}
                            </p>
                          </div>
                          <span className="text-sm">#{task.id}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                              Type
                            </p>
                            <p>{task.type || "N/A"}</p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                              Camp
                            </p>
                            <p>{getCampLabel(task.camp_id)}</p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7c8794]">
                              Time
                            </p>
                            <p>{getEstimatedMinutes(task.estimated_minutes)}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getLevelBadge(
                                task.priority,
                              )}`}
                            >
                              {getLevelLabel(task.priority)}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${getLevelBadge(
                                task.difficulty,
                              )}`}
                            >
                              {getLevelLabel(task.difficulty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-[#9ca3af] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#64748b]">
                  Found: {filteredTasks.length.toString().padStart(4, "0")}
                </p>

                <div className="flex gap-3">
                  <button className="min-w-[150px] bg-[#e5c0ae] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.3em] text-[#9c9c9c]">
                    Previous
                  </button>
                  <button className="min-w-[150px] bg-[#ababab] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.3em] text-white">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-full xl:max-w-[360px]">
          <div className="rounded-xl bg-[#232323] p-6 text-white shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ClipboardList className="text-[#FF6600]" />
              <div>
                <p className={detailLabelClass}>Task detail</p>
                <h3 className="mt-1 text-2xl">
                  {selectedTask?.name ?? "----"}
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className={detailCardClass}>
                <p className={detailLabelClass}>Description</p>
                <p className="mt-2 text-white">
                  {selectedTask?.description || "No description"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={detailCardClass}>
                  <p className={detailLabelClass}>Priority</p>
                  <p className="mt-2 text-lg">
                    {getLevelLabel(selectedTask?.priority)}
                  </p>
                </div>

                <div className={detailCardClass}>
                  <p className={detailLabelClass}>Difficulty</p>
                  <p className="mt-2 text-lg">
                    {getLevelLabel(selectedTask?.difficulty)}
                  </p>
                </div>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Type</p>
                <p className="mt-2">{selectedTask?.type || "N/A"}</p>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Estimated time</p>
                <p className="mt-2">
                  {getEstimatedMinutes(selectedTask?.estimated_minutes)}
                </p>
              </div>

              <div className={detailCardClass}>
                <p className={detailLabelClass}>Camp</p>
                <p className="mt-2">{getCampLabel(selectedTask?.camp_id)}</p>
              </div>

              <div className={detailCardClass}>
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <Calendar className="h-4 w-4" />
                  <p className="text-[10px] uppercase tracking-[0.25em]">
                    Created / Updated
                  </p>
                </div>
                <p className="mt-2">{selectedTask?.created_at || "--"}</p>
                <p className="text-[#bdbdbd]">
                  {selectedTask?.updated_at || "--"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 border border-[#FF6600] bg-[#FF6600] px-4 py-3 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-[#FF6600]">
                Edit
              </button>
              <button className="flex-1 border border-[#FF6600] px-4 py-3 text-sm uppercase tracking-[0.2em] text-[#FF6600] transition-colors hover:bg-[#FF6600] hover:text-black">
                View more
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF]">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              System task record available
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}