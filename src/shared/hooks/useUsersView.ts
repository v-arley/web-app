import { useEffect, useMemo, useState } from "react";

import { UserService } from "../../services/UserService";
import { PersonService } from "../../services/PersonService";
import { AdmissionRequestService } from "../../services/AdmissionRequestService";
import { PersonProfessionService } from "../../services/PersonProfessionService";

import type { User } from "../../models/User";
import type { AdmissionRequest } from "../../models/AdmissionRequest";

const userService = new UserService();
const personService = new PersonService();
const admissionRequestService = new AdmissionRequestService();
const personProfessionService = new PersonProfessionService();

export type StatusFilter = "active" | "inactive" | "all";
export type HealthFilter = "all" | "healthy" | "has-condition";
export type AgeFilter = "all" | "under-18" | "18-30" | "31-50" | "51-plus";

type ChangeProfessionOptions = {
  isTemporary: boolean;
  temporaryUntil?: string;
};

export type UserCardData = {
  idUser?: number;
  userId?: number;
  personId?: number;

  name: string;
  lastName: string;
  role: string;
  id: string;
  dni: string;
  active: boolean;
  profession: string;
  temporaryProfession?: string | null;
  temporaryUntil?: string | null;
  imageUrl: string;

  description: string;
  conditions: string;
  age: number | null;
  state: string;

  sex: string;
  registrationDate: Date;
  birthdate: Date;
  idCardUrl?: string;
};

const statusTitleMap: Record<StatusFilter, string> = {
  active: "Active staff",
  inactive: "Inactive staff",
  all: "All staff",
};

const professionCodes = [
  "PROF-MED",
  "PROF-LOG",
  "PROF-AGR",
  "PROF-EXP",
  "PROF-COC",
];

const professionLabels: Record<string, string> = {
  "PROF-MED": "Medicina",
  "PROF-LOG": "Logística",
  "PROF-AGR": "Agricultura",
  "PROF-EXP": "Exploración",
  "PROF-COC": "Cocina",
  "PROF-COOK": "Cocina",

  MEDICINA: "Medicina",
  LOGISTICA: "Logística",
  LOGÍSTICA: "Logística",
  AGRICULTURA: "Agricultura",
  EXPLORACION: "Exploración",
  EXPLORACIÓN: "Exploración",
  COCINA: "Cocina",
  COOKING: "Cocina",
  OPERACIONES: "Operaciones",
  OPERACION: "Operación",
  OPERACIÓN: "Operación",
  ABASTECIMIENTO: "Abastecimiento",
};

const labelToProfessionCode: Record<string, string> = {
  MEDICINA: "PROF-MED",
  LOGISTICA: "PROF-LOG",
  LOGÍSTICA: "PROF-LOG",
  AGRICULTURA: "PROF-AGR",
  EXPLORACION: "PROF-EXP",
  EXPLORACIÓN: "PROF-EXP",
  COCINA: "PROF-COC",
  COOKING: "PROF-COC",
};

const professionIds: Record<string, number> = {
  "PROF-MED": 1,
  "PROF-LOG": 2,
  "PROF-AGR": 3,
  "PROF-EXP": 4,
  "PROF-COC": 5,
  "PROF-COOK": 5,
};

function formatProfession(value?: string | null) {
  const raw = value?.trim();

  if (!raw) return "No profession";

  return professionLabels[raw.toUpperCase()] ?? raw;
}

function getProfessionCode(value: string) {
  const normalized = value.trim().toUpperCase();

  return labelToProfessionCode[normalized] ?? normalized;
}

function getProfessionId(value: string): number {
  const code = getProfessionCode(value);

  return professionIds[code] ?? Number(code);
}

function getList<T>(response: any): T[] {
  const registros = response.getResultado("registros") as T[] | undefined;
  const items = response.getResultado("items") as T[] | undefined;

  return registros ?? items ?? [];
}

function getRole(user: any) {
  const roles = user.userRoles ?? user.roles ?? [];

  if (Array.isArray(roles) && roles.length > 0) {
    const first = roles[0];

    if (typeof first === "string") return first;

    return first.role?.name ?? first.name ?? "WORKER";
  }

  return user.role ?? "WORKER";
}

