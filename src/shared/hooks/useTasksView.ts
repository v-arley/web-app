import { useMemo, useState } from "react";

export type Level = "L" | "M" | "H";
export type TaskFilter = "all" | "L" | "M" | "H";

export type TaskRow = {
  id: number;
  camp_id: number;
  name: string;
  description?: string;
  type?: string;
  priority?: Level;
  difficulty?: Level;
  estimated_minutes?: number;
  created_at?: string;
  updated_at?: string;
};

const tasks: TaskRow[] = [
  {
    id: 1,
    camp_id: 1,
    name: "Generator repair",
    description: "Inspection and repair of the camp's main generator.",
    type: "Maintenance",
    priority: "H",
    difficulty: "M",
    estimated_minutes: 180,
    created_at: "2026-04-20 08:30",
    updated_at: "2026-04-21 10:45",
  },
  {
    id: 2,
    camp_id: 2,
    name: "Medical supply sorting",
    description: "Sort and record priority medical supplies.",
    type: "Logistics",
    priority: "M",
    difficulty: "L",
    estimated_minutes: 90,
    created_at: "2026-04-19 14:00",
    updated_at: "2026-04-19 14:00",
  },
  {
    id: 3,
    camp_id: 1,
    name: "North perimeter reinforcement",
    description: "Install reinforcements and inspect vulnerable points.",
    type: "Defense",
    priority: "H",
    difficulty: "H",
    estimated_minutes: 240,
    created_at: "2026-04-18 09:15",
    updated_at: "2026-04-22 07:50",
  },
  {
    id: 4,
    camp_id: 3,
    name: "Dry ration count",
    description: "General count of available rations in storage.",
    type: "Inventory",
    priority: "L",
    difficulty: "L",
    estimated_minutes: 60,
    created_at: "2026-04-17 16:20",
    updated_at: "2026-04-17 16:20",
  },
];

export function getLevelLabel(level?: Level) {
  if (level === "L") return "Low";
  if (level === "M") return "Medium";
  if (level === "H") return "High";
  return "N/A";
}

export function getLevelBadge(level?: Level) {
  if (level === "L") return "bg-blue-500/15 text-blue-600";
  if (level === "M") return "bg-orange-500/15 text-orange-600";
  if (level === "H") return "bg-red-500/15 text-red-500";
  return "bg-gray-500/15 text-gray-600";
}

export function getEstimatedMinutes(minutes?: number) {
  return minutes ? `${minutes} min` : "N/A";
}

export function getCampLabel(campId?: number) {
  return campId ? `Camp #${campId}` : "--";
}

export function useTasksView() {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<TaskFilter>("all");
  const [difficulty, setDifficulty] = useState<TaskFilter>("all");
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(
    tasks[0] ?? null,
  );
  const [isPriorityFocused, setIsPriorityFocused] = useState(false);
  const [isDifficultyFocused, setIsDifficultyFocused] = useState(false);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.name.toLowerCase().includes(query) ||
        (task.description ?? "").toLowerCase().includes(query) ||
        (task.type ?? "").toLowerCase().includes(query);

      const matchesPriority = priority === "all" || task.priority === priority;

      const matchesDifficulty =
        difficulty === "all" || task.difficulty === difficulty;

      return matchesSearch && matchesPriority && matchesDifficulty;
    });
  }, [search, priority, difficulty]);

  const totalHigh = useMemo(() => {
    return tasks.filter((task) => task.priority === "H").length;
  }, []);

  const totalMinutes = useMemo(() => {
    return tasks.reduce(
      (accumulator, task) => accumulator + (task.estimated_minutes ?? 0),
      0,
    );
  }, []);

  return {
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
  };
}