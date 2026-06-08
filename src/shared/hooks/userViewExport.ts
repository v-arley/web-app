import type { UserCardData } from "./useUsersView";
import { normalizeHealth } from "./userViewFilters";

function escapeCsv(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function exportUsersToCsv(users: UserCardData[]) {
  const headers = [
    "Name",
    "Last name",
    "DNI",
    "Role",
    "Profession",
    "Temporary profession",
    "Temporary until",
    "State",
    "Condition",
    "Age",
  ];

  const rows = users.map((user) => [
    user.name,
    user.lastName,
    user.dni,
    user.role,
    user.profession,
    user.temporaryProfession ?? "",
    user.temporaryUntil ?? "",
    user.active ? "Active" : "Inactive",
    normalizeHealth(user.conditions) === "healthy" ? "Healthy" : "Has condition",
    user.age ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `camp_population_${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}