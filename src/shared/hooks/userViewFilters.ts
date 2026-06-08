import type {AgeFilter, HealthFilter, StatusFilter, UserCardData,} from "./useUsersView";

export const statusTitleMap: Record<StatusFilter, string> = {
  active: "Active staff",
  inactive: "Inactive staff",
  all: "All staff",
};

export function normalizeHealth(value?: string | null): HealthFilter {
  const condition = value?.trim().toUpperCase();

  if (!condition) return "healthy";

  const healthyWords = [
    "SANO",
    "SANA",
    "APTO",
    "APTA",
    "SALUDABLE",
    "BIEN",
    "NONE",
    "NO CONDITION",
    "SIN CONDICION",
    "SIN CONDICIÓN",
  ];

  return healthyWords.some((word) => condition.includes(word))
    ? "healthy"
    : "has-condition";
}

function matchesAge(age: number | null, filter: AgeFilter) {
  if (filter === "all") return true;
  if (age === null) return false;

  const ranges: Record<Exclude<AgeFilter, "all">, boolean> = {
    "under-18": age < 18,
    "18-30": age >= 18 && age <= 30,
    "31-50": age >= 31 && age <= 50,
    "51-plus": age >= 51,
  };

  return ranges[filter];
}

type FilterUsersOptions = {
  searchQuery: string;
  statusFilter: StatusFilter;
  professionFilter: string;
  healthFilter: HealthFilter;
  ageFilter: AgeFilter;
};

export function filterUsers(users: UserCardData[], options: FilterUsersOptions) {
  const {
    searchQuery,
    statusFilter,
    professionFilter,
    healthFilter,
    ageFilter,
  } = options;

  const query = searchQuery.trim().toLowerCase();

  return users.filter((user) => {
    const matchesSearch =
      !query ||
      [
        user.name,
        user.lastName,
        user.dni,
        user.id,
        user.role,
        user.profession,
        user.temporaryProfession ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.active) ||
      (statusFilter === "inactive" && !user.active);

    const matchesProfession =
      professionFilter === "all" ||
      user.profession === professionFilter ||
      user.temporaryProfession === professionFilter;

    const matchesHealth =
      healthFilter === "all" || normalizeHealth(user.conditions) === healthFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesProfession &&
      matchesHealth &&
      matchesAge(user.age, ageFilter)
    );
  });
}