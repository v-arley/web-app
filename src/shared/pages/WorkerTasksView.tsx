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
    if (priority === "H") return "Alta";
    if (priority === "M") return "Media";
    if (priority === "L") return "Baja";
    return "N/A";
}

function getDifficultyLabel(difficulty?: string) {
    if (difficulty === "H") return "Alta";
    if (difficulty === "M") return "Media";
    if (difficulty === "L") return "Baja";
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
        return "bg-[#E85D04]/15 border-[#E85D04]/70 text-[#E85D04]";
    }

    if (priority === "M") {
        return "bg-[#FACC15]/10 border-[#FACC15]/60 text-[#FACC15]";
    }

    if (priority === "L") {
        return "bg-[#38BDF8]/10 border-[#38BDF8]/50 text-[#38BDF8]";
    }

    return "bg-[#2e2e2e] border-[#3a3a3a] text-[#6B7280]";
}

function getDifficultyStyle(difficulty?: TaskDifficulty | string) {
    if (difficulty === "H") {
        return "bg-[#E85D04]/15 border-[#E85D04]/70 text-[#E85D04]";
    }

    if (difficulty === "M") {
        return "bg-[#38BDF8]/10 border-[#38BDF8]/50 text-[#38BDF8]";
    }

    if (difficulty === "L") {
        return "bg-[#22C55E]/10 border-[#22C55E]/50 text-[#22C55E]";
    }

    return "bg-[#2e2e2e] border-[#3a3a3a] text-[#6B7280]";
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
        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-5 flex flex-col justify-between gap-4 hover:border-[#E85D04]/70 hover:bg-[#E85D04]/5 transition-colors shadow-[0_0_18px_rgba(0,0,0,0.35)]">
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] text-[#6B7280] font-mono tracking-label uppercase">
                        {task.type || "General"} // REF: {task.id}
                    </span>

                    <span
                        className={`px-2 py-0.5 text-[10px] font-mono border uppercase tracking-label font-bold ${getPriorityStyle(task.priority)}`}
                    >
                        Prioridad {getPriorityLabel(task.priority)}
                    </span>
                </div>

                <h3 className="font-mono text-sm text-white font-bold leading-tight tracking-label uppercase">
                    {task.name || task.title || "Tarea sin nombre"}
                </h3>

                <p className="font-mono text-xs text-[#C0C0C0] bg-[#111111] p-3 border border-[#3a3a3a] leading-relaxed">
                    {task.description || "Sin descripción registrada."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="border border-[#3a3a3a] p-3 bg-[#111111]">
                        <span className="text-[#6B7280] block text-[9px] uppercase tracking-label">
                            Dificultad
                        </span>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                                className={`border px-2 py-0.5 text-[10px] uppercase tracking-label font-bold ${getDifficultyStyle(task.difficulty)}`}
                            >
                                {getDifficultyLabel(task.difficulty)}
                            </span>

                            <span className="text-[#FACC15] font-bold">
                                +{points} pts
                            </span>
                        </div>
                    </div>

                    <div className="border border-[#3a3a3a] p-3 bg-[#111111]">
                        <span className="text-[#6B7280] block text-[9px] uppercase tracking-label">
                            Tiempo estimado
                        </span>

                        <span className="text-white font-medium flex items-center gap-1 mt-2">
                            <Clock size={13} className="text-[#38BDF8]" />
                            {formatEstimatedTime(task)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-[#3a3a3a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="font-mono text-[10px] text-[#6B7280] flex items-center gap-1 uppercase tracking-label">
                    <Calendar size={13} />
                    <span>Asignado: {formatDate(getAssignedDate(task))}</span>
                </div>

                <button
                    type="button"
                    onClick={() => onComplete(task.id)}
                    disabled={completing}
                    className="px-4 py-2 border border-[#E85D04] text-[#E85D04] hover:bg-[#E85D04] hover:text-[#111111] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#E85D04] font-bold font-mono text-xs uppercase tracking-label transition-colors"
                >
                    {completing ? "Completando..." : "Complete task"}
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
        <div className="w-full h-full flex flex-col bg-[#111111] overflow-hidden">
            <div className="w-full bg-[#242424] border-b border-[#3a3a3a] px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                    <span className="text-[12px] font-mono font-bold text-[#C0C0C0] uppercase tracking-label">
                        Mis tareas
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-label">
                        Active worker assignments / completion protocol
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => void reload()}
                    className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] hover:text-[#E85D04] uppercase tracking-label transition-colors"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 flex flex-col gap-4">
                    <section className="border border-[#E85D04]/45 bg-[#1a1a1a] p-5 shadow-[0_0_18px_rgba(232,93,4,0.1)]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className="text-[10px] text-[#6B7280] font-mono tracking-label block uppercase">
                                    Duties and scheduling unit // orden de trabajo
                                </span>

                                <h2 className="text-lg font-mono font-bold text-white uppercase flex items-center gap-2 mt-1">
                                    <ClipboardCheck className="text-[#E85D04]" size={20} />
                                    <span>Asignaciones operativas del turno</span>
                                </h2>
                            </div>

                            <div className="border border-[#E85D04]/60 bg-[#111111] px-4 py-3 font-mono text-center">
                                <span className="block text-[10px] text-[#6B7280] uppercase tracking-label">
                                    Active tasks
                                </span>
                                <span className="block text-2xl text-[#E85D04] font-black">
                                    {activeTasks.length}
                                </span>
                            </div>
                        </div>
                    </section>

                    {error && (
                        <div className="border border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04] px-4 py-3 font-mono text-xs uppercase tracking-label flex items-center gap-2">
                            <AlertTriangle size={15} />
                            {error}
                        </div>
                    )}

                    {lastCompleted && (
                        <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E]/50 text-[#22C55E] font-mono text-xs space-y-2 shadow-[0_0_14px_rgba(34,197,94,0.18)]">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <CheckSquare size={17} className="text-[#22C55E]" />
                                    <span className="font-bold uppercase tracking-label">
                                        Tarea completada correctamente
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={clearLastCompleted}
                                    className="text-[#6B7280] hover:text-[#22C55E] uppercase tracking-label"
                                >
                                    Cerrar
                                </button>
                            </div>

                            <p className="text-[#C0C0C0]">
                                {lastCompleted.alreadyCompleted
                                    ? "Esta tarea ya estaba completada. No se sumaron puntos nuevos."
                                    : `La tarea "${lastCompleted.taskName}" fue completada. Ganaste +${lastCompleted.pointsAwarded} puntos.`}
                            </p>

                            {lastCompleted.points && (
                                <p className="text-[#C0C0C0]">
                                    Puntos actuales:{" "}
                                    <strong className="text-[#FACC15]">
                                        {lastCompleted.points.totalPoints ??
                                            lastCompleted.points.total_points ??
                                            0}
                                    </strong>{" "}
                                    | Nivel:{" "}
                                    <strong className="text-[#FACC15]">
                                        {lastCompleted.points.level ?? "N/A"}
                                    </strong>
                                </p>
                            )}

                            {!!lastCompleted.unlockedAchievements?.length && (
                                <div className="border border-[#FACC15]/40 bg-[#FACC15]/10 p-3 text-[#FACC15]">
                                    <div className="flex items-center gap-2 font-bold uppercase tracking-label">
                                        <Award size={15} />
                                        New achievements unlocked
                                    </div>

                                    <p className="mt-1 text-[#C0C0C0]">
                                        Se desbloquearon {lastCompleted.unlockedAchievements.length} logro(s) nuevo(s).
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {loading && (
                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-6 font-mono text-xs text-[#6B7280] uppercase tracking-label">
                            Loading worker tasks...
                        </div>
                    )}

                    {!loading && activeTasks.length === 0 && (
                        <div className="border border-[#3a3a3a] bg-[#1a1a1a] min-h-[235px] p-12 flex flex-col items-center justify-center text-center gap-3">
                            <CheckSquare size={42} className="text-[#22C55E]" />

                            <h3 className="font-mono text-sm text-[#C0C0C0] uppercase tracking-label">
                                No hay tareas activas asignadas
                            </h3>

                            <p className="text-xs text-[#6B7280] font-mono max-w-md mx-auto text-center leading-relaxed">
                                El trabajador no tiene directivas activas pendientes en este ciclo operativo.
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