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

export function getProgressPercent(current: number, required: number) {
  if (!required || required <= 0) return 0;
  return Math.min(100, Math.round((current / required) * 100));
}