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

export function getSexLabel(sex?: string | null) {
  if (sex === "M") return "Male";
  if (sex === "F") return "Female";
  if (sex === "O") return "Other";
  return "N/A";
}

export function getStateLabel(state?: string | null) {
  if (state === "A") return "Active";
  if (state === "I") return "Inactive";
  return "Unknown";
}

export function getStateClass(state?: string | null) {
  if (state === "A") {
    return "text-[#F59E0B] border-[#F59E0B]/60 bg-black/60";
  }

  if (state === "I") {
    return "text-[#9A9A9A] border-white/10 bg-black/60";
  }

  return "text-[#9A9A9A] border-white/10 bg-black/60";
}