function normalizeHealth(value?: string | null): HealthFilter {
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

function calculateAge(value?: string | Date | null) {
  if (!value) return null;

  const birthDate = new Date(value);

  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
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

function getDefaultImage(active: boolean) {
  return active
    ? "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    : "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80";
}

function toValidDate(value?: string | Date | null): Date {
  if (!value) return new Date();

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function buildPersonMap(persons: any[]) {
  const map = new Map<number, any>();

  persons.forEach((person) => {
    const id = Number(person.id);

    if (Number.isFinite(id) && id > 0) {
      map.set(id, person);
    }
  });

  return map;
}

function getPersonForUser(user: any, peopleById: Map<number, any>) {
  const embeddedPerson = user.person ?? user.persona ?? {};
  const personId = Number(
    embeddedPerson.id ?? user.person_id ?? user.personId ?? 0,
  );

  return peopleById.get(personId) ?? embeddedPerson;
}

function isTemporaryAssignment(assignment: any) {
  return (
    assignment?.is_temporary === "Y" ||
    assignment?.is_temporary === true ||
    assignment?.isTemporary === true
  );
}

function getProfessionFromAssignment(assignment: any) {
  if (!assignment) return null;

  return (
    assignment.profession?.code ??
    assignment.profession?.name ??
    assignment.profession_code ??
    assignment.professionCode ??
    assignment.profession_name ??
    assignment.professionName ??
    null
  );
}

function getTemporaryUntil(assignment: any) {
  const value =
    assignment?.temporary_until ??
    assignment?.temporaryUntil ??
    assignment?.until ??
    null;

  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB");
}

function getTemporaryDataFromAssignments(assignments: any[]) {
  const temporaryAssignment = assignments.find(isTemporaryAssignment);

  return {
    temporaryProfession: getProfessionFromAssignment(temporaryAssignment),
    temporaryUntil: getTemporaryUntil(temporaryAssignment),
  };
}

function getNormalProfessionFromAssignments(assignments: any[]) {
  const normalAssignment = assignments.find(
    (assignment) => !isTemporaryAssignment(assignment),
  );

  return getProfessionFromAssignment(normalAssignment);
}

async function getPersonProfessionAssignments(personId?: number) {
  if (!personId) return [];

  const response = await personProfessionService.findByPersonId(personId);

  if (!response.getEstado()) return [];

  return getList<any>(response);
}

function mapUser(user: User, peopleById: Map<number, any>): UserCardData {
  const raw = user as any;
  const person = getPersonForUser(raw, peopleById);

  const state = raw.state ?? person.state ?? "I";
  const active = state === "A";

  const dni = String(person.dni ?? raw.dni ?? raw.username ?? "");
  const birthdate = person.date_of_birth ?? person.date_birth ?? "";

  return {
    idUser: raw.id ?? undefined,
    userId: raw.id ?? undefined,
    personId: person.id ?? raw.person_id ?? undefined,

    name: String(person.name ?? raw.name ?? "Unknown"),
    lastName: String(person.surname ?? person.lastName ?? raw.surname ?? ""),
    role: getRole(raw),
    id: dni,
    dni,
    active,
    profession: formatProfession(raw.profession),
    temporaryProfession: null,
    temporaryUntil: null,
    imageUrl:
      person.photo ??
      person.photo_url ??
      raw.photo ??
      getDefaultImage(active),

    description: String(person.description ?? ""),
    conditions: String(person.conditions ?? ""),
    age: calculateAge(birthdate),
    state,

    sex: person.sex ?? "",
    registrationDate: toValidDate(raw.created_at ?? person.created_at),
    birthdate: toValidDate(birthdate),
    idCardUrl: person.id_card_url ?? person.dni_url ?? "",
  };
}

async function addProfessionAssignmentsToUsers(users: UserCardData[]) {
  return await Promise.all(
    users.map(async (user) => {
      const assignments = await getPersonProfessionAssignments(user.personId);

      if (assignments.length === 0) {
        return user;
      }

      const normalProfession = getNormalProfessionFromAssignments(assignments);
      const temporaryData = getTemporaryDataFromAssignments(assignments);

      return {
        ...user,
        profession: normalProfession
          ? formatProfession(normalProfession)
          : user.profession,
        temporaryProfession: temporaryData.temporaryProfession
          ? formatProfession(temporaryData.temporaryProfession)
          : null,
        temporaryUntil: temporaryData.temporaryUntil,
      };
    }),
  );
}

function parseTemporaryDate(value?: string | null): Date | null {
  if (!value) return null;

  const raw = String(value).trim();

  if (!raw) return null;

  const directDate = new Date(raw);

  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const parts = raw.split(/[/-]/);

  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    const parsedDate = new Date(year, month - 1, day, 23, 59, 59, 999);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return null;
}

function hasActiveTemporaryProfession(user?: UserCardData | null): boolean {
  if (!user?.temporaryProfession?.trim()) {
    return false;
  }

  const untilDate = parseTemporaryDate(user.temporaryUntil);

  if (!untilDate) {
    return true;
  }

  return untilDate.getTime() >= Date.now();
}

function escapeCsv(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function exportUsersToCsv(users: UserCardData[]) {
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

async function replacePersonProfession(
  personId: number,
  professionId: number,
  options?: ChangeProfessionOptions,
) {
  if (options?.isTemporary) {
    return await personProfessionService.save({
      person_id: personId,
      profession_id: professionId,
      is_temporary: "Y",
      temporary_until: options.temporaryUntil,
    } as any);
  }

  const currentResponse = await personProfessionService.findByPersonId(personId);

  if (currentResponse.getEstado()) {
    const currentAssignments = getList<any>(currentResponse);

    for (const assignment of currentAssignments) {
      if (isTemporaryAssignment(assignment)) continue;

      const currentProfessionId = Number(
        assignment.profession_id ??
          assignment.professionId ??
          assignment.profession?.id,
      );

      if (currentProfessionId > 0) {
        await personProfessionService.remove(personId, currentProfessionId);
      }
    }
  }

  return await personProfessionService.save({
    person_id: personId,
    profession_id: professionId,
    is_temporary: "N",
    temporary_until: null,
  } as any);
}

export function useUsersView() {
  const [users, setUsers] = useState<UserCardData[]>([]);
  const [admissionRequests, setAdmissionRequests] = useState<AdmissionRequest[]>(
    [],
  );

  const [selectedUser, setSelectedUser] = useState<UserCardData | null>(null);
  const [isRegistrationPanelOpen, setIsRegistrationPanelOpen] = useState(false);
  const [isStatusSelectFocused, setIsStatusSelectFocused] = useState(false);
  const [showAdmissions, setShowAdmissions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersResponse, personsResponse, admissionsResponse] =
        await Promise.allSettled([
          userService.findAll(),
          personService.findAll(),
          admissionRequestService.findAll(),
        ]);

      const loadedUsers =
        usersResponse.status === "fulfilled" && usersResponse.value.getEstado()
          ? usersResponse.value.getResultado<User[]>("registros") ??
            usersResponse.value.getResultado<User[]>("items") ??
            []
          : [];

      const loadedPersons =
        personsResponse.status === "fulfilled" && personsResponse.value.getEstado()
          ? personsResponse.value.getResultado<any[]>("registros") ??
            personsResponse.value.getResultado<any[]>("items") ??
            []
          : [];

      const loadedAdmissions =
        admissionsResponse.status === "fulfilled" &&
        admissionsResponse.value.getEstado()
          ? admissionsResponse.value.getResultado<AdmissionRequest[]>("registros") ??
            admissionsResponse.value.getResultado<AdmissionRequest[]>("items") ??
            []
          : [];

      const peopleById = buildPersonMap(loadedPersons);
      const mappedUsers = loadedUsers.map((user) => mapUser(user, peopleById));
      const usersWithProfessions =
        await addProfessionAssignmentsToUsers(mappedUsers);

      setUsers(usersWithProfessions);
      setAdmissionRequests(loadedAdmissions);
    } catch {
      setError("No se pudo cargar la población del campamento.");
      setUsers([]);
      setAdmissionRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const professionOptions = useMemo(() => {
    return Array.from(
      new Set(
        users
          .flatMap((user) => [user.profession, user.temporaryProfession])
          .filter(Boolean) as string[],
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const filteredUsers = useMemo(() => {
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
  }, [users, searchQuery, statusFilter, professionFilter, healthFilter, ageFilter]);

  const handleToggleUserActive = async () => {
    if (!selectedUser?.userId) {
      const message = "No se encontró el usuario seleccionado.";
      setError(message);
      throw new Error(message);
    }

    const response = await userService.update(selectedUser.userId, {
      state: selectedUser.active ? "I" : "A",
    } as any);

    if (!response.getEstado()) {
      const message = "No se pudo actualizar el usuario.";
      setError(message);
      throw new Error(message);
    }

    setSelectedUser(null);
    await loadUsers();
  };

  const handleChangeProfession = async (
    profession: string,
    options?: ChangeProfessionOptions,
  ) => {
    if (!selectedUser?.personId) {
      const message = "No se encontró la persona seleccionada.";
      setError(message);
      throw new Error(message);
    }

    const professionId = getProfessionId(profession);

    if (!Number.isFinite(professionId) || professionId <= 0) {
      const message = "Profesión inválida.";
      setError(message);
      throw new Error(message);
    }

    if (options?.isTemporary && !options.temporaryUntil) {
      const message = "Debe seleccionar una fecha final para la profesión temporal.";
      setError(message);
      throw new Error(message);
    }

    if (options?.isTemporary && hasActiveTemporaryProfession(selectedUser)) {
      const message = `Esta persona ya tiene una profesión temporal vigente${
        selectedUser.temporaryUntil ? ` hasta ${selectedUser.temporaryUntil}` : ""
      }. Debe esperar a que caduque antes de asignar otra.`;

      setError(message);
      throw new Error(message);
    }

    const response = await replacePersonProfession(
      selectedUser.personId,
      professionId,
      options,
    );

    if (!response.getEstado()) {
      const message = "No se pudo cambiar la profesión.";
      setError(message);
      throw new Error(message);
    }

    const formattedProfession = formatProfession(profession);
    const formattedTemporaryUntil = options?.isTemporary
      ? getTemporaryUntil({ temporary_until: options.temporaryUntil })
      : null;

    const patchUser = (user: UserCardData): UserCardData => {
      if (String(user.personId) !== String(selectedUser.personId)) return user;

      return {
        ...user,
        profession: options?.isTemporary ? user.profession : formattedProfession,
        temporaryProfession: options?.isTemporary ? formattedProfession : null,
        temporaryUntil: formattedTemporaryUntil,
      };
    };

    setUsers((currentUsers) => currentUsers.map(patchUser));

    setSelectedUser((currentUser) =>
      currentUser ? patchUser(currentUser) : currentUser,
    );

    await loadUsers();
  };

  const handleUpdatePersonProfile = async (
    personId: number,
    payload: {
      photo?: string;
      description?: string;
      conditions?: string;
    },
  ) => {
    const response = await personService.update(personId, payload as any);

    if (!response.getEstado()) {
      const message = "No se pudo actualizar el perfil de la persona.";
      setError(message);
      throw new Error(message);
    }

    const patchUser = (user: UserCardData): UserCardData => {
      if (String(user.personId) !== String(personId)) return user;

      return {
        ...user,
        imageUrl: payload.photo !== undefined ? payload.photo : user.imageUrl,
        description:
          payload.description !== undefined ? payload.description : user.description,
        conditions:
          payload.conditions !== undefined ? payload.conditions : user.conditions,
      };
    };

    setUsers((currentUsers) => currentUsers.map(patchUser));

    setSelectedUser((currentUser) =>
      currentUser ? patchUser(currentUser) : currentUser,
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("active");
    setProfessionFilter("all");
    setHealthFilter("all");
    setAgeFilter("all");
  };

  const activeUsers = users.filter((user) => user.active);
  const inactiveUsers = users.filter((user) => !user.active);

  return {
    users,
    staff: users,
    filteredUsers,
    filteredStaff: filteredUsers,
    displayedUsers: filteredUsers,

    professions: professionCodes,
    professionOptions,
    admissionRequests,

    selectedUser,
    setSelectedUser,
    isRegistrationPanelOpen,
    setIsRegistrationPanelOpen,
    isStatusSelectFocused,
    setIsStatusSelectFocused,
    showAdmissions,
    setShowAdmissions,

    loading,
    error,

    searchQuery,
    setSearchQuery,
    searchTerm: searchQuery,
    setSearchTerm: setSearchQuery,
    query: searchQuery,
    setQuery: setSearchQuery,

    statusFilter,
    setStatusFilter,
    professionFilter,
    setProfessionFilter,
    healthFilter,
    setHealthFilter,
    ageFilter,
    setAgeFilter,
    statusTitleMap,

    handleToggleUserActive,
    handleChangeProfession,
    handleUpdatePersonProfile,
    formatProfession,

    loadUsers,
    loadData: loadUsers,
    reload: loadUsers,
    resetFilters,
    exportFilteredUsers: () => exportUsersToCsv(filteredUsers),

    activeUsers,
    inactiveUsers,
    totalUsers: users.length,
    totalFilteredUsers: filteredUsers.length,
  };
}