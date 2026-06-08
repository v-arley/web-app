import type { User } from "../../models/User";
import type { UserCardData } from "./useUsersView";

export const professionCodes = [
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

export function formatProfession(value?: string | null) {
  const raw = value?.trim();

  if (!raw) return "No profession";

  return professionLabels[raw.toUpperCase()] ?? raw;
}

export function getProfessionCode(value: string) {
  const normalized = value.trim().toUpperCase();

  return labelToProfessionCode[normalized] ?? normalized;
}

export function getProfessionId(value: string): number {
  const code = getProfessionCode(value);

  return professionIds[code] ?? Number(code);
}

export function getList<T>(response: any): T[] {
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

export function buildPersonMap(persons: any[]) {
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

export function isTemporaryAssignment(assignment: any) {
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

export function getTemporaryUntil(assignment: any) {
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

export function getTemporaryDataFromAssignments(assignments: any[]) {
  const temporaryAssignment = assignments.find(isTemporaryAssignment);

  return {
    temporaryProfession: getProfessionFromAssignment(temporaryAssignment),
    temporaryUntil: getTemporaryUntil(temporaryAssignment),
  };
}

export function getNormalProfessionFromAssignments(assignments: any[]) {
  const normalAssignment = assignments.find(
    (assignment) => !isTemporaryAssignment(assignment),
  );

  return getProfessionFromAssignment(normalAssignment);
}


export function mapUser(user: User, peopleById: Map<number, any>): UserCardData {
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
    username:
      String(
        raw.username ??
          raw.user?.username ??
          raw.account?.username ??
          raw.credentials?.username ??
          raw.person?.user?.username ??
          person.user?.username ??
          person.username ??
          "",
      ).trim() || dni,
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

export function hasActiveTemporaryProfession(
  user?: UserCardData | null,
): boolean {
  if (!user?.temporaryProfession?.trim()) {
    return false;
  }

  const untilDate = parseTemporaryDate(user.temporaryUntil);

  if (!untilDate) {
    return true;
  }

  return untilDate.getTime() >= Date.now();
}