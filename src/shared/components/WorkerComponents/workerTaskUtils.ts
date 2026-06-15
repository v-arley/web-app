import type { Task, TaskDifficulty, TaskPriority } from "../../../models/Task";

export function formatDate(value?: Date | string | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function getPriorityLabel(priority?: string) {
  if (priority === "H") return "High";
  if (priority === "M") return "Medium";
  if (priority === "L") return "Low";
  return "N/A";
}

export function getDifficultyLabel(difficulty?: string) {
  if (difficulty === "H") return "High";
  if (difficulty === "M") return "Medium";
  if (difficulty === "L") return "Low";
  return "N/A";
}

export function getDifficultyPoints(difficulty?: string) {
  if (difficulty === "H") return 15;
  if (difficulty === "M") return 10;
  if (difficulty === "L") return 5;
  return 0;
}

export function getPriorityStyle(priority?: TaskPriority | string) {
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

export function getDifficultyStyle(difficulty?: TaskDifficulty | string) {
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

export function formatEstimatedTime(task: Task) {
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

export function getAssignedDate(task: Task) {
  return task.assignment?.assignedAt ?? task.assignment?.assigned_at;
}
