import type { CampProductionRule } from "../../../../models/CampProductionRule";
import type { WorkerProductionHistoryItem } from "../../../../models/ResourceProduction";

export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

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

export function getExpectedAmount(rule?: CampProductionRule | null) {
  return rule?.expectedAmount ?? rule?.expected_amount ?? 0;
}

export function getEffectiveDate(rule?: CampProductionRule | null) {
  return rule?.effectiveDate ?? rule?.effective_date;
}

export function getResourceId(rule?: CampProductionRule | null) {
  return rule?.resourceId ?? rule?.resource_id ?? rule?.resource?.id ?? 0;
}

export function getResourceName(rule?: CampProductionRule | null) {
  return rule?.resource?.name ?? `Recurso #${getResourceId(rule) || "N/A"}`;
}

export function getResourceCode(rule?: CampProductionRule | null) {
  return rule?.resource?.code ?? `RES-${getResourceId(rule) || "N/A"}`;
}

export function getResourceUnit(rule?: CampProductionRule | null) {
  return (
    rule?.resource?.unitOfMeasure ??
    rule?.resource?.unit_of_measure ??
    rule?.resource?.unitName ??
    rule?.resource?.unit_name ??
    rule?.resource?.unit ??
    "u"
  );
}

export function getProfessionName(rule?: CampProductionRule | null) {
  return (
    rule?.profession?.name ??
    `Profesión #${rule?.professionId ?? rule?.profession_id ?? "N/A"}`
  );
}

export function getProductionDate(item: WorkerProductionHistoryItem) {
  return item.productionDate ?? item.production_date;
}

export function getHistoryResource(
  item: WorkerProductionHistoryItem,
  rule?: CampProductionRule | null,
) {
  return (
    item.resource?.name ??
    rule?.resource?.name ??
    `Recurso #${item.resourceId ?? item.resource_id ?? "N/A"}`
  );
}

export function getHistoryExpected(
  item: WorkerProductionHistoryItem,
  rule?: CampProductionRule | null,
) {
  return item.expectedAmount ?? item.expected_amount ?? getExpectedAmount(rule);
}
