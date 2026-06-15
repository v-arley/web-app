import type { Ration } from "../../../../models/Ration";
import type { RationResource } from "../../../../models/RationResource";

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

export function getRationDate(ration?: Ration | null) {
  return ration?.rationDate ?? ration?.ration_date;
}

export function isDelivered(ration?: Ration | null) {
  return ration?.completed === "Y";
}

export function getRationResources(ration?: Ration | null) {
  return ration?.sources ?? ration?.rationResources ?? ration?.resources ?? [];
}

export function getResourceName(item: RationResource) {
  return (
    item.name ??
    item.resource?.name ??
    `Recurso #${item.resourceId ?? item.resource_id ?? item.id ?? "N/A"}`
  );
}

export function getResourceCode(item: RationResource) {
  return (
    item.code ??
    item.resource?.code ??
    `RES-${item.resourceId ?? item.resource_id ?? item.id ?? "N/A"}`
  );
}

export function getResourceUnit(item: RationResource) {
  return (
    item.unitOfMeasure ??
    item.unit_of_measure ??
    item.resource?.unitOfMeasure ??
    item.resource?.unit_of_measure ??
    item.resource?.unitName ??
    item.resource?.unit_name ??
    item.resource?.unit ??
    "u"
  );
}
