import { useEffect, useMemo, useState } from "react";

import { UserService } from "../../services/UserService";
import { PersonService } from "../../services/PersonService";
import { AdmissionRequestService } from "../../services/AdmissionRequestService";
import { PersonProfessionService } from "../../services/PersonProfessionService";

import type { User } from "../../models/User";
import type { AdmissionRequest } from "../../models/AdmissionRequest";

import {
 buildPersonMap,
  formatProfession,
  getList,
  getNormalProfessionFromAssignments,
  getProfessionId,
  getTemporaryDataFromAssignments,
  getTemporaryUntil,
  hasActiveTemporaryProfession,
  isTemporaryAssignment,
  mapUser,
  professionCodes,
} from "./userViewMappers";
import { exportUsersToCsv } from "./userViewExport";
import { filterUsers, statusTitleMap } from "./userViewFilters";

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
  username?: string;

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

async function getPersonProfessionAssignments(personId?: number) {
  if (!personId) return [];

  const response = await personProfessionService.findByPersonId(personId);

  if (!response.getEstado()) return [];

  return getList<any>(response);
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
    return filterUsers(users, {
      searchQuery,
      statusFilter,
      professionFilter,
      healthFilter,
      ageFilter,
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