export type RiskLevel = "L" | "M" | "H";
export type ExplorationState = "P" | "A" | "F" | "C";
export type RiskFilter = "todas" | "L" | "M" | "H";
export type StateFilter = "todas" | "P" | "A" | "F" | "C";

export type ExplorationRow = {
    id: number;
    camp_id: number;
    code: string;
    name: string;
    objective?: string;
    notes?: string;
    departure_date: string;
    estimated_return_date?: string;
    duration_days?: number;
    risk_level?: RiskLevel;
    state?: ExplorationState;
};

export function getRiskLabel(level?: RiskLevel) {
    if (level === "L") return "Bajo";
    if (level === "M") return "Medio";
    if (level === "H") return "Alto";
    return "N/D";
}

export function getRiskBadge(level?: RiskLevel) {
    if (level === "L") return "bg-blue-500/15 text-blue-600";
    if (level === "M") return "bg-orange-500/15 text-orange-600";
    if (level === "H") return "bg-red-500/15 text-red-500";
    return "bg-gray-500/15 text-gray-600";
}

export function getStateLabel(state?: ExplorationState) {
    if (state === "P") return "Pendiente";
    if (state === "A") return "Activa";
    if (state === "F") return "Finalizada";
    if (state === "C") return "Cancelada";
    return "N/D";
}

export function getStateBadge(state?: ExplorationState) {
    if (state === "P") return "bg-yellow-500/15 text-yellow-600";
    if (state === "A") return "bg-green-500/15 text-green-600";
    if (state === "F") return "bg-blue-500/15 text-blue-600";
    if (state === "C") return "bg-red-500/15 text-red-500";
    return "bg-gray-500/15 text-gray-600";
}

export function getDuration(days?: number) {
    return days !== undefined
        ? `${days} día${days === 1 ? "" : "s"}`
        : "N/D";
}

export function getCampLabel(campId?: number) {
    return campId ? `Camp #${campId}` : "--";
}