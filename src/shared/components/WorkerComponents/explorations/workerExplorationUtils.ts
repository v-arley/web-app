import type { Exploration } from "../../../../models/Exploration";

export function formatDate(value?: string | Date | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDepartureDate(exploration: Exploration) {
  return exploration.departureDate ?? exploration.departure_date;
}

export function getReturnDate(exploration: Exploration) {
  return exploration.estimatedReturnDate ?? exploration.estimated_return_date;
}

export function getDuration(exploration: Exploration) {
  return exploration.durationDays ?? exploration.duration_days;
}

export function getRiskLevel(exploration: Exploration) {
  return exploration.riskLevel ?? exploration.risk_level;
}

export function getCampId(exploration: Exploration) {
  return exploration.campId ?? exploration.camp_id;
}

export function getStateLabel(exploration: Exploration) {
  if (exploration.stateLabel) return exploration.stateLabel;

  if (exploration.state === "P") return "Pending";
  if (exploration.state === "A") return "Active";
  if (exploration.state === "F") return "Finished";
  if (exploration.state === "C") return "Cancelled";

  return "N/A";
}

export function getRiskLabel(exploration: Exploration) {
  if (exploration.riskLevelLabel) return exploration.riskLevelLabel;

  const risk = getRiskLevel(exploration);

  if (risk === "L") return "Low";
  if (risk === "M") return "Medium";
  if (risk === "H") return "High";

  return "N/A";
}

export function getStateStyle(state?: string) {
  if (state === "A") {
    return "bg-black/60 border-[#E85D04]/60 text-[#E85D04]";
  }

  if (state === "F") {
    return "bg-black/60 border-[#22C55E]/50 text-[#22C55E]";
  }

  if (state === "C") {
    return "bg-black/60 border-[#EF4444]/50 text-[#EF4444]";
  }

  return "bg-black/60 border-[#FACC15]/50 text-[#FACC15]";
}

export function getRiskStyle(risk?: string) {
  if (risk === "H") {
    return "bg-black/60 border-[#EF4444]/60 text-[#EF4444]";
  }

  if (risk === "M") {
    return "bg-black/60 border-[#FACC15]/50 text-[#FACC15]";
  }

  if (risk === "L") {
    return "bg-black/60 border-[#22C55E]/50 text-[#22C55E]";
  }

  return "bg-black/60 border-white/10 text-[#9A9A9A]";
}
